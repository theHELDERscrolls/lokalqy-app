import { hasRole, isAuth } from "@/middlewares/index.js";
import express from "express";

export const usersRouter = express.Router();

usersRouter.get("/", isAuth, hasRole(["admin"]) /* getUsers */);
usersRouter.get("/:id", isAuth /* getUser */);
usersRouter.put("/:id", isAuth /* updateUser */);
usersRouter.delete("/:id", isAuth, hasRole(["admin"]) /* deleteUser */);
