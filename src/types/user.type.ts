import type { Document, Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  image: string;
  properties?: Types.ObjectId[];
  vehicles?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDoc extends IUser, Document {}
