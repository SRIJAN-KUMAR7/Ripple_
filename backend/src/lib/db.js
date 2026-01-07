import mongoose from "mongoose"

export const connectDB=async()=>{
    try{
        const conn=mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO DB CONNECTED SUCCESSFULLY:",(await conn).connection.host);
    }catch(error){
        console.error("Error connecting to db",error);
        process.exit(1)//1 meaning failed 0 mean success;
    }
};