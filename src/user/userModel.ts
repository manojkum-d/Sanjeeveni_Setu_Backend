import mongoose, { Model, Schema } from "mongoose";
import { User } from "./userTypes.js";

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  phoneNumber: String,
  address: String,
  documents: [{ type: mongoose.Types.ObjectId, ref: "Document" }],
  qrCode: { type: mongoose.Types.ObjectId, ref: "QrCode" },
  otp: String,
  otpExpiration: Date,
  phoneOtp: String,
  phoneOtpExpiration: Date,
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isHealthFormCompleted: { type: Boolean, default: false },
});

const userModel: Model<User> = mongoose.model<User>("User", userSchema);

export default userModel;
