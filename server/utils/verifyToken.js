import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export default async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.acces_token;
    if (!token) return next(ErrorHandler(401, "Unathorized!!! pls login"));

    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(ErrorHandler(405, "Token expired pls login"));
        }
        return next(ErrorHandler(402, "Unathroized access,pls login"));
      } else {
        req.user = user;
        next();
      }
    });
  } catch (err) {
    next(ErrorHandler(500, err.message));
  }
}
