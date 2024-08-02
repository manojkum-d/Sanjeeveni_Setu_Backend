import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config";
import { Hospital } from "../hospital/hospitalTypes";
import { User } from "../user/userTypes";

// Extend the Express Request interface to include user
export interface AuthenticatedRequest extends Request {
  user?: User | Hospital;
}

const verifyJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(createHttpError(401, "Authentication token missing"));
  }

  jwt.verify(token, config.jwtSecret as string, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err); // Log the error
      return next(createHttpError(401, "Invalid token"));
    }

    // Check the decoded payload
    if (decoded && typeof decoded === "object" && "sub" in decoded) {
      req.user = { _id: decoded.sub } as User | Hospital; // Adjust according to your app logic
      next();
    } else {
      return next(createHttpError(401, "Invalid token structure"));
    }
  });
};

export { verifyJWT };
