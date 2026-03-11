# 🗄️ Minimized Database Schema - 8 Collections Only

## 📊 OPTIMIZED COLLECTIONS (8 Total)

### Core Collections (6 Essential)
```
1. users           - All users + profiles + preferences
2. courses         - Courses + lessons + modules (embedded)
3. enrollments     - Student progress + certificates + reviews
4. activities      - Assignments + quizzes + submissions + results
5. transactions    - Payments + payouts + earnings
6. communications  - Announcements + notifications + messages
```

### Supporting Collections (2 Optional)
```
7. categories      - Course categories (can be embedded in courses)
8. analytics       - Platform analytics (can be computed)
```

---

## 🏗️ DETAILED SCHEMA DEFINITIONS

### 1. Users Collection (All-in-One)
```typescript
interface IUser {
  _id: ObjectId;
  
  // Basic Info
  name: string;
  email: string;
  phone?: string;
  password?: string;
  photoURL?: string;
  role: "student" | "instructor" | "admin";
  provider: "credentials" | "google" | "github";
  
  // Profile (embedded instead of separate collection)
  profile: {
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
    
    // Role-specific data (embedded)
    instructorData?: {
      expertise: string[];
      experience: number;
      education: string;
      verified: boolean;
      rating: number;
      totalStudents: number;
      totalCourses: number;
      totalEarnings: number;
      bankInfo?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
      };
    };
    
    studentData?: {
      enrolledCourses: number;
      completedCourses: number;
      totalCertificates: number;
      averageScore: number;
    };
  };
  
  // Settings (embedded instead of separate collection)
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: "light" | "dark";
    language: "en" | "bn";
  };
  
  // Security
  resetToken?: string;
  resetTokenExpiry?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  lastLogin?: Date;
  
  status: "active" | "suspended" | "pending";
  isVerified: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Courses Collection (With Embedded Lessons)
```typescript
interface ICourse {
  _id: ObjectId;
  instructorId: ObjectId; // ref: User
  
  // Basic Info
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string; // embedded instead of ref
  subcategory?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: "English" | "Bengali" | "Both";
  tags: string[];
  
  // Media
  coverImage: {
    type: "upload" | "url";
    url: string;
  };
  salesVideo?: {
    type: "upload" | "url";
    url: string;
    duration?: number;
  };
  
  // Content Structure (embedded lessons instead of separate collection)
  modules: {
    _id: ObjectId;
    title: string;
    description?: string;
    order: number;
    lessons: {
      _id: ObjectId;
      title: string;
      description?: string;
      type: "video" | "text" | "quiz" | "assignment";
      order: number;
      duration?: number; // minutes
      
      // Content based on type
      content: {
        videoUrl?: string;
        textContent?: string; // HTML
        attachments?: {
          name: string;
          url: string;
          type: string;
        }[];
      };
      
      isPreview: boolean;
      createdAt: Date;
    }[];
  }[];
  
  // Computed fields
  totalLessons: number;
  totalDuration: number;
  
  // Pricing
  pricing: {
    type: "free" | "paid";
    price: number;
    currency: "BDT" | "USD";
    discountPrice?: number;
    discountExpiry?: Date;
    accessDuration: "lifetime" | "1year" | "6months" | "3months";
  };
  
  // Requirements & Outcomes
  requirements: string[];
  whatYouWillLearn: string[];
  
  // FAQ (embedded)
  faqs: {
    question: string;
    answer: string;
  }[];
  
  // Status
  status: "draft" | "pending" | "published" | "rejected";
  visibility: "public" | "private";
  publishedAt?: Date;
  
