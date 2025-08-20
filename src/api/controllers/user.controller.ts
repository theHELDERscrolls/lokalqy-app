import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";

export const getAllUsers = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const users = await User.find();
    return res.status(201).json(users);
  } catch (error) {
    return res.status(400).json("Error al obtener los users");
  }
};

export const getUser = async (req: Request<{ id: string }>, res: Response, _next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json("Error al obtener el usuario");
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!userUpdated) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(400).json("Error al actualizar el usuario");
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userDeleted = await User.findByIdAndDelete(id);

    if (!userDeleted) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
      userDeleted: userDeleted,
    });
  } catch (error) {
    return res.status(400).json("Error al eliminar el usuario");
  }
};
