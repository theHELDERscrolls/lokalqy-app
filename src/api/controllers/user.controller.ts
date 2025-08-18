import { User } from "../models/index.js";
import type { NextFunction, Request, Response } from "express";
import type { UserDoc } from "../../types/index.js";

export const register = async (
  req: Request<{}, {}, UserDoc>,
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

    const userEmailDuplicated = await User.findOne({ name });
    if (userEmailDuplicated) {
      return res.status(409).json({ error: `El usuario con el email ${email} ya existe` });
    }

    const user = new User(req.body);
    const userSaved = await user.save();

    return res.status(201).json({ message: "Usuario registrado", user: userSaved });
  } catch (error) {
    return res.status(400).json("Error en el registro");
  }
};
