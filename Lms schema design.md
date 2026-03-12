# 🗄️ LMS Pro - Complete MongoDB Schema Design
## ৬টি Collection দিয়ে সম্পূর্ণ LMS System

---

## 📊 Collection Overview

```
DATABASE: lms_pro
│
├── 1. users           ← সব user data (student/instructor/admin)
├── 2. courses         ← সব course data (modules, lessons embedded)
├── 3. enrollments     ← student-course সম্পর্ক + progress
├── 4. transactions    ← সব payment/payout records
├── 5. messages        ← real-time chat messages
└── 6. notifications   ← broadcast + per-user notifications
```

### Traditional (❌ Complex):
```
users, courses, enrollments, lessons, modules, assignments, 
submissions, quizzes, quiz_results, certificates, transactions, 
notifications, reviews, categories = 14+ collections!
```

### আমাদের Approach (✅ Optimized):
```
users + courses + enrollments + transactions + messages + notifications = মাত্র 6টি!
```

### কেন ঠিক 6টি? প্রতিটির কারণ:

| Collection | কেন আলাদা? |
|---|---|
| `users` | Core data, সবসময় দরকার |
| `courses` | Lessons + reviews embedded — 1 query তে পুরো page |
| `enrollments` | Per-student progress tracking আলাদা রাখা দরকার |
| `transactions` | Financial audit trail, কখনো delete হয় না |
| `messages` | Real-time chat, অনেক বেশি documents — embed করা যাবে না |
| `notifications` | Admin broadcast feature — সব user কে একসাথে পাঠানো যায় |

---

---

## 1️⃣ COLLECTION: `users`

### কী কী Data থাকবে:
- Basic info (name, email, password)
- Profile (bio, photo, address)
- Stats — denormalized (dashboard instant load এর জন্য)
- Preferences (theme, language, settings)

> ⚠️ **Note:** Notifications এখন আলাদা `notifications` collection এ — users document এ embed নেই।

### Schema (TypeScript):

```typescript
// src/models/User.ts

import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDocument extends Document {
  // ── Basic Auth ──
  name: string;
  email: string;
  phone?: string;
  password?: string;
  photoURL?: string;
  role: "student" | "instructor" | "admin";
  provider: "credentials" | "google" | "github";

  // ── Profile ──
  bio?: string;
  dateOfBirth?: Date;
  address?: {
    city?: string;
    country?: string;
  };
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
  };

  // ── Stats (denormalized — dashboard instant load) ──
  stats: {
    // Student stats
    enrolledCourses: number;
    completedCourses: number;
    totalCertificates: number;
    totalTimeSpent: number;       // minutes
    // Instructor stats
    totalCourses: number;
    totalStudents: number;
    totalEarnings: number;
    rating: number;
    totalReviews: number;
  };

  // ── Preferences ──
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: "light" | "dark";
    language: "en" | "bn";
  };

  // ── Security ──
  resetToken?: string;
  resetTokenExpiry?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  status: "active" | "suspended" | "pending";
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    phone:     { type: String, default: null },
    password:  { type: String, select: false },
    photoURL:  { type: String, default: null },
    role:      { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    provider:  { type: String, enum: ["credentials", "google", "github"], default: "credentials" },

    bio:         { type: String, default: "" },
    dateOfBirth: { type: Date },
    address: {
      city:    { type: String },
      country: { type: String, default: "Bangladesh" },
    },
    socialLinks: {
      website:  { type: String },
      linkedin: { type: String },
      github:   { type: String },
    },

    // Denormalized stats — $inc দিয়ে update হয়
    stats: {
      enrolledCourses:   { type: Number, default: 0 },
      completedCourses:  { type: Number, default: 0 },
      totalCertificates: { type: Number, default: 0 },
      totalTimeSpent:    { type: Number, default: 0 },
      totalCourses:      { type: Number, default: 0 },
      totalStudents:     { type: Number, default: 0 },
      totalEarnings:     { type: Number, default: 0 },
      rating:            { type: Number, default: 0 },
      totalReviews:      { type: Number, default: 0 },
    },

    preferences: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications:  { type: Boolean, default: true },
      theme:              { type: String, enum: ["light", "dark"], default: "light" },
      language:           { type: String, enum: ["en", "bn"], default: "bn" },
    },

    resetToken:       { type: String },
    resetTokenExpiry: { type: Date },
    loginAttempts:    { type: Number, default: 0 },
    lockUntil:        { type: Date },
    lastLogin:        { type: Date },
    status:           { type: String, enum: ["active", "suspended", "pending"], default: "active" },
    isVerified:       { type: Boolean, default: false },
  },
  { timestamps: true, collection: "users" }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1, status: 1 });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
```

