import express from "express";

const router=express.Router();

<<<<<<< HEAD
import { signup ,login,logout } from "../controllers/auth.controller.js";
=======
import { signup ,login,logout ,updateProfile } from "../controllers/auth.controller.js";
>>>>>>> middleware
import { protectRoute } from "../middleware/auth.middleware.js";

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

<<<<<<< HEAD
router.put("/update-profile",protectRoute,updateprofile);

=======
router.post("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,(req,res)=>
    res.status(200).json(req.user)
);
>>>>>>> middleware
export default router;