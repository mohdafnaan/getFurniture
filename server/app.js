import express from "express";
import dotenv from "dotenv";
dotenv.config();


// import database connection
import "./utils/dbConnect.js";

const app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    try {
        res.status(200).json({message:"Welcome to the server"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})