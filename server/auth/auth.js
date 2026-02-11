import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const middleware = (req,res,next)=>{
    try {
        let token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        let decoded = jwt.verify(token,process.env.JWT_SECKEY);
        req.user = decoded;
        next();        
    } catch (error) {
        console.log(error)
    }
}

export default middleware;