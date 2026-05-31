import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique:true
    },
    fullName:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true,
        minlength:6
    },
    profilePic:{
        type:String,
        default:""
    },
    publicKey:{
        type:String,
        default:null
        // Stores user's ECDH P-256 public key in Base64 SPKI format.
        // Safe to store server-side — the matching private key never leaves the browser.
    }
},{timestamps:true}) //shows createdAt and Updatedat

const User=mongoose.model("User",userSchema);

export default User;