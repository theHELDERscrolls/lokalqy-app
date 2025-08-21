import type { Request, Response } from "express";
import { Property, User } from "../models/index.js";
import type { UserDoc } from "../../types/index.js";

interface AuthenticatedRequest<Params = {}, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: Omit<UserDoc, "password">;
}

export const getProperties = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const properties = await Property.find({ owner: req.user?._id });
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(400).json("Error al obtener las propiedades del usuario");
  }
};

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

export const createProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const propertyData = { ...req.body, owner: req.user?._id };
    const newProperty = new Property(propertyData);

    const propertySaved = await newProperty.save();

    await User.findByIdAndUpdate(req.user?._id, { $push: { properties: propertySaved._id } });

    return res.status(201).json(propertySaved);
  } catch (error) {
    return res.status(400).json("Error al crear la propiedad");
  }
};

export const updateProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const propertyUpdated = await Property.findByIdAndUpdate(
      { _id: id, owner: req.user?._id },
      req.body,
      { new: true }
    );

    if (!propertyUpdated) {
      return res.status(404).json("Propiedad no encontrada o no tienes permisos");
    }

    return res.status(200).json(propertyUpdated);
  } catch (error) {
    return res.status(400).json("Error al actualizar la propiedad");
  }
};

export const deleteProperty = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
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
