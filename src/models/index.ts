// src/models/index.ts
// ✅ Central model registry to avoid import issues

import mongoose from "mongoose";

// Import all models to ensure they're registered
import User from "./User";
import Course from "./Course";

// Export models
export { User, Course };

// Export types
export type { IUserDocument } from "./User";
export type { ICourseDocument, ILesson, IModule, IFAQ } from "./Course";

// Helper function to ensure all models are registered
export function ensureModelsRegistered() {
  const models = { User, Course };
  
  console.log("📋 Registered Models:", Object.keys(mongoose.models));
  
  return models;
}

export default {
  User,
  Course,
  ensureModelsRegistered,
};