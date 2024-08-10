import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import PatientProfileModel from "./userProfileModel";
import { AuthenticatedRequest } from "../../middlewares/jwtTokenVerification";
import userModel from "../userModel";

// Get patient profile
const getPatientProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Determine whether the request is made by a hospital or a user
    const userId = req.hospital ? req.params.userId : req.user?._id;

    if (!userId) {
      return next(
        createHttpError(401, "User not authenticated or user ID not provided")
      );
    }

    const patientProfile = await PatientProfileModel.findOne({ userId });

    if (!patientProfile) {
      return next(createHttpError(404, "Patient profile not found"));
    }

    res.status(200).json(patientProfile);
  } catch (err) {
    console.error(err); // Log the error for debugging
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
    const userId = req.user?._id;

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

    // Set isHealthFormCompleted to true for the user
    await userModel.findByIdAndUpdate(userId, { isHealthFormCompleted: true });

    res.status(201).json(newProfile);
  } catch (err) {
    console.error(err); // Log the error for debugging
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
    const userId = req.user?._id;

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

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error(err); // Log the error for debugging
    next(createHttpError(500, "Error while updating patient profile"));
  }
};

export { getPatientProfile, createPatientProfile, updatePatientProfile };
