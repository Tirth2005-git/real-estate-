import express from "express";
import verifyToken from "../utils/verifyToken.js";
import {
  updateUser,
  deleteUser,
  signout
} from "../controllers/user.controller.js";
const userrouter = express.Router();
userrouter.post("/update/:id", verifyToken, updateUser);
userrouter.delete("/delete/:id", verifyToken, deleteUser);
userrouter.get("/signout",signout)
userrouter.post("/webclosed",signout)
export default userrouter;
