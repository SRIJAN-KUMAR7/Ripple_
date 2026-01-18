import mongoose from "mongoose"
import { ENV } from "./env.js";

export const connectDB=async()=>{
    try{
        if(!ENV.MONGO_URI){
        throw new Error("MONGO_URI is not set")
        }
        const conn=mongoose.connect(ENV.MONGO_URI);
        console.log("MONGO DB CONNECTED SUCCESSFULLY:",(await conn).connection.host);
    }catch(error){
        console.error("Error connecting to db",error);
        process.exit(1)//1 meaning failed 0 mean success;
    }
};