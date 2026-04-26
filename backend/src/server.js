import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app,server} from "./lib/socket.js";



const __dirname=path.resolve();

const PORT=ENV.PORT||3000;


//payload too large error - increased limit for file/image uploads
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


app.get("/",(req,res)=>{
    res.send("app is working");
})
//ready for deployment with only backend deployment 
if(ENV.NODE_ENV=="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
    })
}


server.listen(PORT,()=>{
    console.log("Server is running on port:"+ PORT);
    connectDB();
});
