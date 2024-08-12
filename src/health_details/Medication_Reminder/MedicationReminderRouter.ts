import express from "express";
import { verifyJWT } from "../../middlewares/jwtTokenVerification";
import {
  createMedicationReminder,
  getMedicationRemindersByUser,
  deleteMedicationReminder,
} from "./MedicationReminderController";
import { verifyHospitalToken } from "../../middlewares/verifyHospitalToken";

const medicationReminderRouter = express.Router();

medicationReminderRouter.post("/create", verifyJWT, createMedicationReminder);

medicationReminderRouter.get(
  "/user/:userId",
  verifyJWT,
  getMedicationRemindersByUser
);

medicationReminderRouter.get(
  "/hospital/user/:userId",
  verifyHospitalToken,
  getMedicationRemindersByUser
);

medicationReminderRouter.delete(
  "/:reminderId",
  verifyJWT,
  deleteMedicationReminder
);

export default medicationReminderRouter;
