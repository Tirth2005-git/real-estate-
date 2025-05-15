import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";
export default async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.acces_token;
    if (!token) return next(ErrorHandler(401, "Unathorized!!!"));
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) {
        return next(ErrorHandler(402, "Unathroized access"));
      } else {
        req.user = user;
        next();
      }
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      next(ErrorHandler(405, "Token expired pls login again"));
    }
    next(ErrorHandler(500, err.message));
  }
}
