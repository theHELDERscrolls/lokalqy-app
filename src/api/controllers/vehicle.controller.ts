import { deleteImgFile } from "../../utils/index.js";
import { User, Vehicle } from "../models/index.js";
import mongoose from "mongoose";
import type { AuthenticatedRequest, IVehicle } from "../../types/index.js";
import type { Response } from "express";

/**
 * Obtiene todos los vehículos del usuario autenticado
 * @param {AuthenticatedRequest} req - Request con usuario autenticado
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Array de vehículos del usuario
 */
export const getVehicles = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user?._id });
    return res.status(200).json(vehicles);
  } catch (error) {
    return res.status(400).json("Error al obtener los vehículos del usuario");
  }
};

/**
 * Obtiene un vehículo específico del usuario
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID de vehículo
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Vehículo encontrado o error
 */
export const getVehicle = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findOne({ _id: id, owner: req.user?._id });

    if (!vehicle) {
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    return res.status(200).json(vehicle);
  } catch (error) {
    return res.status(400).json("Error al obtener el vehículo");
  }
};

/**
 * Crea un nuevo vehículo para el usuario
 * @param {AuthenticatedRequest} req - Request con datos del vehículo
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Vehículo creado o error
 */
export const createVehicle = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const vehicleData = { ...req.body, owner: req.user?._id };
    const newVehicle = new Vehicle(vehicleData);

    if (req.file) {
      newVehicle.image = req.file.path;
    }

    const vehicleSaved = await newVehicle.save();
    await User.findByIdAndUpdate(req.user?._id, { $push: { vehicles: vehicleSaved._id } });

    return res.status(201).json(vehicleSaved);
  } catch (error) {
    if (req.file) {
      await deleteImgFile(req.file.path);
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }
    return res.status(400).json("Error al crear el vehículo");
  }
};

/**
 * Actualiza un vehículo existente
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID y datos actualizados
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Vehículo actualizado o error
 */
export const updateVehicle = async (
  req: AuthenticatedRequest<{ id: string }, {}, IVehicle>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const vehicleUpdated = await Vehicle.findByIdAndUpdate(
      { _id: id, owner: req.user?._id },
      updateData,
      { new: true }
    );

    if (!vehicleUpdated) {
      if (req.file) {
        await deleteImgFile(req.file.path);
      }
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    return res.status(200).json(vehicleUpdated);
  } catch (error) {
    if (req.file) {
      await deleteImgFile(req.file.path);
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    return res.status(400).json("Error al actualizar el vehículo");
  }
};

/**
 * Elimina un vehículo del usuario
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID de vehículo
 * @param {Response} res - Response de Express
 * @returns {Promise<Response>} Confirmación de eliminación o error
 */
export const deleteVehicle = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const vehicleDeleted = await Vehicle.findOneAndDelete({
      _id: id,
      owner: req.user?._id,
    });

    if (!vehicleDeleted) {
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    if (vehicleDeleted.image) {
      await deleteImgFile(vehicleDeleted.image);
    }

    await User.findByIdAndUpdate(req.user?._id, { $pull: { vehicles: vehicleDeleted._id } });

    return res.status(200).json({
      message: "Vehículo eliminado correctamente",
      vehicleDeleted: vehicleDeleted,
    });
  } catch (error) {
    return res.status(400).json("Error al eliminar el vehículo");
  }
};
