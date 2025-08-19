import jwt from "jsonwebtoken";
import { getJwtSecret } from "./getJwtSecret.js";

// Definimos la interfaz (tipo) para el payload (contenido) del token JWT
interface JwtPayload {
  id: string; // Identificador único del usuario
}

// Destructuring de tipos específicos de jwt necesarios para el manejo de errores
// Nota: Esto es necesario porque jsonwebtoken no exporta directamente estos tipos en ESM
const { JsonWebTokenError, TokenExpiredError } = jwt;

/**
 * Función para generar un nuevo token JWT
 * @param payload - Objeto con la información a incluir en el token (id, role, email)
 * @returns Token JWT firmado
 */
export const generateToken = (payload: JwtPayload): string => {
  // jwt.sign() crea un nuevo token:
  // 1er parámetro: datos a incluir en el token
  // 2do parámetro: clave secreta para firmar el token
  // 3er parámetro: opciones (en este caso, expira en 1 hora)
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1h" });
};

/**
 * Función para verificar y decodificar un token JWT
 * @param token - Token JWT a verificar
 * @returns Payload decodificado (datos del usuario)
 * @throws Error con mensaje descriptivo si hay problemas
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    // jwt.verify() verifica y decodifica el token:
    // 1er parámetro: token a verificar
    // 2do parámetro: clave secreta usada para firmarlo
    const decoded = jwt.verify(token, getJwtSecret());

    // Verificamos que el token decodificado tenga la estructura correcta
    if (typeof decoded === "object" && "id" in decoded) {
      // Hacemos type assertion (asegurar el tipo) ya que hemos verificado la estructura
      return decoded as JwtPayload;
    }

    // Si falta algún campo obligatorio, lanzamos error
    throw new Error("Token inválido: falta el campo 'id'");
  } catch (error) {
    // Manejo específico de errores conocidos de JWT:
    if (error instanceof TokenExpiredError) {
      throw new Error("El token ha expirado");
    }
    if (error instanceof JsonWebTokenError) {
      throw new Error("El token es inválido");
    }

    // Cualquier otro error inesperado
    throw new Error("Error desconocido al verificar el token");
  }
};
