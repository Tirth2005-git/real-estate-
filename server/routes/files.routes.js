import express from "express";
import verifyToken from "../utils/verifyToken.js";
import multer from "multer";
import {
  pfpUpload,
  propertyImagesUpload,
} from "../controllers/fileuplds.controller.js";
const filerouter = express.Router();
const upload = multer({ dest: "uploads/" });

filerouter.post(
  "/api/pfp/upload",
  verifyToken,
  upload.single("pfp-pic"),
  pfpUpload
);
filerouter.post(
  "/api/mult/uploads",
  verifyToken,
  upload.array("property-pics", 5),
  propertyImagesUpload
);
export default filerouter;
