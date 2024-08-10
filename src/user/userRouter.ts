import express from "express";
import {
  createUser,
  getUserProfile,
  loginUser,
  verifyUserEmailOTP,
  verifyUserPhoneOTP,
} from "./userController";
import { createQRCode, getQRCode } from "../qr-code/qrController";
import { verifyJWT } from "../middlewares/jwtTokenVerification";
import { verifyHospitalToken } from "../middlewares/verifyHospitalToken";

const userRouter = express.Router();

// user Routes
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/verify-email-otp", verifyUserEmailOTP);
userRouter.post("/verify-phone-otp", verifyUserPhoneOTP);
userRouter.post("/generate-qr-code", createQRCode);
userRouter.get("/get-qr-code/:userId", getQRCode);
userRouter.get("/profile/:userId", verifyJWT, getUserProfile);
userRouter.get(
  "/hospital/profile/:userId",
  verifyHospitalToken,
  getUserProfile
);

export default userRouter;
