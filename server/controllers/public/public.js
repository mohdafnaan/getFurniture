import express from "express";
import bcrypt from "bcrypt";
import userModel from "../../Models/User/User.js";
import manufacturerModel from "../../Models/Manufacturers/Man.js";

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
        let user = await userModel.create({name,email,phone,password:bPass,address,emailOtp:otp});
        res.status(201).json({message:"User created successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
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
        await userModel.updateOne({emailOtp:otp},{$set:{isVerified:true,emailOtp:null}})
        res.status(200).json({message:"User verified successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
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
            return res.status(400).json({message:"User not verified"})
        }
        let isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"})
        }
        res.status(200).json({message:"User logged in successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

export default router;