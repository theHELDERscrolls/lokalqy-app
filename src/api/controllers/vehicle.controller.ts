import { User, Vehicle } from "../models/index.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../types/index.js";

/**
 * Obtiene todos los vehículos del usuario autenticado
 * @async
 * @function getVehicles
 * @param {AuthenticatedRequest} req - Request con usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con array de vehículos
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getVehicles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Busca vehículos que pertenezcan al usuario autenticado
    const vehicles = await Vehicle.find({ owner: req.user?._id });

    return res.status(200).json(vehicles);
  } catch (error) {
    return res.status(400).json("Error al obtener los vehículos del usuario");
  }
};

/**
 * Obtiene un vehículo específico del usuario autenticado por ID
 * @async
 * @function getVehicle
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID y usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el vehículo encontrado
 * @throws {404} Si el vehículo no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getVehicle = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Busca vehículo por ID que además pertenezca al usuario autenticado
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
 * Crea un nuevo vehículo asociado al usuario autenticado
 * @async
 * @function createVehicle
 * @param {AuthenticatedRequest} req - Request con datos del vehículo
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el vehículo creado
 * @throws {400} Si ocurre un error al crear
 * @throws {201} Si la operación es exitosa
 */
export const createVehicle = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Añade el ID del usuario autenticado como propietario
    const vehicleData = { ...req.body, owner: req.user?._id };

    const newVehicle = new Vehicle(vehicleData);

    // Guarda el vehículo en la base de datos
    const vehicleSaved = await newVehicle.save();

    // Actualiza el usuario añadiendo el ID del nuevo vehículo
    await User.findByIdAndUpdate(req.user?._id, { $push: { vehicles: vehicleSaved._id } });

    return res.status(201).json(vehicleSaved);
  } catch (error) {
    return res.status(400).json("Error al crear el vehículo");
  }
};

/**
 * Actualiza un vehículo existente del usuario autenticado
 * @async
 * @function updateVehicle
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID y datos a actualizar
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el vehículo actualizado
 * @throws {404} Si el vehículo no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la actualización
 * @throws {200} Si la operación es exitosa
 */
export const updateVehicle = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Busca y actualiza vehículo que pertenezca al usuario autenticado
    const vehicleUpdated = await Vehicle.findByIdAndUpdate(
      { _id: id, owner: req.user?._id },
      req.body,
      { new: true } // Devuelve el documento actualizado
    );

    if (!vehicleUpdated) {
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    return res.status(200).json(vehicleUpdated);
  } catch (error) {
    return res.status(400).json("Error al actualizar la propiedad");
  }
};

/**
 * Elimina un vehículo del usuario autenticado
 * @async
 * @function deleteVehicle
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID del vehículo
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con confirmación
 * @throws {404} Si el vehículo no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error al eliminar
 * @throws {200} Si la operación es exitosa
 */
export const deleteVehicle = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Busca y elimina vehículo que pertenezca al usuario autenticado
    const vehicleDeleted = await Vehicle.findOneAndDelete({
      _id: id,
      owner: req.user?._id,
    });

    if (!vehicleDeleted) {
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    return res.status(200).json({
      message: "Vehículo eliminado correctamente",
      vehicleDeleted: vehicleDeleted,
    });
  } catch (error) {
    return res.status(400).json("Error al eliminar el vehículo");
  }
};
