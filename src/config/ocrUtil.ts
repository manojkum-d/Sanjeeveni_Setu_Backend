import Tesseract from "tesseract.js";
import fs from "fs";

export const scanDocumentForText = async (filePath: any) => {
  try {
    const result = await Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    });

    const text = result.data.text.trim();
    if (text.length > 0) {
      console.log("Text recognized in image:", text);
      return true;
    } else {
      console.log("No text recognized in image.");
      return false;
    }
  } catch (error) {
    console.error("OCR error:", error);
    throw new Error("Error during OCR processing.");
  } finally {
    // Optionally delete the file after processing
    fs.unlinkSync(filePath);
  }
};
