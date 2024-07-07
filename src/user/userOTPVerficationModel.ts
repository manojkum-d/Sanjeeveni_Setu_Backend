import mongoose from "mongoose";
import { UserOTP } from "./userOTPTypes";

const userOTPVerificationSchema = new mongoose.Schema<UserOTP>({
  userId: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model<UserOTP>(
  "userOTPVerification",
  userOTPVerificationSchema
);
