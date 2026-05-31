import express from "express";
import { uploadPublicKey, getPublicKey } from "../controllers/publickey.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// All key routes require authentication
router.use(arcjetProtection, protectRoute);

// POST /api/keys/upload   → store your own public key
router.post("/upload", uploadPublicKey);

// GET  /api/keys/:userId  → fetch someone else's public key
router.get("/:userId", getPublicKey);

export default router;
