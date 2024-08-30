import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number, required: true },
  sex: { type: Number, required: true },
  cp: { type: Number, required: true },
  trestbps: { type: Number, required: true },
  chol: { type: Number, required: true },
  fbs: { type: Number, required: true },
  restecg: { type: Number, required: true },
  thalach: { type: Number, required: true },
  exang: { type: Number, required: true },
  oldpeak: { type: Number, required: true },
  slope: { type: Number, required: true },
  ca: { type: Number, required: true },
  thal: { type: Number, required: true },
  prediction: { type: Number }, // Prediction result from Flask API
  probability: { type: Number }, // Probability from Flask API
  date: { type: Date, default: Date.now },
});

export default mongoose.model("Prediction", predictionSchema);
