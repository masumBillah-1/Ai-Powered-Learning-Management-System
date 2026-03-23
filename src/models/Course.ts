import mongoose, { Document, Schema } from "mongoose";

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ILesson {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  type?: "video" | "text" | "assignment";
  videoUrl?: string;
  textContent?: string;
  duration?: number;
  resources?: string[];
  isCompleted?: boolean;
  order: number;
  // ✅ Assignment fields
  assignmentDesc?: string;
  marks?: number;
  dueDate?: Date;
}

export interface IModule {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  lessons: ILesson[];
  order: number;
}

export interface ICourseDocument extends Document {
  _id: mongoose.Types.ObjectId;
  instructorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  // ✅ salesVideoUrl — sales/promo video URL string
  salesVideoUrl?: string;
  price: number;
  originalPrice?: number;
  category: string;
  level: string;
  language: string;
  duration?: number;
  modules: IModule[];
  requirements?: string[];
  whatYouWillLearn?: string[];
  tags?: string[];
  faq?: IFAQ[];
  status: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  isPublished: boolean;
  publishedAt?: Date;
  isCertificateEnabled: boolean;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>({
  title:          { type: String, required: true },
  description:    { type: String },
  type:           { type: String, enum: ["video", "text", "assignment"], default: "video" },
  videoUrl:       { type: String },
  textContent:    { type: String },
  duration:       { type: Number, default: 0 },
  resources:      [{ type: String }],
  isCompleted:    { type: Boolean, default: false },
  order:          { type: Number, default: 0 },
  // ✅ Assignment fields
  assignmentDesc: { type: String },
  marks:          { type: Number, default: 0 },
  dueDate:        { type: Date },
});

const ModuleSchema = new Schema<IModule>({
  title:       { type: String, required: true },
  description: { type: String },
  lessons:     [LessonSchema],
  order:       { type: Number, default: 0 },
});

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
});

const CourseSchema = new Schema<ICourseDocument>(
  {
    instructorId: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    title: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 200,
    },
    description: {
      type:      String,
      required:  true,
      maxlength: 5000,
    },
    shortDescription: { type: String, maxlength: 500 },
    // ✅ thumbnail — cover image URL
    thumbnail:        { type: String },
    // ✅ salesVideoUrl — promo/sales video URL (new field)
    salesVideoUrl:    { type: String, default: "" },

    price: {
      type:    Number,
      default: 0,
      min:     0,
    },
    originalPrice: { type: Number, min: 0 },

    category: {
      type:     String,
      required: true,
      trim:     true,
    },

    level: {
      type:    String,
      default: "beginner",
    },

    language: { type: String, default: "English" },
    duration: { type: Number, default: 0 },

    modules:          [ModuleSchema],
    requirements:     [{ type: String }],
    whatYouWillLearn: [{ type: String }],
    tags:             [{ type: String }],
    faq:              [FAQSchema],

    status: {
      type:    String,
      default: "draft",
    },
    
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref:  "User",
    },
    approvedAt: { type: Date },
    
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref:  "User",
    },
    rejectedAt: { type: Date },

    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    isCertificateEnabled: { type: Boolean, default: false },

    enrollmentCount: { type: Number, default: 0 },
    rating:          { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:     { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// Indexes
CourseSchema.index({ instructorId: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ status: 1, isPublished: 1 });
CourseSchema.index({ title: "text", description: "text" });
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ rating: -1 });
CourseSchema.index({ enrollmentCount: -1 });

// Virtuals
CourseSchema.virtual("totalLessons").get(function () {
  return this.modules.reduce((total, m) => total + m.lessons.length, 0);
});

CourseSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Methods
CourseSchema.methods.publish = function () {
  this.status      = "published";
  this.isPublished = true;
  this.publishedAt = new Date();
  return this.save();
};

CourseSchema.methods.unpublish = function () {
  this.status      = "draft";
  this.isPublished = false;
  return this.save();
};

// Statics
CourseSchema.statics.findPublished = function () {
  return this.find({ status: "published", isPublished: true });
};

CourseSchema.statics.findByInstructor = function (instructorId: mongoose.Types.ObjectId) {
  return this.find({ instructorId });
};

CourseSchema.statics.findByCategory = function (category: string) {
  return this.find({ category, status: "published", isPublished: true });
};

const Course =
  (mongoose.models.Course as mongoose.Model<ICourseDocument>) ||
  mongoose.model<ICourseDocument>("Course", CourseSchema);

export default Course;