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
            console.error("Cloudinary PFP upload error:", error);
            reject(error);
          } else {
            console.log("PFP uploaded:", result.public_id);
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
    console.error("PFP upload error:", err.message);
    next(ErrorHandler(500, err.message));
  }
}

export async function propertyImagesUpload(req, res, next) {
  try {
    if (!req.files || req.files.length == 0) {
      console.log("No files in request");
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
    console.error("Property images upload error:", err.message);
    next(ErrorHandler(500, err.message));
  }
}

export async function delpfp(pid) {
  try {
    const result = await cloudinary.uploader.destroy(pid);
    console.log("PFP deleted:", result);
    return result;
  } catch (err) {
    console.error("Delete PFP error:", err.message);
    throw err;
  }
}

export async function delimages(...images) {
  try {
    const limit = pLimit(3);
    const delimages = images.map((image, index) => {
      return limit(async () => {
        console.log(`Deleting image ${index + 1}:`, image.public_id);
        await cloudinary.uploader.destroy(image.public_id);
        console.log(`Image ${index + 1} deleted`);
      });
    });
    await Promise.all(delimages);
    console.log("All images deleted");
  } catch (err) {
    console.error("Delete images error:", err.message);
    throw err;
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
                console.error(`Advertisement image ${index + 1} error:`, error);
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
    console.error("Advertisement images upload error:", err.message);
    next(ErrorHandler(500, err.message));
  }
}

export async function uploadPdf(req, res, next) {
  try {
    if (!req.file) {
      console.log("No PDF in request");
      return next(ErrorHandler(400, "Please upload a PDF file"));
    }

    const pdf = req.file;

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "realestate/brochures",
          resource_type: "raw",
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            console.error("PDF upload error:", error);
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
    console.error("PDF upload error:", err.message);
    next(ErrorHandler(500, err.message));
  }
}
