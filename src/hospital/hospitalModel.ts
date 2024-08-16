import mongoose from "mongoose";
import { Hospital } from "./hospitalTypes.js";

const hospitalSchema = new mongoose.Schema<Hospital>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
});

export default mongoose.model<Hospital>("Hospital", hospitalSchema);
