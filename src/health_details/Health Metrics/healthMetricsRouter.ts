import express from "express";
import {
  verifyJWT,
  createHealthMetric,
  updateHealthMetric,
  getHealthMetrics,
  deleteHealthMetric,
} from "./healthMetricsController";

const healthMatricsRouter = express.Router();

healthMatricsRouter.post("/health-metric", verifyJWT, createHealthMetric);
healthMatricsRouter.put("/health-metric", verifyJWT, updateHealthMetric);
healthMatricsRouter.get("/health-metrics", verifyJWT, getHealthMetrics);
healthMatricsRouter.delete(
  "/health-metric/:metricId",
  verifyJWT,
  deleteHealthMetric
);

export default healthMatricsRouter;
