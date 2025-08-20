import { deleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.controller.js";
import { hasRole, isAuth } from "../../middlewares/index.js";
import express from "express";

export const usersRouter = express.Router();

usersRouter.get("/", isAuth, hasRole(["admin"]), getAllUsers);
usersRouter.get("/:id", isAuth, getUser);
usersRouter.put("/:id", isAuth, updateUser);
usersRouter.delete("/:id", isAuth, hasRole(["admin"]), deleteUser);
