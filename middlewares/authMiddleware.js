import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

var checkUserAuth = async (req,res,next)=>{
    let token;
    //GetToken from header
    const {authorization}=req.headers
    if(authorization && authorization.startsWith("Bearer")){
        try {
            token = authorization.split(" ")[1]
            //Verify Token
            const {userID}=jwt.verify(token,process.env.JWT_SECRET_KEY)
            req.user=await userModel.findById(userID).select("-password")
            next()
        } catch (err) {
            console.log(err)
            res.status(401).send({"status":"failed","message":"Unauthorised access"})
        }
    }
    if(!token){
        res.status(401).send({"status":"failed","message":"Unauthorised User,No Token"}) 
    }
}

export default checkUserAuth