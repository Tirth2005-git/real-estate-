import express from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";
const authrouter = express.Router();
authrouter.post("/signup", signUp);
authrouter.post("/login", signIn);

export default authrouter;
