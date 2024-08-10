import express from "express";
import {
  verifyJWT,
  createHealthMetric,
  updateHealthMetric,
  getHealthMetrics,
  deleteHealthMetric,
} from "./healthMetricsController";
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken";

const healthMatricsRouter = express.Router();

healthMatricsRouter.post("/health-metric", verifyJWT, createHealthMetric);
healthMatricsRouter.put("/health-metric", verifyJWT, updateHealthMetric);
healthMatricsRouter.get("/health-metrics", verifyJWT, getHealthMetrics);
healthMatricsRouter.get(
  "/health-metrics/:userId",
  verifyHospitalToken,
  getHealthMetrics
);
healthMatricsRouter.delete(
  "/health-metric/:metricId",
  verifyJWT,
  deleteHealthMetric
);

export default healthMatricsRouter;
