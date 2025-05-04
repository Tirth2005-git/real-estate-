import { readFile } from "fs";
import cloudinary from "../utils/claudinary.js";
import { ErrorHandler } from "../utils/error.js";
import fs from "fs/promises";
import path from "path";

export async function pfpUpload(req, res, next) {
  try {
    if (!req.file) {
      return next(ErrorHandler(401, "pls upload a file"));
    }

    const pfpimage = req.file.path;

    const result = await cloudinary.uploader.upload(pfpimage);

    res.status(201).json({
      success: true,
      url: result.secure_url,
      imageid: result.public_id,
    });
  } catch (err) {
    console.log(err);
    next(ErrorHandler(500, err.message));
  }
}
