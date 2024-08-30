import express from "express";
import {
  createPrediction,
  updatePrediction,
  getPredictions,
  deletePrediction,
} from "./predictionController.js";
import { verifyJWT } from "../../middlewares/jwtTokenVerification.js";

const Predictionrouter = express.Router();

Predictionrouter.post("/prediction", verifyJWT, createPrediction);
Predictionrouter.put("/prediction/:predictionId", verifyJWT, updatePrediction);
Predictionrouter.get("/predictions", verifyJWT, getPredictions);
Predictionrouter.delete(
  "/prediction/:predictionId",
  verifyJWT,
  deletePrediction
);

export default Predictionrouter;
