import express from "express";
import { register } from "../controllers/user.controller.js";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login" /* login */);
