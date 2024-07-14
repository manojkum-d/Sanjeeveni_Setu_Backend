import mongoose from "mongoose";

interface Admin {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
}

const adminSchema = new mongoose.Schema<Admin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: true },
});

export default mongoose.model<Admin>("Admin", adminSchema);
