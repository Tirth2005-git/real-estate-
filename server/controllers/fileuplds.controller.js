import cloudinary from "../utils/claudinary.js";
import { ErrorHandler } from "../utils/error.js";
import pLimit from "p-limit";
import streamifier from "streamifier";

export async function pfpUpload(req, res, next) {
  try {
    if (!req.file) {
      return next(ErrorHandler(401, "Please upload a file"));
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { timeout: 10000, folder: "realestate/pfp" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

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
      return next(ErrorHandler(401, "Please upload images"));
    }

    const images = req.files;

    const limit = pLimit(3);
    const imagesToupload = images.map((image, index) => {
      return limit(async () => {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "realestate/properties" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );

          streamifier.createReadStream(image.buffer).pipe(uploadStream);
        });
        return result;
      });
    });

    let uploadedurls = await Promise.all(imagesToupload);

    uploadedurls = uploadedurls.map((url) => {
      return { public_id: url.public_id, imageurl: url.secure_url };
    });

    res.status(201).json({
      success: true,
      uploadedurls: Array.from(uploadedurls),
    });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function delpfp(pid) {
  try {
    const result = await cloudinary.uploader.destroy(pid);

    return result;
  } catch (err) {
    throw err;
  }
}

export async function delimages(...images) {
  try {
    const limit = pLimit(3);
    const delimages = images.map((image, index) => {
      return limit(async () => {
        await cloudinary.uploader.destroy(image.public_id);
      });
    });
    await Promise.all(delimages);
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function uploadImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return next(ErrorHandler(400, "Please upload images"));
    }

    const images = req.files;

    const limit = pLimit(3);
    const imagesToUpload = images.map((image, index) => {
      return limit(async () => {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "realestate/ads" },
            (error, uploadResult) => {
              if (error) {
                reject(error);
              } else {
                resolve(uploadResult);
              }
            },
          );

          streamifier.createReadStream(image.buffer).pipe(uploadStream);
        });
        return result;
      });
    });

    let uploadedUrls = await Promise.all(imagesToUpload);

    uploadedUrls = uploadedUrls.map((url) => {
      return { public_id: url.public_id, imageurl: url.secure_url };
    });

    res.status(201).json({
      success: true,
      uploadedurls: Array.from(uploadedUrls),
    });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function uploadPdf(req, res, next) {
  try {
    if (!req.file) {
      return next(ErrorHandler(400, "Please upload a PDF file"));
    }

    const pdf = req.file;

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "realestate/brochures",
          resource_type: "auto",
          access_mode: "public",
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      streamifier.createReadStream(pdf.buffer).pipe(uploadStream);
    });

    res.status(201).json({
      success: true,
      uploadedurls: {
        pdfurl: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
    });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
export async function delpdf(public_id) {
  if (!public_id) return;
  try {
    await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw",
    });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
