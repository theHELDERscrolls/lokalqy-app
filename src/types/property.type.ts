import type { Document, Types } from "mongoose";

export interface IProperty {
  name: string;
  type: "apartment" | "rural_house" | "flat" | "studio" | "other";
  address: string;
  status: "available" | "rented" | "maintenance";
  monthlyRent: number;
  expenses: number;
  paid: boolean;
  image: string;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PropertyDoc extends IProperty, Document {}
