import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Listing from "../models/listing.model.js";
import  Advertisement from "../models/advertisement.model.js"

export async function signUp(req, res, next) {
  try {
    let {
      username,
      password,
      role,
      dealerType,
      localities,
      companyName,
      companyAddress,
      companyContactValue,
      companyDescription,
      personalContactValue,
    } = req.body;

    username = username?.trim();
    password = password?.trim();
    role = role?.trim();
    dealerType = dealerType?.trim();
    companyName = companyName?.trim();
    companyAddress = companyAddress?.trim();
    companyContactValue = companyContactValue?.trim();
    personalContactValue = personalContactValue?.trim();
    companyDescription = companyDescription?.trim();

    if (!username || !password || !role) {
      return next(ErrorHandler(400, "Invalid signup data"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newsignup = null;

    if (role === "user") {
      if (!personalContactValue) {
        return next(ErrorHandler(400, "Email required"));
      }

      newsignup = {
        username,
        password: hashedPassword,
        role,
        personalContactValue,
      };
    } else if (role === "dealer") {
      if (!localities || localities.length === 0) {
        return next(ErrorHandler(400, "Dealer localities required"));
      }

      if (dealerType === "agency") {
        if (!companyName || !companyAddress || !companyContactValue) {
          return next(ErrorHandler(400, "Company details required"));
        }

        newsignup = {
          username,
          password: hashedPassword,
          role,
          dealerType,
          localities,
          companyName,
          companyAddress,
          companyContactValue,
          ...(companyDescription && { companyDescription }),
        };
      } else {
        if (!personalContactValue) {
          return next(ErrorHandler(400, "Email required"));
        }

        newsignup = {
          username,
          password: hashedPassword,
          role,
          dealerType,
          localities,
          personalContactValue,
        };
      }
    } else if (role === "builder") {
      if (!companyName || !companyAddress || !companyContactValue) {
        return next(ErrorHandler(400, "Company details required"));
      }

      newsignup = {
        username,
        password: hashedPassword,
        role,
        companyName,
        companyAddress,
        companyContactValue,
        ...(companyDescription && { companyDescription }),
      };
    }

    if (!newsignup) {
      return next(ErrorHandler(400, "Invalid signup data"));
    }

    await User.create(newsignup);

    res.sendStatus(201);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];

      let message = "Duplicate value";

      if (field === "username") {
        message = "Username already exists";
      } else if (
        field === "personalContactValue" ||
        field === "companyContactValue"
      ) {
        message = "Email already registered";
      }

      return next(ErrorHandler(409, message));
    }
    next(ErrorHandler(500, err.message));
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(ErrorHandler(400, "Email and password are required"));
    }

    const validuser = await User.findOne({
      $or: [{ personalContactValue: email }, { companyContactValue: email }],
    });

    if (!validuser) {
      return next(ErrorHandler(404, "User not found"));
    }

    const isvalid = bcrypt.compareSync(password, validuser.password);
    if (!isvalid) {
      return next(ErrorHandler(403, "Incorrect password"));
    }

    const token = jwt.sign({ userid: validuser._id }, process.env.SECRET, {
      expiresIn: "3h",
    });

    const userObj = validuser.toObject();
    delete userObj.password;

    let payload = { user: userObj };

    
    if (validuser.role === "builder") {
      const ads = await Advertisement.find({ builderId: validuser._id });
      payload.ads = ads;
    } else {
      const listings = await Listing.find({ userref: validuser._id });
      payload.userlisting = listings;
    }

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(payload);
  } catch (err) {
    console.log(err.message);
    next(ErrorHandler(500, err.message));
  }
}
