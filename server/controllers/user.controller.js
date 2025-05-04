import User from "../models/users.model.js";
import { ErrorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

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
        return next(ErrorHandler(401, "New credentals required "));
      }
      let newreqobj = {};
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] && req.body[key].toString().trim()) {
          newreqobj[key] = req.body[key];
        }
      });
      req.body = newreqobj;

      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
      }
      let updateduser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            pfp: req.body.avatar,
            password: req.body.password,
            pfpid: req.body.imageid,
          },
        },
        {
          new: true,
        }
      );
      updateduser = updateduser.toObject();
      delete updateduser.password;
      res.status(201).json({ success: true, user: updateduser });
    }
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id !== req.user.userid) {
      return next(ErrorHandler(403, "can't update others!!"));
    }
    await User.findByIdAndDelete(req.params.id);
    res
      .clearCookie("acces_token")
      .status(201)
      .send({ success: true, message: "deleted successfully" });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
export async function signout(req, res, next) {
  try {
    res
      .clearCookie("acces_token")
      .status(201)
      .json({ success: true, message: "signed out successfully" });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
