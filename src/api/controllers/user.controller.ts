import { User } from "../models/index.js";
import mongoose from "mongoose";
import type { IUser } from "../../types/index.js";
import type { NextFunction, Request, Response } from "express";

export const register = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  _next: NextFunction
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y password son requeridos" });
    }

    const userNameDuplicated = await User.findOne({ name });
    if (userNameDuplicated) {
      return res.status(409).json({ error: `El usuario con el nombre ${name} ya existe` });
    }

    const userEmailDuplicated = await User.findOne({ email });
    if (userEmailDuplicated) {
      return res.status(409).json({ error: `El usuario con el email ${email} ya existe` });
    }

    const user = new User(req.body);
    const userSaved = await user.save();

    const { password: _, ...safeUserData } = userSaved.toObject();

    return res.status(201).json({ message: "Usuario registrado", user: safeUserData });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    return res.status(500).json("Error interno en el registro");
  }
};
