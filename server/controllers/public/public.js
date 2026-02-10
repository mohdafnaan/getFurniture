import express from "express";
import userModel from "../../Models/User/User.js";
import manufacturerModel from "../../Models/Manufacturers/Man.js";

const router = express.Router();

router.get("/",(req,res)=>{
    try {
        let {name,email,phone,password,address,}=
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

export default router;