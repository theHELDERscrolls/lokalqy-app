import { authRouter, propertiesRouter, usersRouter, vehiclesRouter } from "./api/routes/index.js";
import { connectDB } from "./config/index.js";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1/users/", authRouter);
app.use("/api/v1/users/", usersRouter);
app.use("/api/v1/properties/", propertiesRouter);
app.use("/api/v1/vehicles/", vehiclesRouter);

app.use((_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).json("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
