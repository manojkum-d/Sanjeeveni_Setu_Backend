import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config.js";

declare module "express-serve-static-core" {
  interface Request {
    hospital?: any; // Replace `any` with the actual hospital token structure if known
  }
}

export const verifyHospitalToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createHttpError(401, "Authorization header is missing"));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.jwtSecret as string, (err, decoded) => {
    if (err) {
      return next(createHttpError(401, "Invalid token"));
    }
    req.hospital = decoded;
    next();
  });
};
