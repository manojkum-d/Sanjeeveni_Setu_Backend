// controllers/labReportController.ts

import { Request, Response, NextFunction } from "express";
import LabReport from "./LabReportsModel";
import cloudinary from "../../config/cloudinaryConfig"; // Ensure this file exports a configured Cloudinary instance
import { unlinkSync } from "fs";
import createHttpError from "http-errors";
import path from "path";
import multer from "multer";
import { AuthenticatedRequest } from "../../middlewares/jwtTokenVerification";

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const uploadLabReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { testName, completedDate } = req.body;
  const file = req.file;
  const userId = req.user?._id || req.hospital?._id; // Handle both user and hospital IDs

  if (!userId || !testName || !completedDate) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    let url: string | undefined;
    if (file) {
      // Derive the file name
      const fileName = path.basename(
        file.originalname,
        path.extname(file.originalname)
      );

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "lab_reports",
        resource_type: "auto", // This allows Cloudinary to automatically detect the file type
      });

      url = result.secure_url;

      // Delete local file after upload
      unlinkSync(file.path);
    }

    // Create lab report entry in MongoDB
    const newLabReport = new LabReport({
      userId,
      testName,
      completedDate: new Date(completedDate), // Convert completedDate from string to Date object
      url,
    });

    await newLabReport.save();

    res
      .status(201)
      .json({ message: "Lab report created successfully", newLabReport });
  } catch (err: any) {
    console.error("Error creating lab report: ", err);
    res.status(500).json({
      message: "Error creating lab report",
      errorStack: err.stack,
    });
  }
};

const getLabReportsByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.hospital ? req.params.userId : req.user?._id;

  try {
    if (!userId) {
      return next(createHttpError(401, "User or hospital not authenticated"));
    }

    const labReports = await LabReport.find({ userId });
    res.json({ labReports });
  } catch (err) {
    next(createHttpError(500, "Error while fetching lab reports"));
  }
};

const deleteLabReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { labReportId } = req.params;
  const userId = req.user?._id || req.hospital?._id; // Handle both user and hospital IDs

  try {
    if (!userId) {
      return next(createHttpError(401, "User or hospital not authenticated"));
    }

    const labReport = await LabReport.findById(labReportId);
    if (!labReport) {
      return next(createHttpError(404, "Lab report not found"));
    }

    if (labReport.userId.toString() !== userId.toString()) {
      return next(
        createHttpError(403, "Unauthorized to delete this lab report")
      );
    }

    // Optionally, delete the file from Cloudinary if `url` is stored
    if (labReport.url) {
      const publicId = labReport.url.split("/").pop()?.split(".")[0]; // Extract public ID from URL
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await LabReport.findByIdAndDelete(labReportId);
    res.json({ message: "Lab report deleted successfully" });
  } catch (err) {
    next(createHttpError(500, "Error while deleting lab report"));
  }
};

export { uploadLabReport, getLabReportsByUser, deleteLabReport };
