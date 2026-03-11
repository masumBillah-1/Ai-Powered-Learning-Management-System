# 📊 Dashboard Data Mapping Guide - Collection Structure

## 🗂️ **Collections Overview (6 Total)**

### **Main Collections:**
1. **users** - User profiles, stats, preferences
2. **courses** - Course content, modules, lessons
3. **enrollments** - Student-course relationships
4. **transactions** - Payment/payout records
5. **messages** - Chat/messaging system
6. **notifications** - System notifications

---

## 🎯 **Dashboard Menu → Collection Mapping**

### **👨‍🎓 STUDENT Dashboard Pages**

#### **1. Student Dashboard (`/dashboard/student`)**
**Data Sources:**
- **users** collection → student stats, profile info
- **enrollments** collection → enrolled courses, progress
- **transactions** collection → payment history
- **notifications** collection → recent notifications

**Sample Data:**
```json
// From users collection
{
  "_id": "student_123",
  "name": "রহিম উদ্দিন",
  "role": "student",
  "stats": {
    "enrolledCourses": 5,
    "completedCourses": 2,
    "certificatesEarned": 2,
    "totalLearningTime": 1250
  }
}

// From enrollments collection
{
  "studentId": "student_123",
  "courseId": "course_456",
  "progress": {
    "progressPercentage": 65,
    "completedLessons": ["lesson_1", "lesson_2"],
    "totalTimeSpent": 180
  },
  "status": "active"
}
```

#### **2. Student Courses (`/dashboard/student/courses`)**
**Data Sources:**
- **enrollments** collection → enrolled courses list
- **courses** collection → course details (populated)

**Sample Data:**
```json
// Enrollment with populated course
{
  "studentId": "student_123",
  "courseId": {
    "title": "Complete JavaScript Fundamentals",
    "coverImage": {"url": "..."},
    "pricing": {"price": 2500}
  },
  "progress": {"progressPercentage": 65},
  "enrolledAt": "2024-03-01T10:00:00Z"
}
```

#### **3. Student Assignments (`/dashboard/student/assignments`)**
**Data Sources:**
- **enrollments** collection → assignment results embedded
- **courses** collection → assignment details from lessons

**Sample Data:**
```json
// In enrollments collection
{
  "results": [
    {
      "lessonId": "lesson_5",
      "type": "assignment",
      "score": 85,
      "maxScore": 100,
      "submittedAt": "2024-03-05T14:30:00Z",
      "feedback": "Good work! Improve error handling."
    }
  ]
}
```

#### **4. Student Quiz (`/dashboard/student/quiz`)**
**Data Sources:**
- **enrollments** collection → quiz results embedded
- **courses** collection → quiz questions from lessons

#### **5. Student Certificates (`/dashboard/student/certificates`)**
**Data Sources:**
- **enrollments** collection → certificate info embedded

**Sample Data:**
```json
// In enrollments collection
{
  "certificate": {
    "issued": true,
    "issuedAt": "2024-03-10T12:00:00Z",
    "certificateUrl": "https://cloudinary.com/cert_123.pdf",
    "verificationCode": "CERT_JS_2024_001"
  }
}
```

---

### **👨‍🏫 INSTRUCTOR Dashboard Pages**

#### **1. Instructor Dashboard (`/dashboard/instructor`)**
**Data Sources:**
- **users** collection → instructor stats
- **courses** collection → instructor's courses
- **enrollments** collection → student enrollments in instructor's courses
- **transactions** collection → earnings data

**Sample Data:**
```json
// From users collection
{
  "_id": "instructor_456",
  "name": "জন স্মিথ",
  "role": "instructor",
  "stats": {
    "totalCourses": 8,
    "totalStudents": 1250,
    "totalEarnings": 125000,
    "rating": 4.8
  }
}
```

#### **2. Instructor Courses (`/dashboard/instructor/courses`)**
**Data Sources:**
- **courses** collection → instructor's courses
- **enrollments** collection → enrollment count per course

#### **3. Instructor Course Create (`/dashboard/instructor/courses/create`)**
**Data Sources:**
- **courses** collection → create/update course data

#### **4. Instructor Announcements (`/dashboard/instructor/announcements`)**
**Data Sources:**
- **notifications** collection → announcements created by instructor

