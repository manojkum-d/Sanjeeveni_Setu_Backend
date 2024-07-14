import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileType: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  url: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
