// qrController.ts
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import QRCode from "./qrCodeModel";
import { sign, verify } from "jsonwebtoken";
import { DecodedToken } from "./qr_Type";
import crypto from "crypto";
import { config } from "../config/config";

// Function to hash the user ID using JWT secret
const hashUserId = (userId: string, secret: string): string => {
  return sign({ sub: userId }, secret);
};

// Function to decode the hashed user ID using JWT secret
const decodeHashedUserId = (hashedUserId: string, secret: string): string => {
  const decoded = verify(hashedUserId, secret) as DecodedToken;
  return decoded.sub;
};

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

  // Hash the userId using the JWT secret
  const hashedUserId = hashUserId(userId, config.jwtSecret!);

  // Generate QR code image URL
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    hashedUserId
  )}&size=200x200`;

  try {
    const newQRCode = await QRCode.create({
      code: hashedUserId,
      user: userId,
      qrImageUrl, // Store the QR code image URL in the database
      hashedUserId, // Store the hashed userId in the database
    });

    res.status(201).json({
      message: "QR code generated successfully",
      qrCode: newQRCode.code,
      qrImageUrl: newQRCode.qrImageUrl,
      hashedUserId: newQRCode.hashedUserId,
    });
  } catch (err) {
    next(createHttpError(500, "Error while generating QR code"));
  }
};

const getQRCode = async (req: Request, res: Response, next: NextFunction) => {
  const { hashedUserId } = req.params;

  let userId: string;
  try {
    userId = decodeHashedUserId(hashedUserId, config.jwtSecret!);
  } catch (err) {
    return next(createHttpError(401, "Invalid hashed user ID"));
  }

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
