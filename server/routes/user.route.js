import express from "express";
import { test } from "../controllers/user.controller.js";
const userrouter = express.Router();
userrouter.get("/test", test);
export default userrouter;
