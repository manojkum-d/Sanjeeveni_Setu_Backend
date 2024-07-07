import express from "express";
import {
  createUser,
  loginUser,
  verifyUserEmailOTP,
  verifyUserPhoneOTP,
} from "./userController";

const userRouter = express.Router();

// Routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-email-otp", verifyUserEmailOTP);
userRouter.post("/verify-phone-otp", verifyUserPhoneOTP);

export default userRouter;
