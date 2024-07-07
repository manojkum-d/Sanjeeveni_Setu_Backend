// qrTypes.ts
import mongoose from "mongoose";

// Interface for QRCode
export interface QRCode {
  code: string;
  user: mongoose.Schema.Types.ObjectId;
  // Removed expirationDate as QR code is permanent
}

export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
}

export interface JwtPayload {
  sub: string;
}

// Mongoose document interface for QRCode
export interface QRCodeDocument extends mongoose.Document, QRCode {}
