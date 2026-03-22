import express from "express";
import verifyToken from "../utils/verifyToken.js";
import { createad ,deletead} from "../controllers/ads.controller.js";
const adsrouter = express.Router();
adsrouter.post("/ads/create/:id", verifyToken, createad);
adsrouter.delete("/ads/delete/:id", verifyToken, deletead);

export default adsrouter;
