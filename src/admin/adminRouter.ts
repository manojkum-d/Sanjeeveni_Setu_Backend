import { Router } from "express";
import { verifyJWT } from "../middlewares/jwtTokenVerification.js";
import { verifyAdminToken } from "../middlewares/checkAdmin.js";
import {
  registerAdmin,
  loginAdmin,
  approveHospital,
  getHospitals,
} from "./adminController.js";

const adminRouter = Router();

// Admin routes
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.put(
  "/hospital/approve/.js",
  verifyJWT,
  verifyAdminToken,
  approveHospital
);
adminRouter.get("/hospitals", verifyJWT, verifyAdminToken, getHospitals);

export default adminRouter;
