import nodemailer from "nodemailer";
import { config } from "./config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

export default transporter;
