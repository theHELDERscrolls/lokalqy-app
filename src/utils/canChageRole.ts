import type { UserDoc } from "../types/user.type.js";

/**
 * Valida si un usuario puede cambiar el rol de otro usuario
 * @function canChangeRole
 * @param {Omit<UserDoc, "password">} user - Usuario que intenta realizar el cambio
 * @param {string} id - ID del usuario objetivo
 * @param {string} [newRole] - Nuevo rol a asignar
 * @returns {string | null} Mensaje de error o null si es válido
 */
export const canChangeRole = (
  user: Omit<UserDoc, "password">,
  id: string,
  newRole?: string
): string | null => {
  // Verifica si el usuario es administrador
  const isAdmin = user.role === "admin";
  // Verifica si el usuario intenta modificarse a sí mismo
  const isSelf = String(user._id) === id;

  // Solo los administradores pueden cambiar roles
  if (!isAdmin && newRole) {
    return "No tienes permisos para modificar el rol del usuario";
  }

  // Los administradores no pueden quitarse sus propios privilegios
  if (isAdmin && isSelf && newRole === "user") {
    return "No puedes cambiar tu rol de admin a user";
  }

  return null;
};
