import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoschema = Schema({
    videofile:{
        type:String,       //cloudinary url
        required:true,
    },
    thumbnail:{
        type:String,       //cloudinary url
        required:true,
    },
    title:{
        type:String,       //cloudinary url
        required:true,
    },
    description:{
        type:String,       //cloudinary url
        required:true,
    },
    views:{
        type:Number,       //cloudinary url
        default:0,
    },
    isPublished:{
        type:Boolean,       //cloudinary url
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,       //cloudinary url
        ref:"User",
    },

},{timestamps:true})

videoschema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoschema)