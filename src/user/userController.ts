import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import userOTPVerificationModel from "./userOTPVerficationModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
import crypto from "crypto";
import transporter from "../config/nodemailer";
import twilioClient from "../config/twilio";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    username,
    email,
    password,
    fullName,
    dateOfBirth,
    gender,
    phoneNumber,
    address,
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !fullName ||
    !dateOfBirth ||
    !gender
  ) {
    return next(createHttpError(400, "All required fields must be provided"));
  }

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return next(
        createHttpError(400, "User already exists with this email or username")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = await userModel.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
    });

    // Generate email OTP
    const emailOtp = crypto.randomInt(100000, 999999).toString();
    const emailOtpExpiration = new Date();
    emailOtpExpiration.setMinutes(emailOtpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

    // Save email OTP to userOTPVerification model
    await userOTPVerificationModel.create({
      userId: newUser._id!.toString(),
      otp: emailOtp,
      createdAt: new Date(),
      expiresAt: emailOtpExpiration,
    });

    // Send email OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Email OTP Code",
      text: `Your OTP code is ${emailOtp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return next(createHttpError(500, "Failed to send OTP email"));
      }
      console.log("Email sent: " + info.response);
    });

    // Generate phone OTP
    const phoneOtp = crypto.randomInt(100000, 999999).toString();
    const phoneOtpExpiration = new Date();
    phoneOtpExpiration.setMinutes(phoneOtpExpiration.getMinutes() + 10); // OTP expires in 10 minutes

    // Save phone OTP to user model
    newUser.phoneOtp = phoneOtp;
    newUser.phoneOtpExpiration = phoneOtpExpiration;
    await newUser.save();

    // Send phone OTP via SMS
    if (phoneNumber) {
      twilioClient.messages
        .create({
          body: `Your OTP code is ${phoneOtp}. It will expire in 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        })
        .then((message: any) => console.log(`SMS sent: ${message.sid}`))
        .catch((error: any) => {
          console.error("Failed to send OTP SMS", error);
          return next(createHttpError(500, "Failed to send OTP SMS"));
        });
    }

    res.status(201).json({
      message:
        "User created successfully. Please verify your email and phone number with the OTPs sent to you.",
    });
  } catch (err) {
    next(createHttpError(500, "Error while creating user"));
  }
};

const verifyUserEmailOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, otp } = req.body;

  try {
    const otpRecord = await userOTPVerificationModel.findOne({ userId, otp });

    if (!otpRecord) {
      return next(createHttpError(400, "Invalid OTP"));
    }

    if (otpRecord.expiresAt < new Date()) {
      return next(createHttpError(400, "OTP has expired"));
    }

    // Mark user as email verified
    await userModel.findByIdAndUpdate(userId, { isVerified: true });

    // Remove the OTP record as it is no longer needed
    await userOTPVerificationModel.findByIdAndDelete(otpRecord._id);

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    next(createHttpError(500, "Error during OTP verification process"));
  }
};

const verifyUserPhoneOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, otp } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user || user.phoneOtp !== otp) {
      return next(createHttpError(400, "Invalid OTP"));
    }

    if (!user.phoneOtpExpiration || user.phoneOtpExpiration < new Date()) {
      return next(createHttpError(400, "OTP has expired"));
    }

    // Mark user as phone verified
    user.phoneOtp = undefined;
    user.phoneOtpExpiration = undefined;
    await user.save();

    res.json({ message: "Phone number verified successfully" });
  } catch (err) {
    next(createHttpError(500, "Error during OTP verification process"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(createHttpError(400, "Username and password are required"));
  }

  try {
    const user = await userModel.findOne({
      $or: [{ email: username }, { username }],
    });

    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    if (!user.isVerified) {
      return next(createHttpError(400, "User is not verified"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid credentials"));
    }

    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.json({ accessToken: token });
  } catch (err) {
    next(createHttpError(500, "Error during login process"));
  }
};

export { createUser, verifyUserEmailOTP, verifyUserPhoneOTP, loginUser };
