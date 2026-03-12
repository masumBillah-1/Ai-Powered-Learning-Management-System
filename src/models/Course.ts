import mongoose, { Document, Schema } from "mongoose";

// ─────────────────────────────────────────────────────────
// Course Related Interfaces  
// ─────────────────────────────────────────────────────────

export interface IFAQ {
  question: string;
  answer: string;
}

export interface ILesson {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  resources?: string[];
  isCompleted?: boolean;
  order: number;
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
  price: number;
  originalPrice?: number;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  duration?: number; // total duration in minutes
  
  // Course Content
  modules: IModule[];
  
  // Course Details
  requirements?: string[];
  whatYouWillLearn?: string[];
  tags?: string[];
  faq?: IFAQ[];
  
  // Status & Visibility
  status: "draft" | "published" | "archived";
  isPublished: boolean;
  publishedAt?: Date;
  
  // Stats
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────
// Course Schema
// ─────────────────────────────────────────────────────────

const LessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String },
  duration: { type: Number, default: 0 },
  resources: [{ type: String }],
  isCompleted: { type: Boolean, default: false },
  order: { type: Number, required: true }
});

const ModuleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [LessonSchema],
  order: { type: Number, required: true }
});

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer: { type: String, required: true }
});

const CourseSchema = new Schema<ICourseDocument>({
  instructorId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 5000
  },
  shortDescription: { 
    type: String,
    maxlength: 500
  },
  thumbnail: { type: String },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  originalPrice: { 
    type: Number,
    min: 0
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  level: { 
    type: String, 
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },
  language: { 
    type: String, 
    default: "English"
  },
  duration: { 
    type: Number, 
    default: 0 
  },
  
  // Course Content
  modules: [ModuleSchema],
  
  // Course Details
  requirements: [{ type: String }],
  whatYouWillLearn: [{ type: String }],
  tags: [{ type: String }],
  faq: [FAQSchema],
  
  // Status & Visibility
  status: { 
    type: String, 
    enum: ["draft", "published", "archived"],
    default: "draft"
  },
  isPublished: { 
    type: Boolean, 
    default: false 
  },
  publishedAt: { type: Date },
  
  // Stats
  enrollmentCount: { 
    type: Number, 
    default: 0 
  },
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ─────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────

CourseSchema.index({ instructorId: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ status: 1, isPublished: 1 });
CourseSchema.index({ title: "text", description: "text" });
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ rating: -1 });
CourseSchema.index({ enrollmentCount: -1 });

// ─────────────────────────────────────────────────────────
// Virtual Fields
// ─────────────────────────────────────────────────────────

CourseSchema.virtual("totalLessons").get(function() {
  return this.modules.reduce((total, module) => total + module.lessons.length, 0);
});

CourseSchema.virtual("discountPercentage").get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// ─────────────────────────────────────────────────────────
// Methods
// ─────────────────────────────────────────────────────────

CourseSchema.methods.publish = function() {
  this.status = "published";
  this.isPublished = true;
  this.publishedAt = new Date();
  return this.save();
};

CourseSchema.methods.unpublish = function() {
  this.status = "draft";
  this.isPublished = false;
  return this.save();
};

CourseSchema.methods.archive = function() {
  this.status = "archived";
  this.isPublished = false;
  return this.save();
};

// ─────────────────────────────────────────────────────────
// Static Methods
// ─────────────────────────────────────────────────────────

CourseSchema.statics.findPublished = function() {
  return this.find({ status: "published", isPublished: true });
};

CourseSchema.statics.findByInstructor = function(instructorId: mongoose.Types.ObjectId) {
  return this.find({ instructorId });
};

CourseSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, status: "published", isPublished: true });
};

// ─────────────────────────────────────────────────────────
// Export Model
// ─────────────────────────────────────────────────────────

const Course = mongoose.models.Course || mongoose.model<ICourseDocument>("Course", CourseSchema);

export default Course;