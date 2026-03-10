import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string | null;
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
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // ✅ phone — unique index নেই, duplicate নিয়ে মাথাব্যথা নেই
    // optional field, দিলেও হয় না দিলেও হয়
    phone: {
      type: String,
      trim: true,
      default: null,
      set: (v: any) => (!v || v.trim() === "" ? null : v.trim()),
    },

    password:         { type: String, minlength: 6 },
    photoURL:         { type: String, default: "" },
    role:             { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    provider:         { type: String, enum: ["credentials", "google", "github"], default: "credentials" },
    resetToken:       { type: String },
    resetTokenExpiry: { type: Date },
    loginAttempts:    { type: Number, default: 0 },
    lockUntil:        { type: Date },
  },
  { 
    timestamps: true,
    collection: "users" // ✅ Fixed collection name in code
  }
);

// ✅ শুধু email unique index — phone index সম্পূর্ণ remove
UserSchema.index({ email: 1 }, { unique: true });

// ✅ Better model export pattern
const User = mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
export default User;