import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import { connectDB } from "./config/index.js";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

connectDB();

app.use((_req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).json("Route not found");
});

app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
