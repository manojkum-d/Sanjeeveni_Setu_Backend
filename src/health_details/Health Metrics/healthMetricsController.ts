import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import HealthMetric from "./healthMetricsModel.js";

// Extend the Express Request interface to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Middleware to verify JWT
const verifyJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(createHttpError(401, "No token provided"));
  }

  jwt.verify(token, config.jwtSecret as string, (err, decoded) => {
    if (err) {
      return next(createHttpError(401, "Failed to authenticate token"));
    }
    req.userId = (decoded as any).sub;
    next();
  });
};

// Controller function to create health metrics
const createHealthMetric = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const metrics = req.body.metrics; // Expecting an array of metrics

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  if (!Array.isArray(metrics) || metrics.length === 0) {
    return next(createHttpError(400, "Metrics array is empty or invalid"));
  }

  try {
    const newMetrics = await Promise.all(
      metrics.map(async (metric: any) => {
        const newMetric = new HealthMetric({
          userId,
          bloodPressure: metric.bloodPressure,
          heartRate: metric.heartRate,
          glucoseLevel: metric.glucoseLevel,
          cholesterol: metric.cholesterol,
          date: metric.date,
        });
        return newMetric.save();
      })
    );
    res
      .status(201)
      .json({ message: "Health metrics created successfully", newMetrics });
  } catch (err) {
    next(createHttpError(500, "Error while creating health metrics"));
  }
};

// Controller function to update a health metric
const updateHealthMetric = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const updateData = req.body;

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  try {
    const updatedMetric = await HealthMetric.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ message: "Health metric updated successfully", updatedMetric });
  } catch (err) {
    next(createHttpError(500, "Error while updating health metric"));
  }
};

const getHealthMetrics = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.hospital ? req.params.userId : req.userId;

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  try {
    const healthMetrics = await HealthMetric.find({ userId });
    res.json({ healthMetrics });
  } catch (err) {
    next(createHttpError(500, "Error while fetching health metrics"));
  }
};

// Controller function to delete a health metric
const deleteHealthMetric = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const { metricId } = req.params;

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  try {
    const deletedMetric = await HealthMetric.findOneAndDelete({
      _id: metricId,
      userId,
    });
    if (!deletedMetric) {
      return next(
        createHttpError(404, "Health metric not found or unauthorized")
      );
    }
    res.json({ message: "Health metric deleted successfully" });
  } catch (err) {
    next(createHttpError(500, "Error while deleting health metric"));
  }
};

export {
  verifyJWT,
  createHealthMetric,
  updateHealthMetric,
  getHealthMetrics,
  deleteHealthMetric,
};
