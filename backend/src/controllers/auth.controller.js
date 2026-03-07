import bcrypt from "bcryptjs"
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js"
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    let payload;

    try {
      // Try to verify as ID Token first
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: ENV.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (e) {
      // Fallback: Try to fetch user info using Access Token
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
      if (!response.ok) {
        throw new Error("Failed to verify Google token");
      }
      payload = await response.json();
    }

    const { email, name, picture, sub } = payload;
    // Note: picture might be 'picture' in ID Token and 'picture' in UserInfo
    // Name might be 'name' in both.

    // check if user exists in DB
    let user = await User.findOne({ email });

    if (!user) {
      // Create user if not exists
      // Using a random password for Google users as they don't need one
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), salt);

      user = await User.create({
        email,
        fullName: name,
        profilePic: picture,
        password: hashedPassword, // Required by model
      });

      try {
        await sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL);
      } catch (error) {
        console.log("Failed to send Welcome email", error);
      }
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in googleAuth controller:", error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
};
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) { return res.status(400).json({ message: "Password must be at least 6 characters" }); }
    //validating emails using regex

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const user = await User.findOne({ email: email });
    if (user) { return res.status(400).json({ message: "Email already exists" }) }

    //1234565--->#^&(bhdbfk&^$#$) gibberish 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    })
    if (newUser) {
      //   generateToken(newUser._id,res);
      //   await newUser.save();

      //persist user first ,then generate /issue the auth coookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
      try {
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);

      } catch (error) {
        console.log("Failed to send Welcome email", error)
      }
    } else {
      res.status(400).json({ message: "Invalid User data" });
    }


  } catch (err) {
    console.log("Error in signup conteroller:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }//never tell the client which one is incorrect email or pass

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.error("Erron in Login Controller ");
    return res.status(500).json({ message: "Internal server error!" })
  }

};


export const logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged Out successfully" })
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; //const profilePic=req.body.profilePic
    if (!profilePic) {
      return res.status(400).json(
        {
          message: "Profile pic required"
        }
      )
    }
    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

    res.status(200).json(
      {
        message: "Profile pic updated successfully "
      })


  } catch (error) {
    return res.status(500).json(
      {
        message: "Error in the update profile"
      })
  }
};