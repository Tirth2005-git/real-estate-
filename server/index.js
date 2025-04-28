import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then((res) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
const app = express();
app.listen(3000, () => console.log("running on 3000"));
