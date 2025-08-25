import { canChangeRole, deleteImgFile, isAdminOrSelf } from "../../utils/index.js";
import { User } from "../models/index.js";
import type { AuthenticatedRequest, IUser } from "../../types/index.js";
import type { Request, Response } from "express";

/**
 * Obtiene todos los usuarios del sistema
 * @param {Request} _req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Array de usuarios sin información sensible
 */
export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await User.find().select("-password").populate("properties").populate("vehicles");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("Error al obtener los usuarios");
  }
};

/**
 * Obtiene un usuario específico por ID
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID de usuario
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Usuario encontrado o error de permisos
 */
export const getUser = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    // Validación de permisos
    if (!req.user || !isAdminOrSelf(req.user, id)) {
      return res.status(401).json("No tienes permisos para ver este usuario");
    }

    const user = await User.findById(id)
      .select("-password")
      .populate("properties")
      .populate("vehicles");

    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json("Error al obtener el usuario");
  }
};

/**
 * Actualiza un usuario existente
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con datos actualizados
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Usuario actualizado o error
 */
export const updateUser = async (
  req: AuthenticatedRequest<{ id: string }, {}, IUser>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    // Validación de permisos básicos
    if (!req.user || !isAdminOrSelf(req.user, id)) {
      if (req.file) {
        await deleteImgFile(req.file.path);
      }
      return res.status(401).json("No tienes permisos para modificar este usuario");
    }

    // Validación de permisos para cambio de rol
    const roleError = canChangeRole(req.user, id, req.body.role);
    if (roleError) {
      return res.status(403).json(roleError);
    }

    if (req.file) {
      req.body.image = req.file.path;
    }

    const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!userUpdated) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json(userUpdated);
  } catch (error) {
    if (req.file) {
      await deleteImgFile(req.file.path);
    }
    return res.status(400).json("Error al actualizar el usuario");
  }
};

/**
 * Elimina un usuario del sistema
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID de usuario
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Confirmación de eliminación o error
 */
export const deleteUser = async (
  req: AuthenticatedRequest<{ id: string }, {}, IUser>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!req.user || !isAdminOrSelf(req.user, id)) {
      return res.status(401).json("No tienes permisos para eliminar");
    }

    const userDeleted = await User.findByIdAndDelete(id)
      .select("-password")
      .populate("properties")
      .populate("vehicles");

    // Eliminar imagen asociada
    if (userDeleted?.image) {
      await deleteImgFile(userDeleted.image);
    }

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
