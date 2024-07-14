import express from "express";
import multer from "multer";
import { verifyJWT } from "../../middlewares/jwtTokenVerification";
import {
  createMedicationReminder,
  getMedicationRemindersByUser,
  deleteMedicationReminder,
} from "./MedicationReminderController";

const medicationReminderRouter = express.Router();
const upload = multer({ dest: "uploads/" });

medicationReminderRouter.post(
  "/create",
  verifyJWT,
  upload.single("document"),
  createMedicationReminder
);
medicationReminderRouter.get(
  "/user/:userId",
  verifyJWT,
  getMedicationRemindersByUser
);
medicationReminderRouter.delete(
  "/:reminderId",
  verifyJWT,
  deleteMedicationReminder
);

export default medicationReminderRouter;
