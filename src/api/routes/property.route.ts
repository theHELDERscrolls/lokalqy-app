import express from "express";
import {
  createProperty,
  deleteProperty,
  getProperties,
  getProperty,
  updateProperty,
} from "../controllers/index.js";
import { isAuth, upload } from "../../middlewares/index.js";

export const propertiesRouter = express.Router();

propertiesRouter.get("/", isAuth, getProperties);
propertiesRouter.get("/:id", isAuth, getProperty);
propertiesRouter.post("/", isAuth, upload.single("image"), createProperty);
propertiesRouter.put("/:id", isAuth, upload.single("image"), updateProperty);
propertiesRouter.delete("/:id", isAuth, deleteProperty);
