import { Request, Response, NextFunction } from "express";
import MedicationReminder from "./MedicationReminderModel";
import cloudinary from "../../config/cloudinaryConfig";
import { unlinkSync } from "fs";
import createHttpError from "http-errors";

const createMedicationReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, medicationName, dosage, frequency, nextDose } = req.body;
  const file = req.file;

  if (!userId || !medicationName || !dosage || !frequency || !nextDose) {
    return next(createHttpError(400, "All required fields must be provided"));
  }

  let documentUrl = "";
  if (file) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "medication-documents",
      });
      documentUrl = result.secure_url;
      unlinkSync(file.path);
    } catch (err) {
      return next(
        createHttpError(500, "Error uploading document to Cloudinary")
      );
    }
  }

  try {
    const newMedicationReminder = new MedicationReminder({
      userId,
      medicationName,
      dosage,
      frequency,
      nextDose,
      documentUrl,
    });

    await newMedicationReminder.save();
    res
      .status(201)
      .json({
        message: "Medication reminder created successfully",
        newMedicationReminder,
      });
  } catch (err) {
    next(createHttpError(500, "Error while creating medication reminder"));
  }
};

const getMedicationRemindersByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    const medicationReminders = await MedicationReminder.find({ userId });
    res.json({ medicationReminders });
  } catch (err) {
    next(createHttpError(500, "Error while fetching medication reminders"));
  }
};

const deleteMedicationReminder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { reminderId } = req.params;

  try {
    const reminder = await MedicationReminder.findById(reminderId);
    if (!reminder) {
      return next(createHttpError(404, "Medication reminder not found"));
    }

    if (reminder.documentUrl) {
      const publicId = reminder.documentUrl.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`medication-documents/${publicId}`);
      }
    }

    await MedicationReminder.findByIdAndDelete(reminderId);
    res.json({ message: "Medication reminder deleted successfully" });
  } catch (err) {
    next(createHttpError(500, "Error while deleting medication reminder"));
  }
};

export {
  createMedicationReminder,
  getMedicationRemindersByUser,
  deleteMedicationReminder,
};
