import mongoose from "mongoose";

const medicationReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicationName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  nextDose: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MedicationReminder", medicationReminderSchema);
