import express from "express";
import { createHospital } from "./hospitalController";
// import createHospital from "./hospitalController";
// import { createUser, loginUser } from "./userController";

const hospitalRouter = express.Router();

//routes

hospitalRouter.post("/register", createHospital);
// hospitalRouter.post("/login", );

export default hospitalRouter;
