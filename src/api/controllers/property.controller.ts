import { Property, User } from "../models/index.js";
import type { AuthenticatedRequest } from "../../types/index.js";
import type { Response } from "express";

/**
 * Obtiene todas las propiedades del usuario autenticado
 * @async
 * @function getProperties
 * @param {AuthenticatedRequest} req - Request autenticado con información del usuario
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el array de propiedades del usuario
 *
 * @throws {400} Si ocurre un error al consultar la base de datos
 * @throws {200} Si la operación se completa exitosamente
 *
 * @description
 * Este controlador busca todas las propiedades donde el campo 'owner' coincide
 * con el ID del usuario autenticado. Solo devuelve propiedades del usuario actual.
 *
 * @example
 * // GET /api/properties
 * // Respuesta exitosa (200):
 * // [
 * //   { "_id": "123", "title": "Casa en la playa", "owner": "userId", ... },
 * //   { "_id": "456", "title": "Apartamento centro", "owner": "userId", ... }
 * // ]
 */
export const getProperties = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const properties = await Property.find({ owner: req.user?._id });
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(400).json("Error al obtener las propiedades del usuario");
  }
};

/**
 * Obtiene una propiedad específica del usuario autenticado
 * @async
 * @function getProperty
 * @param {AuthenticatedRequest<{ id: string }>} req - Request autenticado con ID de propiedad en parámetros
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con la propiedad o mensaje de error
 *
 * @throws {404} Si la propiedad no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la consulta o el ID es inválido
 * @throws {200} Si la propiedad se encuentra y pertenece al usuario
 *
 * @description
 * Busca una propiedad por ID y verifica que pertenezca al usuario autenticado.
 * Implementa control de acceso a nivel de datos.
 *
 * @example
 * // GET /api/properties/123
 * // Respuesta exitosa (200):
 * // { "_id": "123", "title": "Casa en la playa", "owner": "userId", ... }
 */
export const getProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const property = await Property.findOne({ _id: id, owner: req.user?._id });

    if (!property) {
      return res.status(404).json("Propiedad no encontrada o no tienes permisos");
    }

    return res.status(200).json(property);
  } catch (error) {
    return res.status(400).json("Error al obtener la propiedad");
  }
};

/**
 * Crea una nueva propiedad para el usuario autenticado
 * @async
 * @function createProperty
 * @param {AuthenticatedRequest} req - Request autenticado con datos de la propiedad en el body
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con la propiedad creada
 *
 * @throws {400} Si ocurre un error en la creación o validación de datos
 * @throws {201} Si la propiedad se crea exitosamente
 *
 * @description
 * Crea una nueva propiedad asignando automáticamente el ID del usuario autenticado
 * como propietario. Actualiza la referencia en el documento del usuario.
 *
 * @example
 * // POST /api/properties
 * // Body: { "title": "Mi nueva propiedad", "address": "Calle Principal 123", ... }
 * // Respuesta exitosa (201):
 * // { "_id": "789", "title": "Mi nueva propiedad", "owner": "userId", ... }
 */
export const createProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const propertyData = { ...req.body, owner: req.user?._id };
    const newProperty = new Property(propertyData);

    const propertySaved = await newProperty.save();

    // Actualiza el usuario añadiendo la referencia a la nueva propiedad
    await User.findByIdAndUpdate(req.user?._id, { $push: { properties: propertySaved._id } });

    return res.status(201).json(propertySaved);
  } catch (error) {
    return res.status(400).json("Error al crear la propiedad");
  }
};

/**
 * Actualiza una propiedad existente del usuario autenticado
 * @async
 * @function updateProperty
 * @param {AuthenticatedRequest<{ id: string }>} req - Request autenticado con ID y datos a actualizar
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con la propiedad actualizada o mensaje de error
 *
 * @throws {404} Si la propiedad no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la actualización o datos inválidos
 * @throws {200} Si la propiedad se actualiza exitosamente
 *
 * @description
 * Actualiza una propiedad verificando primero que pertenezca al usuario autenticado.
 * Solo permite actualizar propiedades del usuario actual.
 *
 * @example
 * // PUT /api/properties/123
 * // Body: { "title": "Nuevo título de propiedad" }
 * // Respuesta exitosa (200):
 * // { "_id": "123", "title": "Nuevo título de propiedad", "owner": "userId", ... }
 */
export const updateProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const propertyUpdated = await Property.findByIdAndUpdate(
      { _id: id, owner: req.user?._id }, // Filtro de seguridad: ID y propietario
      req.body,
      { new: true } // Devuelve el documento actualizado
    );

    if (!propertyUpdated) {
      return res.status(404).json("Propiedad no encontrada o no tienes permisos");
    }

    return res.status(200).json(propertyUpdated);
  } catch (error) {
    return res.status(400).json("Error al actualizar la propiedad");
  }
};

/**
 * Elimina una propiedad del usuario autenticado
 * @async
 * @function deleteProperty
 * @param {AuthenticatedRequest<{ id: string }>} req - Request autenticado con ID de propiedad
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con confirmación y datos de la propiedad eliminada
 *
 * @throws {404} Si la propiedad no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la eliminación
 * @throws {200} Si la propiedad se elimina exitosamente
 *
 * @description
 * Elimina una propiedad verificando primero que pertenezca al usuario autenticado.
 * Implementa control de acceso a nivel de datos para operaciones de eliminación.
 *
 * @example
 * // DELETE /api/properties/123
 * // Respuesta exitosa (200):
 * // {
 * //   "message": "Propiedad eliminada correctamente",
 * //   "propertyDeleted": { "_id": "123", "title": "Casa en la playa", ... }
 * // }
 */
export const deleteProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const propertyDeleted = await Property.findOneAndDelete({
      _id: id,
      owner: req.user?._id, // Filtro de seguridad: ID y propietario
    });

    if (!propertyDeleted) {
      return res.status(404).json("Propiedad no encontrada o no tienes permisos");
    }

    return res.status(200).json({
      message: "Propiedad eliminada correctamente",
      propertyDeleted: propertyDeleted,
    });
  } catch (error) {
    return res.status(400).json("Error al eliminar la propiedad");
  }
};
