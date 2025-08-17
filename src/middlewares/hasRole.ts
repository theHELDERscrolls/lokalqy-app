import type { UserDoc } from "@/types/user.type.js";
import type { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: Omit<UserDoc, "password">;
}

/**
 * Middleware que verifica si el usuario tiene los roles necesarios
 * para acceder a una ruta específica.
 *
 * @function hasRole
 * @param {Array<"user" | "admin">} roles - Lista de roles permitidos
 * @returns {Function} Middleware de Express que verifica los roles
 *
 * @example
 * // Uso en rutas:
 * router.get('/admin', hasRole(['admin']), adminController);
 *
 * @description
 * Este middleware debe usarse DESPUÉS de isAuth ya que depende de req.user
 *
 * @throws {401} Si no hay usuario autenticado (req.user no existe)
 * @throws {403} Si el usuario no tiene los permisos requeridos
 */
export const hasRole = (roles: Array<"user" | "admin">) => {
  /**
   * Middleware que verifica los roles del usuario autenticado
   * @param {AuthenticatedRequest} req - Request de Express con usuario
   * @param {Response} res - Objeto Response de Express
   * @param {NextFunction} next - Función para continuar al siguiente middleware
   */
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Verificar que el usuario esté autenticado
    // (Este middleware debe usarse después de isAuth)
    if (!req.user) {
      return res.status(401).json({
        error: "No autorizado: usuario no autenticado",
      });
    }

    // 2. Verificar que el rol del usuario esté en la lista de roles permitidos
    if (!roles.includes(req.user.role)) {
      // Nota: Usamos 403 (Forbidden) en lugar de 401 (Unauthorized)
      // porque el usuario está autenticado pero no tiene permisos
      return res.status(403).json({
        error: "Acceso denegado: no tienes permisos",
      });
    }

    // 3. Si todo está correcto, continuar con el siguiente middleware
    next();
    return; // Buen práctica para evitar ejecución adicional de código
  };
};
