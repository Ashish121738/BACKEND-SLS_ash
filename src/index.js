import dotenv from "dotenv"
import {app} from "./app.js"
import { GoogleGenAI } from "@google/genai";

import connectDB from "./db/index.js"


// import mongoose from "mongoose";
// import {DB_Name} from "./constant.js"

dotenv.config({
    path: "./.env"
})

connectDB()      //it auto import connectdb and call it
.then(()=>{
    app.on("error",(error)=>{
        console.log("Server listening failed",error);
        
    })
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is listeneing on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Database connection failed!!!",err);
})

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


export default ai;








/*
import express from "express";
const app = express();
(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        app.on("error",(error)=>{
            console.log("ERROR:",error)
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port ${process.env.PORT}`)
        })
    }catch(error){
        console.log("Error", error)
        throw error;
    }
})()
*/
