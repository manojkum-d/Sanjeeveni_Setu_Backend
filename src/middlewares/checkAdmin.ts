// src/middlewares/checkAdmin.ts
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { Hospital } from "../hospital/hospitalTypes";
import { User } from "../user/userTypes";

// Extend the Express Request interface to include userId
interface AuthenticatedRequest extends Request {
  user?: Hospital | User; // Adjust based on your application logic
}

const checkAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(createHttpError(401, "User not authenticated"));
  }

  if (!req.user.isAdmin) {
    return next(createHttpError(403, "Admin access required"));
  }

  next();
};

export { checkAdmin };
