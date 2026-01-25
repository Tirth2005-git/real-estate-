import User from "../models/users.model.js";
import { ErrorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import Listing from "../models/listing.model.js";
import { delpfp } from "./fileuplds.controller.js";
import isCloudinaryURL from "../utils/isclaudinary.js";
import { delimages } from "./fileuplds.controller.js";
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
    ];

    const hasValidField = allowedFields.some(
      (field) => req.body[field] && req.body[field].toString().trim(),
    );

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
      if (req.body[key] && req.body[key].toString().trim()) {
        cleanBody[key] = req.body[key];
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
    next(ErrorHandler(500, err.message));
  }
}
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(ErrorHandler(403, "can't delete others!!"));
    }
    const usertodel = await User.findById(req.params.id);
    const { pfpid, pfp } = usertodel;
    if (isCloudinaryURL(pfp)) {
      await delpfp(pfpid);
    }

    const userlistings = await Listing.find({
      userref: req.params.id,
    });

    if (userlistings.length > 0) {
      userlistings.forEach(async (listing) => {
        const imagestodel = Array.from(listing.images);

        await delimages(...imagestodel);
      });
      await Listing.deleteMany({ userref: req.params.id });
    }
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("acces_token").status(201).json({ success: true });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}

export async function signout(req, res, next) {
  try {
    res.clearCookie("acces_token").status(201).json({ success: true });
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