### Real JSON Example (MongoDB তে এভাবে store হবে):

```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "রহিম উদ্দিন",
  "email": "rahim@example.com",
  "phone": "+8801712345678",
  "password": "$2b$12$hashed_password_here",
  "photoURL": "https://res.cloudinary.com/lms/image/upload/v1/photos/rahim.jpg",
  "role": "student",
  "provider": "credentials",
  "bio": "আমি একজন ওয়েব ডেভেলপার। প্রোগ্রামিং শিখতে ভালোবাসি।",
  "dateOfBirth": "1995-05-20T00:00:00.000Z",
  "address": { "city": "ঢাকা", "country": "বাংলাদেশ" },
  "socialLinks": {
    "website": "https://rahim-portfolio.com",
    "linkedin": "https://linkedin.com/in/rahim",
    "github": "https://github.com/rahim"
  },
  "stats": {
    "enrolledCourses": 5,
    "completedCourses": 2,
    "totalCertificates": 2,
    "totalTimeSpent": 1250,
    "totalCourses": 0,
    "totalStudents": 0,
    "totalEarnings": 0,
    "rating": 0,
    "totalReviews": 0
  },
  "preferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "theme": "dark",
    "language": "bn"
  },
  "loginAttempts": 0,
  "status": "active",
  "isVerified": true,
  "lastLogin": "2024-03-09T10:00:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-03-09T14:30:00.000Z"
}
```

> 💡 Notifications এখন আলাদা collection এ — `userId` দিয়ে query করা হয়।

---

---

## 2️⃣ COLLECTION: `courses`

### কী কী Data থাকবে:
- Course basic info (title, category, pricing)
- Modules → Lessons (embedded, nested)
- FAQs (embedded)
- Reviews (embedded)
- Course Stats (denormalized)

### Schema (TypeScript):

```typescript
// src/models/Course.ts

import mongoose, { Schema, Document } from "mongoose";

// ─── Sub-Interfaces ───────────────────────────────────

export interface ILesson {
  _id: mongoose.Types.ObjectId;
  title: string;
  type: "video" | "text" | "quiz" | "assignment" | "live";
  content: string;               // video URL or text content
  duration?: number;             // minutes (for video)
  order: number;
  isFree: boolean;               // preview available without enrollment?
  isPublished: boolean;
  resources?: {                  // downloadable files
    title: string;
    url: string;
    type: "pdf" | "doc" | "zip" | "other";
  }[];
}

export interface IModule {
  _id: mongoose.Types.ObjectId;
  title: string;
  order: number;
  lessons: ILesson[];
}

export interface IFAQ {
  _id: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  order: number;
}

export interface IReview {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  studentPhoto?: string;
  rating: number;                // 1-5
  comment: string;
  isVerified: boolean;           // verified purchase?
  createdAt: Date;
}

export interface ICourseDocument extends Document {
  instructorId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  category: string;
  level: "Basic" | "Intermediate" | "Advanced";
  description: string;
  shortDescription?: string;
  language: "English" | "Bengali" | "Both";
  tags: string[];

  // Media
  coverImage: { type: "upload" | "url"; url: string };
  salesVideo?: { type: "upload" | "url"; url: string };

  // Content (Embedded)
  modules: IModule[];
  faqs: IFAQ[];
  reviews: IReview[];

  // Pricing
  pricing: {
    type: "paid" | "free";
    price: number;
    discountPrice?: number;
    currency: "BDT" | "USD";
    enrollmentLimit?: number;
    accessDuration: "lifetime" | "1year" | "6months" | "3months";
  };

  // Stats (denormalized for instant load)
  stats: {
    enrolledCount: number;
    completedCount: number;
    rating: number;
    reviewCount: number;
    totalRevenue: number;
    completionRate: number;
  };

  visibility: "public" | "private";
  status: "draft" | "published" | "archived";

  createdAt: Date;
  updatedAt: Date;
}

// ─── Sub-Schemas ─────────────────────────────────────

const LessonSchema = new Schema<ILesson>({
  title:       { type: String, required: true },
  type:        { type: String, enum: ["video", "text", "quiz", "assignment", "live"], required: true },
  content:     { type: String, required: true },
  duration:    { type: Number },
  order:       { type: Number, required: true },
  isFree:      { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  resources:   [{ title: String, url: String, type: String }],
});

const ModuleSchema = new Schema<IModule>({
  title:   { type: String, required: true },
  order:   { type: Number, required: true },
  lessons: { type: [LessonSchema], default: [] },
});

const FAQSchema = new Schema<IFAQ>({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  order:    { type: Number, default: 0 },
});

const ReviewSchema = new Schema<IReview>({
  studentId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
  studentName:  { type: String, required: true },
  studentPhoto: { type: String },
  rating:       { type: Number, min: 1, max: 5, required: true },
  comment:      { type: String, required: true },
  isVerified:   { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now },
});

// ─── Main Schema ──────────────────────────────────────

const CourseSchema = new Schema<ICourseDocument>(
  {
    instructorId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true },
    category:        { type: String, required: true },
    level:           { type: String, enum: ["Basic", "Intermediate", "Advanced"], required: true },
    description:     { type: String, required: true },
    shortDescription:{ type: String },
    language:        { type: String, enum: ["English", "Bengali", "Both"], default: "Bengali" },
    tags:            [{ type: String }],

    coverImage: {
      type: { type: String, enum: ["upload", "url"] },
      url:  { type: String },
    },
    salesVideo: {
      type: { type: String, enum: ["upload", "url"] },
      url:  { type: String },
    },

    modules: { type: [ModuleSchema], default: [] },
    faqs:    { type: [FAQSchema], default: [] },
    reviews: { type: [ReviewSchema], default: [] },

    pricing: {
      type:            { type: String, enum: ["paid", "free"], default: "paid" },
      price:           { type: Number, default: 0 },
      discountPrice:   { type: Number },
      currency:        { type: String, enum: ["BDT", "USD"], default: "BDT" },
      enrollmentLimit: { type: Number },
      accessDuration:  { type: String, enum: ["lifetime", "1year", "6months", "3months"], default: "lifetime" },
    },

    stats: {
      enrolledCount:  { type: Number, default: 0 },
      completedCount: { type: Number, default: 0 },
      rating:         { type: Number, default: 0 },
      reviewCount:    { type: Number, default: 0 },
      totalRevenue:   { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
    },

    visibility: { type: String, enum: ["public", "private"], default: "public" },
    status:     { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  },
  { timestamps: true, collection: "courses" }
);

// ─── Indexes ──────────────────────────────────────────
CourseSchema.index({ slug: 1 });
CourseSchema.index({ instructorId: 1 });
CourseSchema.index({ category: 1, status: 1 });
CourseSchema.index({ "stats.rating": -1 });
CourseSchema.index({ tags: 1 });

// ─── Auto-generate slug ───────────────────────────────
CourseSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }
  next();
});

export const Course = mongoose.models.Course || mongoose.model<ICourseDocument>("Course", CourseSchema);
```

