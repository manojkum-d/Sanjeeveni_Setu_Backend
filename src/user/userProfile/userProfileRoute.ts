import express from "express";
import {
  createPatientProfile,
  updatePatientProfile,
  getPatientProfile,
} from "./userProfileController";
import { verifyJWT } from "../../middlewares/jwtTokenVerification"; // Assuming you have a token verification middleware
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken";

const patientProfileRouter = express.Router();

// Routes for users
patientProfileRouter.post("/create", verifyJWT, createPatientProfile);
patientProfileRouter.put("/update", verifyJWT, updatePatientProfile);
patientProfileRouter.get("/:userId", verifyJWT, getPatientProfile);

// Routes for hospitals
patientProfileRouter.get(
  "/hospital/:userId",
  verifyHospitalToken,
  getPatientProfile
);

export default patientProfileRouter;
