import { Router } from "express";
import { verifyJWT } from "../middlewares/jwtTokenVerification";
import { checkAdmin } from "../middlewares/checkAdmin";
import {
  registerAdmin,
  loginAdmin,
  approveHospital,
  getHospitals,
} from "./adminController";

const adminRouter = Router();

// Admin routes
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.put(
  "/hospital/approve/:hospitalId",
  verifyJWT,
  checkAdmin,
  approveHospital
);
adminRouter.get("/hospitals", verifyJWT, checkAdmin, getHospitals);

export default adminRouter;
