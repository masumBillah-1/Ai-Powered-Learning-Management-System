import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  photoURL?: string;
  role: "student" | "instructor" | "admin";
  provider: "credentials" | "google" | "github";
  resetToken?: string;
  resetTokenExpiry?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
<<<<<<< HEAD
    phone: { type: String, sparse: true },
=======

    // ✅ FIX: empty string "" কে null এ convert করো
    // sparse index শুধু null skip করে, "" skip করে না
    phone: {
      type: String,
      trim: true,
      default: null,
      set: (v: string) => (v === "" || v === undefined ? null : v),
    },

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    password: { type: String, minlength: 6 },
    photoURL: { type: String, default: "" },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

<<<<<<< HEAD
=======
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);