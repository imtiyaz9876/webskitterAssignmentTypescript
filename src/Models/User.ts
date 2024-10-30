import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the User schema
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image: string;
  mobile: string;
  role: "user" | "admin";
  gender?: string;
}

// Define the Mongoose schema with TypeScript types
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      required: false,
    },
  },
  { versionKey: false }
);

// Export the Mongoose model
export default mongoose.model<IUser>("User", userSchema);
