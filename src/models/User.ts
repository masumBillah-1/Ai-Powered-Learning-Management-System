import mongoose, { Schema, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface IProfile {
  bio?: string;
  expertise?: string[];
  experience?: number; // years of experience
  education?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface IUserStats {
  // Instructor-specific stats
  totalCourses?: number;
  totalStudents?: number;
  totalEarnings?: number;
  rating?: number;
  reviewCount?: number;
  
  // Student-specific stats
  enrolledCourses?: number;
  completedCourses?: number;
  certificatesEarned?: number;
  totalLearningTime?: number; // in minutes
  
  // Common stats
  joinedAt?: Date;
  lastActiveAt?: Date;
}

export interface IUserPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: "light" | "dark" | "system";
  language: "en" | "bn";
  timezone?: string;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string | null;
  password?: string;
  photoURL?: string;
  role: "student" | "instructor" | "admin";
  provider: "credentials" | "google" | "github";
  
  // Enhanced fields
  profile?: IProfile;
  stats?: IUserStats;
  preferences?: IUserPreferences;
  
  // Account status and verification
  status: "active" | "suspended" | "pending";
  isVerified: boolean;
  verificationToken?: string;
  
  // Security fields
  resetToken?: string;
  resetTokenExpiry?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub Schemas ──────────────────────────────────────────────────────────────
const ProfileSchema = new Schema<IProfile>({
  bio: { type: String, maxlength: 500, trim: true },
  expertise: [{ type: String, trim: true }],
  experience: { type: Number, min: 0, max: 50 },
  education: { type: String, maxlength: 200, trim: true },
  socialLinks: {
    website: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    twitter: { type: String, trim: true },
  },
});

const UserStatsSchema = new Schema<IUserStats>({
  // Instructor-specific stats
  totalCourses: { type: Number, default: 0, min: 0 },
  totalStudents: { type: Number, default: 0, min: 0 },
  totalEarnings: { type: Number, default: 0, min: 0 },
  rating: { type: Number, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  
  // Student-specific stats
  enrolledCourses: { type: Number, default: 0, min: 0 },
  completedCourses: { type: Number, default: 0, min: 0 },
  certificatesEarned: { type: Number, default: 0, min: 0 },
  totalLearningTime: { type: Number, default: 0, min: 0 },
  
  // Common stats
  joinedAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
});

const UserPreferencesSchema = new Schema<IUserPreferences>({
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
  language: { type: String, enum: ["en", "bn"], default: "en" },
  timezone: { type: String, default: "Asia/Dhaka" },
});

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
    
    // Enhanced fields
    profile: { type: ProfileSchema },
    stats: { type: UserStatsSchema, default: () => ({}) },
    preferences: { type: UserPreferencesSchema, default: () => ({}) },
    
    // Account status and verification
    status: { type: String, enum: ["active", "suspended", "pending"], default: "active" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    
    // Security fields
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
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ provider: 1 });
UserSchema.index({ "stats.lastActiveAt": -1 });

// ─── Methods ──────────────────────────────────────────────────────────────────
UserSchema.methods.updateLastActive = function() {
  if (this.stats) {
    this.stats.lastActiveAt = new Date();
  } else {
    this.stats = { lastActiveAt: new Date() };
  }
  return this.save();
};

UserSchema.methods.updateInstructorStats = function(courseCount?: number, studentCount?: number, earnings?: number) {
  if (!this.stats) {
    this.stats = {};
  }
  
  if (courseCount !== undefined) this.stats.totalCourses = courseCount;
  if (studentCount !== undefined) this.stats.totalStudents = studentCount;
  if (earnings !== undefined) this.stats.totalEarnings = earnings;
  
  return this.save();
};

UserSchema.methods.updateStudentStats = function(enrolledCount?: number, completedCount?: number, certificatesCount?: number, learningTime?: number) {
  if (!this.stats) {
    this.stats = {};
  }
  
  if (enrolledCount !== undefined) this.stats.enrolledCourses = enrolledCount;
  if (completedCount !== undefined) this.stats.completedCourses = completedCount;
  if (certificatesCount !== undefined) this.stats.certificatesEarned = certificatesCount;
  if (learningTime !== undefined) this.stats.totalLearningTime = (this.stats.totalLearningTime || 0) + learningTime;
  
  return this.save();
};

UserSchema.methods.updateProfile = function(profileData: Partial<IProfile>) {
  if (!this.profile) {
    this.profile = {};
  }
  
  Object.assign(this.profile, profileData);
  return this.save();
};

UserSchema.methods.updatePreferences = function(preferencesData: Partial<IUserPreferences>) {
  if (!this.preferences) {
    this.preferences = {};
  }
  
  Object.assign(this.preferences, preferencesData);
  return this.save();
};

// ─── Static methods ───────────────────────────────────────────────────────────
UserSchema.statics.getInstructorLeaderboard = function(limit: number = 10) {
  return this.find({ 
    role: "instructor",
    status: "active"
  })
    .sort({ "stats.rating": -1, "stats.totalStudents": -1 })
    .limit(limit)
    .select('name photoURL stats.rating stats.totalStudents stats.totalCourses');
};

UserSchema.statics.getActiveUsers = function(days: number = 30) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.find({
    "stats.lastActiveAt": { $gte: cutoffDate },
    status: "active"
  }).countDocuments();
};

// ✅ Better model export pattern
const User = mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
export default User;
