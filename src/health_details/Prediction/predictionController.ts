import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import Prediction from "./Prediction_Model.js";
import { config } from "../../config/config.js";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Controller function to create predictions
const createPrediction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(createHttpError(401, "Authentication token missing"));
  }

  let userId;
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);
    if (decoded && typeof decoded === "object" && "sub" in decoded) {
      userId = decoded.sub as string;
    } else {
      return next(createHttpError(401, "Invalid token structure"));
    }
  } catch (err) {
    return next(createHttpError(401, "Invalid token"));
  }

  const predictionData = req.body;

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  try {
    const newPrediction = new Prediction({
      userId,
      age: predictionData.age,
      gender: predictionData.gender,
      bloodPressure: predictionData.bloodPressure,
      cholesterolLevel: predictionData.cholesterolLevel,
      bloodSugarLevel: predictionData.bloodSugarLevel,
      BMI: predictionData.BMI,
      smokingStatus: predictionData.smokingStatus,
      physicalActivityLevel: predictionData.physicalActivityLevel,
      familyHistory: predictionData.familyHistory,
      medicalHistory: predictionData.medicalHistory,
      date: predictionData.date,
    });
    await newPrediction.save();
    res
      .status(201)
      .json({ message: "Prediction created successfully", newPrediction });
  } catch (err) {
    next(createHttpError(500, "Error while creating prediction"));
  }
};

// Controller function to update a prediction
const updatePrediction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(createHttpError(401, "Authentication token missing"));
  }

  let userId;
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);
    if (decoded && typeof decoded === "object" && "sub" in decoded) {
      userId = decoded.sub as string;
    } else {
      return next(createHttpError(401, "Invalid token structure"));
    }
  } catch (err) {
    return next(createHttpError(401, "Invalid token"));
  }

  const updateData = req.body;

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  try {
    const updatedPrediction = await Prediction.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.json({ message: "Prediction updated successfully", updatedPrediction });
  } catch (err) {
    next(createHttpError(500, "Error while updating prediction"));
  }
};

// Controller function to get predictions
const getPredictions = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(createHttpError(401, "Authentication token missing"));
  }

  let userId;
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);
    if (decoded && typeof decoded === "object" && "sub" in decoded) {
      userId = decoded.sub as string;
    } else {
      return next(createHttpError(401, "Invalid token structure"));
    }
  } catch (err) {
    return next(createHttpError(401, "Invalid token"));
  }

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  try {
    const predictions = await Prediction.find({ userId });
    res.json({ predictions });
  } catch (err) {
    next(createHttpError(500, "Error while fetching predictions"));
  }
};

// Controller function to delete a prediction
const deletePrediction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(createHttpError(401, "Authentication token missing"));
  }

  let userId;
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);
    if (decoded && typeof decoded === "object" && "sub" in decoded) {
      userId = decoded.sub as string;
    } else {
      return next(createHttpError(401, "Invalid token structure"));
    }
  } catch (err) {
    return next(createHttpError(401, "Invalid token"));
  }

  const { predictionId } = req.params;

  if (!userId) {
    return next(createHttpError(401, "User ID is missing in request"));
  }

  try {
    const deletedPrediction = await Prediction.findOneAndDelete({
      _id: predictionId,
      userId,
    });
    if (!deletedPrediction) {
      return next(createHttpError(404, "Prediction not found or unauthorized"));
    }
    res.json({ message: "Prediction deleted successfully" });
  } catch (err) {
    next(createHttpError(500, "Error while deleting prediction"));
  }
};

export { createPrediction, updatePrediction, getPredictions, deletePrediction };