### Real JSON Example:

```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c000",
  "instructorId": "64f8a1b2c3d4e5f6a7b8c999",
  "title": "Complete JavaScript Fundamentals",
  "slug": "complete-javascript-fundamentals",
  "category": "Programming",
  "level": "Basic",
  "language": "Bengali",
  "shortDescription": "জাভাস্ক্রিপ্টের বেসিক থেকে অ্যাডভান্স শিখুন",
  "coverImage": {
    "type": "url",
    "url": "https://res.cloudinary.com/lms/image/upload/v1/covers/js.jpg"
  },
  "pricing": {
    "type": "paid",
    "price": 2500,
    "discountPrice": 1999,
    "currency": "BDT",
    "accessDuration": "lifetime"
  },
  "modules": [
    {
      "_id": "mod_001",
      "title": "JavaScript Basics",
      "order": 1,
      "lessons": [
        {
          "_id": "les_001",
          "title": "Variables এবং Data Types",
          "type": "video",
          "content": "https://res.cloudinary.com/lms/video/upload/v1/lessons/js-variables.mp4",
          "duration": 15,
          "order": 1,
          "isFree": true,
          "isPublished": true,
          "resources": [
            {
              "title": "Variables Cheatsheet",
              "url": "https://res.cloudinary.com/lms/raw/upload/v1/resources/cheatsheet.pdf",
              "type": "pdf"
            }
          ]
        },
        {
          "_id": "les_002",
          "title": "Functions Quiz",
          "type": "quiz",
          "content": "{\"questions\":[{\"q\":\"কোনটি সঠিক?\",\"options\":[\"A\",\"B\",\"C\"],\"correct\":0}]}",
          "order": 2,
          "isFree": false,
          "isPublished": true
        }
      ]
    }
  ],
  "faqs": [
    {
      "_id": "faq_001",
      "question": "এই কোর্সের জন্য কি পূর্ব অভিজ্ঞতা দরকার?",
      "answer": "না, একদম beginner হলেও এই কোর্স করতে পারবেন।",
      "order": 1
    }
  ],
  "reviews": [
    {
      "_id": "rev_001",
      "studentId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "studentName": "রহিম উদ্দিন",
      "studentPhoto": "https://res.cloudinary.com/lms/image/upload/v1/photos/rahim.jpg",
      "rating": 5,
      "comment": "অসাধারণ কোর্স! খুবই সহজভাবে বুঝিয়েছেন।",
      "isVerified": true,
      "createdAt": "2024-03-05T16:45:00.000Z"
    }
  ],
  "stats": {
    "enrolledCount": 1250,
    "completedCount": 890,
    "rating": 4.8,
    "reviewCount": 245,
    "totalRevenue": 156000,
    "completionRate": 71.2
  },
  "visibility": "public",
  "status": "published",
  "tags": ["javascript", "programming", "web-development"],
  "createdAt": "2024-02-01T10:00:00.000Z",
  "updatedAt": "2024-03-09T12:00:00.000Z"
}
```

