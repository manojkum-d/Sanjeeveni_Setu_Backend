import nodemailer from "nodemailer";
import { config } from "./config.js";

const nodemailerModule = nodemailer || require("nodemailer");

const transporter = nodemailerModule.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

export default transporter;
