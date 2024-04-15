import express from "express";
const router=express.Router();
import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/authMiddleware.js";

//Route level middleware- To protect Route
router.use("/changepassword",checkUserAuth)
router.use("/loggedUser",checkUserAuth)

//public Routes
router.post("/register",UserController.userRegistration)
router.post("/login",UserController.UserLogin)
router.post("/send-reset-password-mail",UserController.sendUserPasswordResetMail)
router.post("/reset-password/:id/:token",UserController.userPasswordReset)

//protected Routes
router.post("/changepassword",UserController.changeUserPassword)
router.get("/loggedUser",UserController.loggedUser)

export default router