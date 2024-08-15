// models/LabReport.ts

import mongoose, { Schema, Document } from "mongoose";

export interface LabReport extends Document {
  userId: string;
  testName: string;
  completedDate: Date;
  url: string;
  createdAt: Date;
}

const LabReportSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    testName: { type: String, required: true },
    completedDate: { type: Date, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<LabReport>("LabReport", LabReportSchema);
