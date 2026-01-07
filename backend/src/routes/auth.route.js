import express from "express";

const router=express.Router();

import { signup } from "../controllers/auth.controller.js";


router.post("/signup",signup);

router.get("/login",(req,res)=>{
    res.send("Login endpoint");
});

router.get("/logout",(req,res)=>{
    res.send("Logout endpoint");
});

export default router;