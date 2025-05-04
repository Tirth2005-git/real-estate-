import express from "express";
import verifyToken from "../utils/verifyToken.js";
import multer from "multer";
import { pfpUpload } from "../controllers/fileuplds.controller.js";
const filerouter = express.Router();
const upload = multer({ dest: "uploads/" });

filerouter.post(
  "/api/pfp/upload",
  verifyToken,
  upload.single("pfp-pic"),
  pfpUpload
);
export default filerouter
