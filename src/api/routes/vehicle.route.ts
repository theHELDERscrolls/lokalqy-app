import { isAuth, upload } from "../../middlewares/index.js";
import express from "express";
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "../controllers/index.js";

export const vehiclesRouter = express.Router();

vehiclesRouter.get("/", getVehicles);
vehiclesRouter.get("/:id", getVehicle);
vehiclesRouter.post("/", isAuth, upload.single("image"), createVehicle);
vehiclesRouter.put("/:id", isAuth, upload.single("image"), updateVehicle);
vehiclesRouter.delete("/:id", isAuth, deleteVehicle);
