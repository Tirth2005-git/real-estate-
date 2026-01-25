import express from "express";
import verifyToken from "../utils/verifyToken.js";
import { createad } from "../controllers/ads.controller.js";
const adsrouter = express.Router();
adsrouter.post("/ads/create/:id", verifyToken, createad);

export default adsrouter;
