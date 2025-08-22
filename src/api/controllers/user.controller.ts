import type { Request, Response } from "express";
import { User } from "../models/index.js";
import type { AuthenticatedRequest, IUser } from "../../types/index.js";
import { canChangeRole, isAdminOrSelf } from "../../utils/index.js";

/**
 * Obtiene todos los usuarios del sistema excluyendo información sensible
 * @async
 * @function getAllUsers
 * @param {Request} _req - Objeto Request de Express
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con array de usuarios
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // Obtiene todos los usuarios excluyendo password y poblando relaciones
    const users = await User.find().select("-password").populate("properties").populate("vehicles");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("Error al obtener los usuarios");
  }
};

/**
 * Obtiene un usuario específico por su ID con validación de permisos
 * @async
 * @function getUser
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID y usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el usuario encontrado
 * @throws {401} Si no tiene permisos para ver el usuario
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getUser = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    // Valida permisos usando función utilitaria
    if (!req.user || !isAdminOrSelf(req.user, id)) {
      return res.status(401).json("No tienes permisos para ver este usuario");
    }

    // Busca usuario excluyendo password y poblando relaciones
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
 * Actualiza un usuario existente con validación de permisos y roles
 * @async
 * @function updateUser
 * @param {AuthenticatedRequest<{ id: string }, {}, IUser>} req - Request con datos a actualizar
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el usuario actualizado
 * @throws {401} Si no tiene permisos para modificar el usuario
 * @throws {403} Si no tiene permisos para modificar el rol
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error en la actualización
 * @throws {200} Si la operación es exitosa
 */
export const updateUser = async (
  req: AuthenticatedRequest<{ id: string }, {}, IUser>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    // Valida permisos básicos usando función utilitaria
    if (!req.user || !isAdminOrSelf(req.user, id)) {
      return res.status(401).json("No tienes permisos para modificar este usuario");
    }

    // Valida permisos específicos para cambio de rol
    const roleError = canChangeRole(req.user, id, req.body.role);
    if (roleError) {
      return res.status(403).json(roleError);
    }

    // Actualiza el usuario y devuelve el documento actualizado
    const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!userUpdated) {
      return res.status(404).json("Usuario no encontrado");
    }

    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(400).json("Error al actualizar el usuario");
  }
};

/**
 * Elimina un usuario existente con validación de permisos
 * @async
 * @function deleteUser
 * @param {AuthenticatedRequest<{ id: string }, {}, IUser>} req - Request con ID del usuario
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con confirmación
 * @throws {401} Si no tiene permisos para eliminar
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error al eliminar
 * @throws {200} Si la operación es exitosa
 */
export const deleteUser = async (
  req: AuthenticatedRequest<{ id: string }, {}, IUser>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    // Valida permisos usando función utilitaria
    if (!req.user || !isAdminOrSelf(req.user, id)) {
      return res.status(401).json("No tienes permisos para eliminar");
    }

    // Elimina usuario y devuelve datos sin password
    const userDeleted = await User.findByIdAndDelete(id)
      .select("-password")
      .populate("properties")
      .populate("vehicles");

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
