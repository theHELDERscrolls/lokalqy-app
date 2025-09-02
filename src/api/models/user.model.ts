import type { IUser } from "../../types/index.js";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      unique: true,
      minLength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxLength: [20, "El nombre no puede exceder de 20 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      trim: true,
      unique: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Formato de email inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
      maxLength: [128, "La contraseña no puede superar los 128 caracteres"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Rol no válido",
      },
      default: "user",
    },
    image: { type: String },
    properties: [{ type: Schema.Types.ObjectId, ref: "properties" }],
    vehicles: [{ type: Schema.Types.ObjectId, ref: "vehicles" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = mongoose.model("users", userSchema, "users");
