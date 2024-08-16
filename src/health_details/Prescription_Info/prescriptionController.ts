import { Request, Response, NextFunction } from "express";
import Prescription from "./prescription_Model.js";
import cloudinary from "../../config/cloudinaryConfig.js"; // Ensure this file exports a configured cloudinary instance
import { unlinkSync } from "fs";
import createHttpError from "http-errors";
import path from "path";
import multer from "multer";
import { AuthenticatedRequest } from "../../middlewares/jwtTokenVerification.js";

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

const uploadPrescription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { prescribedBy, dateTime } = req.body;
  const file = req.file;
  const userId = req.user?._id || req.hospital?._id; // Handle both user and hospital IDs

  if (!userId || !prescribedBy || !dateTime) {
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
        folder: "prescriptions",
        resource_type: "auto", // This allows Cloudinary to automatically detect the file type
      });

      url = result.secure_url;

      // Delete local file after upload
      unlinkSync(file.path);
    }

    // Create prescription entry in MongoDB
    const newPrescription = new Prescription({
      userId,
      prescribedBy,
      createdAt: new Date(),
      url,
      dateTime: new Date(dateTime), // Convert dateTime from string to Date object
    });

    await newPrescription.save();

    res
      .status(201)
      .json({ message: "Prescription created successfully", newPrescription });
  } catch (err: any) {
    console.error("Error creating prescription: ", err);
    res.status(500).json({
      message: "Error creating prescription",
      errorStack: err.stack,
    });
  }
};

const getPrescriptionsByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.hospital ? req.params.userId : req.user?._id;

  try {
    if (!userId) {
      return next(createHttpError(401, "User or hospital not authenticated"));
    }

    const prescriptions = await Prescription.find({ userId });
    res.json({ prescriptions });
  } catch (err) {
    next(createHttpError(500, "Error while fetching prescriptions"));
  }
};

const deletePrescription = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { prescriptionId } = req.params;
  const userId = req.user?._id || req.hospital?._id; // Handle both user and hospital IDs

  try {
    if (!userId) {
      return next(createHttpError(401, "User or hospital not authenticated"));
    }

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return next(createHttpError(404, "Prescription not found"));
    }

    if (prescription.userId.toString() !== userId.toString()) {
      return next(
        createHttpError(403, "Unauthorized to delete this prescription")
      );
    }

    // Optionally, delete the file from Cloudinary if `url` is stored
    if (prescription.url) {
      const publicId = prescription.url.split("/").pop()?.split(".")[0]; // Extract public ID from URL
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Prescription.findByIdAndDelete(prescriptionId);
    res.json({ message: "Prescription deleted successfully" });
  } catch (err) {
    next(createHttpError(500, "Error while deleting prescription"));
  }
};

export { uploadPrescription, getPrescriptionsByUser, deletePrescription };
