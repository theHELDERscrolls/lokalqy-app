import { User } from "../api/models/index.js";
import type { UserDoc } from "../types/index.js";
import { verifyToken } from "../utils/index.js";
import type { NextFunction, Request, Response } from "express";

// Extendemos el tipo Request de Express para añadir la propiedad user
interface AuthenticatedRequest extends Request {
  user?: Omit<UserDoc, "password">; // El usuario autenticado, sin el campo password
}

/**
 * Middleware de autenticación que verifica:
 * 1. Presencia del token JWT en headers
 * 2. Validez del token
 * 3. Existencia del usuario en la base de datos
 *
 * @param req - Request de Express (extendido con posible user)
 * @param res - Response de Express
 * @param next - Función para pasar al siguiente middleware
 */
export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // PASO 1: Verificar el header de autorización
    const authHeader = req.headers.authorization;

    // Comprobamos que exista el header y empiece por "Bearer " (!OJO con el espacio)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autorizado: token no proporcionado" });
    }

    // PASO 2: Extraer el token del header
    // Formato esperado: "Bearer <nuestro token>"
    const token = authHeader.split(" ")[1]; // Separamos por espacios y tomamos la segunda parte

    // Verificamos que el token exista después de "Bearer"
    if (!token) {
      return res.status(401).json({ error: "No autorizado: token no proporcionado" });
    }

    // PASO 3: Verificar el token JWT
    // verifyToken lanzará error si el token es inválido o ha expirado
    const { id } = verifyToken(token); // Extraemos el ID del payload del token

    // PASO 4: Buscar el usuario en la base de datos
    const user = await User.findById(id).select("-password"); // Buscamos sin traer el password

    // Si no encontramos al usuario, aunque el token sea válido
    if (!user) {
      return res.status(401).json({ error: "No autorizado: usuario no encontrado" });
    }

    // PASO 5: Adjuntar el usuario al request para los siguientes middlewares
    req.user = user as Omit<UserDoc, "password">; // TypeScript sabe que no incluye password

    // PASO 6: Pasar al siguiente middleware/ruta
    next();
    return; // Buen práctica para evitar ejecución adicional
  } catch (error) {
    // Manejo centralizado de errores
    return res
      .status(401)
      .json(
        error instanceof Error ? { error: error.message } : { error: "Error de autenticación" }
      );
  }
};
