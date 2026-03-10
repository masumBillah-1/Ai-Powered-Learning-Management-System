# 🚀 SmartLMS Pro - সম্পূর্ণ প্রজেক্ট রোডম্যাপ ও ডাটাবেস স্কিমা

## 📋 প্রজেক্ট স্ট্যাটাস ওভারভিউ

### ✅ সম্পন্ন কাজসমূহ (40% Complete)
- [x] Next.js 16+ প্রজেক্ট সেটআপ
- [x] TypeScript কনফিগারেশন
- [x] Tailwind CSS + DaisyUI সেটআপ
- [x] MongoDB কানেকশন
- [x] Basic User Model (name, email, password, role)
- [x] Basic Course Model (title, description, modules)
- [x] Authentication API (login, register, OTP)
- [x] Dashboard Layout (Admin, Instructor, Student)
- [x] Course Creation API (basic)
- [x] Theme Toggle (Dark/Light)
- [x] Responsive Design
- [x] Social Auth Setup (Google, GitHub)
- [x] Cloudinary Integration
- [x] Firebase Setup
- [x] Socket.io Dependencies

### ⚠️ আংশিক সম্পন্ন (30% Complete)
- [~] Course Management (শুধু create, list আছে)
- [~] Dashboard Pages (layout আছে, content নেই)
- [~] User Profile (basic structure)
- [~] API Error Handling (কিছু routes এ আছে)
- [~] Middleware Protection (file আছে কিন্তু active নয়)

### ❌ অসম্পন্ন কাজসমূহ (60% Remaining)
- [ ] Enrollment System
- [ ] Progress Tracking
- [ ] Assignment & Quiz System
- [ ] Certificate Generation
- [ ] Payment Integration
- [ ] Chat/Messaging System
- [ ] AI Features (Gemini Integration)
- [ ] Gamification (Badges, Points, Leaderboard)
- [ ] Real-time Notifications
- [ ] File Upload System
- [ ] Analytics & Reporting
- [ ] Email Notification System
- [ ] Mobile App API
- [ ] Advanced Search & Filtering
- [ ] Content Management System

---

## 🎯 Phase-wise Development Plan

### 🔴 Phase 1: Critical Fixes (1-2 সপ্তাহ)
**Priority: URGENT**

#### Security & Infrastructure
- [ ] Move `src/proxy.ts` → `src/middleware.ts`
- [ ] Environment variables secure করা
- [ ] API Authorization middleware
- [ ] Input validation সব routes এ
- [ ] Error handling standardization
- [ ] Rate limiting implementation

#### Database Optimization
- [ ] Index optimization
- [ ] Schema validation
- [ ] Connection pooling
- [ ] Backup strategy

### 🟡 Phase 2: Core Features (3-4 সপ্তাহ)
**Priority: HIGH**

#### Enrollment System
- [ ] Course enrollment API
- [ ] Student-Course relationship
- [ ] Enrollment status tracking
- [ ] Capacity management

#### Progress Tracking
- [ ] Lesson completion tracking
- [ ] Module progress calculation
- [ ] Course completion certificates
- [ ] Learning analytics

#### Dashboard Completion
- [ ] Admin dashboard (users, courses, earnings)
- [ ] Instructor dashboard (students, analytics, earnings)
- [ ] Student dashboard (progress, assignments, certificates)

### 🟢 Phase 3: Advanced Features (4-6 সপ্তাহ)
**Priority: MEDIUM**

#### Assignment & Quiz System
- [ ] Assignment creation & submission
- [ ] Quiz builder with multiple question types
- [ ] Auto-grading system
- [ ] Manual grading interface

#### Communication Features
- [ ] Real-time chat system
- [ ] Discussion forums
- [ ] Announcement system
- [ ] Email notifications

#### AI Integration
- [ ] Gemini API for content generation
- [ ] Personalized learning recommendations
- [ ] Automated content analysis
- [ ] Smart search functionality

### 🔵 Phase 4: Enhancement (6-8 সপ্তাহ)
**Priority: LOW**

#### Gamification
- [ ] Badge system
- [ ] Point calculation
- [ ] Leaderboard
- [ ] Achievement tracking

#### Advanced Analytics
- [ ] Learning analytics dashboard
- [ ] Performance reports
- [ ] Revenue analytics
- [ ] User behavior tracking

---

## 🗄️ MongoDB Database Schema Design

### 📊 Collection Strategy
**Approach: Hybrid (Embedded + Referenced)**
- Small, frequently accessed data → Embedded
- Large, independent data → Referenced
- Many-to-many relationships → Referenced

### 🏗️ Core Collections

