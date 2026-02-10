import express from "express";
import { getAllContacts,getMessagesByUserId,sendMessage,getChatPartners } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";


const router=express.Router();
router.use(arcjetProtection,protectRoute);

router.get("/contacts",getAllContacts);
 router.get("/chats",getChatPartners);
 router.get("/:id",getMessagesByUserId);
 router.post("/send/:id",sendMessage);

export default router;





// GET on /messages/contacts
// [
//     {
//         "profilePic": "",
//         "_id": "695fff5240e4450d1da55274",
//         "email": "srijan@gmail.com",
//         "fullName": "Srijan Kumar",
//         "password": "$2a$10$FVINucQvThyW6fQhTrkfee89WQg5LpHSqIFiUWy6yRZKRLEI82KA2",
//         "profilepic": "",
//         "createdAt": "2026-01-08T19:02:42.731Z",
//         "updatedAt": "2026-01-08T19:02:42.731Z",
//         "__v": 0
//     },
//     {
//         "profilePic": "",
//         "_id": "69668a1e7e4bc4b6c23d6a08",
//         "email": "srijanasa@gmail.com",
//         "fullName": "Rishu Kumar",
//         "password": "$2a$10$.KKkhkulUIeCEgF3JjKZm.QoT9GJD9TLvDtM5aNCf3HVGNd9q8tLm",
//         "profilepic": "",
//         "createdAt": "2026-01-13T18:08:30.122Z",
//         "updatedAt": "2026-01-13T18:08:30.122Z",
//         "__v": 0
//     },
//     {
//         "profilePic": "",
//         "_id": "69668bfc92c80ce15d22e23c",
//         "email": "srijanassssa@gmail.com",
//         "fullName": "koi Kumar",
//         "password": "$2a$10$LP4ottFQQ3WkziyJRBqYfOWKm.7bNAF7b3dTwFE62aVy6HY.b38ue",
//         "profilepic": "",
//         "createdAt": "2026-01-13T18:16:28.986Z",
//         "updatedAt": "2026-01-13T18:16:28.986Z",
//         "__v": 0
//     },
//     {
//         "profilePic": "",
//         "_id": "6967a92e8248e9150c0cb04e",
//         "email": "johnthedon@gmail.com",
//         "fullName": "John the Don",
//         "password": "$2a$10$kc.6sVdsDKjuJDgAOPFEdOU7pkAz8NyCpNfGLUC.ABJgkaHlo0.oS",
//         "profilepic": "",
//         "createdAt": "2026-01-14T14:33:18.785Z",
//         "updatedAt": "2026-01-14T14:33:18.785Z",
//         "__v": 0
//     },
//     {
//         "profilePic": "",
//         "_id": "696c70ca4927c837a44854d0",
//         "email": "srijankumar7@gmail.com",
//         "fullName": "John the Don",
//         "password": "$2a$10$L3ZBRT9EVWHIjhackL0O...sSmW/55lt41Ug/xisDigRYpjwUe9Wy",
//         "profilepic": "",
//         "createdAt": "2026-01-18T05:34:02.928Z",
//         "updatedAt": "2026-01-18T05:34:02.928Z",
//         "__v": 0
//     },
//     {
//         "profilePic": "",
//         "_id": "696c71a1c57b82bd4e68ef68",
//         "email": "srijankumar7777@gmail.com",
//         "fullName": "John the Don",
//         "password": "$2a$10$7Xi/Fhz2bIp48q5vX4K2VexBcdw.xPiL.QdFkimoEyeH3L930pXE6",
//         "profilepic": "",
//         "createdAt": "2026-01-18T05:37:37.809Z",
//         "updatedAt": "2026-01-18T05:37:37.809Z",
//         "__v": 0
//     },
//     {
//         "profilePic": "",
//         "_id": "696c72fbc57b82bd4e68ef6c",
//         "email": "srijankumar77@gmail.com",
//         "fullName": "John the Don",
//         "password": "$2a$10$tF.IgCSKgU64G3f3j25fT.yXEhC07g3SfyeHjM8XLCkjcsYj2rlX.",
//         "profilepic": "",
//         "createdAt": "2026-01-18T05:43:23.481Z",
//         "updatedAt": "2026-01-18T05:43:23.481Z",
//         "__v": 0
//     },
//     {
//         "profilePic": "",
//         "_id": "696c7a5b279fb8e29b88ddd3",
//         "email": "srijankumar77777@gmail.com",
//         "fullName": "Vivek Oberoi",
//         "password": "$2a$10$aQousFzmQLo1RtAauGhWM.MCR21wSFV2q1wzQjMocqxiBW961tsMa",
//         "profilepic": "",
//         "createdAt": "2026-01-18T06:14:51.308Z",
//         "updatedAt": "2026-01-18T06:14:51.308Z",
//         "__v": 0
//     }
// ]