import mongoose from "mongoose";

export interface User extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  fullName: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  phoneNumber?: string;
  address?: string;
  documents?: mongoose.Types.ObjectId[];
  qrCode?: mongoose.Types.ObjectId;
  otp?: string;
  otpExpiration?: Date;
  phoneOtp?: string;
  phoneOtpExpiration?: Date;
  isVerified: boolean;
  isAdmin: boolean;
  isHealthFormCompleted: boolean;
}
