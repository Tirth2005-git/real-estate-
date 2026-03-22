import express from "express";
import verifyToken from "../utils/verifyToken.js";
import multer from "multer";

import {
  pfpUpload,
  propertyImagesUpload,
  uploadImages,
  uploadPdf,
} from "../controllers/fileuplds.controller.js";

const filerouter = express.Router();

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, WEBP allowed."), false);
  }
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF allowed."), false);
  }
};

export const imageUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 5,
  },
});

const pdfUpload = multer({
  storage,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

filerouter.post(
  "/pfp/upload",
  verifyToken,
  imageUpload.single("pfp-pic"),
  pfpUpload,
);

filerouter.post(
  "/mult/uploads",
  verifyToken,
  imageUpload.array("property-pics", 5),
  propertyImagesUpload,
);

filerouter.post(
  "/ads/upload-images",
  verifyToken,
  imageUpload.array("images", 5),
  uploadImages,
);

filerouter.post(
  "/ads/upload-pdf",
  verifyToken,
  pdfUpload.single("brochure"),
  uploadPdf,
);

export default filerouter;
