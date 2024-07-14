import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicationName: { type: String, required: true },
  prescribedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Prescription", prescriptionSchema);
