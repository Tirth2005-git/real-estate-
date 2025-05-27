import express from "express";
import {
  listController,
  deleteList,
  updateList,
  browseList,
} from "../controllers/list.controllers.js";
import { getUserListings } from "../controllers/user.controller.js";
import verifyToken from "../utils/verifyToken.js";
import { upload } from "./files.routes.js";
const listingrouter = express.Router();
listingrouter.post("/list/:id", verifyToken, listController);
listingrouter.get("/getlist/:id", verifyToken, getUserListings);
listingrouter.delete("/delete/listing/:id", verifyToken, deleteList);
listingrouter.post(
  "/update/listing/:id",
  verifyToken,
  upload.none(),
  updateList
);
listingrouter.post("/browse/listing", verifyToken, browseList);

export default listingrouter;
