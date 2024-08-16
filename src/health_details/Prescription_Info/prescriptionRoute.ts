import express from "express";
import { verifyJWT } from "../../middlewares/jwtTokenVerification.js";
import {
  uploadPrescription,
  getPrescriptionsByUser,
  deletePrescription,
} from "./prescriptionController.js";
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken.js";
import multer from "multer";
import path from "path";

const prescriptionRouter = express.Router();

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

prescriptionRouter.post(
  "/upload",
  verifyJWT,
  upload.single("document"),
  uploadPrescription
);
prescriptionRouter.get("/user/:userId", verifyJWT, getPrescriptionsByUser);
prescriptionRouter.get(
  "/hospital/:userId",
  verifyHospitalToken,
  getPrescriptionsByUser
);
prescriptionRouter.delete("/:prescriptionId", verifyJWT, deletePrescription);

export default prescriptionRouter;
