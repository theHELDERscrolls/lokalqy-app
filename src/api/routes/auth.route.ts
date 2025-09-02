import { login, register } from "../controllers/index.js";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
