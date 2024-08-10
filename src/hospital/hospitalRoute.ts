// Example usage in a route
import { Router } from "express";
import { verifyJWT } from "../middlewares/jwtTokenVerification";
import { checkAdmin } from "../middlewares/checkAdmin";
import {
  approveHospital,
  createHospital,
  loginHospital,
} from "./hospitalController";
import { getQRCode } from "../qr-code/qrController";
import { verifyHospitalToken } from "../middlewares/verifyHospitalToken";

const hospitalRouter = Router();

// Protect routes with authentication middleware
hospitalRouter.post("/register", createHospital);
hospitalRouter.post("/login", loginHospital);
hospitalRouter.get("/get-qr-code/:userId", verifyHospitalToken, getQRCode);
hospitalRouter.put(
  "/hospital/approve/:hospitalId",
  verifyJWT,
  checkAdmin,
  approveHospital
);

export default hospitalRouter;
