import mongoose from "mongoose";

const healthMetricSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bloodPressure: { type: String, required: false },
  heartRate: { type: Number, required: false },
  glucoseLevel: { type: Number, required: false },
  cholesterol: { type: Number, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("HealthMetric", healthMetricSchema);