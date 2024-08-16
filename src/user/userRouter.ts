import express from "express";
import {
  createUser,
  getUserProfile,
  loginUser,
  updateUserDetails,
  verifyUserEmailOTP,
  verifyUserPhoneOTP,
} from "./userController.js";
import { createQRCode, getQRCode } from "../qr-code/qrController.js";
import { verifyJWT } from "../middlewares/jwtTokenVerification.js";
import { verifyHospitalToken } from "../middlewares/verifyHospitalToken.js";

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
userRouter.put("/update-profile", verifyJWT, updateUserDetails);

userRouter.get;

export default userRouter;
