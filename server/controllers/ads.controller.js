import Advertisement from "../models/advertisement.model.js";
import { ErrorHandler } from "../utils/error.js";
export async function createad(req, res,next) {
  try {
    if (req.user.userid !== req.params.id) {
      return next(ErrorHandler(403, "unauthorized,can only create your own ads"));
    }
    const {
      projectName,
      description,
      location,
      projectType,
      unitTypes,
      priceRange,
      areaRange,
      possessionDate,
      reraRegistered,
      reraNumber,
      amenities,
      images,
      brochure,
      projectContacts,
    } = req.body;

    if (
      !projectName ||
      !description ||
      !location ||
      !projectType ||
      !unitTypes?.length ||
      !priceRange?.min ||
      !priceRange?.max ||
      !areaRange?.min ||
      !areaRange?.max ||
      !images?.length ||
      !projectContacts?.length
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (reraRegistered && !reraNumber) {
      return res.status(400).json({ message: "RERA number is required" });
    }

    const newAd = new Advertisement({
      builderId:req.user.userid,
      projectName: projectName.trim(),
      description: description.trim(),
      location,
      projectType,
      unitTypes,
      priceRange: {
        min: Number(priceRange.min),
        max: Number(priceRange.max),
      },
      areaRange: {
        min: Number(areaRange.min),
        max: Number(areaRange.max),
      },
      possessionDate: possessionDate || null,
      reraRegistered: !!reraRegistered,
      reraNumber: reraNumber || "",
      amenities: amenities || [],
      images,
      brochure: brochure || null,
      projectContacts,
    });

    const savedAd = await newAd.save();

    res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      advertisement: savedAd,
    });
  } catch (err) {
    console.error("Create Ad Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to create advertisement",
    });
  }
}
