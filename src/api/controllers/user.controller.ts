import type { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model.js";

/**
 * Obtiene todos los usuarios del sistema excluyendo información sensible
 * @async
 * @function getAllUsers
 * @param {Request} _req - Objeto Request de Express (no se utilizan parámetros)
 * @param {Response} res - Objeto Response de Express
 * @param {NextFunction} _next - Función next (no utilizada en este controlador)
 * @returns {Promise<Response>} Respuesta JSON con array de usuarios en el formato especificado
 *
 * @throws {400} Si ocurre un error en la consulta a la base de datos
 * @throws {200} Si la operación es exitosa
 *
 * @example
 * // GET /api/users
 * // Respuesta exitosa (200):
 * // [
 * //   {
 * //     "_id": "00aa11bb22cc33dd44ee55",
 * //     "name": "User",
 * //     "email": "user@gmail.com",
 * //     "role": "user",
 * //     "properties": [],
 * //     "vehicles": [],
 * //     "createdAt": "2025-08-19T11:32:29.149Z",
 * //     "updatedAt": "2025-08-20T11:00:27.746Z",
 * //     "__v": 0
 * //   }
 * // ]
 */
export const getAllUsers = async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("Error al obtener los users");
  }
};

/**
 * Obtiene un usuario específico por su ID excluyendo información sensible
 * @async
 * @function getUser
 * @param {Request<{ id: string }>} req - Request de Express con ID en parámetros
 * @param {Response} res - Objeto Response de Express
 * @param {NextFunction} _next - Función next (no utilizada)
 * @returns {Promise<Response>} Respuesta JSON con el usuario encontrado en el formato especificado
 *
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error en la consulta o el ID es inválido
 * @throws {200} Si la operación es exitosa
 *
 * @example
 * // GET /api/users/00aa11bb22cc33dd44ee55
 * // Respuesta exitosa (200):
 * // {
 * //   "_id": "00aa11bb22cc33dd44ee55",
 * //   "name": "User",
 * //   "email": "user@gmail.com",
 * //   "role": "user",
 * //   "properties": [],
 * //   "vehicles": [],
 * //   "createdAt": "2025-08-19T11:32:29.149Z",
 * //   "updatedAt": "2025-08-20T11:00:27.746Z",
 * //   "__v": 0
 * // }
 */
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

/**
 * Actualiza un usuario existente por su ID
 * @async
 * @function updateUser
 * @param {Request<{ id: string }>} req - Request de Express con ID y datos a actualizar
 * @param {Response} res - Objeto Response de Express
 * @param {NextFunction} _next - Función next (no utilizada)
 * @returns {Promise<Response>} Respuesta JSON con el usuario actualizado en el formato especificado
 *
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error en la actualización o datos inválidos
 * @throws {200} Si la operación es exitosa
 *
 * @description
 * Actualiza parcialmente el usuario con los datos proporcionados en el body.
 * { new: true } asegura que devuelva el documento actualizado, no el original.
 * La validación de datos y permisos se maneja en el modelo y middlewares previos.
 *
 * @example
 * // PATCH /api/users/00aa11bb22cc33dd44ee55
 * // Body: { "name": "User Updated" }
 * // Respuesta (200):
 * // {
 * //   "_id": "00aa11bb22cc33dd44ee55",
 * //   "name": "User Updated",
 * //   "email": "user@gmail.com",
 * //   "role": "user",
 * //   "properties": [],
 * //   "vehicles": [],
 * //   "createdAt": "2025-08-19T11:32:29.149Z",
 * //   "updatedAt": "2025-08-20T11:32:45.123Z", // ← updatedAt actualizado
 * //   "__v": 0
 * // }
 */
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

/**
 * Elimina un usuario existente por su ID
 * @async
 * @function deleteUser
 * @param {Request<{ id: string }>} req - Request de Express con ID en parámetros
 * @param {Response} res - Objeto Response de Express
 * @param {NextFunction} _next - Función next (no utilizada)
 * @returns {Promise<Response>} Respuesta JSON con confirmación y datos del usuario eliminado
 *
 * @throws {404} Si el usuario no existe
 * @throws {400} Si ocurre un error en la eliminación
 * @throws {200} Si la operación es exitosa
 *
 * @description
 * Elimina permanentemente el usuario de la base de datos.
 * Incluye .select("-password") como refuerzo de seguridad aunque el modelo
 * ya pueda tener configurada la exclusión del password.
 *
 * @example
 * // DELETE /api/users/00aa11bb22cc33dd44ee55
 * // Respuesta exitosa (200):
 * // {
 * //   "message": "Usuario eliminado correctamente",
 * //   "userDeleted": {
 * //     "_id": "00aa11bb22cc33dd44ee55",
 * //     "name": "User",
 * //     "email": "user@gmail.com",
 * //     "role": "user",
 * //     "properties": [],
 * //     "vehicles": [],
 * //     "createdAt": "2025-08-19T11:32:29.149Z",
 * //     "updatedAt": "2025-08-20T11:00:27.746Z",
 * //     "__v": 0
 * //   }
 * // }
 */
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const userDeleted = await User.findByIdAndDelete(id).select("-password");

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
