import { Document } from "mongoose";

export interface Iuser extends Document {
  name: string;
  email: string;
  password?: string;
  image: string;
  mobile: string;
  role: "user" | "admin";
  gender?: string;
}
