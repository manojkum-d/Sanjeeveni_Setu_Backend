// qrController.ts
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import QRCode from "./qrCodeModel";
import { verify } from "jsonwebtoken";

import { DecodedToken } from "./qr_Type";
import crypto from "crypto";
import { config } from "../config/config";

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

  // Generate QR code data
  const qrData = crypto.randomBytes(20).toString("hex");

  // Hash the userId to hide it
  const hashedUserId = crypto.createHash("sha256").update(userId).digest("hex");

  try {
    const newQRCode = await QRCode.create({
      code: qrData,
      user: userId,
    });

    res.status(201).json({
      message: "QR code generated successfully",
      qrCode: newQRCode.code,
      hashedUserId,
    });
  } catch (err) {
    next(createHttpError(500, "Error while generating QR code"));
  }
};

const getQRCode = async (req: Request, res: Response, next: NextFunction) => {
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

  try {
    const qrCode = await QRCode.findOne({ user: userId });

    if (!qrCode) {
      return next(createHttpError(404, "QR code not found"));
    }

    res.json({ qrCode: qrCode.code });
  } catch (err) {
    next(createHttpError(500, "Error while retrieving QR code"));
  }
};

export { createQRCode, getQRCode };
