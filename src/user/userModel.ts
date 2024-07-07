import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  phoneNumber: { type: String },
  address: { type: String },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  qrCode: { type: mongoose.Schema.Types.ObjectId, ref: "QRCode" },
  otp: String,
  otpExpiration: Date,
  phoneOtp: String, // New field
  phoneOtpExpiration: Date,
  isVerified: { type: Boolean, default: false },
});

//Users
export default mongoose.model<User>("User", userSchema);
