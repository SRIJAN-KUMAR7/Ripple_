import { measureMemory } from "vm";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts=async(req,res)=>{

    try {
        const loggedInUsers=req.user._id;
        const filteredUsers=await User.find({_id: {$ne: loggedInUsers}}).select(-"password")

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getAllContacts:",error);
        res.status(500).json({message:"Server error!"})
    }
};

export const getMessagesByUserId=async(req,res)=>{
    try {
        const myId=req.user._id;
        const {id : UserToChat}=req.params;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:UserToChat},
                {senderId:UserToChat,receiverId:myId},
            ],
        });
        res.status(200).json(messages);
    } catch (error) {
       console.log("Error in getMessages Controller :",error.message); 
    }
};

export const sendMessage=async(req,res)=>{
    try {
       const {text,image}=req.body;
       const {id :receiverId}=req.params;

       const senderId=req.user._id;

       if(!text && image){
        return res.status(400).json({message: "Text or Image is requiresd"});
       }
       if(senderId.equals(receiverId)){
                return res.status(400).json({message: "Cannot send message to yourself"});
       }
       const recieverExists=await User.exists({
        _id:receiverId
       });

       if(!recieverExists){
        return res.status(404).json({
            message:"Receiver Not found"
        });
       }

       let imageUrl;
       if(image){
        //upload base64 to cloudinary
        const uploadResponse=await cloudinary.uploader.upload(image);
        imageUrl=uploadResponse.secure_url;
       }
       const newMessage= new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl,
       })
       await newMessage.save();
      
       //todo : send message in real time if user is online -socket.io 
       res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in SendMessage controller:",error.message);
    }
};

export const getChatPartners=async(req,res)=>{
    try {
        const loggedInUserId=req.user._id;

        //find all the messages where the logged_in user is either sender or reciever 
        const message=await Message.find({
            $or:[{senderId: loggedInUserId},{receiverId:loggedInUserId}],
        });

        const chatPartnerIds=[...new Set(message.map((msg)=>
             msg.senderId.toString()===loggedInUserId.toString()? msg.receiverId.toString():msg.senderId.toString())
        )];

        const chatPartners = await User
  .find({ _id: { $in: chatPartnerIds } })
  .select("-password");


        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error in getChatPartners",error.message);
        res.status(500).json({
            error:"Internal server Error!"
        });
    }
}