import type { Document, Types } from "mongoose";

export interface IVehicle {
  name: string;
  type: "car" | "motorcycle" | "truck" | "van" | "other";
  plate: string;
  status: "available" | "rented" | "maintenance";
  dailyRent: number;
  expenses: number;
  paid: boolean;
  image: string;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleDoc extends IVehicle, Document {}
