import User from "../models/users.model.js";
import { ErrorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import Listing from "../models/listing.model.js";
import { delpfp } from "./fileuplds.controller.js";
import isCloudinaryURL from "../utils/isclaudinary.js";
import { delimages } from "./fileuplds.controller.js";
export function test(req, res) {
  res.send("Hello !!!");
}
export async function updateUser(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(ErrorHandler(403, "can't update others!!"));
    } else {
      if (
        !req.body.username &&
        !req.body.email &&
        !req.body.avatar &&
        !req.body.password &&
        !req.body.imageid
      ) {
        return next(ErrorHandler(403, "New credentals required "));
      }
      const user = await User.findById(req.params.id);
      const { pfp, pfpid } = user;

      if (req.body.avatar) {
        if (isCloudinaryURL(pfp)) {
          await delpfp(pfpid);
        }
      }

      let newreqobj = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] && req.body[key].toString().trim()) {
          newreqobj[key] = req.body[key];
        }
      });
      if (Object.keys(newreqobj).length == 0) {
        return next(ErrorHandler(401, "New credentials required"));
      }
      req.body = newreqobj;

      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      let updateduser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username?.trim(),
            email: req.body.email?.trim(),
            pfp: req.body.avatar?.trim(),
            password: req.body.password?.trim(),
            pfpid: req.body.imageid?.trim(),
          },
        },
        {
          new: true,
        }
      );
      updateduser = updateduser.toObject();
      if (updateduser.password) {
        delete updateduser.password;
      }

      res.status(201).json({ success: true, user: updateduser });
    }
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
