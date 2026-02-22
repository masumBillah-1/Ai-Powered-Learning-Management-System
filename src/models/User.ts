import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  photoURL?: string;
  role: "student" | "instructor" | "admin";
  provider: "credentials" | "google";
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, sparse: true },
    password: { type: String, minlength: 6 },
    photoURL: { type: String, default: "" },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);