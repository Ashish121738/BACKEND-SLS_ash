import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userschema = Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
    },
        fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,       //cloudinary url
        required:true,
    },
    cover_image:{
        type:String,
        // required:true,
    },
    watchhistory:[
        {
        type:Schema.Types.ObjectId,
        ref:"Video"
        }
    ],
    Password:{
        type:String,
        required:[true,"PLEASE PROVIDE A PASSWORD"]
    },
    refreshToken:{
        type:String
    },

},{timestamps:true})

userschema.pre("save", async function(next){
    if(!this.isModified("Password")) return next

    this.Password = await bcrypt.hash(this.Password, 10)
    next
})

userschema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.Password)
}

userschema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userschema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User  = mongoose.model("User",userschema)
