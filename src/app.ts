import express from "express";
import cors from "cors"; // Add this line
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import hospitalRouter from "./hospital/hospitalRoute";
import healthMetricsRouter from "./health_details/Health Metrics/healthMetricsRouter";
import documentRouter from "./health_details/Documents_Info/documentRouter";
import medicationReminderRouter from "./health_details/Medication_Reminder/MedicationReminderRouter";
import adminRouter from "./admin/adminRouter";

const app = express();

// Add CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from your Next.js frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sanjeevni setu !!!" });
});

app.use("/api/users", userRouter);
app.use("/api/hospitals", hospitalRouter);
app.use("/api/health-metrics", healthMetricsRouter);
app.use("/api/documents", documentRouter);
app.use("/api/medication-reminders", medicationReminderRouter);
app.use("/api/admin", adminRouter); // Use the admin router

// Global error handler
app.use(globalErrorHandler);

export default app;
