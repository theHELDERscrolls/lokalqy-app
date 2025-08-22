import { generateToken } from "../../utils/index.js";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import type { IUser } from "../../types/index.js";
import type { Request, Response } from "express";

/**
 * Registra un nuevo usuario en el sistema
 * @async
 * @function register
 * @param {Request<{}, {}, IUser>} req - Request con datos del usuario
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el usuario creado
 * @throws {400} Si faltan campos requeridos o validación falla
 * @throws {409} Si el nombre o email ya existen
 * @throws {500} Si ocurre un error interno
 * @throws {201} Si la operación es exitosa
 */
export const register = async (req: Request<{}, {}, IUser>, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;
    // Valida que todos los campos requeridos estén presentes
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y password son requeridos" });
    }

    // Verifica si ya existe un usuario con el mismo nombre
    const userNameDuplicated = await User.findOne({ name });
    if (userNameDuplicated) {
      return res.status(409).json({ error: `El usuario con el nombre ${name} ya existe` });
    }

    // Verifica si ya existe un usuario con el mismo email
    const userEmailDuplicated = await User.findOne({ email });
    if (userEmailDuplicated) {
      return res.status(409).json({ error: `El usuario con el email ${email} ya existe` });
    }

    // Crea nuevo usuario con rol por defecto "user"
    const user = new User({ ...req.body, role: "user" });
    const userSaved = await user.save();

    // Excluye el password del objeto de respuesta por seguridad
    const { password: _, ...safeUserData } = userSaved.toObject();

    return res.status(201).json({
      message: "Usuario registrado",
      user: safeUserData,
    });
  } catch (error) {
    // Maneja errores de validación de Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    return res.status(500).json("Error interno en el registro");
  }
};

/**
 * Autentica a un usuario existente
 * @async
 * @function login
 * @param {Request<{}, {}, IUser>} req - Request con credenciales
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con token y datos de usuario
 * @throws {400} Si las credenciales son incorrectas
 * @throws {500} Si ocurre un error interno
 * @throws {200} Si la autenticación es exitosa
 */
export const login = async (req: Request<{}, {}, IUser>, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Busca usuario por email incluyendo el password (normalmente excluido)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json("Usuario o contraseña incorrectos");
    }

    const userId = user._id.toString();
    if (!userId) {
      return res.status(500).json("Error interno: usuario sin ID");
    }

    // Compara la contraseña proporcionada con el hash almacenado
    if (bcrypt.compareSync(password, user.password)) {
      // Excluye el password del objeto de respuesta
      const { password: _, ...safeUserData } = user.toObject();
      // Genera token JWT para la autenticación
      const token = generateToken({ id: userId });

      return res.status(200).json({ token, user: safeUserData });
    } else {
      return res.status(400).json("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    return res.status(400).json("Error al realizar el login");
  }
};
