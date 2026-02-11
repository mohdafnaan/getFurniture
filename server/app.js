import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
// ================================     IMPORTS   ================================================//
// import database connection
import "./utils/dbConnect.js";
// import public routes
import userPublicRoutes from "./controllers/public/userPublic.js";
//import admin public routes
import adminPublicRoutes from "./controllers/public/adminPublic.js";
// import auth middleware
import authMiddleware from "./auth/auth.js";
// import admin private routes
import adminPrivateRoutes from "./controllers/private/admin-private.js";
// import user private routes
import userPrivateRoutes from "./controllers/private/user-private.js";
// ================================================================================//
let corsObject = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
const app = express();
app.use(express.json())
app.use(cors(corsObject));
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
    try {
        res.status(200).json({message:"Welcome to the server"})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})
app.use("/public",userPublicRoutes);
app.use("/public",adminPublicRoutes);
app.use("/private",authMiddleware,adminPrivateRoutes);
app.use("/private",authMiddleware,userPrivateRoutes);
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})