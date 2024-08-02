import mongoose, { Schema } from "mongoose";
import { PatientProfile, Relative } from "./userProfileType";

const relativeSchema = new Schema<Relative>({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const patientProfileSchema = new Schema<PatientProfile>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bloodType: { type: String, required: true },
  allergies: { type: [String], required: true },
  primaryCarePhysician: { type: String, required: true },
  surgeries: { type: [String], required: true },
  pastMedicalHistory: { type: [String], required: true },
  relatives: { type: [relativeSchema], required: true },
  communicableDiseases: { type: [String], required: true },
});

export default mongoose.model<PatientProfile>(
  "PatientProfile",
  patientProfileSchema
);
