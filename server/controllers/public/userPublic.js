import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import userModel from "../../Models/User/User.js";
import sendMail from "../../utils/mailer.js";
import passResetModel from "../../Models/User/Reset.js";

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
            await sendMail(
              email,
              "Email Verification OTP",
              `<p>Hello <b>${name}</b>,</p>
               <p>Thank you for creating an account with <b>GetFurniture</b>. Please use the OTP below to verify your email address:</p>
               <div style="text-align: center; margin: 30px 0;">
                 <div style="display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 20px 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);">
                   <span style="font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</span>
                 </div>
               </div>
               <p style="color: #6b7280; font-size: 14px;">This OTP is valid for a limited time. If you didn't request this, please ignore this email.</p>
               <p>Best Regards,<br><b>GetFurniture Team</b></p>`,
              true
            );
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
        res.status(200).json({
            message:"User logged in successfully",
            token,
            user: {
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        })
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error during login", error: error.message });
    }
})


// forgot password link to email
router.post("/forgot-password",async (req,res)=>{
    try {
        let email = req.body.email;
        let user = await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message : "user not found"})
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        await passResetModel.insertOne({userId : user._id,token : resetToken,expiresAt : Date.now() + 10 * 60 * 1000})
        const resetUrl = `${process.env.FRONTENDURL}/public/reset-password/${resetToken}`
        await sendMail(
            email,
            "Password Reset",
            `<p>Hello <b>${user.name}</b>,</p>
             <p>You requested to reset your password. Please use the link below to reset your password:</p>
             <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">Reset Password</a>
             <p style="color: #6b7280; font-size: 14px;">This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
             <p>Best Regards,<br><b>GetFurniture Team</b></p>`,
            true
          );
          res.status(200).json({message : "Password reset link sent to your email"})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

// reset password
router.post("/reset-password/:token",async (req,res)=>{
    try {
        const {password} = req.body;
        const resetRecord = await passResetModel.findOne({
            token : req.params.token,
            expiresAt : {$gt : Date.now()}
        });
        if(!resetRecord){
            return res.status(400).json({message : "Invalid or expired reset token"})
        }
        const user = await userModel.findById(resetRecord.userId)
        if(!user){
            return res.status(400).json({message : "user not found"})
        }
        let updatedPass = await bcrypt.hash(password,10);
        await userModel.updateOne({_id :user._id},{$set:{password : updatedPass}})
        await passResetModel.deleteOne({_id : resetRecord._id})
        res.status(200).json({message : "Password reset successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})
export default router;