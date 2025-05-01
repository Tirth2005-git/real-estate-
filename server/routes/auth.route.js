import express from "express";
import { signUp, signIn, google } from "../controllers/auth.controller.js";
const authrouter = express.Router();
authrouter.post("/api/signup", signUp);
authrouter.post("/api/login", signIn);
authrouter.post("/api/google", google);
export default authrouter;
