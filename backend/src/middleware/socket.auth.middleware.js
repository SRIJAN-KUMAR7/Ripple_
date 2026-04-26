import jwt from "jsonwebtoken";
import User from '../models/User.js'
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const cookies = socket.handshake.headers.cookie;
        
        if (!cookies) {
            console.log("Socket connection rejected: No cookies found");
            return next(new Error("Unauthorized - No cookies provided"));
        }

        // Find the jwt token in the cookies
        const token = cookies.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1];

        if (!token) {
            console.log("Socket connection rejected: No JWT token found in cookies");
            return next(new Error("Unauthorized - No token provided"));
        }

        const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
        
        if (!decodedToken) {
            console.log("Socket connection rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid token"));
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("Unauthorized - User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();
        
        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
        next();

    } catch (error) {
        console.log("Socket connection error:", error.message);
        return next(new Error("Unauthorized - Authentication failed"));
    }
}