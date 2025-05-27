import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userroute from "./routes/user.route.js";
import authroute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingrouter from "./routes/lists.route.js";
import filerouter from "./routes/files.routes.js";
import path from "path";
dotenv.config();
await mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
const __dirname = path.resolve();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(userroute);
app.use(authroute);
app.use(listingrouter);
app.use(filerouter);
app.use(express.static(path.join(__dirname, "/client/U-I/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "U-I", "dist", "index.html"))
);
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.json({
      statuscode: 401,
      success: false,
      message: "File size should be less than or equals 2MB",
    });
  }
  const success = false;
  const errcode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(errcode).json({ statuscode: errcode, message, success });
});

app.listen(3000, () => console.log("running on 3000"));
