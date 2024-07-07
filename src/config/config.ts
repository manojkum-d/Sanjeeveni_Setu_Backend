import { config as conf } from "dotenv";
conf();
const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  twilioaccountsid: process.env.TWILIO_ACCOUNT_SID,
  twilioauthtoken: process.env.TWILIO_AUTH_TOKEN,
};

export const config = Object.freeze(_config);