**Sample Data:**
```json
// In notifications collection
{
  "userId": "all_students", // or specific student IDs
  "type": "announcement",
  "title": "নতুন লেসন যোগ করা হয়েছে",
  "message": "JavaScript Advanced কোর্সে নতুন ভিডিও আপলোড হয়েছে",
  "courseId": "course_123",
  "createdBy": "instructor_456"
}
```

#### **5. Instructor Assignments (`/dashboard/instructor/assignments`)**
**Data Sources:**
- **courses** collection → assignment lessons
- **enrollments** collection → student submissions

#### **6. Instructor Students (`/dashboard/instructor/students`)**
**Data Sources:**
- **enrollments** collection → students enrolled in instructor's courses
- **users** collection → student details (populated)

#### **7. Instructor Quiz (`/dashboard/instructor/quiz`)**
**Data Sources:**
- **courses** collection → quiz lessons
- **enrollments** collection → quiz results

#### **8. Instructor Quiz Results (`/dashboard/instructor/quiz-results`)**
**Data Sources:**
- **enrollments** collection → all quiz results for instructor's courses

#### **9. Instructor Earnings (`/dashboard/instructor/earnings`)**
**Data Sources:**
- **transactions** collection → instructor's earnings
- **users** collection → earnings stats

**Sample Data:**
```json
// From transactions collection
{
  "type": "payment",
  "instructorId": "instructor_456",
  "amount": 2500,
  "platformFee": 250,
  "netAmount": 2250,
  "courseId": "course_123",
  "status": "completed"
}
```

---

### **👨‍💼 ADMIN Dashboard Pages**

#### **1. Admin Dashboard (`/dashboard/admin`)**
**Data Sources:**
- **users** collection → total users count
- **courses** collection → total courses count
- **transactions** collection → revenue data
- **enrollments** collection → enrollment stats

**Sample Data:**
```json
// Aggregated stats
{
  "totalUsers": 1278,
  "totalCourses": 94,
  "totalRevenue": 482000,
  "totalEnrollments": 5420,
  "pendingApprovals": 3
}
```

#### **2. Admin Users (`/dashboard/admin/users`)**
**Data Sources:**
- **users** collection → all users with filtering

**Sample Data:**
```json
// Users list with stats
{
  "_id": "user_123",
  "name": "রহিম উদ্দিন",
  "email": "rahim@example.com",
  "role": "student",
  "status": "active",
  "stats": {
    "enrolledCourses": 5,
    "totalEarnings": 0
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### **3. Admin Courses (`/dashboard/admin/courses`)**
**Data Sources:**
- **courses** collection → all courses
- **users** collection → instructor details (populated)
- **enrollments** collection → enrollment counts

#### **4. Admin Announcements (`/dashboard/admin/announcements`)**
**Data Sources:**
- **notifications** collection → system-wide announcements

#### **5. Admin Earnings (`/dashboard/admin/earnings`)**
**Data Sources:**
- **transactions** collection → all platform transactions
- **users** collection → instructor earnings

---

### **🔄 SHARED Dashboard Pages**

#### **1. Messages (`/dashboard/messages`)**
**Data Sources:**
- **messages** collection → user conversations

**Sample Data:**
```json
// Message thread
{
  "senderId": "user_123",
  "receiverId": "user_456",
  "content": "আপনার কোর্স সম্পর্কে জানতে চাই",
  "messageType": "text",
  "isRead": false,
  "createdAt": "2024-03-09T15:30:00Z"
}
```

#### **2. Profile (`/dashboard/profile`)**
**Data Sources:**
- **users** collection → user profile data

#### **3. Settings (`/dashboard/settings`)**
**Data Sources:**
- **users** collection → user preferences

**Sample Data:**
```json
// User preferences
{
  "preferences": {
    "emailNotifications": true,
    "pushNotifications": true,
    "theme": "dark",
    "language": "bn"
  }
}
```

---

## 📊 **API Endpoints → Collection Mapping**

### **Dashboard API (`/api/dashboard`)**
**Query Parameters:**
- `?role=student` → users + enrollments + transactions
- `?role=instructor` → users + courses + enrollments + transactions  
- `?role=admin` → users + courses + enrollments + transactions (all)

### **Enrollments API (`/api/enrollments`)**
- `GET` → enrollments collection (with course population)
- `POST` → create enrollment + update course.enrolledCount
- `PUT` → update enrollment progress

### **Transactions API (`/api/transactions`)**
- `GET` → transactions collection (filtered by user)
- `POST` → create payment transaction
- `PUT` → update transaction status

### **Notifications API (`/api/notifications`)**
- `GET` → notifications collection (filtered by user)
- `POST` → create notification
- `PUT` → mark as read

### **Messages API (`/api/chat`)**
- `GET` → messages collection (conversation threads)
- `POST` → create message
- `PUT` → mark as read

---

## 🗄️ **Collection Size Estimates**

### **Production Scale (10K Users):**
1. **users**: ~10,000 documents (~50MB)
2. **courses**: ~1,000 documents (~50MB)
3. **enrollments**: ~50,000 documents (~100MB)
4. **transactions**: ~20,000 documents (~40MB)
5. **messages**: ~100,000 documents (~200MB)
6. **notifications**: ~200,000 documents (~100MB)

**Total Database Size: ~540MB** (Very manageable!)

---

## 🔍 **Query Patterns**

### **Student Dashboard Load:**
```javascript
// Single API call loads everything
GET /api/dashboard?role=student&userId=student_123

