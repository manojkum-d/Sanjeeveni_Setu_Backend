import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import QRCode from "./qrCodeModel.js";
import pkg from "jsonwebtoken";
import { DecodedToken } from "./qr_Type.js";
import { config } from "../config/config.js";

const { verify } = pkg;

const createQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createHttpError(401, "Authorization header missing"));
  }

  const token = authHeader.split(" ")[1];

  let decodedToken: DecodedToken;
  try {
    decodedToken = verify(token, config.jwtSecret!) as DecodedToken;
  } catch (err) {
    return next(createHttpError(401, "Invalid token"));
  }

  const userId = decodedToken.sub;

  // Generate QR code image URL using the actual user ID
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    userId
  )}&size=200x200`;

  try {
    const newQRCode = await QRCode.create({
      code: userId, // Store the actual userId in the database
      user: userId,
      qrImageUrl, // Store the QR code image URL in the database
    });

    res.status(201).json({
      message: "QR code generated successfully",
      qrCode: newQRCode.code,
      qrImageUrl: newQRCode.qrImageUrl,
      userId: newQRCode.user,
    });
  } catch (err) {
    console.error("Error details:", err); // Log the error details
    next(createHttpError(500, "Error while generating QR code"));
  }
};

const getQRCode = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;

  try {
    const qrCode = await QRCode.findOne({ user: userId });

    if (!qrCode) {
      return next(createHttpError(404, "QR code not found"));
    }

    res.json({
      qrCode: qrCode.code,
      qrImageUrl: qrCode.qrImageUrl,
      userId: qrCode.user, // Return the userId along with the QR code details
    });
  } catch (err) {
    next(createHttpError(500, "Error while retrieving QR code"));
  }
};

export { createQRCode, getQRCode };