---

---

## 3️⃣ COLLECTION: `enrollments`

### কী কী Data থাকবে:
- Student ↔ Course সম্পর্ক
- Progress tracking (completed lessons, %)
- Certificate info
- Quiz results

### Schema (TypeScript):

```typescript
// src/models/Enrollment.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IQuizResult {
  lessonId: mongoose.Types.ObjectId;
  score: number;
  maxScore: number;
  percentage: number;
  submittedAt: Date;
  answers: any[];
}

export interface IEnrollmentDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;

  // Progress
  progress: {
    completedLessons: mongoose.Types.ObjectId[];   // lesson IDs
    currentLessonId?: mongoose.Types.ObjectId;
    progressPercentage: number;                    // 0-100
    totalTimeSpent: number;                        // minutes
    lastAccessedAt?: Date;
  };

  // Quiz Results
  quizResults: IQuizResult[];

  // Certificate
  certificate: {
    issued: boolean;
    issuedAt?: Date;
    certificateUrl?: string;
    certificateId?: string;
  };

  // Denormalized (fast query এর জন্য)
  courseName: string;
  courseImage: string;
  instructorName: string;

  status: "active" | "completed" | "dropped" | "expired";
  enrolledAt: Date;
  completedAt?: Date;
  expiresAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ─── Main Schema ──────────────────────────────────────

const EnrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId:  { type: Schema.Types.ObjectId, ref: "Course", required: true },

    progress: {
      completedLessons:   { type: [Schema.Types.ObjectId], default: [] },
      currentLessonId:    { type: Schema.Types.ObjectId },
      progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
      totalTimeSpent:     { type: Number, default: 0 },
      lastAccessedAt:     { type: Date },
    },

    quizResults: [
      {
        lessonId:    { type: Schema.Types.ObjectId, required: true },
        score:       { type: Number, required: true },
        maxScore:    { type: Number, required: true },
        percentage:  { type: Number, required: true },
        submittedAt: { type: Date, default: Date.now },
        answers:     { type: Schema.Types.Mixed },
      },
    ],

    certificate: {
      issued:         { type: Boolean, default: false },
      issuedAt:       { type: Date },
      certificateUrl: { type: String },
      certificateId:  { type: String },
    },

    // Denormalized fields
    courseName:     { type: String, required: true },
    courseImage:    { type: String, default: "" },
    instructorName: { type: String, required: true },

    status:      { type: String, enum: ["active", "completed", "dropped", "expired"], default: "active" },
    enrolledAt:  { type: Date, default: Date.now },
    completedAt: { type: Date },
    expiresAt:   { type: Date },
  },
  { timestamps: true, collection: "enrollments" }
);

// ─── Indexes ──────────────────────────────────────────
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true }); // একই course দুবার enroll নয়
EnrollmentSchema.index({ studentId: 1, status: 1 });
EnrollmentSchema.index({ courseId: 1 });
EnrollmentSchema.index({ "progress.progressPercentage": 1 });

export const Enrollment = mongoose.models.Enrollment || mongoose.model<IEnrollmentDocument>("Enrollment", EnrollmentSchema);
```

### Real JSON Example:

