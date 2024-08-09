import mongoose from "mongoose";
import { QRCodeDocument } from "./qr_Type";

const qrCodeSchema = new mongoose.Schema<QRCodeDocument>({
  code: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  qrImageUrl: { type: String, required: true }, // Store the QR code image URL
});

const QRCode = mongoose.model<QRCodeDocument>("QRCode", qrCodeSchema);

export default QRCode;
