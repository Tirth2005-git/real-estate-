import express from "express";
import verifyToken from "../utils/verifyToken.js";
import {
  test,
  updateUser,
  deleteUser,
  signout
} from "../controllers/user.controller.js";
const userrouter = express.Router();
userrouter.get("/test", test);
userrouter.post("/api/update/:id", verifyToken, updateUser);
userrouter.delete("/api/delete/:id", verifyToken, deleteUser);
userrouter.get("/api/signout",signout)
export default userrouter;
