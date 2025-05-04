import express from "express";
import { listController } from "../controllers/list.controllers.js";
import verifyToken from "../utils/verifyToken.js";
const listingrouter = express.Router();
listingrouter.post("/api/list",verifyToken, listController);

export default listingrouter