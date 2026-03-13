// src/models/index.ts
// ✅ Central model registry to avoid import issues

import mongoose from "mongoose";

// Import all models to ensure they're registered
import User from "./User";
import Course from "./Course";
import Blog from "./Blog";
import Enrollment from "./Enrollment";
import Transaction from "./Transaction";
import Message from "./Message";
import Notification from "./Notification";

// Export models
export { User, Course, Blog, Enrollment, Transaction, Message, Notification };

// Export types
export type { IUserDocument } from "./User";
export type { ICourseDocument, ILesson, IModule, IFAQ } from "./Course";
export type { IBlog } from "./Blog";
export type { IEnrollmentDocument } from "./Enrollment";
export type { ITransactionDocument } from "./Transaction";
export type { IMessageDocument } from "./Message";
export type { INotificationDocument } from "./Notification";

// Helper function to ensure all models are registered
export function ensureModelsRegistered() {
  const models = { User, Course, Blog, Enrollment, Transaction, Message, Notification };

  console.log("📋 Registered Models:", Object.keys(mongoose.models));

  return models;
}

export default {
  User,
  Course,
  Blog,
  Enrollment,
  Transaction,
  Message,
  Notification,
  ensureModelsRegistered,
};