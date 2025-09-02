import type { IProperty } from "../../types/index.js";
import mongoose, { Schema } from "mongoose";

const propertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: [true, "El nombre de la propiedad es obligatorio"],
      trim: true,
      minLength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxLength: [100, "El nombre no puede exceder de los 100 caracteres"],
    },
    type: {
      type: String,
      required: [true, "El tipo de propiedad es obligatorio"],
      trim: true,
      enum: {
        values: ["apartment", "rural_house", "flat", "studio", "other"],
        message: "Tipo de propiedad inválido",
      },
    },
    address: {
      type: String,
      required: [true, "La dirección es obligatoria"],
      trim: true,
      minLength: [5, "La dirección debe tener al menos 5 caracteres"],
      maxLength: [200, "La dirección no puede exceder los 200 caracteres"],
    },
    status: {
      type: String,
      required: [true, "El estado es obligatorio"],
      enum: {
        values: ["available", "rented", "maintenance"],
        message: "Estado no válido",
      },
    },
    monthlyRent: {
      type: Number,
      required: [true, "La renta mensual es obligatoria"],
      min: [0, "La renta mensual no puede ser negativa"],
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

propertySchema.index(
  { name: 1, owner: 1 },
  { unique: true, collation: { locale: "es", strength: 2 } }
);

propertySchema.index(
  { address: 1, owner: 1 },
  { unique: true, collation: { locale: "es", strength: 2 } }
);

export const Property = mongoose.model("properties", propertySchema, "properties");
