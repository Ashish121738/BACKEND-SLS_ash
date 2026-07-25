import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadoncloudinary} from "../utils/cloudinary.js"
import {Apiresponse} from "../utils/ApiResponse.js"
// console.log(User)
const generateAccessTokenAndRefreshToken = async(userId)=>{
  try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({isValidateBeforeSave:false})
    return {accessToken, refreshToken}
  } catch (error) {
    throw new ApiError(500, "Error while generating access and refresh token")
  }

}

const registeruser = asyncHandler(async(req,res)=>{
   /*
   get user details from frontend
   validation - not empty
   check if user already exist:username or email
   check for images , check for avatar
   upload on cloudinary, check for avatar
   create user object
   remove password and refreshToken from field from response
   check user created
   return res
   */
  const {email,username,fullName,Password}=req.body

  // console.log("email:",email)

  if (
    [fullName,email,username,Password].some((field)=>field?.trim()==="")
  ) {
    throw new ApiError(400,"All fields are required")
  }

  const existeduser = await User.findOne({
    $or:[{username},{email}]
  })

  if(existeduser){
    throw new ApiError(409,"User already exist")
  }

const avatarLocalPath=req.files?.avatar[0]?.path
// const coverImageLocalPath = req.files?.coverImage[0]?.path

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
  coverImageLocalPath = req.files.coverImage[0].path
}

if(!avatarLocalPath){
  throw new ApiError(400,"Avatar file is required")
}

const avatar = await uploadoncloudinary(avatarLocalPath)
const CoverImage = await uploadoncloudinary(coverImageLocalPath)

if(!avatar){
  throw new ApiError(500,"Server failed to Upload ")
}

const userdb = await User.create({
  fullName,
  avatar:avatar.url,
  coverImage:CoverImage.url || " ",
  email,
  Password,
  username:username.toLowerCase()

})

const createduser = await User.findById(userdb._id).select("-password -refreshToken")

if(!createduser){
  throw new ApiError(500,"Something went wrong while registering the user")
}

return res.status(201).json(
 new Apiresponse(200,createduser,"User created Successfully")
)

})

//login user
const loginUser = asyncHandler(async(req,res)=>{
  const {email,username,Password} = req.body
  if(!(username || email)){
    throw new ApiError(400,"Username or email is required")
  }
const user= await User.findOne({
    $or:[{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"User not found")
  }
  const isPasswordvalid = await user.isPasswordCorrect(Password)
  if(!isPasswordvalid){
    throw new ApiError(401,"Invalid user credentials")
  }
  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id)
  const loggedInUser = await User.findById(user._id).select("-Password -refreshToken")

  const Options = {
    httpOnly:true,
    secure:true,
  }
  return res.status(200).cookie("refreshToken",refreshToken,Options)
  .cookie("accessToken",accessToken,Options).json(
    new Apiresponse(201,{
      user:loggedInUser,
      accessToken,
      refreshToken
    },"User logged in successfully")
  )

})

//logout 
const logOut = asyncHandler(async(req,res,next)=>{
  User.findByIdAndUpdate(req.user._id,{
    $set:{
    refreshToken: undefined
  }
  },
  {
    new:true,
  }
)
 const Options = {
    httpOnly:true,
    secure:true,
  }
  return res.status(201)
  .clearCookie("refreshToken",Options)
  .clearCookie("accessToken",Options)
  .json(new Apiresponse(201,{},"User logged out successfully"))
  
})

export {registeruser, loginUser, logOut}