```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8e001",
  "studentId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "courseId": "64f8a1b2c3d4e5f6a7b8c000",
  "progress": {
    "completedLessons": [
      "64f8a1b2c3d4e5f6a7b8les01",
      "64f8a1b2c3d4e5f6a7b8les02",
      "64f8a1b2c3d4e5f6a7b8les03"
    ],
    "currentLessonId": "64f8a1b2c3d4e5f6a7b8les04",
    "progressPercentage": 60,
    "totalTimeSpent": 180,
    "lastAccessedAt": "2024-03-09T14:30:00.000Z"
  },
  "quizResults": [
    {
      "lessonId": "64f8a1b2c3d4e5f6a7b8les02",
      "score": 8,
      "maxScore": 10,
      "percentage": 80,
      "submittedAt": "2024-03-02T15:30:00.000Z",
      "answers": [0, 1, 2, 1, 0, 1, 2, 0, 1, 2]
    }
  ],
  "certificate": {
    "issued": false
  },
  "courseName": "Complete JavaScript Fundamentals",
  "courseImage": "https://res.cloudinary.com/lms/image/upload/v1/covers/js.jpg",
  "instructorName": "জন স্মিথ",
  "status": "active",
  "enrolledAt": "2024-03-01T10:00:00.000Z",
  "createdAt": "2024-03-01T10:00:00.000Z",
  "updatedAt": "2024-03-09T14:30:00.000Z"
}
```

---

---

## 4️⃣ COLLECTION: `transactions`

### কী কী Data থাকবে:
- Payment records (student → course)
- Payout records (LMS → instructor)
- Refund records
- Commission tracking

### Schema (TypeScript):

```typescript
// src/models/Transaction.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ITransactionDocument extends Document {
  // Participants
  studentId?: mongoose.Types.ObjectId;
  instructorId?: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;

  // Transaction Core
  type: "payment" | "payout" | "refund" | "commission";
  amount: number;
  netAmount?: number;            // after commission deduction
  commissionAmount?: number;     // platform commission
  commissionRate?: number;       // % (e.g. 30 for 30%)
  currency: "BDT" | "USD";
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";

  // Payment Details (Student pays)
  paymentMethod?: "bkash" | "nagad" | "rocket" | "card" | "bank_transfer";
  paymentId?: string;            // bKash/Nagad transaction ID
  gatewayResponse?: any;         // raw response from payment gateway

  // Payout Details (Platform pays instructor)
  payoutMethod?: "bkash" | "nagad" | "bank";
  accountDetails?: string;       // account number (masked)
  payoutReference?: string;

  // Metadata
  description: string;
  notes?: string;
  invoiceNumber?: string;

  // Denormalized (fast query)
  courseName?: string;
  studentName?: string;
  instructorName?: string;

  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Main Schema ──────────────────────────────────────

const TransactionSchema = new Schema<ITransactionDocument>(
  {
    studentId:    { type: Schema.Types.ObjectId, ref: "User" },
    instructorId: { type: Schema.Types.ObjectId, ref: "User" },
    courseId:     { type: Schema.Types.ObjectId, ref: "Course" },

    type:             { type: String, enum: ["payment", "payout", "refund", "commission"], required: true },
    amount:           { type: Number, required: true, min: 0 },
    netAmount:        { type: Number, min: 0 },
    commissionAmount: { type: Number, min: 0 },
    commissionRate:   { type: Number, min: 0, max: 100 },
    currency:         { type: String, enum: ["BDT", "USD"], default: "BDT" },
    status:           { type: String, enum: ["pending", "completed", "failed", "cancelled", "refunded"], default: "pending" },

    paymentMethod:   { type: String, enum: ["bkash", "nagad", "rocket", "card", "bank_transfer"] },
    paymentId:       { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },

    payoutMethod:    { type: String, enum: ["bkash", "nagad", "bank"] },
    accountDetails:  { type: String },
    payoutReference: { type: String },

    description:   { type: String, required: true },
    notes:         { type: String },
    invoiceNumber: { type: String },

    // Denormalized
    courseName:     { type: String },
    studentName:    { type: String },
    instructorName: { type: String },

    processedAt: { type: Date },
  },
  { timestamps: true, collection: "transactions" }
);

// ─── Indexes ──────────────────────────────────────────
TransactionSchema.index({ studentId: 1, type: 1, createdAt: -1 });
TransactionSchema.index({ instructorId: 1, type: 1, status: 1 });
TransactionSchema.index({ courseId: 1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ paymentId: 1 });
TransactionSchema.index({ invoiceNumber: 1 });

export const Transaction = mongoose.models.Transaction || mongoose.model<ITransactionDocument>("Transaction", TransactionSchema);
```

### Real JSON Example (Payment):

