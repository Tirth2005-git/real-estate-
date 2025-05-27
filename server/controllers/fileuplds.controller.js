import cloudinary from "../utils/claudinary.js";
import { ErrorHandler } from "../utils/error.js";
import fs from "fs/promises";
import pLimit from "p-limit";

export async function pfpUpload(req, res, next) {
  try {
    if (!req.file) {
      return next(ErrorHandler(401, "pls upload a file"));
    }

    const pfpimage = req.file.path;

    const result = await cloudinary.uploader.upload(pfpimage, {
      timeout: 10000,
    });

    await fs.rm(req.file.path, { force: true });
    res.status(201).json({
      success: true,
      url: result.secure_url,
      imageid: result.public_id,
    });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function propertyImagesUpload(req, res, next) {
  try {
    if (!req.files || req.files.length == 0) {
      return next(401, "Pls upload images");
    }

    const images = req.files;

    const limit = pLimit(3);
    const imagesToupload = images.map((image) => {
      return limit(async () => {
        const result = await cloudinary.uploader.upload(image.path);
        await fs.rm(image.path, { force: true });
        return result;
      });
    });
    let uploadedurls = await Promise.all(imagesToupload);

    uploadedurls = uploadedurls.map((url) => {
      return { public_id: url.public_id, imageurl: url.secure_url };
    });

    res
      .status(201)
      .json({ success: true, uploadedurls: Array.from(uploadedurls) });
  } catch (err) {
   

    next(ErrorHandler(500, err.message));
  }
}

export async function delpfp(pid) {
  const result = await cloudinary.uploader.destroy(pid);
}
export async function delimages(...images) {
  const limit = pLimit(3);
  const delimages = images.map((image) => {
    return limit(async () => {
      await cloudinary.uploader.destroy(image.public_id);
    });
  });
  await Promise.all(delimages);
}
