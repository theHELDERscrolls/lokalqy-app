import type { UserDoc } from "../types/user.type.js";

export const isAdminOrSelf = (user: Omit<UserDoc, "password">, id: string): boolean => {
  return user.role === "admin" || String(user._id) === id;
};
