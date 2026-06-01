import jwt from "jsonwebtoken"
import { ENV } from "./env.js";

export const generateToken=(userId,res)=>{
  const {JWT_SECRET} =ENV;
  if(!JWT_SECRET){
    throw new Error("JWT_SECRET is not configured");
  }

  const token =jwt.sign({
    userId:userId
  },JWT_SECRET,{
    expiresIn:"7d",
  });
  res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000 ,//in ms
    httpOnly:true,//xss attacks ->cross site scripting
    sameSite:"none", //CSRF attacks(but railway and vercel doesn't support sameSite:"strict")
    secure:ENV.NODE_ENV==="development"?"false":true,
  });
  return token;
};