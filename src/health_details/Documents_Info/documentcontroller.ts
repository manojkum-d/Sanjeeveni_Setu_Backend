import { Request, Response, NextFunction } from "express";
import Document from "./documentModel.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import { unlinkSync } from "fs";
import createHttpError from "http-errors";
import path from "path";
import { AuthenticatedRequest } from "../../middlewares/jwtTokenVerification.js";

const uploadDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { description } = req.body;
  const file = req.file;
  const userId = req.user?._id || req.hospital?._id; // Handle both user and hospital IDs

  if (!userId || !description || !file) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    // Ensure file is being received
    if (!file) {
      throw new Error("No file received");
    }

    // Derive the document name from the file name
    const fileName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "documents",
      resource_type: "auto", // This allows Cloudinary to automatically detect the file type
    });

    // Create document entry in MongoDB
    const newDocument = new Document({
      userId,
      docname: fileName,
      description,
      dateTime: new Date(),
      url: result.secure_url,
    });

    await newDocument.save();

    // Delete local file after upload
    unlinkSync(file.path);

    res
      .status(201)
      .json({ message: "Document created successfully", newDocument });
  } catch (err: any) {
    console.error("Error uploading to Cloudinary: ", err);
    res.status(500).json({
      message: "Error uploading to Cloudinary",
      errorStack: err.stack,
    });
  }
};

const uploadDocumentByHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params; // Take userId from URL
  const { description } = req.body;
  const file = req.file;

  if (!userId || !description || !file) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    // Ensure file is being received
    if (!file) {
      throw new Error("No file received");
    }

    // Derive the document name from the file name
    const fileName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "documents",
      resource_type: "auto", // This allows Cloudinary to automatically detect the file type
    });

    // Create document entry in MongoDB
    const newDocument = new Document({
      userId,
      docname: fileName,
      description,
      dateTime: new Date(),
      url: result.secure_url,
    });

    await newDocument.save();

    // Delete local file after upload
    unlinkSync(file.path);

    res
      .status(201)
      .json({ message: "Document created successfully", newDocument });
  } catch (err: any) {
    console.error("Error uploading to Cloudinary: ", err);
    res.status(500).json({
      message: "Error uploading to Cloudinary",
      errorStack: err.stack,
    });
  }
};

const getDocumentsByUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.hospital ? req.params.userId : req.user?._id;

  try {
    if (!userId) {
      return next(createHttpError(401, "User or hospital not authenticated"));
    }

    const documents = await Document.find({ userId });
    res.json({ documents });
  } catch (err) {
    next(createHttpError(500, "Error while fetching documents"));
  }
};

const deleteDocument = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { documentId } = req.params;
  const userId = req.user?._id || req.hospital?._id; // Handle both user and hospital IDs

  try {
    if (!userId) {
      return next(createHttpError(401, "User or hospital not authenticated"));
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return next(createHttpError(404, "Document not found"));
    }

    if (document.userId.toString() !== userId.toString()) {
      return next(createHttpError(403, "Unauthorized to delete this document"));
    }

    const publicId = document.url?.split("/").pop()?.split(".")[0]; // Extract public ID from URL
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await Document.findByIdAndDelete(documentId);
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    next(createHttpError(500, "Error while deleting document"));
  }
};

export {
  uploadDocument,
  uploadDocumentByHospital,
  getDocumentsByUser,
  deleteDocument,
};
