import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminModel from "../../Models/Admins/Admin.js";

const router = express.Router();

router.post("/admin-register",async (req,res)=>{
    try {
        let {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        let dupAdmin = await adminModel.findOne({email});
        if(dupAdmin){
            return res.status(400).json({message:"Admin already exists"})
        }
        let bPass = await bcrypt.hash(password,10); 
        await adminModel.insertOne({name,email,password : bPass});
        res.status(201).json({message:"Admin created successfully"})
    } catch (error) {
        console.error("Admin Registration Error:", error);
        res.status(500).json({ message: "Internal server error during admin registration", error: error.message });
    }
})

router.post("/admin-login",async(req,res)=>{
    try {
        let {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        let admin = await adminModel.findOne({email});
        if(!admin){
            return res.status(400).json({message:"Admin not found"})
        }
        let isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        let token = jwt.sign({adminId:admin._id},process.env.JWT_SECKEY,{expiresIn:"7d"});
        res.status(200).json({message:"Admin logged in successfully",token})
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ message: "Internal server error during admin login", error: error.message });
    }
})
export default router;  