import mongoose, { Schema, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface ILesson {
  title: string;
  type: "video" | "quiz" | "assignment" | "text";
  duration: string;
  url?: string;
  textContent?: string;
  assignmentDesc?: string;
  marks?: number;       // ← নতুন: assignment এর total marks
  dueDate?: Date;       // ← নতুন: assignment এর due date
  order: number;
}

export interface IModule {
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ICourseDocument extends Document {
  instructorId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  level: "Basic" | "Intermediate" | "Advanced";
  description: string;
  coverImage: { type: "upload" | "url"; url: string };
  salesVideo: { type: "upload" | "url"; url: string };
  faqs: IFAQ[];
  modules: IModule[];
  pricing: {
    type: "paid" | "free";
    price: number;
    discountPrice?: number;
    enrollmentLimit?: number | null;
    accessDuration: "lifetime" | "1year" | "6months" | "3months";
  };
  visibility: "public" | "private";
  status: "draft" | "published";
  enrolledCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub Schemas ──────────────────────────────────────────────────────────────
const LessonSchema = new Schema<ILesson>({
  title:          { type: String, required: true, trim: true },
  type:           { type: String, enum: ["video", "quiz", "assignment", "text"], default: "video" },
  duration:       { type: String, default: "" },
  url:            { type: String, default: "" },
  textContent:    { type: String, default: "" },
  assignmentDesc: { type: String, default: "" },
  marks:          { type: Number, default: 0 },     // ← নতুন
  dueDate:        { type: Date, default: null },     // ← নতুন
  order:          { type: Number, default: 0 },
});

const ModuleSchema = new Schema<IModule>({
  title:   { type: String, required: true, trim: true },
  order:   { type: Number, default: 0 },
  lessons: [LessonSchema],
});

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
});

// ─── Main Schema ──────────────────────────────────────────────────────────────
const CourseSchema = new Schema<ICourseDocument>(
  {
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:        { type: String, required: true, trim: true },
    category:     { type: String, required: true },
    level:        { type: String, enum: ["Basic", "Intermediate", "Advanced"], default: "Basic" },
    description:  { type: String, default: "" },
    coverImage: {
      type: { type: String, enum: ["upload", "url"], default: "url" },
      url:  { type: String, default: "" },
    },
    salesVideo: {
      type: { type: String, enum: ["upload", "url"], default: "url" },
      url:  { type: String, default: "" },
    },
    faqs:    [FAQSchema],
    modules: [ModuleSchema],
    pricing: {
      type:            { type: String, enum: ["paid", "free"], default: "paid" },
      price:           { type: Number, default: 0 },
      discountPrice:   { type: Number, default: null },
      enrollmentLimit: { type: Number, default: null },
      accessDuration:  { type: String, enum: ["lifetime", "1year", "6months", "3months"], default: "lifetime" },
    },
    visibility:    { type: String, enum: ["public", "private"], default: "public" },
    status:        { type: String, enum: ["draft", "published"], default: "draft" },
    enrolledCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "courses" }
);

CourseSchema.index({ instructorId: 1 });
CourseSchema.index({ status: 1, visibility: 1 });

const Course = mongoose.models.Course || mongoose.model<ICourseDocument>("Course", CourseSchema);
export default Course;