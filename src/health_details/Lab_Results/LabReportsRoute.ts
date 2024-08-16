// routes/labReportRoutes.ts

// import { Router } from "express";
import express from "express";
import multer from "multer";
import {
  uploadLabReport,
  getLabReportsByUser,
  deleteLabReport,
} from "./LabReportsControllerts.js";
import { verifyJWT } from "../../middlewares/jwtTokenVerification.js";
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken.js";
import path from "path";

const LabRouter = express.Router();
// const prescriptionRouter = express.Router();

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

LabRouter.post("/", upload.single("file"), verifyJWT, uploadLabReport);
LabRouter.get("/user/:userId", verifyJWT, getLabReportsByUser);
LabRouter.get("/hospital/:userId", verifyHospitalToken, getLabReportsByUser);
LabRouter.delete("/:labReportId", verifyJWT, deleteLabReport);

export default LabRouter;
