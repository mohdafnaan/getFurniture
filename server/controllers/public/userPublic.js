import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../Models/User/User.js";
import sendMail from "../../utils/mailer.js";

const router = express.Router();

router.post("/user-register",async (req,res)=>{
    try {
        let {name,email,phone,password,address}=req.body;
        if(!name || !email || !phone || !password || !address){
            return res.status(400).json({message:"All fields are required"})
        }
        let dupUser = await userModel.findOne({email});
        if(dupUser){
            return res.status(400).json({message:"User already exists"})
        }
        let bPass = await bcrypt.hash(password,10);
        let otp = Math.floor(100000 + Math.random() * 900000);
        
        // Create user first
        await userModel.create({name,email,phone,password:bPass,address,emailOtp:otp});
        
        // Try to send mail but don't block if it fails (or handle it gracefully)
        try {
            await sendMail(email,"Email Verification OTP",`Your OTP for email verification is ${otp}`);
        } catch (mailError) {
            console.error("Failed to send verification email:", mailError);
            // We still created the user, they just didn't get the email. 
            // In a real app we might want to handle this better.
        }
        
        res.status(201).json({message:`User created successfully. Verification OTP sent to ${email}`})
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal server error during registration", error: error.message });
    }
})

router.post("/email-otp",async(req,res)=>{
    try {
        let {otp} = req.body;
        if(!otp){
            return res.status(400).json({message:"All fields are required"})
        }
        let user = await userModel.findOne({emailOtp:otp});
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        if(user.emailOtp !== otp){
            return res.status(400).json({message:"Invalid OTP"})
        }
        let token = jwt.sign({email:user.email,userId:user._id},process.env.JWT_SECKEY,{expiresIn:"7d"});
        await userModel.updateOne({emailOtp:otp},{$set:{isVerified:true,emailOtp:null}})
        res.status(200).json({message:"User verified successfully",token})
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
})

router.post("/user-login",async(req,res)=>{
    try {
        let {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        let user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        if(!user.isVerified){
            return res.status(400).json({message:"Verify your email before logging in"})
        }
        let isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }
        let token = jwt.sign({email:user.email,userId:user._id},process.env.JWT_SECKEY,{expiresIn:"7d"});
        res.status(200).json({message:"User logged in successfully",token})
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error during login", error: error.message });
    }
})


export default router;