  // Statistics (computed/cached)
  stats: {
    enrolledCount: number;
    completedCount: number;
    rating: number;
    totalReviews: number;
    totalRevenue: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Enrollments Collection (Progress + Certificates + Reviews)
```typescript
interface IEnrollment {
  _id: ObjectId;
  studentId: ObjectId; // ref: User
  courseId: ObjectId; // ref: Course
  
  // Enrollment Details
  enrolledAt: Date;
  completedAt?: Date;
  expiresAt?: Date;
  
  // Progress Tracking (embedded instead of separate collection)
  progress: {
    completedLessons: {
      lessonId: ObjectId;
      completedAt: Date;
      timeSpent: number; // minutes
    }[];
    totalLessons: number;
    completionPercentage: number;
    lastAccessedLesson?: ObjectId;
    lastAccessedAt?: Date;
    totalTimeSpent: number;
  };
  
  // Payment Info (embedded from transactions)
  payment: {
    transactionId?: ObjectId;
    amount: number;
    currency: string;
    method: string;
    paidAt: Date;
  };
  
  // Certificate (embedded instead of separate collection)
  certificate?: {
    certificateNumber: string;
    issuedAt: Date;
    certificateUrl: string;
    verificationCode: string;
    finalScore?: number;
    completionTime: number; // days
  };
  
  // Review (embedded instead of separate collection)
  review?: {
    rating: number; // 1-5
    comment: string;
    reviewedAt: Date;
    isPublic: boolean;
  };
  
  status: "active" | "completed" | "expired" | "refunded";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Activities Collection (Assignments + Quizzes + Submissions + Results)
```typescript
interface IActivity {
  _id: ObjectId;
  courseId: ObjectId; // ref: Course
  lessonId?: ObjectId; // lesson within course
  instructorId: ObjectId; // ref: User
  
  // Activity Type & Basic Info
  type: "assignment" | "quiz";
  title: string;
  description: string;
  instructions?: string;
  
  // Timing
  dueDate?: Date;
  timeLimit?: number; // minutes for quiz
  maxAttempts: number;
  
  // Scoring
  maxScore: number;
  passingScore: number;
  
  // Assignment-specific data
  assignmentData?: {
    submissionType: "text" | "file" | "code";
    allowedFileTypes?: string[];
    maxFileSize?: number; // MB
    gradingCriteria: {
      criterion: string;
      maxPoints: number;
    }[];
  };
  
  // Quiz-specific data
  quizData?: {
    showCorrectAnswers: boolean;
    randomizeQuestions: boolean;
    questions: {
      _id: ObjectId;
      type: "multiple_choice" | "true_false" | "fill_blank";
      question: string;
      explanation?: string;
      points: number;
      options?: {
        text: string;
        isCorrect: boolean;
      }[];
      correctAnswer?: any;
    }[];
  };
  
  // Student Submissions/Results (embedded instead of separate collections)
  submissions: {
    _id: ObjectId;
    studentId: ObjectId;
    attemptNumber: number;
    submittedAt: Date;
    
    // Submission content
    content: {
      textAnswer?: string;
      files?: {
        name: string;
        url: string;
        type: string;
      }[];
      answers?: { // for quiz
        questionId: ObjectId;
        answer: any;
        isCorrect?: boolean;
        pointsEarned: number;
      }[];
    };
    
    // Grading
    grading?: {
      score: number;
      percentage: number;
      gradedBy?: ObjectId;
      gradedAt?: Date;
      feedback?: string;
      passed: boolean;
    };
    
    status: "submitted" | "graded" | "returned";
  }[];
  
  status: "draft" | "published" | "archived";
  
  createdAt: Date;
  updatedAt: Date;
}
```
### 5. Transactions Collection (Payments + Payouts + Earnings)
```typescript
interface ITransaction {
  _id: ObjectId;
  
  // Transaction Type
  type: "course_purchase" | "refund" | "payout_request" | "payout_completed";
  
  // Parties Involved
  userId: ObjectId; // ref: User (student for purchase, instructor for payout)
  courseId?: ObjectId; // ref: Course (for course purchases)
  
  // Amount Details
  amount: number;
  currency: "BDT" | "USD";
  originalAmount?: number;
  discountAmount?: number;
  
  // Payment Info (for purchases)
  paymentData?: {
    method: "card" | "bkash" | "nagad" | "rocket";
    gateway: "stripe" | "sslcommerz" | "bkash";
    gatewayTransactionId: string;
    metadata?: {
      couponCode?: string;
      ipAddress?: string;
    };
  };
  
  // Payout Info (for instructor payouts)
  payoutData?: {
    period: {
      start: Date;
      end: Date;
    };
    earnings: {
      courseId: ObjectId;
      courseName: string;
      enrollments: number;
      revenue: number;
      commission: number;
      instructorShare: number;
    }[];
    bankInfo: {
      accountName: string;
      accountNumber: string;
      bankName: string;
    };
    requestedAt: Date;
    approvedAt?: Date;
    processedAt?: Date;
    adminNotes?: string;
  };
  
  // Status
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

### 6. Communications Collection (Announcements + Notifications + Messages)
```typescript
interface ICommunication {
  _id: ObjectId;
  
  // Communication Type
  type: "announcement" | "notification" | "message";
  
  // Sender
  senderId: ObjectId; // ref: User
  senderRole: "admin" | "instructor" | "student";
  
  // Content
  title?: string;
  content: string; // HTML content
  
  // Targeting (for announcements/notifications)
  targeting?: {
    audience: ("student" | "instructor" | "admin")[];
    courseIds?: ObjectId[]; // specific courses
    userIds?: ObjectId[]; // specific users
  };
  
  // Message-specific (for live chat)
  messageData?: {
    roomId: string;
    recipientId?: ObjectId;
    messageType: "text" | "file" | "image";
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
  };
  
  // Announcement-specific
  announcementData?: {
    priority: "low" | "medium" | "high" | "urgent";
    publishAt?: Date;
    expiresAt?: Date;
    allowComments: boolean;
    attachments?: {
      name: string;
      url: string;
      type: string;
    }[];
  };
  
  // Notification-specific
  notificationData?: {
    notificationType: "course_update" | "assignment_due" | "quiz_available" | "certificate_earned" | "payment_received";
    relatedId?: ObjectId; // course, assignment, quiz, etc.
    actionUrl?: string;
    isRead: boolean;
    readAt?: Date;
  };
  
  // Engagement
  readBy: {
    userId: ObjectId;
    readAt: Date;
  }[];
  
  status: "draft" | "sent" | "delivered" | "failed";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 7. Categories Collection (Optional - Can be embedded)
```typescript
interface ICategory {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  
  // Hierarchy
  parentId?: ObjectId; // for subcategories
  order: number;
  
  // Statistics
  courseCount: number;
  
  status: "active" | "inactive";
  
  createdAt: Date;
  updatedAt: Date;
}
```

### 8. Analytics Collection (Optional - Can be computed)
```typescript
interface IAnalytics {
  _id: ObjectId;
  
  // Analytics Type
  type: "daily" | "weekly" | "monthly" | "yearly";
  date: Date;
  
  // Platform Stats
  platformStats: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    totalCourses: number;
    newCourses: number;
    totalEnrollments: number;
    newEnrollments: number;
    totalRevenue: number;
    newRevenue: number;
  };
  
  // User Stats by Role
  userStats: {
    students: {
      total: number;
      new: number;
      active: number;
    };
    instructors: {
      total: number;
      new: number;
      active: number;
    };
  };
  
  // Course Stats
  courseStats: {
    byCategory: {
      category: string;
      count: number;
      enrollments: number;
      revenue: number;
    }[];
    topCourses: {
      courseId: ObjectId;
      title: string;
      enrollments: number;
      revenue: number;
    }[];
  };
  
  createdAt: Date;
}
```

---

## 🔗 SIMPLIFIED RELATIONSHIPS

### Primary Relationships (6 Collections)
```
User (1) ←→ (Many) Courses [instructorId]
User (1) ←→ (Many) Enrollments [studentId]
User (1) ←→ (Many) Transactions [userId]
User (1) ←→ (Many) Communications [senderId]

Course (1) ←→ (Many) Enrollments [courseId]
Course (1) ←→ (Many) Activities [courseId]
Course (1) ←→ (Many) Transactions [courseId]

Enrollment (1) ←→ (1) User [studentId]
Enrollment (1) ←→ (1) Course [courseId]

Activity (1) ←→ (1) Course [courseId]
Activity (1) ←→ (1) User [instructorId]

Transaction (1) ←→ (1) User [userId]
Transaction (1) ←→ (0..1) Course [courseId]

Communication (1) ←→ (1) User [senderId]
```

---

## 🚀 SIMPLIFIED API STRUCTURE

### Core APIs (30 endpoints instead of 60+)
```
# Authentication (5 endpoints)
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-otp
POST   /api/auth/logout
POST   /api/auth/forgot-password

# Users (4 endpoints)
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users (admin only)
PUT    /api/users/[id]/status (admin only)

# Courses (6 endpoints)
GET    /api/courses
POST   /api/courses
GET    /api/courses/[id]
PUT    /api/courses/[id]
DELETE /api/courses/[id]
POST   /api/courses/[id]/publish

# Enrollments (5 endpoints)
GET    /api/enrollments
POST   /api/enrollments
GET    /api/enrollments/[id]
PUT    /api/enrollments/[id]/progress
POST   /api/enrollments/[id]/review

# Activities (5 endpoints)
GET    /api/activities
POST   /api/activities
GET    /api/activities/[id]
PUT    /api/activities/[id]
POST   /api/activities/[id]/submit

# Transactions (3 endpoints)
GET    /api/transactions
POST   /api/transactions/payment
POST   /api/transactions/payout

# Communications (2 endpoints)
GET    /api/communications
POST   /api/communications
```

---

## 📊 DASHBOARD DATA (Simplified Queries)

### Student Dashboard (Single Query)
```javascript
// Get all student data in one aggregation
db.enrollments.aggregate([
  { $match: { studentId: ObjectId(studentId) } },
  { $lookup: { from: "courses", localField: "courseId", foreignField: "_id", as: "course" } },
  { $lookup: { from: "activities", localField: "courseId", foreignField: "courseId", as: "activities" } },
  { $lookup: { from: "transactions", localField: "payment.transactionId", foreignField: "_id", as: "transaction" } }
])
```

### Instructor Dashboard (Single Query)
```javascript
// Get all instructor data in one aggregation
db.courses.aggregate([
  { $match: { instructorId: ObjectId(instructorId) } },
  { $lookup: { from: "enrollments", localField: "_id", foreignField: "courseId", as: "enrollments" } },
  { $lookup: { from: "activities", localField: "_id", foreignField: "courseId", as: "activities" } },
  { $lookup: { from: "transactions", localField: "_id", foreignField: "courseId", as: "transactions" } }
])
```

### Admin Dashboard (Single Query)
```javascript
// Get platform stats in one aggregation
db.analytics.findOne({ type: "daily", date: today })
// Or compute on-the-fly from other collections
```

---

## 💡 BENEFITS OF MINIMIZED SCHEMA

### ✅ Advantages:
1. **Fewer Collections** - Only 6-8 collections instead of 18
2. **Embedded Data** - Related data stored together (faster queries)
3. **Fewer JOINs** - Less complex aggregation queries
4. **Simpler APIs** - Fewer endpoints to maintain
5. **Better Performance** - Fewer database calls
6. **Easier Maintenance** - Less schema complexity

### ⚠️ Trade-offs:
1. **Document Size** - Some documents might be larger
2. **Embedded Arrays** - Need to manage array size limits
3. **Data Duplication** - Some data might be duplicated
4. **Update Complexity** - Updating embedded data needs care

---

## 🔧 IMPLEMENTATION PRIORITY

### Phase 1: Core (Week 1)
1. ✅ Users (enhance existing)
2. ✅ Courses (enhance existing)
3. 🆕 Enrollments

### Phase 2: Learning (Week 2)
4. 🆕 Activities (assignments + quizzes)
5. 🆕 Transactions (payments + payouts)

### Phase 3: Communication (Week 3)
6. 🆕 Communications (announcements + notifications)

### Phase 4: Optional (Week 4)
7. 🆕 Categories (if needed)
8. 🆕 Analytics (if needed)

---

## 📋 NEXT STEPS

### 1. Create Model Files (6 files only)
```bash
src/models/
├── User.ts (✅ enhance existing)
├── Course.ts (✅ enhance existing)
├── Enrollment.ts (🆕 create)
├── Activity.ts (🆕 create)
├── Transaction.ts (🆕 create)
└── Communication.ts (🆕 create)
```

### 2. Create API Routes (6 folders only)
```bash
src/app/api/
├── users/
├── courses/ (✅ exists)
├── enrollments/
├── activities/
├── transactions/
└── communications/
```

### 3. Database Indexes (Performance)
```javascript
// Essential indexes only
db.enrollments.createIndex({ studentId: 1, courseId: 1 })
db.activities.createIndex({ courseId: 1, type: 1 })
db.transactions.createIndex({ userId: 1, type: 1 })
db.communications.createIndex({ type: 1, "targeting.audience": 1 })
```

এই minimized schema দিয়ে আপনার সম্পূর্ণ dashboard system efficiently implement করতে পারবেন। কম collection কিন্তু সব functionality intact থাকবে!