import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodPressure: { type: Number, required: true },
  cholesterolLevel: { type: Number, required: true },
  bloodSugarLevel: { type: Number, required: true },
  BMI: { type: Number, required: true },
  smokingStatus: { type: String, required: true },
  physicalActivityLevel: { type: String, required: true },
  familyHistory: { type: String, required: true },
  medicalHistory: { type: String, required: false },
  date: { type: String, required: false }, // Add a date field if needed
});

export default mongoose.model("Prediction", predictionSchema);
