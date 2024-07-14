import { Request, Response, NextFunction } from "express";
import Document from "./documentModel";
import cloudinary from "../../config/cloudinaryConfig";
import { unlinkSync } from "fs";
import createHttpError from "http-errors";

const uploadDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, fileType, date, time } = req.body;
  const file = req.file;

  console.log("Request body: ", req.body);
  console.log("File: ", file);

  if (!userId || !fileType || !date || !time || !file) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided" });
  }

  try {
    // Ensure file is being received
    if (!file) {
      throw new Error("No file received");
    }

    // Log file information
    console.log("File received: ", file);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "documents",
      resource_type: "auto", // This allows Cloudinary to automatically detect the file type
    });

    // Log Cloudinary response
    console.log("Cloudinary upload result: ", result);

    // Create document entry in MongoDB
    const newDocument = new Document({
      userId,
      fileType,
      date,
      time,
      url: result.secure_url,
      createdAt: new Date(),
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    const documents = await Document.find({ userId });
    res.json({ documents });
  } catch (err) {
    next(createHttpError(500, "Error while fetching documents"));
  }
};

const deleteDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { documentId } = req.params;

  try {
    const document = await Document.findById(documentId);
    if (!document) {
      return next(createHttpError(404, "Document not found"));
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

export { uploadDocument, getDocumentsByUser, deleteDocument };
