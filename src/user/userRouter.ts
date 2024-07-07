import express from "express";
import {
  createUser,
  loginUser,
  verifyUserEmailOTP,
  verifyUserPhoneOTP,
} from "./userController";
import { createQRCode, getQRCode } from "../qr-code/qrController";

const userRouter = express.Router();

// Routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-email-otp", verifyUserEmailOTP);
userRouter.post("/verify-phone-otp", verifyUserPhoneOTP);
userRouter.post("/generate-qr-code", createQRCode);
userRouter.get("/get-qr-code", getQRCode);

export default userRouter;
