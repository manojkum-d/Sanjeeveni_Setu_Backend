import mongoose, { Document } from "mongoose";

export interface User extends Document {
  _id: string;
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
