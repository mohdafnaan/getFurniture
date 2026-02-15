import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

const app = express();
app.use(express.json());

// ===================================== CORS ==========================================//
let corsObject = {
  origin: ["http://localhost:5173", "https://getfurnitures.in", "https://www.getfurnitures.in"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
// ================================================================================//
app.use(cors(corsObject));
app.use("/uploads", express.static("uploads"));
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is responsive" });
});

app.use("/public", userPublicRoutes);
app.use("/public", adminPublicRoutes);
app.use("/private", authMiddleware, adminPrivateRoutes);
app.use("/private", authMiddleware, userPrivateRoutes);

const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
