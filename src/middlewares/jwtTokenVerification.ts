// src/middlewares/jwtTokenVerification.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config";
import { Hospital } from "../hospital/hospitalTypes";
import { User } from "../user/userTypes";

// Extend the Express Request interface to include userId
interface AuthenticatedRequest extends Request {
  user?: Hospital | User; // Adjust based on your application logic
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
      return next(createHttpError(401, "Invalid token"));
    }

    // Assuming decoded can be either Hospital or User type
    req.user = decoded as Hospital | User; // Assign decoded data to req.user
    next();
  });
};

export { verifyJWT };
