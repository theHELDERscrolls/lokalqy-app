import type { IVehicle } from "../../types/index.js";
import mongoose, { Schema } from "mongoose";

const vehicleSchema = new Schema<IVehicle>(
  {
    name: {
      type: String,
      required: [true, "El nombre del vehículo  es obligatorio"],
      trim: true,
      minLength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxLength: [100, "El nombre no puede exceder de los 100 caracteres"],
    },
    type: {
      type: String,
      required: [true, "El tipo de vehículo es obligatorio"],
      enum: {
        values: ["car", "motorcycle", "truck", "van", "other"],
        message: "Tipo del vehículo inválido",
      },
    },
    plate: {
      type: String,
      required: [true, "La matrícula es obligatoria"],
      trim: true,
      unique: true,
      match: [/^\d{4}[A-Z]{3}$/, "Formato de la matrícula inválido (ej: 1234ABC)"],
    },
    status: {
      type: String,
      required: [true, "El estado es obligatorio"],
      enum: {
        values: ["available", "rented", "maintenance"],
        message: "Estado no válido",
      },
    },
    dailyRent: {
      type: Number,
      required: [true, "La renta diaria es obligatoria"],
      min: [0, "La renta diaria no puede ser negativa"],
    },
    expenses: {
      type: Number,
      required: [true, "Los gastos son obligatorios"],
      min: [0, "Los gastos no pueden ser negativos"],
    },
    paid: { type: Boolean, required: true, default: false },
    image: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, "El propietario es obligatorio"],
      ref: "users",
    },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("vehicles", vehicleSchema, "vehicles");
