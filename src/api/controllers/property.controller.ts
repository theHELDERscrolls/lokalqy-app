import { Property, User } from "../models/index.js";
import type { AuthenticatedRequest } from "../../types/index.js";
import type { Response } from "express";

/**
 * Obtiene todas las propiedades del usuario autenticado
 * @async
 * @function getProperties
 * @param {AuthenticatedRequest} req - Request con usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con array de propiedades
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getProperties = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Busca propiedades que pertenezcan al usuario autenticado
    const properties = await Property.find({ owner: req.user?._id });
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(400).json("Error al obtener las propiedades del usuario");
  }
};

/**
 * Obtiene una propiedad específica del usuario autenticado por ID
 * @async
 * @function getProperty
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID y usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con la propiedad encontrada
 * @throws {404} Si la propiedad no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    // Busca propiedad por ID que además pertenezca al usuario autenticado
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
 * Crea una nueva propiedad asociada al usuario autenticado
 * @async
 * @function createProperty
 * @param {AuthenticatedRequest} req - Request con datos de la propiedad
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con la propiedad creada
 * @throws {400} Si ocurre un error al crear
 * @throws {201} Si la operación es exitosa
 */
export const createProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Añade el ID del usuario autenticado como propietario
    const propertyData = { ...req.body, owner: req.user?._id };
    const newProperty = new Property(propertyData);

    // Guarda la propiedad en la base de datos
    const propertySaved = await newProperty.save();

    // Actualiza el usuario añadiendo el ID de la nueva propiedad
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
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID y datos a actualizar
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con la propiedad actualizada
 * @throws {404} Si la propiedad no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la actualización
 * @throws {200} Si la operación es exitosa
 */
export const updateProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    // Busca y actualiza propiedad que pertenezca al usuario autenticado
    const propertyUpdated = await Property.findByIdAndUpdate(
      { _id: id, owner: req.user?._id },
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
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID de la propiedad
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con confirmación
 * @throws {404} Si la propiedad no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error al eliminar
 * @throws {200} Si la operación es exitosa
 */
export const deleteProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    // Busca y elimina propiedad que pertenezca al usuario autenticado
    const propertyDeleted = await Property.findOneAndDelete({
      _id: id,
      owner: req.user?._id,
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
