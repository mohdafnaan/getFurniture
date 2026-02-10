import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DBURI = process.env.DBURI
async function dbConnect(){
    try {
        await mongoose.connect(DBURI)
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}       

dbConnect()