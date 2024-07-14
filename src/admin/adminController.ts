import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import adminModel from "./adminModel";
import hospitalModel from "../hospital/hospitalModel";
import { config } from "../config/config";

const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return next(createHttpError(400, "Admin already exists with this email"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await adminModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = sign(
      { sub: newAdmin._id, isAdmin: newAdmin.isAdmin },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );

    res.status(201).json({
      accessToken: token,
      message: "Admin registered successfully.",
    });
  } catch (err) {
    next(createHttpError(500, "Error while creating admin"));
  }
};

const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return next(createHttpError(404, "Admin not found"));
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid credentials"));
    }

    const token = sign(
      { sub: admin._id, isAdmin: admin.isAdmin },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
        algorithm: "HS256",
      }
    );

    res.json({ accessToken: token });
  } catch (err) {
    next(createHttpError(500, "Error during login process"));
  }
};

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

const getHospitals = async (
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

export { registerAdmin, loginAdmin, approveHospital, getHospitals };
