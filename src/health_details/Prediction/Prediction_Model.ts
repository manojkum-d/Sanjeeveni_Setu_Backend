import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, required: true },
  riskPercentage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Prediction", predictionSchema);
