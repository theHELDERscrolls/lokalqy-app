import { isAuth } from "@/middlewares/index.js";
import express from "express";

export const vehiclesRouter = express.Router();

vehiclesRouter.get("/" /* getVehicles */);
vehiclesRouter.get("/:id" /* getVehicle */);
vehiclesRouter.post("/", isAuth /* createVehicle */);
vehiclesRouter.put("/:id", isAuth /* updateVehicle */);
vehiclesRouter.delete("/:id", isAuth /* deleteVehicle */);
