import express from "express";
import {
  createPatientProfile,
  updatePatientProfile,
  getPatientProfile,
} from "./userProfileController";
import { verifyJWT } from "../../middlewares/jwtTokenVerification"; // Assuming you have a token verification middleware

const patientProfileRouter = express.Router();

// Routes
patientProfileRouter.post("/create", verifyJWT, createPatientProfile);
patientProfileRouter.put("/update", verifyJWT, updatePatientProfile);
patientProfileRouter.get("/:userId", verifyJWT, getPatientProfile);

export default patientProfileRouter;
