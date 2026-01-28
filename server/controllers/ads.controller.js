import Advertisement from "../models/advertisement.model.js";
import { ErrorHandler } from "../utils/error.js";
import { delimages, delpdf } from "./fileuplds.controller.js";
export async function createad(req, res, next) {
  try {
    if (req.user.userid !== req.params.id) {
      return next(
        ErrorHandler(403, "unauthorized, can only create your own ads"),
      );
    }

    let {
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

    
    const normalizedAd = {
      builderId: req.user.userid,
      projectName: projectName.trim(),
      description: description.trim(),
      location: location.trim().toLowerCase(),
      projectType: projectType.trim().toLowerCase(),

      unitTypes: unitTypes.map((u) => u.trim().toLowerCase()),

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
      reraNumber: reraNumber ? reraNumber.trim().toLowerCase() : "",

      amenities: amenities ? amenities.map((a) => a.trim().toLowerCase()) : [],

      images, // already urls / ids — don’t lowercase

      brochure: brochure || null,

      projectContacts: projectContacts.map((c) => ({
        name: c.name.trim().toLowerCase(),
        phone: c.phone.trim(), // keep digits
        email: c.email ? c.email.trim().toLowerCase() : "",
      })),
    };

    const newAd = new Advertisement(normalizedAd);
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

export async function deletead(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(
        ErrorHandler(403, "You can only delete your own advertisement!"),
      );
    }

    const ad = await Advertisement.findById(req.body.adId);
    if (!ad) {
      return next(ErrorHandler(404, "Advertisement not found"));
    }

    if (ad.images && ad.images.length > 0) {
      const imagesToDelete = ad.images;
      await delimages(...imagesToDelete);
    }

    if (ad.brochure && ad.brochure.public_id) {
      await delpdf(ad.brochure.public_id);
    }

    await Advertisement.findByIdAndDelete(req.body.adId);

    res.status(200).json({ success: true, message: "Advertisement deleted" });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
