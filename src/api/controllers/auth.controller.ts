import { generateToken } from "../../utils/index.js";
import { User } from "../models/index.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import type { IUser } from "../../types/index.js";
import type { Request, Response } from "express";

/**
 * Controlador para el registro de nuevos usuarios
 * @async
 * @function register
 * @param {Request<{}, {}, IUser>} req - Request de Express con los datos del usuario
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con el resultado de la operación
 *
 * @throws {400} Si faltan campos obligatorios o hay errores de validación
 * @throws {409} Si el nombre de usuario o email ya existen
 * @throws {500} Si ocurre un error interno del servidor
 *
 * @description
 * Este endpoint permite registrar nuevos usuarios en el sistema, validando:
 * 1. Campos obligatorios (nombre, email, password)
 * 2. Unicidad del nombre y email
 * 3. Cumplimiento de las reglas de validación del modelo
 */
export const register = async (req: Request<{}, {}, IUser>, res: Response): Promise<Response> => {
  try {
    // Extraemos los campos del body de la request
    const { name, email, password } = req.body;

    // Validación básica de campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Nombre, email y password son requeridos" });
    }

    // Verificación de nombre duplicado en la base de datos
    const userNameDuplicated = await User.findOne({ name });
    if (userNameDuplicated) {
      return res.status(409).json({ error: `El usuario con el nombre ${name} ya existe` });
    }

    // Verificación de email duplicado en la base de datos
    const userEmailDuplicated = await User.findOne({ email });
    if (userEmailDuplicated) {
      return res.status(409).json({ error: `El usuario con el email ${email} ya existe` });
    }

    // Creación del nuevo usuario con los datos recibidos forzando el role "user"
    const user = new User({ ...req.body, role: "user" });

    // Guardado del usuario en la base de datos
    const userSaved = await user.save();

    // Eliminamos el password del objeto antes de enviarlo (seguridad)
    // Usamos destructuring para separar el password y quedarnos con el resto de campos
    const { password: _, ...safeUserData } = userSaved.toObject();

    // Respuesta exitosa con código 201 (Created)
    return res.status(201).json({
      message: "Usuario registrado",
      user: safeUserData, // Datos del usuario sin el password
    });
  } catch (error) {
    // Manejo específico de errores de validación de Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
      // Extraemos los mensajes de error de todas las validaciones fallidas
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    // Error interno del servidor para cualquier otro error no controlado
    return res.status(500).json("Error interno en el registro");
  }
};

/**
 * Controlador para el inicio de sesión de usuarios
 * @async
 * @function login
 * @param {Request<{}, {}, IUser>} req - Request de Express con credenciales
 * @param {Response} res - Objeto Response de Express
 * @returns {Promise<Response>} Respuesta JSON con token y datos de usuario
 *
 * @throws {400} Si las credenciales son incorrectas
 * @throws {500} Si ocurre un error interno del servidor
 *
 * @description
 * Este endpoint permite a los usuarios iniciar sesión verificando:
 * 1. Existencia del email en la base de datos
 * 2. Corrección de la contraseña mediante bcrypt
 * 3. Generación de un token JWT para autenticación posterior
 */
export const login = async (req: Request<{}, {}, IUser>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Buscamos el usuario por email incluyendo el password (normalmente excluido)
    // .select("+password") sobrescribe la exclusión por defecto del password
    const user = await User.findOne({ email }).select("+password");

    // Si no encontramos el usuario, respondemos con error genérico (por seguridad)
    if (!user) {
      return res.status(400).json("Usuario o contraseña incorrectos");
    }

    // Convertimos el ObjectId a string para usarlo en el token
    const userId = user._id.toString();
    if (!userId) {
      return res.status(500).json("Error interno: usuario sin ID");
    }

    // Comparamos la contraseña proporcionada con el hash almacenado
    if (bcrypt.compareSync(password, user.password)) {
      // Si la contraseña es correcta:

      // 1. Eliminamos el password del objeto de respuesta
      const { password: _, ...safeUserData } = user.toObject();

      // 2. Generamos un token JWT con el ID del usuario
      const token = generateToken({ id: userId });

      // 3. Respondemos con el token y los datos del usuario (sin password)
      return res.status(200).json({ token, user: safeUserData });
    } else {
      // Contraseña incorrecta - mismo mensaje que usuario no encontrado (seguridad)
      return res.status(400).json("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    // Error genérico del proceso de login
    return res.status(400).json("Error al realizar el login");
  }
};
