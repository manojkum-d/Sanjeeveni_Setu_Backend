import { config } from "./config";
import twilio from "twilio";

const twilioClient = twilio(config.twilioaccountsid, config.twilioauthtoken);

export default twilioClient;
