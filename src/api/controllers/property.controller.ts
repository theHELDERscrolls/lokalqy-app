import { deleteImgFile } from "../../utils/index.js";
import { Property, User } from "../models/index.js";
import mongoose from "mongoose";
import type { AuthenticatedRequest, IProperty } from "../../types/index.js";
import type { Response } from "express";

/**
 * Obtiene todas las propiedades del usuario autenticado
 * @param {AuthenticatedRequest} req - Request con usuario autenticado
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Array de propiedades del usuario
 */
export const getProperties = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const properties = await Property.find({ owner: req.user?._id });
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(400).json("Error al obtener las propiedades del usuario");
  }
};

/**
 * Obtiene una propiedad específica del usuario autenticado
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID de propiedad
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Propiedad encontrada o error
 */
export const getProperty = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<Response> => {
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
 * @param {AuthenticatedRequest} req - Request con datos de la propiedad
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Propiedad creada o error
 */
export const createProperty = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const propertyData = { ...req.body, owner: req.user?._id };
    const newProperty = new Property(propertyData);

    // Manejo de imagen subida
    if (req.file) {
      newProperty.image = req.file.path;
    }

    const propertySaved = await newProperty.save();

    // Actualizar referencia en usuario
    await User.findByIdAndUpdate(req.user?._id, { $push: { properties: propertySaved._id } });

    return res.status(201).json(propertySaved);
  } catch (error) {
    // Limpieza de imagen en caso de error
    if (req.file) {
      await deleteImgFile(req.file.path);
    }

    // Validación de errores de mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }
    return res.status(400).json("Error al crear la propiedad");
  }
};

/**
 * Actualiza una propiedad existente del usuario
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID y datos actualizados
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Propiedad actualizada o error
 */
export const updateProperty = async (
  req: AuthenticatedRequest<{ id: string }, {}, IProperty>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const propertyUpdated = await Property.findByIdAndUpdate(
      { _id: id, owner: req.user?._id },
      updateData,
      { new: true }
    );

    if (!propertyUpdated) {
      if (req.file) {
        await deleteImgFile(req.file.path);
      }
      return res.status(404).json("Propiedad no encontrada o no tienes permisos");
    }

    return res.status(200).json(propertyUpdated);
  } catch (error) {
    if (req.file) {
      await deleteImgFile(req.file.path);
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    return res.status(400).json("Error al actualizar la propiedad");
  }
};

/**
 * Elimina una propiedad del usuario
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID de propiedad
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Confirmación de eliminación o error
 */
export const deleteProperty = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const propertyDeleted = await Property.findOneAndDelete({
      _id: id,
      owner: req.user?._id,
    });

    if (!propertyDeleted) {
      return res.status(404).json("Propiedad no encontrada o no tienes permisos");
    }

    // Eliminar imagen de Cloudinary si existe
    if (propertyDeleted?.image) {
      await deleteImgFile(propertyDeleted.image);
    }

    // Remover referencia del usuario
    await User.findByIdAndUpdate(req.user?._id, { $pull: { properties: propertyDeleted._id } });

    return res.status(200).json({
      message: "Propiedad eliminada correctamente",
      propertyDeleted: propertyDeleted,
    });
  } catch (error) {
    return res.status(400).json("Error al eliminar la propiedad");
  }
};
