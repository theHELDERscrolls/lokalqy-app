import express from "express";

export const authRouter = express.Router();

authRouter.post("/auth/register" /* register */);
authRouter.post("/auth/login" /* login */);
