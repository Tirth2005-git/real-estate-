import express from "express";
import {
  listController,
  deleteList,
  updateList,
} from "../controllers/list.controllers.js";
import { getUserListings } from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyToken.js";
import { upload } from "./files.routes.js";
const listingrouter = express.Router();
listingrouter.post("/api/list/:id", verifyToken, listController);
listingrouter.get("/api/getlist/:id", verifyToken, getUserListings);
listingrouter.delete("/api/delete/listing/:id", verifyToken, deleteList);
listingrouter.post(
  "/api/update/listing/:id",
  verifyToken,
  upload.none(),
  updateList
);

export default listingrouter;
