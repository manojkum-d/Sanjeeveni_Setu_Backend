import express from "express";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRouter";
import hospitalRouter from "./hospital/hospitalRoute";
// import qrRouter from "../qr-code/qrRoutes";

const app = express();
app.use(express.json());

//Routes
app.get("/", (req, res, next) => {
  res.json({ message: "Welcome to Sanjeevni setu !!!" });
});

app.use("/api/users", userRouter);
app.use("/api/hospitals", hospitalRouter);

//Global error handler
app.use(globalErrorHandler);

export default app;
