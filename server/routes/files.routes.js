import express from "express";
import verifyToken from "../utils/verifyToken.js";
import multer from "multer";
import storage from "../utils/multure.js";
import {
  pfpUpload,
  propertyImagesUpload,
} from "../controllers/fileuplds.controller.js";
const filerouter = express.Router();
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

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
