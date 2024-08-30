import express from "express";
import {
  createPatientProfile,
  updatePatientProfile,
  getPatientProfile,
} from "./userProfileController.js";
import { verifyJWT } from "../../middlewares/jwtTokenVerification.js"; // Assuming you have a token verification middleware
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken.js";
import multer from "multer";
import path from "path";

const patientProfileRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save uploaded files to the uploads/ directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Routes for users
patientProfileRouter.post(
  "/create",
  verifyJWT,
  upload.single("profileImage"), // Add this to handle profile image upload
  createPatientProfile
);
patientProfileRouter.put(
  "/update",
  verifyJWT,
  upload.single("profileImage"), // Add this to handle profile image upload
  updatePatientProfile
);
patientProfileRouter.get("/:userId", verifyJWT, getPatientProfile);

// Routes for hospitals
patientProfileRouter.get(
  "/hospital/:userId",
  verifyHospitalToken,
  getPatientProfile
);

export default patientProfileRouter;
