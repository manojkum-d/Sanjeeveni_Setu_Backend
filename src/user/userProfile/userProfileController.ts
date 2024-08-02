import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import PatientProfileModel from "./userProfileModel";
import { AuthenticatedRequest } from "../../middlewares/jwtTokenVerification";
// import { User } from "../user/userTypes";
// import { Hospital } from "../../hospital/hospitalTypes";

// Get patient profile
const getPatientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id; // Type assertion should be adjusted based on actual JWT payload
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }

    const patientProfile = await PatientProfileModel.findOne({ userId });

    if (!patientProfile) {
      return next(createHttpError(404, "Patient profile not found"));
    }

    res.json(patientProfile);
  } catch (err) {
    next(createHttpError(500, "Error while retrieving patient profile"));
  }
};

// Create patient profile
const createPatientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id; // Type assertion should be adjusted based on actual JWT payload
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }

    const profileData = req.body;

    // Check if profile already exists
    const existingProfile = await PatientProfileModel.findOne({ userId });
    if (existingProfile) {
      return next(createHttpError(400, "Patient profile already exists"));
    }

    // Create new patient profile
    const newProfile = await PatientProfileModel.create({
      userId,
      ...profileData,
    });

    res.status(201).json(newProfile);
  } catch (err) {
    next(createHttpError(500, "Error while creating patient profile"));
  }
};

// Update patient profile
const updatePatientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id; // Type assertion should be adjusted based on actual JWT payload
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }

    const profileData = req.body;

    // Update patient profile
    const updatedProfile = await PatientProfileModel.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { new: true }
    );

    if (!updatedProfile) {
      return next(createHttpError(404, "Patient profile not found"));
    }

    res.json(updatedProfile);
  } catch (err) {
    next(createHttpError(500, "Error while updating patient profile"));
  }
};

export { getPatientProfile, createPatientProfile, updatePatientProfile };
