import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  instructor: string;
  instructorId: mongoose.Types.ObjectId;
  students: number;
  revenue: number;
  rating: number;
  status: "published" | "pending" | "draft";
  category: string;
  lessons: number;
  description?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    students: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    status: { type: String, enum: ["published", "pending", "draft"], default: "draft" },
    category: { type: String, required: true },
    lessons: { type: Number, default: 0 },
    description: { type: String },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
