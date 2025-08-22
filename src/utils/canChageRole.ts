import type { UserDoc } from "../types/user.type.js";

export const canChangeRole = (
  user: Omit<UserDoc, "password">,
  id: string,
  newRole?: string
): string | null => {
  const isAdmin = user.role === "admin";
  const isSelf = String(user._id) === id;

  if (!isAdmin && newRole) {
    return "No tienes permisos para modificar el rol del usuario";
  }

  if (isAdmin && isSelf && newRole === "user") {
    return "No puedes cambiar tu rol de admin a user";
  }

  return null;
};
