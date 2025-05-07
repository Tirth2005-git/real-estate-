import express from "express";
import { listController } from "../controllers/list.controllers.js";
import { getUserListings } from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyToken.js";
const listingrouter = express.Router();
listingrouter.post("/api/list/:id", verifyToken, listController);
listingrouter.get("/api/getlist/:id", verifyToken, getUserListings);

export default listingrouter;
