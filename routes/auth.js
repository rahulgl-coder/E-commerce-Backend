const express = require("express");
const userRouter = express.Router();
const controller=require("../controller/userController")


userRouter.post("/signup",controller.signUp )
userRouter.post("/login",controller.logIn)
userRouter.get("/products",controller.getProduct)
userRouter.get("/product/:id",controller.findOne)
userRouter.post("/google-login",controller.googleLogin)
userRouter.post("/cart",controller.addCart)
userRouter.get("/cart/:id",controller.getCart)
userRouter.delete("/cart/:id",controller.removeCart)
userRouter.post("/address",controller.addAddress)
userRouter.get("/address/:id",controller.getAddress)
userRouter.post("/otp-verification",controller.verifyOtp)
userRouter.post("/resend-otp",controller.resendOtp)
userRouter.post("/forgot-password",controller.forgotPassword)
userRouter.put("/reset-password/:id",controller.resetPassword)



module.exports = userRouter;
