import type { Request, Response } from "express";
import { User } from "../models/index.js";
import type { AuthenticatedRequest } from "../../types/index.js";

/**
 * Obtiene todos los usuarios del sistema excluyendo información sensible
 * @async
 * @function getAllUsers
 * @param {Request} _req - Objeto Request de Express (no se utilizan parámetros)
 * @param {Response} res - Objeto Response de Express
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
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    // Busca todos los usuarios en la base de datos
    // .select("-password") excluye el campo password de los resultados por seguridad
    // .populate("properties") reemplaza los IDs de propiedades con los documentos completos
    // .populate("vehicles") reemplaza los IDs de vehículos con los documentos completos
    const users = await User.find().select("-password").populate("properties").populate("vehicles");

    // Devuelve la lista de usuarios con código de estado 200 (éxito)
    return res.status(200).json(users);
  } catch (error) {
    // Si hay algún error, devuelve código 400 (error del cliente) con mensaje
    return res.status(400).json("Error al obtener los usuarios");
  }
};

/**
 * Obtiene un usuario específico por su ID excluyendo información sensible
 * @async
 * @function getUser
 * @param {Request<{ id: string }>} req - Request de Express con ID en parámetros
 * @param {Response} res - Objeto Response de Express
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
export const getUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // Extrae el ID de los parámetros de la URL
    const { id } = req.params;

    // Busca usuario por ID, excluyendo password y poblando propiedades y vehículos
    const user = await User.findById(id)
      .select("-password")
      .populate("properties")
      .populate("vehicles");

    // Si no encuentra el usuario, devuelve error 404
    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    // Devuelve el usuario encontrado con código 200
    return res.status(200).json(user);
  } catch (error) {
    // Si hay error (ej: ID inválido), devuelve código 400
    return res.status(400).json("Error al obtener el usuario");
  }
};

/**
 * Actualiza un usuario existente por su ID
 * @async
 * @function updateUser
 * @param {Request<{ id: string }>} req - Request de Express con ID y datos a actualizar
 * @param {Response} res - Objeto Response de Express
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
export const updateUser = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    // Extrae el ID de los parámetros de la URL
    const { id } = req.params;

    if (!req.user || req.user.role !== "admin") {
      // Si no es admin, eliminamos el campo role del body antes de actualizar
      delete req.body.role;
    }

    // Busca y actualiza el usuario por ID
    // req.body contiene los campos a actualizar (name, email, etc.)
    // { new: true } hace que devuelva el documento actualizado en lugar del original
    const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });

    // Si no encuentra el usuario, devuelve error 404
    if (!userUpdated) {
      return res.status(404).json("Usuario no encontrado");
    }

    // Devuelve el usuario actualizado con código 200
    return res.status(200).json(userUpdated);
  } catch (error) {
    // Si hay error en la actualización, devuelve código 400
    return res.status(400).json("Error al actualizar el usuario");
  }
};

/**
 * Elimina un usuario existente por su ID
 * @async
 * @function deleteUser
 * @param {Request<{ id: string }>} req - Request de Express con ID en parámetros
 * @param {Response} res - Objeto Response de Express
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
export const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    // Extrae el ID de los parámetros de la URL
    const { id } = req.params;

    // Busca y elimina el usuario por ID
    // .select("-password") excluye el campo password del resultado por seguridad
    // .populate() incluye los documentos completos de propiedades y vehículos
    const userDeleted = await User.findByIdAndDelete(id)
      .select("-password")
      .populate("properties")
      .populate("vehicles");

    // Si no encuentra el usuario, devuelve error 404
    if (!userDeleted) {
      return res.status(404).json("Usuario no encontrado");
    }

    // Devuelve mensaje de éxito y datos del usuario eliminado con código 200
    return res.status(200).json({
      message: "Usuario eliminado correctamente",
      userDeleted: userDeleted,
    });
  } catch (error) {
    // Si hay error en la eliminación, devuelve código 400
    return res.status(400).json("Error al eliminar el usuario");
  }
};
