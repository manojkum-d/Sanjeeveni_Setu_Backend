import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    mongoose.connection.on("error", (err) => {
      console.log("Failed to connect MongoDB", err);
    });
    await mongoose.connect(config.databaseUrl as string);
  } catch (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }
};

export default connectDB;