#### 1. **users** Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String (optional),
  password: String (hashed),
  photoURL: String,
  role: "student" | "instructor" | "admin",
  provider: "credentials" | "google" | "github",
  
  // Profile Information
  profile: {
    bio: String,
    dateOfBirth: Date,
    gender: "male" | "female" | "other",
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      website: String
    }
  },
  
  // Preferences
  preferences: {
    language: String,
    timezone: String,
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    theme: "light" | "dark"
  },
  
  // Security
  resetToken: String,
  resetTokenExpiry: Date,
  loginAttempts: Number,
  lockUntil: Date,
  lastLogin: Date,
  
  // Instructor Specific (only for instructors)
  instructorData: {
    expertise: [String],
    experience: Number,
    education: String,
    certifications: [String],
    bankDetails: {
      accountNumber: String,
      routingNumber: String,
      bankName: String
    },
    isVerified: Boolean,
    verificationDocuments: [String]
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **courses** Collection
```javascript
{
  _id: ObjectId,
  instructorId: ObjectId (ref: users),
  
  // Basic Information
  title: String,
  slug: String (unique),
  description: String,
  shortDescription: String,
  category: String,
  subcategory: String,
  level: "beginner" | "intermediate" | "advanced",
  language: String,
  
  // Media
  coverImage: {
    type: "upload" | "url",
    url: String,
    alt: String
  },
  salesVideo: {
    type: "upload" | "url", 
    url: String,
    duration: Number
  },
  
  // Course Content (Embedded for performance)
  modules: [{
    _id: ObjectId,
    title: String,
    description: String,
    order: Number,
    lessons: [{
      _id: ObjectId,
      title: String,
      type: "video" | "text" | "quiz" | "assignment" | "live",
      content: {
        // For video lessons
        videoUrl: String,
        duration: Number,
        transcript: String,
        
        // For text lessons
        textContent: String,
        attachments: [String],
        
        // For quiz lessons
        quizId: ObjectId,
        
        // For assignments
        assignmentId: ObjectId
      },
      order: Number,
      isPreview: Boolean,
      estimatedTime: Number
    }]
  }],
  
  // Pricing
  pricing: {
    type: "free" | "paid" | "subscription",
    price: Number,
    currency: String,
    discountPrice: Number,
    discountExpiry: Date,
    installmentOptions: [{
      months: Number,
      monthlyPrice: Number
    }]
  },
  
  // Enrollment Settings
  enrollment: {
    maxStudents: Number,
    enrollmentDeadline: Date,
    accessDuration: "lifetime" | "1year" | "6months" | "3months",
    certificateIncluded: Boolean
  },
  
  // Course Metadata
  requirements: [String],
  whatYouWillLearn: [String],
  targetAudience: [String],
  tags: [String],
  
  // FAQ (Embedded)
  faqs: [{
    question: String,
    answer: String
  }],
  
  // Statistics
  stats: {
    enrolledCount: Number,
    completionRate: Number,
    averageRating: Number,
    totalReviews: Number,
    totalDuration: Number,
    lastUpdated: Date
  },
  
  // Status
  status: "draft" | "published" | "archived",
  visibility: "public" | "private" | "unlisted",
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **enrollments** Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses),
  instructorId: ObjectId (ref: users),
  
  // Enrollment Details
  enrollmentDate: Date,
  status: "active" | "completed" | "dropped" | "suspended",
  paymentStatus: "pending" | "paid" | "refunded",
  
  // Progress Tracking
  progress: {
    completedLessons: [ObjectId],
    completedModules: [ObjectId],
    currentLesson: ObjectId,
    overallProgress: Number, // 0-100
    timeSpent: Number, // in minutes
    lastAccessed: Date
  },
  
  // Completion Data
  completion: {
    isCompleted: Boolean,
    completionDate: Date,
    certificateIssued: Boolean,
    certificateId: String,
    finalGrade: Number
  },
  
  // Access Control
  access: {
    expiryDate: Date,
    isActive: Boolean,
    accessLevel: "full" | "preview" | "restricted"
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **assignments** Collection
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: courses),
  moduleId: ObjectId,
  lessonId: ObjectId,
  instructorId: ObjectId (ref: users),
  
  // Assignment Details
  title: String,
  description: String,
  instructions: String,
  type: "essay" | "project" | "code" | "presentation" | "file_upload",
  
  // Submission Settings
  submission: {
    allowedFileTypes: [String],
    maxFileSize: Number,
    maxFiles: Number,
    submissionFormat: "text" | "file" | "both"
  },
  
  // Grading
  grading: {
    maxPoints: Number,
    gradingCriteria: [{
      criterion: String,
      points: Number,
      description: String
    }],
    autoGrading: Boolean,
    rubric: String
  },
  
  // Timing
  timing: {
    assignedDate: Date,
    dueDate: Date,
    lateSubmissionAllowed: Boolean,
    latePenalty: Number // percentage
  },
  
  // Status
  status: "draft" | "published" | "archived",
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **submissions** Collection
```javascript
{
  _id: ObjectId,
  assignmentId: ObjectId (ref: assignments),
  studentId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses),
  
  // Submission Content
  content: {
    textSubmission: String,
    files: [{
      filename: String,
      url: String,
      fileType: String,
      fileSize: Number,
      uploadDate: Date
    }],
    links: [String]
  },
  
  // Submission Details
  submissionDate: Date,
  isLate: Boolean,
  attemptNumber: Number,
  
  // Grading
  grading: {
    isGraded: Boolean,
    grade: Number,
    maxPoints: Number,
    percentage: Number,
    feedback: String,
    gradedBy: ObjectId (ref: users),
    gradedDate: Date,
    criteriaGrades: [{
      criterion: String,
      points: Number,
      feedback: String
    }]
  },
  
  // Status
  status: "submitted" | "graded" | "returned" | "resubmitted",
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. **quizzes** Collection
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: courses),
  moduleId: ObjectId,
  lessonId: ObjectId,
  instructorId: ObjectId (ref: users),
  
  // Quiz Details
  title: String,
  description: String,
  instructions: String,
  
  // Questions (Embedded for performance)
  questions: [{
    _id: ObjectId,
    type: "multiple_choice" | "true_false" | "short_answer" | "essay" | "matching",
    question: String,
    options: [String], // for multiple choice
    correctAnswer: String | [String],
    explanation: String,
    points: Number,
    order: Number,
    
    // For matching questions
    pairs: [{
      left: String,
      right: String
    }]
  }],
  
  // Quiz Settings
  settings: {
    timeLimit: Number, // in minutes
    attemptsAllowed: Number,
    showCorrectAnswers: Boolean,
    showScoreImmediately: Boolean,
    randomizeQuestions: Boolean,
    randomizeOptions: Boolean,
    passingScore: Number // percentage
  },
  
  // Availability
  availability: {
    startDate: Date,
    endDate: Date,
    isActive: Boolean
  },
  
  // Statistics
  stats: {
    totalAttempts: Number,
    averageScore: Number,
    passRate: Number
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 7. **quiz_attempts** Collection
```javascript
{
  _id: ObjectId,
  quizId: ObjectId (ref: quizzes),
  studentId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses),
  
  // Attempt Details
  attemptNumber: Number,
  startTime: Date,
  endTime: Date,
  timeSpent: Number, // in seconds
  
  // Answers
  answers: [{
    questionId: ObjectId,
    answer: String | [String],
    isCorrect: Boolean,
    pointsEarned: Number,
    timeSpent: Number
  }],
  
  // Results
  results: {
    totalQuestions: Number,
    correctAnswers: Number,
    totalPoints: Number,
    earnedPoints: Number,
    percentage: Number,
    passed: Boolean,
    grade: String
  },
  
  // Status
  status: "in_progress" | "completed" | "abandoned",
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 8. **certificates** Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses),
  instructorId: ObjectId (ref: users),
  
  // Certificate Details
  certificateNumber: String (unique),
  title: String,
  description: String,
  
  // Completion Data
  completionDate: Date,
  finalGrade: Number,
  totalHours: Number,
  
  // Certificate Design
  template: {
    templateId: String,
    backgroundColor: String,
    textColor: String,
    logoUrl: String
  },
  
  // Verification
  verification: {
    isVerified: Boolean,
    verificationCode: String,
    verificationUrl: String
  },
  
  // File Information
  file: {
    url: String,
    filename: String,
    generatedDate: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 9. **messages** Collection
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: conversations),
  senderId: ObjectId (ref: users),
  
  // Message Content
  content: {
    text: String,
    type: "text" | "file" | "image" | "video" | "audio",
    files: [{
      filename: String,
      url: String,
      fileType: String,
      fileSize: Number
    }]
  },
  
  // Message Status
  status: {
    sent: Boolean,
    delivered: Boolean,
    read: Boolean,
    readAt: Date
  },
  
  // Threading
  replyTo: ObjectId (ref: messages),
  
  // Reactions
  reactions: [{
    userId: ObjectId (ref: users),
    emoji: String,
    createdAt: Date
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 10. **conversations** Collection
```javascript
{
  _id: ObjectId,
  type: "direct" | "group" | "course_discussion",
  
  // Participants
  participants: [{
    userId: ObjectId (ref: users),
    role: "admin" | "member",
    joinedAt: Date,
    lastSeen: Date
  }],
  
  // Conversation Details
  title: String,
  description: String,
  courseId: ObjectId (ref: courses), // if course discussion
  
  // Settings
  settings: {
    isPrivate: Boolean,
    allowFileSharing: Boolean,
    allowInvites: Boolean
  },
  
  // Last Message Info
  lastMessage: {
    messageId: ObjectId (ref: messages),
    content: String,
    senderId: ObjectId (ref: users),
    timestamp: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 11. **notifications** Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  
  // Notification Details
  type: "course_update" | "assignment_due" | "message" | "achievement" | "payment",
  title: String,
  message: String,
  
  // Related Data
  relatedId: ObjectId, // course, assignment, message etc.
  relatedType: String,
  
  // Action
  action: {
    type: "redirect" | "modal" | "none",
    url: String,
    data: Object
  },
  
  // Status
  status: {
    isRead: Boolean,
    readAt: Date,
    isSent: Boolean,
    sentAt: Date
  },
  
  // Delivery Channels
  channels: {
    inApp: Boolean,
    email: Boolean,
    push: Boolean
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 12. **payments** Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  courseId: ObjectId (ref: courses),
  instructorId: ObjectId (ref: users),
  
  // Payment Details
  amount: Number,
  currency: String,
  paymentMethod: "card" | "paypal" | "bank_transfer" | "crypto",
  
  // Transaction Info
  transactionId: String,
  paymentGateway: "stripe" | "paypal" | "razorpay",
  gatewayTransactionId: String,
  
  // Status
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled",
  
  // Refund Info
  refund: {
    isRefunded: Boolean,
    refundAmount: Number,
    refundDate: Date,
    refundReason: String
  },
  
  // Revenue Split
  revenueSplit: {
    instructorAmount: Number,
    platformAmount: Number,
    platformFeePercentage: Number
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 13. **reviews** Collection
```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: courses),
  studentId: ObjectId (ref: users),
  instructorId: ObjectId (ref: users),
  
  // Review Content
  rating: Number, // 1-5
  title: String,
  comment: String,
  
  // Review Status
  status: "published" | "pending" | "rejected",
  
  // Helpful Votes
  helpful: {
    upvotes: Number,
    downvotes: Number,
    voters: [ObjectId] // user IDs who voted
  },
  
  // Instructor Response
  response: {
    comment: String,
    respondedAt: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### 14. **gamification** Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  
  // Points System
  points: {
    total: Number,
    available: Number,
    spent: Number
  },
  
  // Badges
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    iconUrl: String,
    earnedDate: Date,
    category: "completion" | "engagement" | "achievement" | "special"
  }],
  
  // Achievements
  achievements: [{
    achievementId: String,
    name: String,
    description: String,
    progress: Number, // 0-100
    isCompleted: Boolean,
    completedDate: Date
  }],
  
  // Streaks
  streaks: {
    currentLoginStreak: Number,
    longestLoginStreak: Number,
    currentLearningStreak: Number,
    longestLearningStreak: Number,
    lastActivityDate: Date
  },
  
  // Leaderboard Position
  leaderboard: {
    globalRank: Number,
    categoryRanks: [{
      category: String,
      rank: Number
    }]
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 Collection Relationships

### Primary Relationships
```
users (1) ←→ (M) courses (instructorId)
users (1) ←→ (M) enrollments (studentId)
courses (1) ←→ (M) enrollments (courseId)
courses (1) ←→ (M) assignments (courseId)
assignments (1) ←→ (M) submissions (assignmentId)
courses (1) ←→ (M) quizzes (courseId)
quizzes (1) ←→ (M) quiz_attempts (quizId)
users (1) ←→ (M) certificates (studentId)
courses (1) ←→ (M) certificates (courseId)
users (1) ←→ (M) messages (senderId)
conversations (1) ←→ (M) messages (conversationId)
users (1) ←→ (M) notifications (userId)
users (1) ←→ (M) payments (userId)
courses (1) ←→ (M) payments (courseId)
courses (1) ←→ (M) reviews (courseId)
users (1) ←→ (1) gamification (userId)
```

### Indexes Strategy
```javascript
// users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ "instructorData.isVerified": 1 })

// courses collection
db.courses.createIndex({ instructorId: 1 })
db.courses.createIndex({ status: 1, visibility: 1 })
db.courses.createIndex({ category: 1, level: 1 })
db.courses.createIndex({ "stats.averageRating": -1 })
db.courses.createIndex({ createdAt: -1 })

// enrollments collection
db.enrollments.createIndex({ studentId: 1, courseId: 1 }, { unique: true })
db.enrollments.createIndex({ courseId: 1, status: 1 })
db.enrollments.createIndex({ studentId: 1, status: 1 })

// assignments collection
db.assignments.createIndex({ courseId: 1 })
db.assignments.createIndex({ instructorId: 1 })

// submissions collection
db.submissions.createIndex({ assignmentId: 1, studentId: 1 })
db.submissions.createIndex({ studentId: 1, status: 1 })

// quizzes collection
db.quizzes.createIndex({ courseId: 1 })

// quiz_attempts collection
db.quiz_attempts.createIndex({ quizId: 1, studentId: 1 })
db.quiz_attempts.createIndex({ studentId: 1, status: 1 })

// messages collection
db.messages.createIndex({ conversationId: 1, createdAt: -1 })
db.messages.createIndex({ senderId: 1 })

// notifications collection
db.notifications.createIndex({ userId: 1, createdAt: -1 })
db.notifications.createIndex({ userId: 1, "status.isRead": 1 })

// payments collection
db.payments.createIndex({ userId: 1, status: 1 })
db.payments.createIndex({ courseId: 1, status: 1 })
db.payments.createIndex({ transactionId: 1 }, { unique: true })

// reviews collection
db.reviews.createIndex({ courseId: 1, status: 1 })
db.reviews.createIndex({ studentId: 1 })
```

---

## 📊 Data Relationships Strategy

### 1. **Embedded vs Referenced Data**

**Embedded (Performance Critical):**
- Course modules & lessons (frequently accessed together)
- User profile & preferences (small, user-specific)
- Quiz questions (accessed together)
- FAQ in courses (small, course-specific)

**Referenced (Independent Entities):**
- Users, Courses, Enrollments (large, independent)
- Assignments, Submissions (can be large)
- Messages, Conversations (can grow infinitely)
- Payments, Reviews (audit trail needed)

### 2. **Denormalization Strategy**
```javascript
// Store frequently accessed data in multiple places
// Example: In enrollments collection
{
  studentId: ObjectId,
  courseId: ObjectId,
  
  // Denormalized for performance
  studentName: String,
  studentEmail: String,
  courseTitle: String,
  instructorName: String
}
```

### 3. **Aggregation Pipeline Examples**

**Student Dashboard Data:**
```javascript
db.enrollments.aggregate([
  { $match: { studentId: ObjectId("...") } },
  { $lookup: {
      from: "courses",
      localField: "courseId", 
      foreignField: "_id",
      as: "course"
  }},
  { $lookup: {
      from: "users",
      localField: "instructorId",
      foreignField: "_id", 
      as: "instructor"
  }},
  { $project: {
      courseTitle: "$course.title",
      instructorName: "$instructor.name",
      progress: "$progress.overallProgress",
      status: 1
  }}
])
```

**Instructor Analytics:**
```javascript
db.enrollments.aggregate([
  { $match: { instructorId: ObjectId("...") } },
  { $group: {
      _id: "$courseId",
      totalStudents: { $sum: 1 },
      completedStudents: {
        $sum: { $cond: ["$completion.isCompleted", 1, 0] }
      },
      averageProgress: { $avg: "$progress.overallProgress" }
  }},
  { $lookup: {
      from: "courses",
      localField: "_id",
      foreignField: "_id",
      as: "course"
  }}
])
```

---

## 🚀 Implementation Priority

### Phase 1: Core Schema (Week 1-2)
1. ✅ users collection (already exists, needs enhancement)
2. ✅ courses collection (already exists, needs enhancement) 
3. 🆕 enrollments collection
4. 🆕 notifications collection

### Phase 2: Learning Features (Week 3-4)
5. 🆕 assignments collection
6. 🆕 submissions collection
7. 🆕 quizzes collection
8. 🆕 quiz_attempts collection

### Phase 3: Communication (Week 5-6)
9. 🆕 messages collection
10. 🆕 conversations collection
11. 🆕 reviews collection

### Phase 4: Advanced Features (Week 7-8)
12. 🆕 certificates collection
13. 🆕 payments collection
14. 🆕 gamification collection

---

## 💡 Best Practices

### 1. **Schema Design Principles**
- Keep frequently accessed data together (embedding)
- Separate large, independent entities (referencing)
- Denormalize for read performance
- Use appropriate indexes
- Plan for horizontal scaling

### 2. **Performance Optimization**
- Index on query patterns
- Use aggregation pipelines for complex queries
- Implement caching layer (Redis)
- Use connection pooling
- Monitor query performance

### 3. **Data Integrity**
- Use schema validation
- Implement referential integrity in application layer
- Use transactions for multi-document operations
- Regular backup and recovery testing

### 4. **Security Considerations**
- Encrypt sensitive data
- Use role-based access control
- Audit trail for critical operations
- Input validation and sanitization
- Rate limiting on API endpoints

---

## 📈 Scalability Considerations

### 1. **Horizontal Scaling**
- Shard by userId for user-centric collections
- Shard by courseId for course-centric collections
- Use compound shard keys for even distribution

### 2. **Caching Strategy**
- Redis for session data
- Cache frequently accessed course data
- Cache user profiles and preferences
- Implement cache invalidation strategy

### 3. **Performance Monitoring**
- MongoDB Compass for query analysis
- Application Performance Monitoring (APM)
- Database performance metrics
- User experience monitoring

---

এই ডকুমেন্ট অনুযায়ী কাজ করলে আপনার SmartLMS Pro একটি সম্পূর্ণ, স্কেলেবল এবং production-ready অ্যাপ্লিকেশন হবে। কোন specific section নিয়ে আরো বিস্তারিত জানতে চান?

---

## 🗂️ সম্পূর্ণ প্রজেক্ট ফাইল স্ট্রাকচার

### 📁 Root Directory Structure
```
ai-powered-learning-management-system/
├── 📁 .next/                          # Next.js build files
├── 📁 .vercel/                        # Vercel deployment config
├── 📁 .vscode/                        # VS Code settings
├── 📁 .git/                           # Git repository
├── 📁 node_modules/                   # Dependencies
├── 📁 public/                         # Static assets
├── 📁 src/                            # Source code
├── 📄 .env.local                      # Environment variables
├── 📄 .gitignore                      # Git ignore rules
├── 📄 next.config.ts                  # Next.js configuration
├── 📄 package.json                    # Project dependencies
├── 📄 package-lock.json               # Dependency lock file
├── 📄 tailwind.config.js              # Tailwind CSS config
├── 📄 postcss.config.mjs              # PostCSS config
├── 📄 eslint.config.mjs               # ESLint config
├── 📄 tsconfig.json                   # TypeScript config
├── 📄 next-env.d.ts                   # Next.js TypeScript definitions
└── 📄 README.md                       # Project documentation
```

### 📁 src/ Directory Structure
```
src/
├── 📁 app/                            # Next.js App Router
│   ├── 📁 (auth)/                     # Authentication routes
│   ├── 📁 (public)/                   # Public routes
│   ├── 📁 api/                        # API routes
│   ├── 📁 sampleDashboard/            # Dashboard routes
│   ├── 📁 enrollment/                 # Enrollment pages
│   ├── 📁 help/                       # Help & support pages
│   ├── 📄 globals.css                 # Global styles
│   ├── 📄 layout.tsx                  # Root layout
│   ├── 📄 loading.tsx                 # Global loading component
│   ├── 📄 error.tsx                   # Global error component
│   └── 📄 not-found.tsx               # 404 page
├── 📁 components/                     # Reusable components
├── 📁 lib/                            # Utility libraries
├── 📁 models/                         # Database models
├── 📁 db/                             # Database connection
├── 📁 hooks/                          # Custom React hooks
├── 📁 utils/                          # Utility functions
├── 📁 types/                          # TypeScript type definitions
├── 📁 constants/                      # Application constants
├── 📁 services/                       # API service functions
├── 📁 middleware/                     # Custom middleware
└── 📄 middleware.ts                   # Next.js middleware
```

---

## 🗄️ MongoDB Collections Summary

### 📊 Core Collections (14 Total)

#### 1. **users** Collection
- User authentication & profiles
- Instructor verification data
- User preferences & settings
- Security & login tracking

#### 2. **courses** Collection  
- Course content & structure
- Modules & lessons (embedded)
- Pricing & enrollment settings
- Course statistics & metadata

#### 3. **enrollments** Collection
- Student-course relationships
- Progress tracking per student
- Completion status & certificates
- Access control & expiry

#### 4. **assignments** Collection
- Assignment creation & management
- Grading criteria & rubrics
- Submission settings & deadlines
- File upload configurations

#### 5. **submissions** Collection
- Student assignment submissions
- File attachments & content
- Grading & feedback system
- Attempt tracking

#### 6. **quizzes** Collection
- Quiz creation with multiple question types
- Time limits & attempt settings
- Question randomization
- Scoring & passing criteria

#### 7. **quiz_attempts** Collection
- Individual quiz attempts
- Answer tracking & scoring
- Time spent per question
- Results & performance data

#### 8. **certificates** Collection
- Course completion certificates
- Certificate templates & design
- Verification codes & URLs
- PDF generation & storage

#### 9. **messages** Collection
- Real-time messaging system
- File sharing & attachments
- Message threading & replies
- Read receipts & reactions

#### 10. **conversations** Collection
- Chat conversations & groups
- Course discussion forums
- Participant management
- Conversation settings

#### 11. **notifications** Collection
- In-app notifications
- Email & push notifications
- Notification preferences
- Delivery tracking

#### 12. **payments** Collection
- Payment processing & tracking
- Revenue split calculations
- Refund management
- Transaction history

#### 13. **reviews** Collection
- Course reviews & ratings
- Student feedback system
- Instructor responses
- Helpful vote tracking

#### 14. **gamification** Collection
- Points & badge system
- Achievement tracking
- Learning streaks
- Leaderboard rankings

---

## 📂 Complete File Structure to Add

### 🔧 Database Models (src/models/)
```
src/models/
├── 📄 User.ts                         ✅ EXISTS (needs enhancement)
├── 📄 Course.ts                       ✅ EXISTS (needs enhancement)
├── 📄 Enrollment.ts                   🆕 TO ADD
├── 📄 Assignment.ts                   🆕 TO ADD
├── 📄 Submission.ts                   🆕 TO ADD
├── 📄 Quiz.ts                         🆕 TO ADD
├── 📄 QuizAttempt.ts                  🆕 TO ADD
├── 📄 Certificate.ts                  🆕 TO ADD
├── 📄 Message.ts                      🆕 TO ADD
├── 📄 Conversation.ts                 🆕 TO ADD
├── 📄 Notification.ts                 🆕 TO ADD
├── 📄 Payment.ts                      🆕 TO ADD
├── 📄 Review.ts                       🆕 TO ADD
├── 📄 Gamification.ts                 🆕 TO ADD
└── 📄 index.ts                        🆕 TO ADD (export all models)
```

### 🌐 API Routes (src/app/api/)
```
src/app/api/
├── 📁 auth/                           ✅ EXISTS
│   ├── 📁 login/                      ✅ EXISTS
│   ├── 📁 register/                   ✅ EXISTS
│   ├── 📁 verify-otp/                 ✅ EXISTS
│   ├── 📁 logout/                     🆕 TO ADD
│   ├── 📁 refresh-token/              🆕 TO ADD
│   ├── 📁 forgot-password/            🆕 TO ADD
│   ├── 📁 reset-password/             🆕 TO ADD
│   └── 📁 social/                     🆕 TO ADD
│       ├── 📁 google/                 🆕 TO ADD
│       └── 📁 github/                 🆕 TO ADD
├── 📁 courses/                        ✅ EXISTS (partial)
│   ├── 📄 route.ts                    ✅ EXISTS
│   ├── 📁 [id]/                       ✅ EXISTS
│   ├── 📁 search/                     🆕 TO ADD
│   ├── 📁 categories/                 🆕 TO ADD
│   └── 📁 featured/                   🆕 TO ADD
├── 📁 enrollments/                    🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   └── 📁 bulk/                       🆕 TO ADD
├── 📁 assignments/                    🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   └── 📁 course/                     🆕 TO ADD
│       └── 📁 [courseId]/             🆕 TO ADD
├── 📁 submissions/                    🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   └── 📁 assignment/                 🆕 TO ADD
│       └── 📁 [assignmentId]/         🆕 TO ADD
├── 📁 quizzes/                        🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   └── 📁 attempts/                   🆕 TO ADD
│       ├── 📄 route.ts                🆕 TO ADD
│       └── 📁 [id]/                   🆕 TO ADD
├── 📁 certificates/                   🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   ├── 📁 generate/                   🆕 TO ADD
│   └── 📁 verify/                     🆕 TO ADD
├── 📁 messages/                       🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   └── 📁 conversation/               🆕 TO ADD
│       └── 📁 [conversationId]/       🆕 TO ADD
├── 📁 conversations/                  🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   └── 📁 [id]/                       🆕 TO ADD
├── 📁 notifications/                  🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   └── 📁 mark-read/                  🆕 TO ADD
├── 📁 payments/                       🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   ├── 📁 stripe/                     🆕 TO ADD
│   ├── 📁 paypal/                     🆕 TO ADD
│   └── 📁 webhooks/                   🆕 TO ADD
├── 📁 reviews/                        🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 [id]/                       🆕 TO ADD
│   └── 📁 course/                     🆕 TO ADD
│       └── 📁 [courseId]/             🆕 TO ADD
├── 📁 gamification/                   🆕 TO ADD
│   ├── 📄 route.ts                    🆕 TO ADD
│   ├── 📁 badges/                     🆕 TO ADD
│   ├── 📁 achievements/               🆕 TO ADD
│   └── 📁 leaderboard/                🆕 TO ADD
├── 📁 analytics/                      🆕 TO ADD
│   ├── 📁 dashboard/                  🆕 TO ADD
│   ├── 📁 courses/                    🆕 TO ADD
│   └── 📁 users/                      🆕 TO ADD
├── 📁 uploads/                        🆕 TO ADD
│   ├── 📁 images/                     🆕 TO ADD
│   ├── 📁 videos/                     🆕 TO ADD
│   └── 📁 documents/                  🆕 TO ADD
├── 📁 ai/                             🆕 TO ADD
│   ├── 📁 gemini/                     🆕 TO ADD
│   ├── 📁 recommendations/            🆕 TO ADD
│   └── 📁 content-analysis/           🆕 TO ADD
└── 📁 admin/                          🆕 TO ADD
    ├── 📁 users/                      🆕 TO ADD
    ├── 📁 courses/                    🆕 TO ADD
    └── 📁 system/                     🆕 TO ADD
```

### 🎨 Components (src/components/)
```
src/components/
├── 📁 ui/                             ✅ EXISTS (partial)
│   ├── 📄 Button.tsx                  🆕 TO ADD
│   ├── 📄 Input.tsx                   🆕 TO ADD
│   ├── 📄 Modal.tsx                   🆕 TO ADD
│   ├── 📄 Card.tsx                    🆕 TO ADD
│   ├── 📄 Badge.tsx                   🆕 TO ADD
│   ├── 📄 Avatar.tsx                  🆕 TO ADD
│   ├── 📄 Dropdown.tsx                🆕 TO ADD
│   ├── 📄 Tabs.tsx                    🆕 TO ADD
│   ├── 📄 Pagination.tsx              🆕 TO ADD
│   ├── 📄 SearchBox.tsx               🆕 TO ADD
│   ├── 📄 FileUpload.tsx              🆕 TO ADD
│   ├── 📄 VideoPlayer.tsx             🆕 TO ADD
│   ├── 📄 ProgressBar.tsx             🆕 TO ADD
│   ├── 📄 Rating.tsx                  🆕 TO ADD
│   ├── 📄 Tooltip.tsx                 🆕 TO ADD
│   ├── 📄 Skeleton.tsx                🆕 TO ADD
│   ├── 📄 LoadingSpinner.tsx          🆕 TO ADD
│   └── 📄 ErrorBoundary.tsx           🆕 TO ADD
├── 📁 layout/                         ✅ EXISTS
│   ├── 📄 Navbar.tsx                  ✅ EXISTS
│   ├── 📄 Footer.tsx                  ✅ EXISTS
│   ├── 📄 Sidebar.tsx                 🆕 TO ADD
│   ├── 📄 Header.tsx                  🆕 TO ADD
│   └── 📄 Breadcrumb.tsx              🆕 TO ADD
├── 📁 dashboard/                      🆕 TO ADD
│   ├── 📄 DashboardLayout.tsx         🆕 TO ADD
│   ├── 📄 StatsCard.tsx               🆕 TO ADD
│   ├── 📄 RecentActivity.tsx          🆕 TO ADD
│   ├── 📄 QuickActions.tsx            🆕 TO ADD
│   └── 📄 NotificationPanel.tsx       🆕 TO ADD
├── 📁 course/                         🆕 TO ADD
│   ├── 📄 CourseCard.tsx              🆕 TO ADD
│   ├── 📄 CourseList.tsx              🆕 TO ADD
│   ├── 📄 CourseGrid.tsx              🆕 TO ADD
│   ├── 📄 CourseDetails.tsx           🆕 TO ADD
│   ├── 📄 CoursePlayer.tsx            🆕 TO ADD
│   ├── 📄 ModuleList.tsx              🆕 TO ADD
│   ├── 📄 LessonItem.tsx              🆕 TO ADD
│   └── 📄 CourseProgress.tsx          🆕 TO ADD
├── 📁 assignment/                     🆕 TO ADD
│   ├── 📄 AssignmentCard.tsx          🆕 TO ADD
│   ├── 📄 AssignmentForm.tsx          🆕 TO ADD
│   ├── 📄 SubmissionForm.tsx          🆕 TO ADD
│   ├── 📄 GradingInterface.tsx        🆕 TO ADD
│   └── 📄 AssignmentList.tsx          🆕 TO ADD
├── 📁 quiz/                           🆕 TO ADD
│   ├── 📄 QuizBuilder.tsx             🆕 TO ADD
│   ├── 📄 QuizPlayer.tsx              🆕 TO ADD
│   ├── 📄 QuestionTypes.tsx           🆕 TO ADD
│   ├── 📄 QuizResults.tsx             🆕 TO ADD
│   └── 📄 QuizAnalytics.tsx           🆕 TO ADD
├── 📁 chat/                           ✅ EXISTS (partial)
│   ├── 📄 ChatWindow.tsx              🆕 TO ADD
│   ├── 📄 MessageList.tsx             🆕 TO ADD
│   ├── 📄 MessageInput.tsx            🆕 TO ADD
│   ├── 📄 ConversationList.tsx        🆕 TO ADD
│   └── 📄 UserList.tsx                🆕 TO ADD
├── 📁 gamification/                   🆕 TO ADD
│   ├── 📄 BadgeDisplay.tsx            🆕 TO ADD
│   ├── 📄 PointsCounter.tsx           🆕 TO ADD
│   ├── 📄 Leaderboard.tsx             🆕 TO ADD
│   ├── 📄 AchievementCard.tsx         🆕 TO ADD
│   └── 📄 ProgressRing.tsx            🆕 TO ADD
├── 📁 payment/                        🆕 TO ADD
│   ├── 📄 PaymentForm.tsx             🆕 TO ADD
│   ├── 📄 PricingCard.tsx             🆕 TO ADD
│   ├── 📄 CheckoutSummary.tsx         🆕 TO ADD
│   └── 📄 PaymentHistory.tsx          🆕 TO ADD
├── 📁 analytics/                      🆕 TO ADD
│   ├── 📄 Chart.tsx                   🆕 TO ADD
│   ├── 📄 MetricsCard.tsx             🆕 TO ADD
│   ├── 📄 ReportGenerator.tsx         🆕 TO ADD
│   └── 📄 DataTable.tsx               🆕 TO ADD
└── 📁 forms/                          🆕 TO ADD
    ├── 📄 LoginForm.tsx               🆕 TO ADD
    ├── 📄 RegisterForm.tsx            🆕 TO ADD
    ├── 📄 ProfileForm.tsx             🆕 TO ADD
    ├── 📄 CourseForm.tsx              🆕 TO ADD
    └── 📄 ContactForm.tsx             🆕 TO ADD
```

### 🔧 Utilities & Services (src/lib/, src/utils/, src/services/)
```
src/lib/
├── 📄 auth.ts                         🆕 TO ADD (JWT utilities)
├── 📄 cloudinary.ts                   ✅ EXISTS
├── 📄 firebase.ts                     🆕 TO ADD
├── 📄 gemini.ts                       🆕 TO ADD
├── 📄 stripe.ts                       🆕 TO ADD
├── 📄 paypal.ts                       🆕 TO ADD
├── 📄 nodemailer.ts                   🆕 TO ADD
├── 📄 socket.ts                       🆕 TO ADD
├── 📄 redis.ts                        🆕 TO ADD
└── 📄 validation.ts                   🆕 TO ADD

src/utils/
├── 📄 constants.ts                    🆕 TO ADD
├── 📄 helpers.ts                      🆕 TO ADD
├── 📄 formatters.ts                   🆕 TO ADD
├── 📄 validators.ts                   🆕 TO ADD
├── 📄 encryption.ts                   🆕 TO ADD
├── 📄 file-utils.ts                   🆕 TO ADD
├── 📄 date-utils.ts                   🆕 TO ADD
└── 📄 api-utils.ts                    🆕 TO ADD

src/services/
├── 📄 api.ts                          🆕 TO ADD (API client)
├── 📄 auth-service.ts                 🆕 TO ADD
├── 📄 course-service.ts               🆕 TO ADD
├── 📄 user-service.ts                 🆕 TO ADD
├── 📄 payment-service.ts              🆕 TO ADD
├── 📄 notification-service.ts         🆕 TO ADD
├── 📄 upload-service.ts               🆕 TO ADD
├── 📄 email-service.ts                🆕 TO ADD
└── 📄 analytics-service.ts            🆕 TO ADD
```

### 🎯 Custom Hooks (src/hooks/)
```
src/hooks/
├── 📄 useAuth.ts                      🆕 TO ADD
├── 📄 useLocalStorage.ts              🆕 TO ADD
├── 📄 useDebounce.ts                  🆕 TO ADD
├── 📄 usePagination.ts                🆕 TO ADD
├── 📄 useSocket.ts                    🆕 TO ADD
├── 📄 useUpload.ts                    🆕 TO ADD
├── 📄 useNotifications.ts             🆕 TO ADD
├── 📄 useProgress.ts                  🆕 TO ADD
├── 📄 useQuiz.ts                      🆕 TO ADD
└── 📄 useAnalytics.ts                 🆕 TO ADD
```

### 📱 Dashboard Pages (src/app/sampleDashboard/)
```
src/app/sampleDashboard/
├── 📄 layout.tsx                      ✅ EXISTS
├── 📄 page.tsx                        🆕 TO ADD (dashboard selector)
├── 📁 admin/                          ✅ EXISTS (partial)
│   ├── 📄 page.tsx                    ✅ EXISTS
│   ├── 📁 users/                      ✅ EXISTS (empty)
│   ├── 📁 courses/                    ✅ EXISTS (empty)
│   ├── 📁 earnings/                   ✅ EXISTS (empty)
│   ├── 📁 announcements/              ✅ EXISTS (empty)
│   ├── 📁 analytics/                  🆕 TO ADD
│   ├── 📁 settings/                   🆕 TO ADD
│   └── 📁 reports/                    🆕 TO ADD
├── 📁 instructor/                     ✅ EXISTS (partial)
│   ├── 📄 page.tsx                    ✅ EXISTS
│   ├── 📁 courses/                    ✅ EXISTS
│   ├── 📁 students/                   🆕 TO ADD
│   ├── 📁 assignments/                ✅ EXISTS (empty)
│   ├── 📁 quizzes/                    🆕 TO ADD
│   ├── 📁 earnings/                   ✅ EXISTS (empty)
│   ├── 📁 analytics/                  🆕 TO ADD
│   └── 📁 announcements/              ✅ EXISTS (empty)
├── 📁 student/                        ✅ EXISTS (partial)
│   ├── 📄 page.tsx                    ✅ EXISTS
│   ├── 📁 courses/                    🆕 TO ADD
│   ├── 📁 assignments/                🆕 TO ADD
│   ├── 📁 quizzes/                    🆕 TO ADD
│   ├── 📁 certificates/               🆕 TO ADD
│   ├── 📁 progress/                   🆕 TO ADD
│   └── 📁 achievements/               🆕 TO ADD
├── 📁 shared/                         🆕 TO ADD
│   ├── 📁 profile/                    🆕 TO ADD
│   ├── 📁 messages/                   🆕 TO ADD
│   ├── 📁 notifications/              🆕 TO ADD
│   └── 📁 settings/                   🆕 TO ADD
└── 📁 components/                     🆕 TO ADD
    ├── 📄 DashboardSidebar.tsx        🆕 TO ADD
    ├── 📄 DashboardHeader.tsx         🆕 TO ADD
    └── 📄 DashboardStats.tsx          🆕 TO ADD
```

### 🔐 Middleware & Types (src/middleware/, src/types/)
```
src/middleware/
├── 📄 auth.ts                         🆕 TO ADD
├── 📄 cors.ts                         🆕 TO ADD
├── 📄 rate-limit.ts                   🆕 TO ADD
├── 📄 validation.ts                   🆕 TO ADD
└── 📄 error-handler.ts                🆕 TO ADD

src/types/
├── 📄 auth.ts                         🆕 TO ADD
├── 📄 course.ts                       🆕 TO ADD
├── 📄 user.ts                         🆕 TO ADD
├── 📄 assignment.ts                   🆕 TO ADD
├── 📄 quiz.ts                         🆕 TO ADD
├── 📄 payment.ts                      🆕 TO ADD
├── 📄 notification.ts                 🆕 TO ADD
├── 📄 api.ts                          🆕 TO ADD
└── 📄 index.ts                        🆕 TO ADD
```

---

## 📋 Implementation Checklist

### ✅ Phase 1: Foundation (Week 1-2)
- [ ] Fix middleware (`src/proxy.ts` → `src/middleware.ts`)
- [ ] Create missing database models
- [ ] Add API middleware (auth, validation, error handling)
- [ ] Implement core API endpoints (enrollment, progress)
- [ ] Create reusable UI components

### ⚠️ Phase 2: Core Features (Week 3-4)
- [ ] Assignment system (creation, submission, grading)
- [ ] Quiz system (builder, player, results)
- [ ] Real-time messaging (Socket.io integration)
- [ ] File upload system (Cloudinary integration)
- [ ] Progress tracking & analytics

### 🆕 Phase 3: Advanced Features (Week 5-6)
- [ ] Payment integration (Stripe/PayPal)
- [ ] Certificate generation (PDF)
- [ ] AI features (Gemini integration)
- [ ] Gamification system
- [ ] Advanced analytics & reporting

### 🔮 Phase 4: Polish & Optimization (Week 7-8)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Testing (unit, integration, e2e)
- [ ] Documentation
- [ ] Deployment preparation

---

## 🎯 Priority File Creation Order

### 🔴 Critical (Do First)
1. `src/middleware.ts` - Fix route protection
2. `src/models/Enrollment.ts` - Core enrollment system
3. `src/app/api/enrollments/route.ts` - Enrollment API
4. `src/components/ui/` - Basic UI components
5. `src/lib/auth.ts` - JWT utilities

### 🟡 High Priority (Do Next)
6. `src/models/Assignment.ts` & `src/models/Submission.ts`
7. `src/app/api/assignments/` & `src/app/api/submissions/`
8. `src/components/assignment/` - Assignment components
9. `src/services/` - API service layer
10. `src/hooks/` - Custom React hooks

### 🟢 Medium Priority (Do Later)
11. `src/models/Quiz.ts` & `src/models/QuizAttempt.ts`
12. `src/app/api/quizzes/` - Quiz system APIs
13. `src/components/quiz/` - Quiz components
14. `src/models/Message.ts` & `src/models/Conversation.ts`
15. Real-time messaging system

### 🔵 Low Priority (Nice to Have)
16. `src/models/Payment.ts` - Payment system
17. `src/models/Gamification.ts` - Gamification
18. `src/app/api/ai/` - AI features
19. Advanced analytics & reporting
20. Mobile app preparation

এই স্ট্রাকচার অনুসরণ করে আপনি একটি সম্পূর্ণ, স্কেলেবল LMS তৈরি করতে পারবেন। কোন specific ফাইল বা ফিচার দিয়ে শুরু করতে চান?

---

## 🎯 SIMPLIFIED DATABASE STRUCTURE (Easy & Minimal)

### 📊 Core Collections (Only 8 Collections)

```
1. users           - All users (student, instructor, admin)
2. courses         - Course content with embedded lessons
3. enrollments     - Student progress & enrollment data
4. assignments     - Assignments with embedded submissions
5. quizzes         - Quizzes with embedded questions & results
6. certificates    - Course completion certificates
7. transactions    - All payment records
8. notifications   - System notifications
```

### 🏗️ SIMPLIFIED SCHEMA DESIGN

#### 1. **users** Collection (Enhanced but Simple)
```javascript
{
  _id: ObjectId,
  name: "আহমেদ করিম",
  email: "ahmed@example.com",
  phone: "+8801712345678",
  password: "hashed_password",
  photoURL: "https://cloudinary.com/avatar.jpg",
  role: "student" | "instructor" | "admin",
  
  // Profile (Embedded)
  profile: {
    bio: "Web Developer with 5+ years experience",
    dateOfBirth: "1990-01-15",
    address: "Dhaka, Bangladesh",
    socialLinks: {
      website: "https://example.com",
      linkedin: "https://linkedin.com/in/ahmed"
    }
  },
  
  // Role-specific Data (Embedded)
  instructorData: {  // Only for instructors
    expertise: ["JavaScript", "React", "Node.js"],
    experience: 5,
    education: "CSE, BUET",
    isVerified: true,
    rating: 4.8,
    totalStudents: 1200,
    totalEarnings: 150000
  },
  
  studentData: {  // Only for students
    enrolledCourses: 5,
    completedCourses: 3,
    totalCertificates: 3,
    averageScore: 85
  },
  
  // Settings (Embedded)
  settings: {
    theme: "light",
    language: "bn",
    emailNotifications: true,
    pushNotifications: true
  },
  
  // Security
  resetToken: "token_string",
  resetTokenExpiry: Date,
  lastLogin: Date,
  
  status: "active" | "suspended",
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **courses** Collection (All-in-One)
```javascript
{
  _id: ObjectId,
  instructorId: ObjectId, // ref: users
  
  // Basic Info
  title: "Complete Web Development Bootcamp",
  slug: "complete-web-development-bootcamp",
  description: "Learn HTML, CSS, JavaScript, React, Node.js",
  category: "Web Development",
  level: "Beginner" | "Intermediate" | "Advanced",
  language: "Bengali" | "English",
  
  // Media
  coverImage: "https://cloudinary.com/cover.jpg",
  salesVideo: "https://cloudinary.com/video.mp4",
  
  // Course Content (Embedded Modules & Lessons)
  modules: [{
    _id: ObjectId,
    title: "HTML Fundamentals",
    order: 1,
    lessons: [{
      _id: ObjectId,
      title: "Introduction to HTML",
      type: "video" | "text" | "quiz" | "assignment",
      order: 1,
      duration: 15, // minutes
      videoUrl: "https://cloudinary.com/lesson1.mp4",
      textContent: "HTML lesson content...",
      resources: [{
        name: "HTML Cheatsheet",
        url: "https://example.com/cheatsheet.pdf"
      }],
      isPreview: true, // free preview
      quizId: ObjectId, // if lesson has quiz
      assignmentId: ObjectId // if lesson has assignment
    }]
  }],
  
  // Pricing
  pricing: {
    type: "free" | "paid",
    price: 2500,
    currency: "BDT",
    discountPrice: 1999,
    discountExpiry: Date
  },
  
  // Course Details
  requirements: ["Basic computer knowledge"],
  whatYouWillLearn: ["HTML/CSS", "JavaScript", "React"],
  targetAudience: ["Beginners", "Students"],
  
  // FAQ (Embedded)
  faqs: [{
    question: "Do I need prior experience?",
    answer: "No, this course is for complete beginners."
  }],
  
  // Statistics (Auto-calculated)
  stats: {
    totalLessons: 156,
    totalDuration: 2400, // minutes
    enrolledCount: 420,
    completedCount: 280,
    rating: 4.9,
    totalReviews: 89,
    totalRevenue: 1050000
  },
  
  // Reviews (Embedded for simplicity)
  reviews: [{
    _id: ObjectId,
    studentId: ObjectId,
    studentName: "রহিম উদ্দিন",
    rating: 5,
    comment: "Excellent course!",
    createdAt: Date
  }],
  
  status: "draft" | "published" | "archived",
  publishedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **enrollments** Collection (Progress Tracking)
```javascript
{
  _id: ObjectId,
  studentId: ObjectId, // ref: users
  courseId: ObjectId, // ref: courses
  
  // Enrollment Info
  enrolledAt: Date,
  expiresAt: Date, // for time-limited courses
  
  // Progress (Embedded)
  progress: {
    completedLessons: [ObjectId], // array of completed lesson IDs
    currentLesson: ObjectId,
    completionPercentage: 65,
    totalTimeSpent: 1200, // minutes
    lastAccessedAt: Date,
    
    // Module-wise progress
    moduleProgress: [{
      moduleId: ObjectId,
      completedLessons: 8,
      totalLessons: 12,
      percentage: 67
    }]
  },
  
  // Payment Info (Embedded)
  payment: {
    transactionId: ObjectId,
    amount: 1999,
    currency: "BDT",
    method: "bkash",
    paidAt: Date
  },
  
  // Completion
  completion: {
    isCompleted: false,
    completedAt: Date,
    finalScore: 85,
    certificateId: ObjectId
  },
  
  status: "active" | "completed" | "expired" | "refunded",
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **assignments** Collection (With Embedded Submissions)
```javascript
{
  _id: ObjectId,
  courseId: ObjectId, // ref: courses
  lessonId: ObjectId, // which lesson this belongs to
  instructorId: ObjectId, // ref: users
  
  // Assignment Details
  title: "Build a Portfolio Website",
  description: "Create a responsive portfolio using HTML/CSS",
  instructions: "Follow the provided guidelines...",
  
  // Settings
  maxScore: 100,
  passingScore: 70,
  dueDate: Date,
  allowLateSubmission: true,
  maxAttempts: 3,
  
  // Grading Criteria (Embedded)
  gradingCriteria: [{
    criterion: "Design Quality",
    maxPoints: 30,
    description: "Overall visual appeal and layout"
  }],
  
  // Student Submissions (Embedded)
  submissions: [{
    _id: ObjectId,
    studentId: ObjectId,
    studentName: "রহিম উদ্দিন", // denormalized for performance
    
    // Submission Content
    content: {
      textAnswer: "My portfolio explanation...",
      files: [{
        name: "portfolio.zip",
        url: "https://cloudinary.com/portfolio.zip",
        size: 2048000 // bytes
      }],
      liveUrl: "https://student-portfolio.netlify.app"
    },
    
    submittedAt: Date,
    isLate: false,
    attemptNumber: 1,
    
    // Grading (Embedded)
    grading: {
      score: 85,
      percentage: 85,
      feedback: "Great work! Improve the mobile responsiveness.",
      gradedBy: ObjectId,
      gradedAt: Date,
      criteriaScores: [{
        criterion: "Design Quality",
        score: 25,
        feedback: "Good color scheme"
      }]
    },
    
    status: "submitted" | "graded" | "returned"
  }],
  
  // Statistics
  stats: {
    totalSubmissions: 45,
    gradedSubmissions: 40,
    averageScore: 78,
    passRate: 85
  },
  
  status: "active" | "archived",
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **quizzes** Collection (All-in-One Quiz System)
```javascript
{
  _id: ObjectId,
  courseId: ObjectId, // ref: courses
  lessonId: ObjectId, // which lesson this belongs to
  instructorId: ObjectId, // ref: users
  
  // Quiz Details
  title: "JavaScript Fundamentals Quiz",
  description: "Test your JavaScript knowledge",
  instructions: "Choose the best answer for each question",
  
  // Settings
  timeLimit: 30, // minutes
  maxAttempts: 2,
  passingScore: 70, // percentage
  showCorrectAnswers: true,
  randomizeQuestions: false,
  
  // Questions (Embedded)
  questions: [{
    _id: ObjectId,
    type: "multiple_choice" | "true_false" | "fill_blank",
    question: "What is the correct way to declare a variable in JavaScript?",
    explanation: "let and const are modern ways to declare variables",
    points: 5,
    order: 1,
    
    // For multiple choice
    options: [{
      text: "var name = 'John'",
      isCorrect: false
    }, {
      text: "let name = 'John'",
      isCorrect: true
    }],
    
    // For true/false
    correctAnswer: true,
    
    // For fill in blank
    acceptedAnswers: ["let", "const", "var"]
  }],
  
  // Student Attempts (Embedded)
  attempts: [{
    _id: ObjectId,
    studentId: ObjectId,
    studentName: "রহিম উদ্দিন", // denormalized
    
    attemptNumber: 1,
    startedAt: Date,
    completedAt: Date,
    timeSpent: 1800, // seconds
    
    // Answers
    answers: [{
      questionId: ObjectId,
      answer: "let name = 'John'",
      isCorrect: true,
      pointsEarned: 5,
      timeSpent: 30 // seconds
    }],
    
    // Results
    results: {
      totalQuestions: 20,
      correctAnswers: 16,
      score: 80,
      percentage: 80,
      passed: true,
      grade: "B+"
    },
    
    status: "completed" | "in_progress" | "abandoned"
  }],
  
  // Statistics
  stats: {
    totalAttempts: 120,
    averageScore: 75,
    passRate: 82,
    averageTime: 1500 // seconds
  },
  
  status: "active" | "archived",
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. **certificates** Collection
```javascript
{
  _id: ObjectId,
  studentId: ObjectId, // ref: users
  courseId: ObjectId, // ref: courses
  enrollmentId: ObjectId, // ref: enrollments
  
  // Certificate Info
  certificateNumber: "CERT-2024-001234", // unique
  title: "Complete Web Development Bootcamp",
  studentName: "রহিম উদ্দিন", // denormalized
  instructorName: "আহমেদ করিম", // denormalized
  
  // Completion Details
  completedAt: Date,
  issuedAt: Date,
  finalScore: 85,
  completionTime: 45, // days taken
  
  // Certificate File
  certificateUrl: "https://cloudinary.com/certificates/cert-001234.pdf",
  
  // Verification
  verificationCode: "VER-ABC123",
  isVerified: true,
  
  // Sharing
  isPublic: true,
  linkedInShared: false,
  
  status: "active" | "revoked",
  createdAt: Date,
  updatedAt: Date
}
```

#### 7. **transactions** Collection (All Payments)
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users (student)
  courseId: ObjectId, // ref: courses
  
  // Transaction Details
  transactionId: "TXN-2024-001234", // unique
  type: "course_purchase" | "refund" | "payout",
  
  // Amount Details
  amount: 1999,
  currency: "BDT",
  originalAmount: 2500,
  discountAmount: 501,
  
  // Payment Info
  paymentMethod: "bkash" | "nagad" | "card" | "bank",
  paymentGateway: "sslcommerz" | "stripe" | "bkash",
  gatewayTransactionId: "SSL123456789",
  
  // For Course Purchase
  courseInfo: {
    courseTitle: "Complete Web Development Bootcamp",
    instructorName: "আহমেদ করিম",
    instructorId: ObjectId
  },
  
  // Revenue Split (for course purchases)
  revenueSplit: {
    instructorShare: 1599, // 80%
    platformShare: 400,    // 20%
    platformFeePercentage: 20
  },
  
  // Payout Info (for instructor payouts)
  payoutInfo: {
    instructorId: ObjectId,
    bankAccount: "1234567890",
    bankName: "Dutch Bangla Bank",
    period: "2024-02"
  },
  
  status: "pending" | "completed" | "failed" | "refunded",
  
  // Timestamps
  createdAt: Date,
  paidAt: Date,
  refundedAt: Date,
  updatedAt: Date
}
```

#### 8. **notifications** Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  
  // Notification Details
  type: "course_update" | "assignment_due" | "quiz_available" | "payment_success" | "certificate_earned",
  title: "New Assignment Available",
  message: "A new assignment has been posted in Web Development course",
  
  // Related Data
  relatedId: ObjectId, // course, assignment, quiz etc.
  relatedType: "course" | "assignment" | "quiz" | "transaction",
  
  // Action Button
  actionUrl: "/dashboard/assignments/123",
  actionText: "View Assignment",
  
  // Status
  isRead: false,
  readAt: Date,
  
  // Priority
  priority: "low" | "medium" | "high" | "urgent",
  
  // Delivery
  channels: {
    inApp: true,
    email: false,
    push: false
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 SIMPLIFIED RELATIONSHIPS

### Primary Connections
```
users ←→ courses (instructorId)
users ←→ enrollments (studentId)
courses ←→ enrollments (courseId)
courses ←→ assignments (courseId)
courses ←→ quizzes (courseId)
enrollments ←→ certificates (enrollmentId)
users ←→ transactions (userId)
users ←→ notifications (userId)
```

### Data Flow Example
```
1. Student enrolls in course → creates enrollment record
2. Student completes lessons → updates progress in enrollment
3. Student submits assignment → adds submission to assignments.submissions[]
4. Student takes quiz → adds attempt to quizzes.attempts[]
5. Student completes course → creates certificate record
6. System sends notification → creates notification record
```

---

## 📁 SIMPLIFIED FILE STRUCTURE

### Database Models (8 Files Only)
```
src/models/
├── User.ts          ✅ EXISTS (enhance)
├── Course.ts        ✅ EXISTS (enhance)
├── Enrollment.ts    🆕 CREATE
├── Assignment.ts    🆕 CREATE
├── Quiz.ts          🆕 CREATE
├── Certificate.ts   🆕 CREATE
├── Transaction.ts   🆕 CREATE
└── Notification.ts  🆕 CREATE
```

### API Routes (Minimal)
```
src/app/api/
├── auth/           ✅ EXISTS
├── courses/        ✅ EXISTS (enhance)
├── enrollments/    🆕 CREATE
├── assignments/    🆕 CREATE
├── quizzes/        🆕 CREATE
├── certificates/   🆕 CREATE
├── transactions/   🆕 CREATE
├── notifications/  🆕 CREATE
└── dashboard/      🆕 CREATE (analytics)
```

### Dashboard Pages (Simple Structure)
```
src/app/dashboard/
├── layout.tsx
├── page.tsx (role-based redirect)
├── student/
│   ├── page.tsx (overview)
│   ├── courses/
│   ├── assignments/
│   ├── quizzes/
│   └── certificates/
├── instructor/
│   ├── page.tsx (overview)
│   ├── courses/
│   ├── students/
│   ├── assignments/
│   └── earnings/
└── admin/
    ├── page.tsx (overview)
    ├── users/
    ├── courses/
    └── transactions/
```

---

## 🎯 IMPLEMENTATION STEPS (Simplified)

### Week 1: Core Setup
1. Fix middleware (`src/proxy.ts` → `src/middleware.ts`)
2. Create Enrollment model & API
3. Enhance Course model with embedded lessons
4. Create basic dashboard layouts

### Week 2: Learning Features
5. Create Assignment model with embedded submissions
6. Create Quiz model with embedded questions & attempts
7. Build assignment submission system
8. Build quiz taking system

### Week 3: Completion & Payments
9. Create Certificate model & generation
10. Create Transaction model for payments
11. Build payment integration
12. Create notification system

### Week 4: Dashboard & Analytics
13. Build student dashboard with progress
14. Build instructor dashboard with earnings
15. Build admin dashboard with overview
16. Add analytics and reporting

---

## 💡 Why This Structure is Better

### ✅ Advantages:
1. **Fewer Collections** - Only 8 instead of 14+
2. **Embedded Data** - Related data stored together (faster queries)
3. **Denormalized** - Common fields duplicated for performance
4. **Simple Relationships** - Easy to understand and maintain
5. **Single Queries** - Most data fetched in one query

### ⚠️ Trade-offs:
1. **Document Size** - Some documents may be larger
2. **Data Duplication** - Some fields stored multiple times
3. **Update Complexity** - Need to update multiple places sometimes

### 🎯 Best For:
- **Read-Heavy Applications** (like LMS)
- **Fast Dashboard Loading**
- **Simple Development**
- **Easy Maintenance**

এই simplified structure দিয়ে আপনি দ্রুত এবং সহজে একটি complete LMS তৈরি করতে পারবেন। সব data efficiently connected এবং dashboard loading অনেক fast হবে।