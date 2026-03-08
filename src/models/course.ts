import mongoose, { Schema, model, models } from "mongoose";

const CourseSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: String, default: "03:15:00" },
  quizCount: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ["PUBLISHED", "PENDING", "DRAFT"], 
    default: "DRAFT" 
  },
}, { timestamps: true });

// learning-management ডাটাবেসের ভেতর 'courses' কালেকশন তৈরি হবে
const Course = models.Course || model("Course", CourseSchema);
export default Course;