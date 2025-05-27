import express from "express";
import { signUp, signIn, google } from "../controllers/auth.controller.js";
const authrouter = express.Router();
authrouter.post("/signup", signUp);
authrouter.post("/login", signIn);
authrouter.post("/google", google);
export default authrouter;