```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8t001",
  "studentId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "instructorId": "64f8a1b2c3d4e5f6a7b8c999",
  "courseId": "64f8a1b2c3d4e5f6a7b8c000",
  "type": "payment",
  "amount": 1999,
  "netAmount": 1399,
  "commissionAmount": 600,
  "commissionRate": 30,
  "currency": "BDT",
  "status": "completed",
  "paymentMethod": "bkash",
  "paymentId": "8BG108263",
  "gatewayResponse": {
    "trxID": "8BG108263",
    "payerReference": "01712345678",
    "customerMsisdn": "01712345678",
    "transactionStatus": "Completed"
  },
  "description": "Course enrollment: Complete JavaScript Fundamentals",
  "invoiceNumber": "INV-2024-001234",
  "courseName": "Complete JavaScript Fundamentals",
  "studentName": "রহিম উদ্দিন",
  "instructorName": "জন স্মিথ",
  "processedAt": "2024-03-08T09:16:30.000Z",
  "createdAt": "2024-03-08T09:15:00.000Z",
  "updatedAt": "2024-03-08T09:16:30.000Z"
}
```

### Real JSON Example (Payout):

```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8t002",
  "instructorId": "64f8a1b2c3d4e5f6a7b8c999",
  "type": "payout",
  "amount": 15000,
  "currency": "BDT",
  "status": "completed",
  "payoutMethod": "bkash",
  "accountDetails": "017*****678",
  "payoutReference": "PAYOUT-2024-03-001",
  "description": "Monthly payout - March 2024",
  "instructorName": "জন স্মিথ",
  "processedAt": "2024-03-31T12:00:00.000Z",
  "createdAt": "2024-03-31T11:00:00.000Z",
  "updatedAt": "2024-03-31T12:00:00.000Z"
}
```

---

---

## 📁 Final Models Index

```typescript
// src/models/index.ts

export { User } from "./User";
export { Course } from "./Course";
export { Enrollment } from "./Enrollment";
export { Transaction } from "./Transaction";
export { Message } from "./Message";
export { Notification } from "./Notification";
```

---

## 5️⃣ COLLECTION: `messages`

### কী কী Data থাকবে:
- Course group chat messages
- Student ↔ Instructor private messages
- Real-time socket এর জন্য roomId system

### কেন আলাদা Collection?
- একটি active course এ হাজার হাজার message হতে পারে
- User বা Course document এ embed করলে document 16MB limit পার হবে
- Socket.io দিয়ে real-time insert হয় — আলাদা রাখা সহজ

### Schema (TypeScript):

```typescript
// src/models/Message.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IMessageDocument extends Document {
  // roomId format:
  //   course chat  → "course_<courseId>"
  //   private chat → "private_<smallerId>_<largerId>"  (sorted user IDs)
  roomId: string;

  senderId: mongoose.Types.ObjectId;
  senderName: string;           // denormalized
  senderPhoto?: string;         // denormalized
  senderRole: "student" | "instructor" | "admin";

  content: string;
  type: "text" | "image" | "file" | "system";
  fileUrl?: string;             // image/file URL (cloudinary)

  readBy: mongoose.Types.ObjectId[];   // কারা পড়েছে
  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessageDocument>(
  {
    roomId: { type: String, required: true, index: true },

    senderId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderName:  { type: String, required: true },
    senderPhoto: { type: String },
    senderRole:  { type: String, enum: ["student", "instructor", "admin"], required: true },

    content:   { type: String, required: true },
    type:      { type: String, enum: ["text", "image", "file", "system"], default: "text" },
    fileUrl:   { type: String },

    readBy:    [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true, collection: "messages" }
);

// ─── Indexes ──────────────────────────────────────────
MessageSchema.index({ roomId: 1, createdAt: -1 });  // room এর latest messages fast load
MessageSchema.index({ senderId: 1 });

export const Message = mongoose.models.Message || mongoose.model<IMessageDocument>("Message", MessageSchema);
```

### Real JSON Examples:

**Course Group Chat:**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8m001",
  "roomId": "course_64f8a1b2c3d4e5f6a7b8c000",
  "senderId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "senderName": "রহিম উদ্দিন",
  "senderPhoto": "https://res.cloudinary.com/lms/image/upload/v1/photos/rahim.jpg",
  "senderRole": "student",
  "content": "Module 2 এর lesson 3 তে কি async/await explain করা হয়েছে?",
  "type": "text",
  "readBy": ["64f8a1b2c3d4e5f6a7b8c999"],
  "isDeleted": false,
  "createdAt": "2024-03-09T15:30:00.000Z",
  "updatedAt": "2024-03-09T15:30:00.000Z"
}
```

**Private Chat (Student ↔ Instructor):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8m002",
  "roomId": "private_64f8a1b2c3d4e5f6a7b8c9d0_64f8a1b2c3d4e5f6a7b8c999",
  "senderId": "64f8a1b2c3d4e5f6a7b8c999",
  "senderName": "জন স্মিথ",
  "senderPhoto": "https://res.cloudinary.com/lms/image/upload/v1/photos/john.jpg",
  "senderRole": "instructor",
  "content": "হ্যাঁ, lesson 3 তে বিস্তারিত আছে। তুমি কোন part বুঝোনি?",
  "type": "text",
  "readBy": [],
  "isDeleted": false,
  "createdAt": "2024-03-09T15:45:00.000Z",
  "updatedAt": "2024-03-09T15:45:00.000Z"
}
```

