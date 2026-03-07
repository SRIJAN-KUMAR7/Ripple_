import express from "express";

const router = express.Router();

import { signup, login, logout, updateProfile, googleAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

// router.get("/test",arcjetProtection,(req,res)=>{
//     res.status(200).json({
//         message:"Test arcjet"
//     })
// })
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);

router.use(arcjetProtection); // Protection for everything else

router.post("/logout", logout);

router.post("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) =>
    res.status(200).json(req.user)
);
export default router;