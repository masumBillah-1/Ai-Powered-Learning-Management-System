# 🗄️ Complete Database Schema & API Structure for Dashboard

## 📋 TABLE OF CONTENTS
1. [Database Collections Overview](#database-collections-overview)
2. [Detailed Schema Definitions](#detailed-schema-definitions)
3. [Data Relationships](#data-relationships)
4. [API Endpoints Structure](#api-endpoints-structure)
5. [Dashboard Data Requirements](#dashboard-data-requirements)
6. [Sample Data Examples](#sample-data-examples)

---

## 🗂️ DATABASE COLLECTIONS OVERVIEW

### Core Collections (12 Total)
```
1. users           - All users (student, instructor, admin)
2. courses         - Course content and metadata
3. enrollments     - Student-course relationships
4. lessons         - Individual lesson content
5. assignments     - Course assignments
6. submissions     - Assignment submissions
7. quizzes         - Quiz questions and metadata
8. quizResults     - Student quiz attempts and scores
9. certificates    - Earned certificates
10. announcements  - Platform announcements
11. transactions   - Payment records
12. payouts        - Instructor payout requests
```

### Supporting Collections (6 Total)
```
13. categories     - Course categories
14. notifications  - User notifications
15. reviews        - Course reviews and ratings
16. messages       - Live chat messages (already exists)
17. progress       - Lesson progress tracking
18. analytics      - Platform analytics data
```

---
## 🏗️ DETAILED SCHEMA DEFINITIONS

### 1. Users Collection (Enhanced)
```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  photoURL?: string;
  role: "student" | "instructor" | "admin";
  provider: "credentials" | "google" | "github";
  
  // Profile Information
  bio?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  
  // Social Links
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  
  // Instructor Specific
  instructorInfo?: {
    expertise: string[];
    experience: number; // years
    education: string;
    verified: boolean;
    rating: number;
    totalStudents: number;
    totalCourses: number;
    joinedDate: Date;
  };
  
  // Student Specific
  studentInfo?: {
    enrolledCourses: number;
    completedCourses: number;
    totalCertificates: number;
    totalQuizzesTaken: number;
    averageScore: number;
  };
  
  // Security
  resetToken?: string;
  resetTokenExpiry?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  lastLogin?: Date;
  
  // Settings
  preferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    courseUpdates: boolean;
    marketingEmails: boolean;
    theme: "light" | "dark" | "auto";
    language: "en" | "bn";
  };
  
  // Status
  status: "active" | "suspended" | "pending";
  isVerified: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Courses Collection (Enhanced)
```typescript
interface ICourse {
  _id: ObjectId;
  instructorId: ObjectId; // ref: User
  
  // Basic Info
  title: string;
  slug: string; // URL-friendly title
  description: string;
  shortDescription: string;
  categoryId: ObjectId; // ref: Category
  subcategory?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: "English" | "Bengali" | "Both";
  
  // Media
  coverImage: {
    type: "upload" | "url";
    url: string;
    alt?: string;
  };
  salesVideo?: {
    type: "upload" | "url";
    url: string;
    duration?: number;
  };
  
  // Content Structure
  modules: IModule[];
  totalLessons: number;
  totalDuration: number; // in minutes
  
  // Pricing
  pricing: {
    type: "free" | "paid";
    price: number;
    currency: "BDT" | "USD";
    discountPrice?: number;
    discountExpiry?: Date;
    enrollmentLimit?: number;
    accessDuration: "lifetime" | "1year" | "6months" | "3months";
  };
  
  // Requirements & Outcomes
  requirements: string[];
  whatYouWillLearn: string[];
  targetAudience: string[];
  
  // FAQ
  faqs: {
    question: string;
    answer: string;
  }[];
  
  // Status & Visibility
  status: "draft" | "pending" | "published" | "rejected";
  visibility: "public" | "private";
  publishedAt?: Date;
  
  // Statistics
  enrolledCount: number;
  completedCount: number;
  rating: number;
  totalReviews: number;
  totalRevenue: number;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

interface IModule {
  _id: ObjectId;
  title: string;
  description?: string;
  order: number;
  lessons: ObjectId[]; // ref: Lesson
  isPreview: boolean; // Free preview module
}
```

### 3. Lessons Collection (New)
```typescript
interface ILesson {
  _id: ObjectId;
  courseId: ObjectId; // ref: Course
  moduleId: ObjectId; // ref: Module
  
  title: string;
  description?: string;
  type: "video" | "text" | "quiz" | "assignment" | "live";
  order: number;
  
  // Content based on type
  content: {
    // For video lessons
    videoUrl?: string;
    videoDuration?: number; // seconds
    videoProvider?: "cloudinary" | "youtube" | "vimeo";
    
    // For text lessons
    textContent?: string; // HTML content
    attachments?: {
      name: string;
      url: string;
      type: string;
      size: number;
    }[];
    
    // For quiz lessons
    quizId?: ObjectId; // ref: Quiz
    
    // For assignment lessons
    assignmentId?: ObjectId; // ref: Assignment
  };
  
  // Access Control
  isPreview: boolean; // Free preview lesson
  isCompleted: boolean; // Auto-calculated
  
  // Resources
  resources: {
    name: string;
    url: string;
    type: "pdf" | "doc" | "link" | "code";
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}
```
### 4. Enrollments Collection
```typescript
interface IEnrollment {
  _id: ObjectId;
  studentId: ObjectId; // ref: User
  courseId: ObjectId; // ref: Course
  
  // Enrollment Details
  enrolledAt: Date;
  completedAt?: Date;
  expiresAt?: Date; // For time-limited courses
  
  // Progress Tracking
  progress: {
    completedLessons: ObjectId[]; // ref: Lesson
    totalLessons: number;
    completionPercentage: number;
    lastAccessedLesson?: ObjectId;
    lastAccessedAt?: Date;
    totalTimeSpent: number; // minutes
  };
  
  // Payment Info
  paymentInfo?: {
    transactionId: ObjectId; // ref: Transaction
    amount: number;
    currency: string;
    paymentMethod: string;
    paidAt: Date;
  };
  
  // Status
  status: "active" | "completed" | "expired" | "refunded";
  
  // Certificate
  certificateId?: ObjectId; // ref: Certificate
  certificateEarnedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Assignments Collection
```typescript
interface IAssignment {
  _id: ObjectId;
  courseId: ObjectId; // ref: Course
  lessonId?: ObjectId; // ref: Lesson (if part of lesson)
  instructorId: ObjectId; // ref: User
  
  title: string;
  description: string;
  instructions: string;
  
  // Assignment Details
  type: "text" | "file" | "code" | "project";
  maxScore: number;
  passingScore: number;
  
  // Timing
  dueDate?: Date;
  allowLateSubmission: boolean;
  lateSubmissionPenalty?: number; // percentage
  
  // Submission Settings
  maxAttempts: number;
  allowedFileTypes?: string[]; // for file assignments
  maxFileSize?: number; // MB
  
  // Resources
  attachments: {
    name: string;
    url: string;
    type: string;
  }[];
  
  // Rubric/Grading Criteria
  gradingCriteria: {
    criterion: string;
    maxPoints: number;
    description: string;
  }[];
  
  status: "draft" | "published" | "archived";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 6. Submissions Collection
```typescript
interface ISubmission {
  _id: ObjectId;
  assignmentId: ObjectId; // ref: Assignment
  studentId: ObjectId; // ref: User
  courseId: ObjectId; // ref: Course
  
  // Submission Content
  content: {
    textAnswer?: string;
    files?: {
      name: string;
      url: string;
      type: string;
      size: number;
    }[];
    codeSubmission?: {
      language: string;
      code: string;
      output?: string;
    };
  };
  
  // Submission Details
  submittedAt: Date;
  isLateSubmission: boolean;
  attemptNumber: number;
  
  // Grading
  grading?: {
    score: number;
    maxScore: number;
    percentage: number;
    gradedBy: ObjectId; // ref: User (instructor)
    gradedAt: Date;
    feedback: string;
    criteriaScores: {
      criterionId: string;
      score: number;
      feedback?: string;
    }[];
  };
  
  status: "submitted" | "graded" | "returned" | "resubmitted";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 7. Quizzes Collection
```typescript
interface IQuiz {
  _id: ObjectId;
  courseId: ObjectId; // ref: Course
  lessonId?: ObjectId; // ref: Lesson
  instructorId: ObjectId; // ref: User
  
  title: string;
  description?: string;
  instructions: string;
  
  // Quiz Settings
  timeLimit?: number; // minutes
  maxAttempts: number;
  passingScore: number; // percentage
  showCorrectAnswers: boolean;
  showScoreImmediately: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  
  // Questions
  questions: {
    _id: ObjectId;
    type: "multiple_choice" | "true_false" | "fill_blank" | "essay";
    question: string;
    explanation?: string;
    points: number;
    
    // For multiple choice
    options?: {
      text: string;
      isCorrect: boolean;
    }[];
    
    // For true/false
    correctAnswer?: boolean;
    
    // For fill in the blank
    correctAnswers?: string[]; // multiple acceptable answers
    
    // For essay
    sampleAnswer?: string;
    gradingRubric?: string;
  }[];
  
  totalQuestions: number;
  totalPoints: number;
  
  status: "draft" | "published" | "archived";
  
  createdAt: Date;
  updatedAt: Date;
}
```
### 8. Quiz Results Collection
```typescript
interface IQuizResult {
  _id: ObjectId;
  quizId: ObjectId; // ref: Quiz
  studentId: ObjectId; // ref: User
  courseId: ObjectId; // ref: Course
  
  // Attempt Details
  attemptNumber: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // seconds
  
  // Answers
  answers: {
    questionId: ObjectId;
    answer: any; // string, boolean, string[] based on question type
    isCorrect?: boolean;
    pointsEarned: number;
    timeSpent?: number; // seconds per question
  }[];
  
  // Results
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  
  // Status
  status: "in_progress" | "completed" | "abandoned";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 9. Certificates Collection
```typescript
interface ICertificate {
  _id: ObjectId;
  studentId: ObjectId; // ref: User
  courseId: ObjectId; // ref: Course
  enrollmentId: ObjectId; // ref: Enrollment
  
  // Certificate Details
  certificateNumber: string; // unique identifier
  title: string;
  description: string;
  
  // Completion Details
  completedAt: Date;
  issuedAt: Date;
  expiresAt?: Date; // for certificates with expiry
  
  // Achievement Data
  finalScore?: number;
  completionTime: number; // days taken to complete
  
  // Certificate Design
  template: "default" | "premium" | "custom";
  certificateUrl: string; // PDF URL
  
  // Verification
  verificationCode: string;
  isVerified: boolean;
  
  // Sharing
  isPublic: boolean; // can be shared publicly
  linkedInShared?: boolean;
  
  status: "active" | "revoked";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 10. Announcements Collection
```typescript
interface IAnnouncement {
  _id: ObjectId;
  authorId: ObjectId; // ref: User (instructor or admin)
  
  title: string;
  content: string; // HTML content
  type: "general" | "course" | "system" | "promotion";
  
  // Targeting
  targetAudience: {
    roles: ("student" | "instructor" | "admin")[];
    courseIds?: ObjectId[]; // specific courses
    userIds?: ObjectId[]; // specific users
  };
  
  // Scheduling
  publishAt?: Date;
  expiresAt?: Date;
  
  // Engagement
  priority: "low" | "medium" | "high" | "urgent";
  allowComments: boolean;
  
  // Media
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  
  // Statistics
  viewCount: number;
  readBy: ObjectId[]; // users who read it
  
  status: "draft" | "scheduled" | "published" | "expired" | "archived";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 11. Transactions Collection
```typescript
interface ITransaction {
  _id: ObjectId;
  userId: ObjectId; // ref: User (student)
  courseId?: ObjectId; // ref: Course
  
  // Transaction Details
  transactionId: string; // payment gateway transaction ID
  type: "course_purchase" | "refund" | "subscription" | "fee";
  
  // Amount Details
  amount: number;
  currency: "BDT" | "USD";
  originalAmount?: number; // before discount
  discountAmount?: number;
  taxAmount?: number;
  
  // Payment Info
  paymentMethod: "card" | "bkash" | "nagad" | "rocket" | "bank";
  paymentGateway: "stripe" | "sslcommerz" | "bkash" | "manual";
  gatewayTransactionId?: string;
  
  // Status
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  
  // Metadata
  metadata?: {
    couponCode?: string;
    referralCode?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  
  // Timestamps
  paidAt?: Date;
  refundedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 12. Payouts Collection
```typescript
interface IPayout {
  _id: ObjectId;
  instructorId: ObjectId; // ref: User
  
  // Payout Details
  amount: number;
  currency: "BDT" | "USD";
  
  // Period
  periodStart: Date;
  periodEnd: Date;
  
  // Breakdown
  earnings: {
    courseId: ObjectId;
    courseName: string;
    enrollments: number;
    revenue: number;
    commission: number; // platform commission
    instructorShare: number;
  }[];
  
  totalRevenue: number;
  platformCommission: number;
  instructorEarnings: number;
  
  // Bank Details
  bankInfo: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
    swiftCode?: string;
  };
  
  // Status
  status: "pending" | "approved" | "processing" | "completed" | "rejected";
  
  // Processing
  requestedAt: Date;
  approvedAt?: Date;
  processedAt?: Date;
  completedAt?: Date;
  
  // Notes
  adminNotes?: string;
  rejectionReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}
```
## 🔗 DATA RELATIONSHIPS

### Primary Relationships
```
User (1) ←→ (Many) Courses [instructorId]
User (1) ←→ (Many) Enrollments [studentId]
Course (1) ←→ (Many) Enrollments [courseId]
Course (1) ←→ (Many) Lessons [courseId]
Course (1) ←→ (Many) Assignments [courseId]
Course (1) ←→ (Many) Quizzes [courseId]
User (1) ←→ (Many) Submissions [studentId]
User (1) ←→ (Many) QuizResults [studentId]
User (1) ←→ (Many) Certificates [studentId]
User (1) ←→ (Many) Transactions [userId]
User (1) ←→ (Many) Payouts [instructorId]
```

### Secondary Relationships
```
Enrollment (1) ←→ (1) Certificate [enrollmentId]
Assignment (1) ←→ (Many) Submissions [assignmentId]
Quiz (1) ←→ (Many) QuizResults [quizId]
Lesson (1) ←→ (1) Quiz [lessonId]
Lesson (1) ←→ (1) Assignment [lessonId]
Transaction (1) ←→ (1) Enrollment [transactionId]
```

---

## 🚀 API ENDPOINTS STRUCTURE

### Authentication APIs
```
POST   /api/auth/register           - User registration
POST   /api/auth/login              - Login with OTP
POST   /api/auth/verify-otp         - Verify OTP
POST   /api/auth/logout             - Logout
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset-password     - Reset password
POST   /api/auth/refresh-token      - Refresh JWT token
```

### User Management APIs
```
GET    /api/users                   - List users (admin only)
GET    /api/users/[id]              - Get user profile
PUT    /api/users/[id]              - Update user profile
DELETE /api/users/[id]              - Delete user (admin only)
POST   /api/users/[id]/suspend      - Suspend user (admin only)
POST   /api/users/[id]/verify       - Verify instructor (admin only)
```

### Course Management APIs
```
GET    /api/courses                 - List all courses (with filters)
POST   /api/courses                 - Create new course
GET    /api/courses/[id]            - Get course details
PUT    /api/courses/[id]            - Update course
DELETE /api/courses/[id]            - Delete course
POST   /api/courses/[id]/publish    - Publish course
POST   /api/courses/[id]/unpublish  - Unpublish course

# Course Content
GET    /api/courses/[id]/lessons    - Get course lessons
POST   /api/courses/[id]/lessons    - Add lesson to course
PUT    /api/lessons/[id]            - Update lesson
DELETE /api/lessons/[id]            - Delete lesson
```

### Enrollment APIs
```
GET    /api/enrollments             - Get user enrollments
POST   /api/enrollments             - Enroll in course
GET    /api/enrollments/[id]        - Get enrollment details
PUT    /api/enrollments/[id]/progress - Update lesson progress
DELETE /api/enrollments/[id]        - Unenroll from course

# Progress Tracking
POST   /api/enrollments/[id]/complete-lesson - Mark lesson complete
GET    /api/enrollments/[id]/progress        - Get detailed progress
```

### Assignment APIs
```
GET    /api/assignments             - List assignments (by course/user)
POST   /api/assignments             - Create assignment
GET    /api/assignments/[id]        - Get assignment details
PUT    /api/assignments/[id]        - Update assignment
DELETE /api/assignments/[id]        - Delete assignment

# Submissions
GET    /api/assignments/[id]/submissions     - Get all submissions
POST   /api/assignments/[id]/submit          - Submit assignment
GET    /api/submissions/[id]                 - Get submission details
PUT    /api/submissions/[id]/grade           - Grade submission
```

### Quiz APIs
```
GET    /api/quizzes                 - List quizzes
POST   /api/quizzes                 - Create quiz
GET    /api/quizzes/[id]            - Get quiz details
PUT    /api/quizzes/[id]            - Update quiz
DELETE /api/quizzes/[id]            - Delete quiz

# Quiz Taking
POST   /api/quizzes/[id]/start      - Start quiz attempt
POST   /api/quizzes/[id]/submit     - Submit quiz answers
GET    /api/quizzes/[id]/results    - Get quiz results
GET    /api/quiz-results/[id]       - Get specific result
```

### Certificate APIs
```
GET    /api/certificates            - List user certificates
GET    /api/certificates/[id]       - Get certificate details
POST   /api/certificates/generate   - Generate certificate
GET    /api/certificates/[id]/verify - Verify certificate
GET    /api/certificates/[id]/download - Download certificate PDF
```

### Announcement APIs
```
GET    /api/announcements           - List announcements
POST   /api/announcements           - Create announcement
GET    /api/announcements/[id]      - Get announcement details
PUT    /api/announcements/[id]      - Update announcement
DELETE /api/announcements/[id]      - Delete announcement
POST   /api/announcements/[id]/read - Mark as read
```

### Transaction & Payment APIs
```
GET    /api/transactions            - List transactions
POST   /api/transactions/create     - Create payment intent
POST   /api/transactions/confirm    - Confirm payment
GET    /api/transactions/[id]       - Get transaction details
POST   /api/transactions/[id]/refund - Process refund
```

### Payout APIs
```
GET    /api/payouts                 - List payout requests
POST   /api/payouts/request         - Request payout
GET    /api/payouts/[id]            - Get payout details
POST   /api/payouts/[id]/approve    - Approve payout (admin)
POST   /api/payouts/[id]/reject     - Reject payout (admin)
POST   /api/payouts/[id]/process    - Process payout (admin)
```

### Analytics & Reports APIs
```
GET    /api/analytics/dashboard     - Dashboard statistics
GET    /api/analytics/courses       - Course analytics
GET    /api/analytics/students      - Student analytics
GET    /api/analytics/revenue       - Revenue analytics
GET    /api/reports/enrollments     - Enrollment reports
GET    /api/reports/performance     - Performance reports
```
## 📊 DASHBOARD DATA REQUIREMENTS

### Student Dashboard Data
```typescript
// Main Dashboard Stats
interface StudentDashboardData {
  stats: {
    enrolledCourses: number;
    activeCourses: number;
    completedCourses: number;
    totalCertificates: number;
    averageScore: number;
  };
  
  recentCourses: {
    courseId: string;
    title: string;
    instructor: string;
    progress: number;
    lastAccessed: Date;
    coverImage: string;
  }[];
  
  upcomingAssignments: {
    assignmentId: string;
    title: string;
    courseName: string;
    dueDate: Date;
    status: "pending" | "submitted";
  }[];
  
  recentQuizScores: {
    quizId: string;
    quizTitle: string;
    courseName: string;
    score: number;
    maxScore: number;
    percentage: number;
    completedAt: Date;
  }[];
  
  recentInvoices: {
    transactionId: string;
    courseName: string;
    amount: number;
    date: Date;
    status: string;
  }[];
}
```

### Instructor Dashboard Data
```typescript
interface InstructorDashboardData {
  stats: {
    totalStudents: number;
    totalCourses: number;
    completionRate: number;
    totalFollowers: number;
    totalLessons: number;
    totalEarnings: number;
    monthlyEarnings: number;
    pendingPayouts: number;
  };
  
  revenueChart: {
    month: string;
    revenue: number;
  }[];
  
  recentEnrollments: {
    studentName: string;
    courseName: string;
    enrolledAt: Date;
    avatar: string;
  }[];
  
  activeCourses: {
    courseId: string;
    title: string;
    enrolledCount: number;
    status: "published" | "draft";
    price: number;
    rating: number;
  }[];
  
  pendingSubmissions: {
    submissionId: string;
    studentName: string;
    assignmentTitle: string;
    courseName: string;
    submittedAt: Date;
  }[];
}
```

### Admin Dashboard Data
```typescript
interface AdminDashboardData {
  stats: {
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    totalRevenue: number;
    monthlyGrowth: {
      students: number;
      instructors: number;
      courses: number;
      revenue: number;
    };
  };
  
  recentTransactions: {
    transactionId: string;
    studentName: string;
    courseName: string;
    amount: number;
    date: Date;
    status: string;
  }[];
  
  pendingActions: {
    type: "course_approval" | "payout_request" | "instructor_verification";
    title: string;
    description: string;
    urgent: boolean;
    createdAt: Date;
  }[];
  
  platformGrowth: {
    date: string;
    users: number;
    courses: number;
    revenue: number;
  }[];
}
```

---

## 📝 SAMPLE DATA EXAMPLES

### Sample User Data
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "আহমেদ করিম",
  "email": "ahmed.karim@example.com",
  "phone": "+8801712345678",
  "role": "instructor",
  "photoURL": "https://cloudinary.com/avatar.jpg",
  "bio": "Web Development এবং Programming এর উপর ১০+ বছরের অভিজ্ঞতা",
  "instructorInfo": {
    "expertise": ["JavaScript", "React", "Node.js", "MongoDB"],
    "experience": 10,
    "education": "Computer Science, BUET",
    "verified": true,
    "rating": 4.8,
    "totalStudents": 1248,
    "totalCourses": 8,
    "joinedDate": "2020-01-15T00:00:00Z"
  },
  "preferences": {
    "emailNotifications": true,
    "theme": "light",
    "language": "bn"
  },
  "status": "active",
  "isVerified": true,
  "createdAt": "2020-01-15T00:00:00Z"
}
```

### Sample Course Data
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "instructorId": "507f1f77bcf86cd799439011",
  "title": "Complete Web Development Bootcamp 2025",
  "slug": "complete-web-development-bootcamp-2025",
  "description": "HTML, CSS, JavaScript, React, Node.js সহ সম্পূর্ণ Web Development শিখুন",
  "categoryId": "507f1f77bcf86cd799439020",
  "level": "Beginner",
  "language": "Bengali",
  "coverImage": {
    "type": "upload",
    "url": "https://cloudinary.com/course-cover.jpg"
  },
  "pricing": {
    "type": "paid",
    "price": 2500,
    "currency": "BDT",
    "discountPrice": 1999,
    "accessDuration": "lifetime"
  },
  "modules": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "HTML Fundamentals",
      "order": 1,
      "lessons": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"]
    }
  ],
  "totalLessons": 156,
  "totalDuration": 2400,
  "requirements": ["Basic computer knowledge", "Internet connection"],
  "whatYouWillLearn": ["HTML/CSS", "JavaScript", "React", "Node.js"],
  "status": "published",
  "enrolledCount": 420,
  "rating": 4.9,
  "totalReviews": 89,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Sample Enrollment Data
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "studentId": "507f1f77bcf86cd799439017",
  "courseId": "507f1f77bcf86cd799439012",
  "enrolledAt": "2024-02-15T00:00:00Z",
  "progress": {
    "completedLessons": ["507f1f77bcf86cd799439014"],
    "totalLessons": 156,
    "completionPercentage": 65,
    "lastAccessedLesson": "507f1f77bcf86cd799439015",
    "lastAccessedAt": "2024-03-01T10:30:00Z",
    "totalTimeSpent": 1200
  },
  "paymentInfo": {
    "transactionId": "507f1f77bcf86cd799439018",
    "amount": 1999,
    "currency": "BDT",
    "paymentMethod": "bkash",
    "paidAt": "2024-02-15T09:15:00Z"
  },
  "status": "active"
}
```

---

## 🔧 IMPLEMENTATION PRIORITY

### Phase 1: Core Collections (Week 1-2)
1. ✅ Users (already exists - enhance)
2. ✅ Courses (already exists - enhance)
3. 🆕 Enrollments
4. 🆕 Lessons
5. 🆕 Categories

### Phase 2: Learning Features (Week 3-4)
6. 🆕 Assignments
7. 🆕 Submissions
8. 🆕 Quizzes
9. 🆕 QuizResults
10. 🆕 Progress

### Phase 3: Business Features (Week 5-6)
11. 🆕 Transactions
12. 🆕 Payouts
13. 🆕 Certificates
14. 🆕 Reviews

### Phase 4: Communication (Week 7-8)
15. 🆕 Announcements
16. 🆕 Notifications
17. ✅ Messages (already exists)
18. 🆕 Analytics

---

## 📋 NEXT STEPS

### 1. Create Model Files
```bash
src/models/
├── User.ts (✅ exists - enhance)
├── Course.ts (✅ exists - enhance)
├── Enrollment.ts (🆕 create)
├── Lesson.ts (🆕 create)
├── Assignment.ts (🆕 create)
├── Submission.ts (🆕 create)
├── Quiz.ts (🆕 create)
├── QuizResult.ts (🆕 create)
├── Certificate.ts (🆕 create)
├── Announcement.ts (🆕 create)
├── Transaction.ts (🆕 create)
├── Payout.ts (🆕 create)
├── Category.ts (🆕 create)
├── Review.ts (🆕 create)
├── Notification.ts (🆕 create)
└── Analytics.ts (🆕 create)
```

### 2. Create API Routes
```bash
src/app/api/
├── enrollments/
├── lessons/
├── assignments/
├── submissions/
├── quizzes/
├── quiz-results/
├── certificates/
├── announcements/
├── transactions/
├── payouts/
├── analytics/
└── reports/
```

### 3. Database Indexes
```javascript
// Performance optimization indexes
db.enrollments.createIndex({ studentId: 1, courseId: 1 })
db.lessons.createIndex({ courseId: 1, order: 1 })
db.submissions.createIndex({ assignmentId: 1, studentId: 1 })
db.quizResults.createIndex({ quizId: 1, studentId: 1 })
db.transactions.createIndex({ userId: 1, status: 1 })
db.certificates.createIndex({ studentId: 1, courseId: 1 })
```

এই comprehensive schema এবং API structure দিয়ে আপনার সম্পূর্ণ dashboard system implement করতে পারবেন। সব data relational এবং properly connected থাকবে।