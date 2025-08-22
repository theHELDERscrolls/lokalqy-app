import type { UserDoc } from "../types/user.type.js";

/**
 * Verifica si un usuario es administrador o el propio usuario dueño del recurso
 * @function isAdminOrSelf
 * @param {Omit<UserDoc, "password">} user - Usuario autenticado
 * @param {string} id - ID del recurso a verificar
 * @returns {boolean} True si tiene permisos, false en caso contrario
 */
export const isAdminOrSelf = (user: Omit<UserDoc, "password">, id: string): boolean => {
  // Retorna true si es administrador o si es el dueño del recurso
  return user.role === "admin" || String(user._id) === id;
};
