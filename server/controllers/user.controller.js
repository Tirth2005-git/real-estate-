import User from "../models/users.model.js";
import { ErrorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import Listing from "../models/listing.model.js";
import { delpfp } from "./fileuplds.controller.js";
import isCloudinaryURL from "../utils/isclaudinary.js";
import { delimages, delpdf } from "./fileuplds.controller.js";
import Advertisement from "../models/advertisement.model.js";
export async function updateUser(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(ErrorHandler(403, "Unauthorized!"));
    }

    const allowedFields = [
      "username",
      "password",
      "personalContactValue",
      "companyContactValue",
      "localities",
      "companyName",
      "companyAddress",
      "pfp",
      "pfpid",
      "companyDescription",
      "notificationPreferences", // ✅ Add this
    ];

    const hasValidField = allowedFields.some((field) => {
      const value = req.body[field];

      if (!value) return false;

      if (field === "notificationPreferences") {
        return true; 
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      
      return true;
    });

    if (!hasValidField) {
      return next(ErrorHandler(400, "At least one field is required"));
    }

    const user = await User.findById(req.params.id);

    if (req.body.pfp) {
      if (isCloudinaryURL(user.pfp)) {
        await delpfp(user.pfpid);
      }
    }

    let cleanBody = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== null && req.body[key] !== undefined) {
        if (typeof req.body[key] === "string") {
          const trimmed = req.body[key].trim();
          if (trimmed.length > 0) {
            cleanBody[key] = trimmed;
          }
        } else if (Array.isArray(req.body[key])) {
          if (req.body[key].length > 0) {
            cleanBody[key] = req.body[key];
          }
        } else if (typeof req.body[key] === "object") {
          cleanBody[key] = req.body[key];
        } else {
          cleanBody[key] = req.body[key];
        }
      }
    });

    if (cleanBody.personalContactValue || cleanBody.companyContactValue) {
      const emailConditions = [];

      if (cleanBody.personalContactValue) {
        const personalEmail = cleanBody.personalContactValue.trim();
        emailConditions.push({ personalContactValue: personalEmail });
        emailConditions.push({ companyContactValue: personalEmail });
      }

      if (cleanBody.companyContactValue) {
        const companyEmail = cleanBody.companyContactValue.trim();
        emailConditions.push({ personalContactValue: companyEmail });
        emailConditions.push({ companyContactValue: companyEmail });
      }

      const existingEmail = await User.findOne({
        $or: emailConditions,
        _id: { $ne: req.params.id },
      });

      if (existingEmail) {
        return next(ErrorHandler(409, `Email is already registered`));
      }
    }

    if (cleanBody.username) {
      const usernameCheck = await User.findOne({
        username: cleanBody.username.trim(),
        _id: { $ne: req.params.id },
      });

      if (usernameCheck) {
        return next(ErrorHandler(409, "Username already in use"));
      }
    }

    if (cleanBody.password) {
      cleanBody.password = await bcrypt.hash(cleanBody.password, 10);
    }

    const stringFields = [
      "username",
      "personalContactValue",
      "companyContactValue",
      "companyName",
      "companyAddress",
      "companyDescription",
    ];

    stringFields.forEach((field) => {
      if (cleanBody[field]) {
        cleanBody[field] = cleanBody[field].trim();
      }
    });

    if (req.user.role !== "builder") {
      if (req.body.notificationPreferences) {
        cleanBody.notificationPreferences = {
          localities: req.body.notificationPreferences.localities || [],
          propertyTypes: req.body.notificationPreferences.propertyTypes || [],
          listingTypes: req.body.notificationPreferences.listingTypes || [],
        };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: cleanBody,
      },
      {
        new: true,
      },
    );

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (err) {
    console.log("Update user error:", err.message);
    next(ErrorHandler(500, err.message));
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(ErrorHandler(403, "Can't delete others!!"));
    }

    const usertodel = await User.findById(req.params.id);
    if (!usertodel) {
      return next(ErrorHandler(404, "User not found"));
    }

    const { pfpid, pfp, role } = usertodel;

    if (isCloudinaryURL(pfp)) {
      await delpfp(pfpid);
    }

    if (role !== "builder") {
      const userlistings = await Listing.find({ userref: req.params.id });

      if (userlistings.length > 0) {
        for (const listing of userlistings) {
          const imagestodel = Array.from(listing.images || []);
          if (imagestodel.length > 0) {
            await delimages(...imagestodel);
          }
        }

        await Listing.deleteMany({ userref: req.params.id });
      }
    }

    if (role === "builder") {
      const ads = await Advertisement.find({ builderId: req.params.id });

      if (ads.length > 0) {
        for (const ad of ads) {
          const imagestodel = Array.from(ad.images || []);
          if (imagestodel.length > 0) {
            await delimages(...imagestodel);
          }

          if (ad.brochure?.public_id) {
            await delpdf(ad.brochure.public_id);
          }
        }

        await Advertisement.deleteMany({ builderId: req.params.id });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.clearCookie("access_token").status(201).json({ success: true });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function signout(req, res, next) {
  try {
    res.clearCookie("access_token").status(201).json({ success: true });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function getUserListings(req, res, next) {
  try {
    if (req.params.id != req.user.userid) {
      return next(ErrorHandler(403, "can't get others's Listings !!"));
    }
    const userlistings = await Listing.find({ userref: req.params.id });

    res.status(201).json({ success: true, userlistings });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function browseDealers(req, res, next) {
  try {
    const { locality, dealerType } = req.body;

    let filters = { role: "dealer" };

    if (locality) {
      const locLower = locality.toLowerCase();

      filters.localities = locLower;
    }

    if (dealerType) {
      filters.dealerType = dealerType.toLowerCase();
    }

    const dealers = await User.find(filters)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(50);

    const transformedDealers = dealers.map((dealer) => ({
      _id: dealer._id,
      name: dealer.username,
      companyName: dealer.companyName,
      dealerType: dealer.dealerType,
      localities: dealer.localities,

      location: {
        locality: dealer.localities[0] || "",
      },

      contact: {
        email:
          dealer.dealerType === "agency"
            ? dealer.companyContactValue || ""
            : dealer.personalContactValue || "",
      },

      pfp: dealer.pfp,
      companyDescription: dealer.companyDescription,
    }));

    res.status(200).json({
      success: true,
      count: transformedDealers.length,
      dealers: transformedDealers,
    });
  } catch (err) {
    console.error("Browse Dealers Error:", err);
    next(ErrorHandler(500, "Failed to fetch dealers"));
  }
}

export async function getDealerProfile(req, res, next) {
  try {
    const { dealerId } = req.params;

    const dealer = await User.findById(dealerId).select(
      "username dealerType companyName companyDescription localities pfp personalContactValue companyContactValue role",
    );

    if (!dealer || dealer.role !== "dealer") {
      return next(ErrorHandler(404, "Dealer not found"));
    }

    const listings = await Listing.find({
      "listedBy.userId": dealerId,
    })
      .sort({ createdAt: -1 })
      .select(
        "title price listingType propertyType bhk area status images location features listedBy",
      );

    const dealerPayload = {
      _id: dealer._id,
      name: dealer.username,
      dealerType: dealer.dealerType,
      companyName: dealer.companyName,
      companyDescription: dealer.companyDescription,
      localities: dealer.localities,
      pfp: dealer.pfp,
      contact: {
        email:
          dealer.dealerType === "agency"
            ? dealer.companyContactValue
            : dealer.personalContactValue,
      },
    };

    res.status(200).json({
      success: true,
      dealer: dealerPayload,
      listings,
    });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
