import type { Request, Response } from "express";
import { User } from "../models/index.js";
import type { AuthenticatedRequest, IUser } from "../../types/index.js";

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
export const getAllUsers = async (_req: Request, res: Response) => {
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
 * @throws {401} Si no está autenticado
 * @throws {403} Si no tiene permisos
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error
 * @throws {200} Si la operación es exitosa
 */
export const getUser = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Verifica que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json("No tienes permisos para ver este usuario");
    }

    // Valida permisos: admin puede ver cualquier usuario, usuarios solo pueden verse a sí mismos
    const isAdmin = req.user.role === "admin";
    const isSelf = String(req.user._id) === id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json("No tienes permisos para ver este usuario");
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
 * Actualiza un usuario existente con validación de permisos avanzada
 * @async
 * @function updateUser
 * @param {AuthenticatedRequest<{ id: string }, {}, IUser>} req - Request con datos a actualizar
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el usuario actualizado
 * @throws {401} Si no está autenticado
 * @throws {403} Si no tiene permisos
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error
 * @throws {200} Si la operación es exitosa
 */
export const updateUser = async (
  req: AuthenticatedRequest<{ id: string }, {}, IUser>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json("No autenticado");
    }

    // Valida permisos: admin puede editar cualquier usuario, usuarios solo pueden editarse a sí mismos
    const isAdmin = req.user.role === "admin";
    const isSelf = String(req.user._id) === id;

    if (!isAdmin && !isSelf) {
      return res.status(403).json("No tienes permisos para modificar este usuario");
    }

    // Solo admin puede modificar el rol de otros usuarios
    if ("role" in req.body && !isAdmin) {
      return res.status(403).json("No tienes permisos para modificar el rol del usuario");
    }

    // Previene que un admin se quite sus propios privilegios
    if (isAdmin && isSelf && "role" in req.body && req.body.role === "user") {
      return res.status(403).json("No puedes cambiar tu rol de admin a user");
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
 * Elimina un usuario existente por su ID
 * @async
 * @function deleteUser
 * @param {Request<{ id: string }>} req - Request con ID en parámetros
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con confirmación
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error
 * @throws {200} Si la operación es exitosa
 */
export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

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