**API Usage:**
```typescript
// Room এর সব messages load (pagination সহ)
const messages = await Message.find({ roomId: "course_64f8..." })
  .sort({ createdAt: -1 })
  .limit(50)
  .skip(page * 50);

// Unread count
const unread = await Message.countDocuments({
  roomId: "course_64f8...",
  readBy: { $nin: [userId] },
  senderId: { $ne: userId }
});
```

---

---

## 6️⃣ COLLECTION: `notifications`

### কী কী Data থাকবে:
- Per-user notifications (payment, certificate, course update)
- Broadcast notifications (admin সব user কে পাঠায়)
- Role-based notifications (সব instructor কে পাঠানো)

### কেন আলাদা Collection?
- Admin একটি notification তৈরি করলে সব student দেখবে — embed করলে হাজার document update করতে হত
- `isBroadcast: true` + `targetRole` দিয়ে একটাই document রাখলেই হয়
- `/api/notifications` route আলাদা আছে → আলাদা collection logical

### Schema (TypeScript):

```typescript
// src/models/Notification.ts

import mongoose, { Schema, Document } from "mongoose";

export interface INotificationDocument extends Document {
  // ── Target ──
  // userId = null মানে broadcast (সবার জন্য)
  userId?: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;

  // ── Content ──
  type: "course_update" | "payment" | "certificate" | "announcement" | "message" | "system";
  title: string;
  message: string;
  actionUrl?: string;

  // ── Broadcast Settings ──
  isBroadcast: boolean;
  targetRole?: "all" | "student" | "instructor";  // broadcast হলে কার জন্য

  // ── Read Status ──
  isRead: boolean;
  readAt?: Date;

  createdBy?: mongoose.Types.ObjectId;   // কোন admin পাঠিয়েছে
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: "User" },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },

    type: {
      type: String,
      enum: ["course_update", "payment", "certificate", "announcement", "message", "system"],
      required: true,
    },
    title:     { type: String, required: true },
    message:   { type: String, required: true },
    actionUrl: { type: String },

    isBroadcast: { type: Boolean, default: false },
    targetRole:  { type: String, enum: ["all", "student", "instructor"] },

    isRead:    { type: Boolean, default: false },
    readAt:    { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, collection: "notifications" }
);

// ─── Indexes ──────────────────────────────────────────
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });  // user এর unread notifications
NotificationSchema.index({ isBroadcast: 1, targetRole: 1 });         // broadcast fetch
NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.models.Notification || mongoose.model<INotificationDocument>("Notification", NotificationSchema);
```

### Real JSON Examples:

**Per-User Notification (Payment complete):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8n001",
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "courseId": "64f8a1b2c3d4e5f6a7b8c000",
  "type": "payment",
  "title": "পেমেন্ট সফল! 🎉",
  "message": "Complete JavaScript Fundamentals কোর্সে enroll সম্পন্ন হয়েছে।",
  "actionUrl": "/dashboard/student/courses",
  "isBroadcast": false,
  "isRead": false,
  "createdAt": "2024-03-08T09:16:30.000Z",
  "updatedAt": "2024-03-08T09:16:30.000Z"
}
```

**Certificate Notification:**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8n002",
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "courseId": "64f8a1b2c3d4e5f6a7b8c000",
  "type": "certificate",
  "title": "Certificate Ready! 🏆",
  "message": "আপনি JavaScript Fundamentals সফলভাবে সম্পন্ন করেছেন। Certificate download করুন।",
  "actionUrl": "/dashboard/student/certificates",
  "isBroadcast": false,
  "isRead": true,
  "readAt": "2024-03-10T08:00:00.000Z",
  "createdAt": "2024-03-09T18:00:00.000Z",
  "updatedAt": "2024-03-10T08:00:00.000Z"
}
```

