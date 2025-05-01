import User from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { ErrorHandler } from "../utils/error.js";
import randpass from "../utils/randpass.js";
import jwt from "jsonwebtoken";
export async function signUp(req, res, next) {
  const { username, email, password } = req.body;
  const hashedpassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedpassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "signed up !!!", success: true });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
export async function signIn(req, res, next) {
  try {
    const { email, userpassword } = req.body;
    let validuser = await User.findOne({ email: [email] });
    if (!validuser) return next(ErrorHandler(404, "User not found!!!"));
    validuser = validuser.toObject();
    const isvalid = bcrypt.compareSync(userpassword, validuser.password);
    if (!isvalid) {
      return next(ErrorHandler(400, "Incorrect password!!!"));
    }
    const token = jwt.sign({ userid: validuser._id }, process.env.SECRET, {
      expiresIn: "1hr",
    });

    delete validuser.password;

    res
      .status(201)
      .cookie("acces_token", token, {
        httpOnly: true,
      })
      .json({ success: true, user: validuser });
  } catch (err) {
    next(err);
  }
}

export async function google(req, res, next) {
  try {
    const { email, pfp, name } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      user = user.toObject();
      delete user.password;
      const token = jwt.sign({ userid: user._id }, process.env.SECRET, {
        expiresIn: "1hr",
      });
      res
        .status(201)
        .cookie("acces_token", token, {
          httpOnly: true,
        })
        .json({ success: true, user });
    } else {
      let newpass = randpass();
      let newuser = new User({
        username: name,
        email,
        password: bcrypt.hashSync(newpass, 10),
        pfp,
      });
      newuser.save();
      const token = jwt.sign({ userid: newuser._id }, process.env.SECRET, {
        expiresIn: "1hr",
      });
      console.log(randpass);

      res
        .status(201)
        .cookie("acces_token", token, {
          httpOnly: true,
        })
        .json({ success: true, user: { ...newuser} });
    }
  } catch (err) {
    console.log(err.message);

    next(ErrorHandler(err));
  }
}
