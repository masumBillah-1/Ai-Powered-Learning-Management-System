import mongoose, { Schema } from "mongoose";

const LessonSchema = new Schema({
  title: String,
  type: String,
  duration: String,
  url: String,
  order: Number
});

const ModuleSchema = new Schema({
  title: String,
  order: Number,
  lessons: [LessonSchema]
});

const CourseSchema = new Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,
    category: String,
    level: String,
    description: String,

    coverImage: {
      type: { type: String },
      url: String
    },

    salesVideo: {
      type: { type: String },
      url: String
    },

    modules: [ModuleSchema],

    pricing: {
      type: String,
      price: Number,
      discountPrice: Number
    },

    status: {
      type: String,
      default: "draft"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
mongoose.model("Course", CourseSchema);