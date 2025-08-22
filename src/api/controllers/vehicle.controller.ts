import { Property, User, Vehicle } from "../models/index.js";
import type {  Response } from "express";
import type { AuthenticatedRequest } from "../../types/index.js";

/**
 * Obtiene todos los vehículos del usuario autenticado
 * @async
 * @function getVehicles
 * @param {AuthenticatedRequest} req - Request con usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con array de vehículos del usuario
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getVehicles = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Busca todos los vehículos cuyo propietario sea el usuario autenticado
    const vehicles = await Property.find({ owner: req.user?._id });

    // Devuelve los vehículos encontrados
    return res.status(200).json(vehicles);
  } catch (error) {
    // Manejo de errores
    return res.status(400).json("Error al obtener los vehículos del usuario");
  }
};

/**
 * Obtiene un vehículo específico del usuario autenticado por ID
 * @async
 * @function getVehicle
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID en parámetros y usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el vehículo encontrado
 * @throws {404} Si el vehículo no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error en la consulta
 * @throws {200} Si la operación es exitosa
 */
export const getVehicle = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    // Extrae el ID del vehículo de los parámetros de la URL
    const { id } = req.params;

    // Busca un vehículo que coincida con el ID y cuyo propietario sea el usuario autenticado
    const vehicle = await Vehicle.findOne({ _id: id, owner: req.user?._id });

    // Si no encuentra el vehículo, devuelve error 404
    if (!vehicle) {
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    // Devuelve el vehículo encontrado
    return res.status(200).json(vehicle);
  } catch (error) {
    // Manejo de errores
    return res.status(400).json("Error al obtener el vehículo");
  }
};

/**
 * Crea un nuevo vehículo asociado al usuario autenticado
 * @async
 * @function createVehicle
 * @param {AuthenticatedRequest} req - Request con datos del vehículo y usuario autenticado
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el vehículo creado
 * @throws {400} Si ocurre un error al crear el vehículo
 * @throws {201} Si la operación es exitosa
 */
export const createVehicle = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Prepara los datos del vehículo incluyendo al propietario (usuario autenticado)
    const vehicleData = { ...req.body, owner: req.user?._id };

    // Crea una nueva instancia del modelo Vehicle
    const newVehicle = new Vehicle(vehicleData);

    // Guarda el vehículo en la base de datos
    const vehicleSaved = await newVehicle.save();

    // Actualiza el usuario añadiendo el ID del nuevo vehículo a su array de vehículos
    await User.findByIdAndUpdate(req.user?._id, { $push: { vehicles: vehicleSaved._id } });

    // Devuelve el vehículo creado con código 201 (creado)
    return res.status(201).json(vehicleSaved);
  } catch (error) {
    // Manejo de errores
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
    // Extrae el ID del vehículo de los parámetros de la URL
    const { id } = req.params;

    // Busca y actualiza el vehículo que coincida con el ID y propietario
    const vehicleUpdated = await Vehicle.findByIdAndUpdate(
      { _id: id, owner: req.user?._id }, // Filtro: ID y propietario
      req.body, // Datos a actualizar
      { new: true } // Opción para devolver el documento actualizado
    );

    // Si no encuentra el vehículo, devuelve error 404
    if (!vehicleUpdated) {
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    // Devuelve el vehículo actualizado
    return res.status(200).json(vehicleUpdated);
  } catch (error) {
    // Manejo de errores
    return res.status(400).json("Error al actualizar la propiedad");
  }
};

/**
 * Elimina un vehículo del usuario autenticado
 * @async
 * @function deleteVehicle
 * @param {AuthenticatedRequest<{ id: string }>} req - Request con ID del vehículo a eliminar
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con confirmación y datos del vehículo eliminado
 * @throws {404} Si el vehículo no existe o no pertenece al usuario
 * @throws {400} Si ocurre un error al eliminar
 * @throws {200} Si la operación es exitosa
 */
export const deleteVehicle = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    // Extrae el ID del vehículo de los parámetros de la URL
    const { id } = req.params;

    // Busca y elimina el vehículo que coincida con el ID y propietario
    const vehicleDeleted = await Vehicle.findOneAndDelete({
      _id: id,
      owner: req.user?._id,
    });

    // Si no encuentra el vehículo, devuelve error 404
    if (!vehicleDeleted) {
      return res.status(404).json("Vehículo no encontrado o no tienes permisos");
    }

    // Devuelve mensaje de éxito y datos del vehículo eliminado
    return res.status(200).json({
      message: "Vehículo eliminado correctamente",
      vehicleDeleted: vehicleDeleted,
    });
  } catch (error) {
    // Manejo de errores
    return res.status(400).json("Error al eliminar el vehículo");
  }
};
