// Example usage in a route
import { Router } from "express";
// import { verifyJWT } from "../middlewares/jwtTokenVerification";
import { verifyAdminToken } from "../middlewares/checkAdmin.js";
import {
  approveHospital,
  createHospital,
  loginHospital,
} from "./hospitalController.js";
import { getQRCode } from "../qr-code/qrController.js";
import { verifyHospitalToken } from "../middlewares/verifyHospitalToken.js";
import { verifyJWT } from "../middlewares/jwtTokenVerification.js";

const hospitalRouter = Router();

// Protect routes with authentication middleware
hospitalRouter.post("/register", createHospital);
hospitalRouter.post("/login", loginHospital);
hospitalRouter.get("/get-qr-code/:userId", verifyHospitalToken, getQRCode);
hospitalRouter.put(
  "/hospital/approve/:hospitalId",
  verifyJWT,
  verifyAdminToken,
  approveHospital
);

export default hospitalRouter;