// Returns aggregated data from:
// - users (profile + stats)
// - enrollments (courses + progress)
// - transactions (payment history)
// - notifications (recent alerts)
```

### **Instructor Dashboard Load:**
```javascript
GET /api/dashboard?role=instructor&userId=instructor_456

// Returns aggregated data from:
// - users (profile + stats)
// - courses (instructor's courses)
// - enrollments (student enrollments)
// - transactions (earnings data)
```

### **Course Progress Update:**
```javascript
PUT /api/enrollments
{
  "courseId": "course_123",
  "lessonId": "lesson_5",
  "timeSpent": 15,
  "completed": true
}

// Updates enrollment.progress in enrollments collection
```

---

## 💡 **Optimization Tips**

### **Indexing Strategy:**
```javascript
// users collection
db.users.createIndex({ "role": 1, "status": 1 })
db.users.createIndex({ "email": 1 }, { unique: true })

// courses collection  
db.courses.createIndex({ "instructorId": 1 })
db.courses.createIndex({ "status": 1, "visibility": 1 })

// enrollments collection
db.enrollments.createIndex({ "studentId": 1 })
db.enrollments.createIndex({ "courseId": 1 })
db.enrollments.createIndex({ "studentId": 1, "courseId": 1 }, { unique: true })

// transactions collection
db.transactions.createIndex({ "studentId": 1, "type": 1 })
db.transactions.createIndex({ "instructorId": 1, "type": 1 })
db.transactions.createIndex({ "status": 1, "createdAt": -1 })

// messages collection
db.messages.createIndex({ "senderId": 1, "receiverId": 1 })
db.messages.createIndex({ "receiverId": 1, "isRead": 1 })

// notifications collection
db.notifications.createIndex({ "userId": 1, "createdAt": -1 })
db.notifications.createIndex({ "userId": 1, "isRead": 1 })
```

### **Aggregation Pipelines:**
```javascript
// Instructor earnings calculation
db.transactions.aggregate([
  { $match: { instructorId: ObjectId("..."), type: "payment", status: "completed" } },
  { $group: { 
    _id: null, 
    totalEarnings: { $sum: "$netAmount" },
    totalTransactions: { $sum: 1 }
  }}
])

// Course enrollment stats
db.enrollments.aggregate([
  { $match: { courseId: ObjectId("...") } },
  { $group: {
    _id: "$status",
    count: { $sum: 1 },
    avgProgress: { $avg: "$progress.progressPercentage" }
  }}
])
```

---

## 🎯 **Implementation Priority**

### **Week 1: Core Data Flow**
1. ✅ Complete dashboard API (`/api/dashboard`)
2. ✅ Complete enrollments API (`/api/enrollments`)
3. ✅ Complete transactions API (`/api/transactions`)

### **Week 2: Enhanced Features**
4. ✅ Complete notifications API (`/api/notifications`)
5. ✅ Complete messages API (`/api/chat`)
6. ✅ Add real-time updates (Socket.io)

### **Week 3: Optimization**
7. ✅ Add proper indexing
8. ✅ Implement caching (Redis)
9. ✅ Add analytics aggregation

**Result: Complete LMS with optimized data structure!** 🚀