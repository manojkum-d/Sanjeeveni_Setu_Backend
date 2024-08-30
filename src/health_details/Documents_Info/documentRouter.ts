import express, { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../../middlewares/jwtTokenVerification.js";
import multer from "multer";
import {
  uploadDocument,
  uploadDocumentByHospital,
  getDocumentsByUser,
  deleteDocument,
} from "./documentcontroller.js";
import path from "path";
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken.js";

const documentRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

documentRouter.post(
  "/upload",
  verifyJWT,
  upload.single("document"),
  uploadDocument
);
documentRouter.post(
  "/hospital/upload/:userId",
  verifyHospitalToken,
  upload.single("document"),
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
