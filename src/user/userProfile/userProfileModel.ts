import mongoose, { Schema } from "mongoose";
import { PatientProfile, Relative } from "./userProfileType";

const relativeSchema = new Schema<Relative>({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const patientProfileSchema = new Schema<PatientProfile>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bloodType: { type: String, required: false },
  allergies: { type: [String], required: false },
  primaryCarePhysician: { type: String, required: false },
  surgeries: { type: [String], required: false },
  pastMedicalHistory: { type: [String], required: false },
  relatives: { type: [relativeSchema], required: false },
  communicableDiseases: { type: [String], required: false },
});

export default mongoose.model<PatientProfile>(
  "PatientProfile",
  patientProfileSchema
);