import mongoose, { Schema, Document } from "mongoose";

export interface IAdminLogDocument extends Document {
  adminId: mongoose.Types.ObjectId;
  action: "approve_course" | "reject_course" | "delete_course" | "ban_user" | "unban_user" | "delete_user";
  targetType: "course" | "user";
  targetId: mongoose.Types.ObjectId;
  targetName: string;
  metadata?: {
    instructorId?: mongoose.Types.ObjectId;
    category?: string;
    email?: string;
    role?: string;
    [key: string]: any;
  };
  createdAt: Date;
}

const AdminLogSchema = new Schema<IAdminLogDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["approve_course", "reject_course", "delete_course", "ban_user", "unban_user", "delete_user"],
      required: true,
    },
    targetType: {
      type: String,
      enum: ["course", "user"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for fast queries
AdminLogSchema.index({ adminId: 1, createdAt: -1 });
AdminLogSchema.index({ targetType: 1, targetId: 1 });
AdminLogSchema.index({ action: 1 });

const AdminLog =
  (mongoose.models.AdminLog as mongoose.Model<IAdminLogDocument>) ||
  mongoose.model<IAdminLogDocument>("AdminLog", AdminLogSchema);

export default AdminLog;
