
import cloudinary from "../utils/claudinary.js";
import { ErrorHandler } from "../utils/error.js";

import pLimit from "p-limit";

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

export async function propertyImagesUpload(req, res, next) {
  try {
    if (!req.files) {
      return next(401, "Pls upload images");
    }

    const images = req.files;

    const limit = pLimit(3);
    const imagesToupload = images.map((image) => {
      return limit(async () => {
        const result = await cloudinary.uploader.upload(image.path);
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
