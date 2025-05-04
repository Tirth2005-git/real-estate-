import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userroute from "./routes/user.route.js";
import authroute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingrouter from "./routes/lists.route.js";
import filerouter from "./routes/files.routes.js";
dotenv.config();
await mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(userroute);
app.use(authroute);
app.use(listingrouter);
app.use(filerouter)
app.use((err, req, res, next) => {
  const success = false;
  const errcode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.json({ statuscode: errcode, message, success });
});
app.listen(3000, () => console.log("running on 3000"));