**Broadcast Notification (Admin → সব Student):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8n003",
  "userId": null,
  "type": "announcement",
  "title": "🎯 নতুন কোর্স Launch হচ্ছে!",
  "message": "আগামীকাল Python Machine Learning কোর্স launch হবে। Early bird discount পাবেন।",
  "actionUrl": "/courses",
  "isBroadcast": true,
  "targetRole": "student",
  "isRead": false,
  "createdBy": "64f8a1b2c3d4e5f6a7b8admin",
  "createdAt": "2024-03-09T10:00:00.000Z",
  "updatedAt": "2024-03-09T10:00:00.000Z"
}
```

**API Usage:**
```typescript
// User এর সব notifications (personal + broadcast একসাথে)
const notifications = await Notification.find({
  $or: [
    { userId: currentUserId },                          // personal
    { isBroadcast: true, targetRole: { $in: ["all", userRole] } }  // broadcast
  ]
})
  .sort({ createdAt: -1 })
  .limit(20);

// Unread count (bell icon badge)
const unreadCount = await Notification.countDocuments({
  $or: [
    { userId: currentUserId, isRead: false },
    { isBroadcast: true, targetRole: { $in: ["all", userRole] }, isRead: false }
  ]
});

// Admin broadcast পাঠানো
await Notification.create({
  type: "announcement",
  title: "নতুন feature!",
  message: "Dashboard এ নতুন analytics যোগ হয়েছে।",
  isBroadcast: true,
  targetRole: "all",
  createdBy: adminId
});
```

---

## 🔗 Collection Relationships (Visual)

```
users (1) ──────────────── (many) enrollments
  │                                    │
  │                                    └── studentId, courseId
  │
  └── instructorId ──── (many) courses (1)
                              │
                              ├── modules → lessons  (embedded)
                              ├── reviews            (embedded)
                              └── faqs               (embedded)

users ──── (many) transactions ──── courses
              studentId / instructorId / courseId

users ──── (many) notifications    (personal: userId set)
           (many) notifications    (broadcast: userId null, targetRole set)

users ──── (many) messages ←── roomId: "course_<id>" or "private_<id>_<id>"
courses ───────────────────┘
```

---

## 📊 কোন Data কোথায় থাকবে?

| Data | Collection | কেন |
|------|-----------|-----|
| User profile, stats | `users` | সবসময় user সাথে load |
| Course lessons | `courses.modules[].lessons[]` | Course page এ একসাথে load |
| Course reviews | `courses.reviews[]` | Course detail page এ দরকার |
| Course FAQs | `courses.faqs[]` | Course detail page এ দরকার |
| Student progress | `enrollments.progress` | Per-enrollment data |
| Quiz results | `enrollments.quizResults[]` | Per-enrollment data |
| Certificate | `enrollments.certificate` | Per-enrollment data |
| Payment records | `transactions` | Financial audit trail |
| Chat messages | `messages` | Real-time, অনেক বেশি data |
| Notifications | `notifications` | Broadcast support দরকার |

---

## ⚡ Fast Query Examples

```typescript
// 1. Student Dashboard (1 query)
const user = await User.findById(userId)
  .select("name photoURL stats notifications preferences");

// 2. Student's enrolled courses (1 query, no join)
const enrollments = await Enrollment.find({ studentId: userId, status: "active" })
  .sort({ enrolledAt: -1 });
// courseName, courseImage ইতিমধ্যে denormalized আছে!

// 3. Course detail page (1 query)
const course = await Course.findOne({ slug })
  .populate("instructorId", "name photoURL bio stats.rating");
// modules, reviews, faqs সব embedded!

// 4. Notification bell (1 query)
const notifications = await Notification.find({
  $or: [
    { userId: currentUserId },
    { isBroadcast: true, targetRole: { $in: ["all", userRole] } }
  ]
}).sort({ createdAt: -1 }).limit(20);

// 5. Course chat (1 query)
const messages = await Message.find({ roomId: `course_${courseId}` })
  .sort({ createdAt: -1 }).limit(50);

// 6. Admin dashboard stats (parallel)
const [users, courses, enrollments, revenue] = await Promise.all([
  User.countDocuments(),
  Course.countDocuments({ status: "published" }),
  Enrollment.countDocuments(),
  Transaction.aggregate([
    { $match: { type: "payment", status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ])
]);
```

---

## 🎯 Final Summary

```
✅ মাত্র 6টি Collection  (14+ এর বদলে)
✅ Embedded lessons/reviews → কম JOIN, fast course page
✅ Denormalized stats → Instant dashboard load
✅ Broadcast notifications → 1 document, সব user দেখে
✅ roomId system → Flexible chat (group + private)
✅ Proper indexes → Fast queries
✅ TypeScript interfaces → Type safety
```