import mongoose from "mongoose";

export interface Relative {
  name: string;
  relation: string;
  phoneNumber: string;
}

export interface PatientProfile extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  bloodType: string;
  allergies: string[];
  primaryCarePhysician: string;
  surgeries: string[];
  pastMedicalHistory: string[];
  relatives: Relative[];
  communicableDiseases: string[];
  profileImageUrl: string;
}
