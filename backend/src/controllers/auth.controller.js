import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js"

export const signup=async(req,res)=>{
    const {fullName,email,password}=req.body;
    try{
        if(!fullName||!email||!password){
            return res.status(400).json({message:"All fields are required"});    
        }
        if(password.length<6){ return res.status(400).json({message:"Password must be at least 6 characters"});    }
         //validating emails using regex
        
         const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});    
         }
     const user=await User.findOne({email:email});
     if(user){return res.status(400).json({message:"Email already exists"})}
     
     //1234565--->#^&(bhdbfk&^$#$) gibberish 
     const salt=await bcrypt.genSalt(10)
     const hashedPassword=await bcrypt.hash(password,salt);

     const newUser= new User({
        fullName,
        email,
        password:hashedPassword
     })
     if(newUser){
    //   generateToken(newUser._id,res);
    //   await newUser.save();

    //persist user first ,then generate /issue the auth coookie
    const savedUser=await newUser.save();
    generateToken(savedUser._id,res);

      res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic,
      });
      try {
        await sendWelcomeEmail(savedUser.email,savedUser.fullName,ENV.CLIENT_URL);
        
      } catch (error) {
        console.log("Failed to send Welcome email",error)
      }
     }else{
        res.status(400).json({message:"Invalid User data"});
     }


    }catch(err){
     console.log("Error in signup conteroller:",err);
     res.status(500).json({message:"Internal server error"});
    }
};


export const login=async(req,res)=>{
const{email,password}=req.body

try {
  const user=await User.findOne({email:email});
  if(!user){
    return res.status(400).json({message:"Invalid Credentials"});
  }//never tell the client which one is incorrect email or pass

  const isPasswordCorrect=await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
       return res.status(400).json({message:"Invalid Credentials"});
  }

  generateToken(user._id,res);
  res.status(200).json({
    _id:user._id,
    fullName:user.fullName,
    email:user.email,
    profilePic:user.profilePic,
  })
} catch (error) {
  console.error("Erron in Login Controller ");
  return res.status(500).json({message:"Internal server error!"})
}

};


export const logout=async(_,res)=>{
  res.cookie("jwt","",{maxAge:0});
  res.status(200).json({message:"Logged Out successfully"})
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c821f5ae17e503c1732d709a1365a88e77f411d4
}

export const updateprofile=async(req,res)>{
  
} 
<<<<<<< HEAD
=======
};

export const updateProfile=async(req,res)=>{
 try {
  const {profilePic}=req.body; //const profilePic=req.body.profilePic
  if(!profilePic){
    return res.status(400).json(
      {
        message:"Profile pic required"
      }
    )
  }
  const userId=req.user._id;

  const uploadResponse=await cloudinary.uploader.upload(profilePic)
 const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
   
 res.status(200).json(
      {
        message:"Profile pic updated successfully "
      })

  
 } catch (error) {
   return res.status(500).json(
      {
        message:"Error in the update profile route"
      })
 }
};
>>>>>>> middleware
=======
>>>>>>> c821f5ae17e503c1732d709a1365a88e77f411d4
