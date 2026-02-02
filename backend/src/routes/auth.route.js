import express from "express";

const router=express.Router();

<<<<<<< HEAD
<<<<<<< HEAD
import { signup ,login,logout } from "../controllers/auth.controller.js";
=======
import { signup ,login,logout ,updateProfile } from "../controllers/auth.controller.js";
>>>>>>> middleware
=======
import { signup ,login,logout } from "../controllers/auth.controller.js";
>>>>>>> c821f5ae17e503c1732d709a1365a88e77f411d4
import { protectRoute } from "../middleware/auth.middleware.js";

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

<<<<<<< HEAD
<<<<<<< HEAD
router.put("/update-profile",protectRoute,updateprofile);

=======
router.post("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,(req,res)=>
    res.status(200).json(req.user)
);
>>>>>>> middleware
=======
router.put("/update-profile",protectRoute,updateprofile);

>>>>>>> c821f5ae17e503c1732d709a1365a88e77f411d4
export default router;