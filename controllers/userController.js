import userModel  from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailconfig.js";

class UserController{
    static userRegistration = async (req,res)=>{
        const {name,email,password,password_confirmation,tc}=req.body
        const user = await userModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already exists"})
        }else{
            if(name && email && password && password_confirmation && tc){
                if(password === password_confirmation){
                 try {
                    const salt =await bcrypt.genSalt(12)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const doc = new userModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                        tc:tc
                    })
                    await doc.save()
                    const saved_user = await userModel.findOne({email:email})
                    //GENERATE JWT TOKEN
                    const token = jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY, {expiresIn:"1D"})
                    res.status(201).send({"status":"success","message":"Registered successfully","token":token})
                 } catch (error) {
                    console.log(error)
                    res.send({"status":"failed","message":"unable to register"})
                 }
                }else{
                    res.send({"status":"failed","message":"password & confirm password doesn't match"})  
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"}) 
            }
        }
    }
    static UserLogin=async(req,res)=>{
        try {
            const {email,password}=req.body
            if(email && password){
                const user = await userModel.findOne({email:email})
                if(user !=null){
                    const ismatch = await bcrypt.compare(password,user.password)
                    if((user.email === email) && ismatch){
                        //GENERATE TOKEN
                        const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY, {expiresIn:"1D"})
                        res.send({"status":"success","message":"Login success","token":token})
                    }else{
                        res.send({"status":"failed","message":"Email or Password is not valid"})
                    }
                }else{
                    res.send({"status":"failed","message":"You are not a registered user"})   
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"})   
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to login"})  
        }
    }
    static changeUserPassword = async(req,res)=>{
        console.log(req.user)
        const {password,password_confirmation}=req.body
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status":"failed","message":"password & confirm password doesn't match"})
            }else{
                const salt = await bcrypt.genSalt(12)
                const hashPassword= await bcrypt.hash(password,salt)
                await userModel.findOneAndUpdate(req.user._id,{$set:
                {password:hashPassword}})
                res.send({"status":"success","message":"password changed successfully"})
            }
        }else{
            res.send({"status":"failed","message":"All fields are required"})
        }
    }
    static loggedUser = async(req,res)=>{
        // console.log(req.user)
        res.send({"user":req.user})
    }
    static sendUserPasswordResetMail = async(req,res)=>{
        const {email} = req.body
        if(email){
            const user = await userModel.findOne({email:email})
            if(user){
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({userID:user._id},secret,{expiresIn:'10m'})
                const link = `https://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link)
                //SEND EMAIL LINK
                let info = await transporter.sendMail({
                    from:process.env.EMAIL_FROM,
                    to:"himanshusekhar836@gmail.com",
                    subject:"GEEKSHOP - Password reset link",
                    html:`<a href=${link}>Click here</a>to reset your password`
                })
                res.send({"status":"success","message":"mail sent.please check your mail id"})
            }else{
                res.send({"status":"failed","message":"wrong email id"})  
            }
        }else{
            res.send({"status":"failed","message":"Email field are required"})
        }
    }
    static userPasswordReset = async(req,res)=>{
        const {password,password_confirmation} = req.body
        const {id,token}=req.params
        const user = await userModel.findById(id)
        const new_secret = user._id +process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token,new_secret)
            if(password && password_confirmation){
                if(password === password_confirmation){
                    const salt =await bcrypt.genSalt(12)
                    const hashPassword = await bcrypt.hash(password,salt)
                    await userModel.findOneAndUpdate(user._id,{$set:
                        {password:hashPassword}})
                    res.send({"status":"success","message":"password changed successfully"})    
                }else{
                    res.send({"status":"failed","message":"password and confirm password doesn't match"})  
                }
            }else{
                res.send({"status":"failed","message":"All fields are required"}) 
            }
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Invalid token"})
        }
    }
}

export default UserController