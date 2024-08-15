import { NextFunction, Request, Response } from "express";
import hospitalModel from "./hospitalModel";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { Hospital } from "./hospitalTypes";

const createHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, address, phoneNumber } = req.body;

  if (!name || !email || !password || !address || !phoneNumber) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const existingHospital = await hospitalModel.findOne({ email });
    if (existingHospital) {
      return next(
        createHttpError(400, "Hospital already exists with this email")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newHospital: Hospital = await hospitalModel.create({
      name,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
      isApproved: false, // Set to false by default, admin will approve later
    });

    const token = sign({ sub: newHospital._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.status(201).json({
      accessToken: token,
      message: "Hospital registered successfully. Waiting for admin approval.",
    });
  } catch (err) {
    next(createHttpError(500, "Error while creating hospital"));
  }
};

const loginHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  try {
    const hospital = await hospitalModel.findOne({ email });
    if (!hospital) {
      return next(createHttpError(404, "Hospital not found"));
    }

    if (!hospital.isApproved) {
      return next(
        createHttpError(403, "Hospital account is not yet approved by admin")
      );
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid credentials"));
    }

    const token = sign({ sub: hospital._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.json({ accessToken: token });
  } catch (err) {
    next(createHttpError(500, "Error during login process"));
  }
};

// Approve hospital (admin only)
const approveHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { hospitalId } = req.params;

  try {
    const hospital = await hospitalModel.findById(hospitalId);
    if (!hospital) {
      return next(createHttpError(404, "Hospital not found"));
    }

    hospital.isApproved = true;
    await hospital.save();

    res.json({ message: "Hospital approved successfully" });
  } catch (err) {
    next(createHttpError(500, "Error while approving hospital"));
  }
};

// Get all hospitals
const getAllHospitals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hospitals = await hospitalModel.find();
    res.json(hospitals);
  } catch (err) {
    next(createHttpError(500, "Error while retrieving hospitals"));
  }
};

export { createHospital, loginHospital, approveHospital, getAllHospitals };
