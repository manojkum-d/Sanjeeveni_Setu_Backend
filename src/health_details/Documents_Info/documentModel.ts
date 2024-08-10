import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateTime: { type: Date, required: true }, // Combined date and time
  url: { type: String, required: false },
  description: { type: String, required: true },
  docname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a model from the schema
export default mongoose.model("Document", documentSchema);
