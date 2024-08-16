import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config.js";
import adminModel from "../admin/adminModel.js"; // Import your admin model

declare module "express-serve-static-core" {
  interface Request {
    admin?: any; // Replace `any` with the actual admin token structure if known
  }
}

export const verifyAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(createHttpError(401, "Authorization header is missing"));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, config.jwtSecret as string, async (err, decoded) => {
    if (err) {
      return next(createHttpError(401, "Invalid token"));
    }

    try {
      const admin = await adminModel.findById(decoded?.sub);
      if (!admin) {
        return next(createHttpError(404, "Admin not found"));
      }

      req.admin = admin; // Store the admin details in the request object
      next();
    } catch (err) {
      next(createHttpError(500, "Error verifying admin"));
    }
  });
};
