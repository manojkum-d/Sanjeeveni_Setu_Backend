import express, { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../../middlewares/jwtTokenVerification.js";
import multer from "multer";
import fs from "fs";
import {
  uploadDocument,
  uploadDocumentByHospital,
  getDocumentsByUser,
  deleteDocument,
} from "./documentcontroller.js";
import path from "path";
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken.js";
import { scanDocumentForText } from "../../config/ocrUtil.js";

const documentRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// OCR Middleware
const ocrMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.file && req.file.mimetype.startsWith("image/")) {
    try {
      const isValidDocument = await scanDocumentForText(req.file.path);
      if (!isValidDocument) {
        return res.status(400).json({
          error:
            "Image does not contain recognizable text. Please upload a valid document.",
        });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error during OCR processing." });
    }
  }
  next();
};

documentRouter.post(
  "/upload",
  verifyJWT,
  upload.single("document"),
  ocrMiddleware, // Add OCR middleware after the file is uploaded
  uploadDocument
);
documentRouter.post(
  "/hospital/upload/:userId",
  verifyHospitalToken,
  upload.single("document"),
  ocrMiddleware, // Add OCR middleware after the file is uploaded
  uploadDocumentByHospital
);
documentRouter.get("/user/:userId", verifyJWT, getDocumentsByUser);
documentRouter.get(
  "/hospital/:userId",
  verifyHospitalToken,
  getDocumentsByUser
);
documentRouter.delete("/:documentId", verifyJWT, deleteDocument);

export default documentRouter;
