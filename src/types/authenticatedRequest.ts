import type { Request } from "express";
import type { UserDoc } from "./index.js";

export interface AuthenticatedRequest<Params = {}, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: Omit<UserDoc, "password">; // Usuario sin campo password por seguridad
}
