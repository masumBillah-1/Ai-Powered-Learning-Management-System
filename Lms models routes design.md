# 🏗️ LMS Pro — Complete Models & Routes Design
## কোন Model কী করে, কোন Route কী করে — সম্পূর্ণ গাইড

---

## 📁 PART 1: MODELS (`src/models/`)

```
src/models/
├── User.ts           ← সব user (student/instructor/admin)
├── Course.ts         ← course + modules + lessons + reviews
├── Enrollment.ts     ← student progress + certificate
├── Transaction.ts    ← payment + payout + refund
├── Message.ts        ← real-time chat
├── Notification.ts   ← personal + broadcast notifications
└── index.ts          ← সব export একসাথে
```

### প্রতিটি Model কী কী কাজ করে:

| Model | Primary Job | Embedded Data | Referenced By |
|-------|-------------|---------------|---------------|
| `User` | Auth + Profile + Stats | — | Enrollment, Transaction, Message, Notification |
| `Course` | Content structure | modules → lessons, reviews, faqs | Enrollment, Transaction |
| `Enrollment` | Progress tracking | quizResults, certificate | — |
| `Transaction` | Financial records | — | — |
| `Message` | Chat history | — | — |
| `Notification` | Alerts + Announcements | — | — |

---

## 📁 PART 2: API ROUTES (`src/app/api/`)

```
src/app/api/
│
├── auth/
│   ├── register/route.ts           POST   → নতুন account তৈরি
│   ├── login/route.ts              POST   → login + JWT cookie set
│   ├── logout/route.ts             POST   → cookie clear
│   ├── verify-otp/route.ts         POST   → OTP check
│   ├── become-instructor/route.ts  POST   → student → instructor upgrade
│   └── [action]/route.ts           POST   → google/github OAuth callback
│
├── profile/route.ts                GET PUT → profile দেখা + update
│
├── courses/
│   ├── route.ts                    GET POST → course list + নতুন course তৈরি
│   └── [id]/route.ts               GET PUT DELETE → single course
│
├── enrollments/route.ts            GET POST PUT → enroll + progress update
│
├── transactions/route.ts           GET POST PUT → payment + payout
│
├── dashboard/route.ts              GET → role-based dashboard data
│
├── notifications/route.ts          GET POST PUT → notifications
│
├── messages/
│   ├── route.ts                    GET POST → messages list + send
│   └── [roomId]/route.ts           GET → specific room messages
│
└── chat/route.ts                   POST → AI chat (existing)
```

---

## 🔍 PART 3: প্রতিটি Route বিস্তারিত

---

### 🔐 `/api/auth/` — Authentication

#### `POST /api/auth/register`
```
কী করে:   নতুন user তৈরি করে
Input:    { name, email, password, role? }
Output:   { success, user }
DB:       User.create()
Steps:
  1. email already আছে কিনা check
  2. password hash করে save
  3. OTP পাঠায় (optional)
  4. JWT token cookie তে set করে
```

#### `POST /api/auth/login`
```
কী করে:   Login + JWT set
Input:    { email, password }
Output:   { success, user, token }
DB:       User.findOne({ email })
Steps:
  1. user খোঁজে
  2. password compare করে (bcrypt)
  3. loginAttempts check করে (lockout)
  4. JWT cookie set করে
  5. lastLogin update করে
```

#### `POST /api/auth/logout`
```
কী করে:   Cookie clear করে logout
Input:    —
Output:   { success }
DB:       —
```

#### `POST /api/auth/verify-otp`
```
কী করে:   OTP verify করে isVerified = true করে
Input:    { email, otp }
Output:   { success }
DB:       User.findOneAndUpdate()
```

#### `POST /api/auth/become-instructor`
```
কী করে:   Student কে instructor বানায়
Input:    { expertise, bio, bankDetails? }
Output:   { success, user }
DB:       User.findByIdAndUpdate({ role: "instructor" })
```

---

### 👤 `/api/profile/` — Profile Management

#### `GET /api/profile`
```
কী করে:   নিজের profile দেখায়
Input:    cookie (JWT)
Output:   { user }
DB:       User.findById(decoded.userId)
          .select("-password -resetToken")
```

#### `PUT /api/profile`
```
কী করে:   Profile update করে
Input:    { name?, bio?, phone?, address?, socialLinks?, preferences?, photoURL? }
Output:   { success, user }
DB:       User.findByIdAndUpdate()
Note:     password change আলাদা field দিয়ে handle করা উচিত
```

---

### 📚 `/api/courses/` — Course Management

#### `GET /api/courses`
```
কী করে:   Published courses list দেখায়
Input:    ?category=&level=&search=&page=&limit=
Output:   { courses, total, page }
DB:       Course.find({ status: "published", visibility: "public" })
          .select("title slug coverImage pricing stats instructorId level category")
          .populate("instructorId", "name photoURL")
Note:     Full modules/reviews load করে না (performance)
```

#### `POST /api/courses`
```
কী করে:   নতুন course তৈরি করে (instructor only)
Input:    { title, category, level, description, pricing, language }
Output:   { success, course }
DB:       Course.create({ ...data, instructorId: decoded.userId })
Auth:     role === "instructor" | "admin"
```

#### `GET /api/courses/[id]`
```
কী করে:   Single course সম্পূর্ণ data দেখায়
Input:    course _id or slug
Output:   { course } (সব modules, lessons, reviews সহ)
DB:       Course.findById(id).populate("instructorId", "name photoURL bio stats")
Note:     Enrolled কিনা check করে lesson content show/hide করে
```

#### `PUT /api/courses/[id]`
```
কী করে:   Course update করে
Input:    যেকোনো course field
Output:   { success, course }
DB:       Course.findByIdAndUpdate()
Auth:     instructorId === decoded.userId | admin
```

#### `DELETE /api/courses/[id]`
```
কী করে:   Course archive করে (delete নয়)
Input:    —
Output:   { success }
DB:       Course.findByIdAndUpdate({ status: "archived" })
Auth:     instructorId === decoded.userId | admin
```

---

### 📝 `/api/enrollments/` — Enrollment & Progress

#### `GET /api/enrollments`
```
কী করে:   User এর সব enrollment দেখায়
Input:    ?courseId= (optional filter)
Output:   { enrollments }
DB:       Enrollment.find({ studentId: decoded.userId })
Note:     courseName, courseImage denormalized তাই populate লাগে না
```

#### `POST /api/enrollments`
```
কী করে:   Course এ enroll করে
Input:    { courseId }
Output:   { success, enrollment }
DB:       1. Enrollment.create()
          2. Course.findByIdAndUpdate({ $inc: { "stats.enrolledCount": 1 } })
          3. User.findByIdAndUpdate({ $inc: { "stats.enrolledCourses": 1 } })
          4. Notification.create({ type: "payment", userId })
Note:     Paid course হলে আগে transaction complete check করে
```

#### `PUT /api/enrollments`
```
কী করে:   Lesson progress update করে
Input:    { courseId, lessonId, timeSpent, completed }
Output:   { success, enrollment }
DB:       Enrollment.findOneAndUpdate({ studentId, courseId })
Steps:
  1. completedLessons array তে lessonId push করে
  2. progressPercentage recalculate করে
  3. 100% হলে status = "completed", certificate issue করে
  4. User stats.completedCourses $inc করে
```

---

### 💰 `/api/transactions/` — Payments & Payouts

#### `GET /api/transactions`
```
কী করে:   User এর সব transactions দেখায়
Input:    ?type=payment|payout&status=
Output:   { transactions }
DB:       Transaction.find({ $or: [{ studentId }, { instructorId }] })
```

#### `POST /api/transactions`
```
কী করে:   Payment initiate করে
Input:    { courseId, paymentMethod, amount }
Output:   { success, transaction, paymentUrl? }
DB:       Transaction.create({ type: "payment", status: "pending" })
Steps:
  1. Course price verify করে
  2. Transaction record তৈরি করে
  3. Payment gateway call করে (bKash/Nagad/Card)
  4. Callback URL return করে
Note:     Payment complete হলে PUT দিয়ে status update + enrollment create
```

#### `PUT /api/transactions`
```
কী করে:   Payment status update করে (gateway callback)
Input:    { transactionId, status, paymentId, gatewayResponse }
Output:   { success, transaction }
DB:       Transaction.findByIdAndUpdate()
Steps:
  1. Status "completed" হলে Enrollment.create() trigger করে
  2. Instructor stats.totalEarnings update করে
  3. Course stats.totalRevenue update করে
```

---

### 📊 `/api/dashboard/` — Dashboard Data

#### `GET /api/dashboard`
```
কী করে:   Role অনুযায়ী dashboard data দেয়
Input:    JWT cookie (role auto-detect হয়)
Output:   role অনুযায়ী আলাদা data

Student Dashboard:
  - User stats (enrolledCourses, completedCourses, certificates)
  - Recent enrollments (last 5)
  - Recent transactions (last 5)
  - Unread notification count

Instructor Dashboard:
  - User stats (totalCourses, totalStudents, totalEarnings)
  - Course list with stats
  - Recent enrollments in their courses
  - Monthly earnings (last 6 months from transactions)

Admin Dashboard:
  - Total users, courses, enrollments, revenue
  - Recent transactions
  - Pending course approvals
  - User growth stats

DB queries (parallel):
  Student:    User.findById + Enrollment.find + Transaction.find + Notification.countDocuments
  Instructor: User.findById + Course.find + Enrollment.find + Transaction.aggregate
  Admin:      User.count + Course.count + Enrollment.count + Transaction.aggregate
```

---

### 🔔 `/api/notifications/` — Notifications

#### `GET /api/notifications`
```
কী করে:   User এর সব notifications দেখায় (personal + broadcast)
Input:    ?unread=true (optional)
Output:   { notifications, unreadCount }
DB:       Notification.find({
            $or: [
              { userId: decoded.userId },
              { isBroadcast: true, targetRole: { $in: ["all", userRole] } }
            ]
          }).sort({ createdAt: -1 }).limit(20)
```

#### `POST /api/notifications`
```
কী করে:   Notification তৈরি করে (admin only broadcast)
Input:    { title, message, type, targetRole, actionUrl? }
Output:   { success, notification }
DB:       Notification.create({ isBroadcast: true, ...data })
Auth:     role === "admin"
```

#### `PUT /api/notifications`
```
কী করে:   Notification read করে
Input:    { notificationId } | { markAllRead: true }
Output:   { success }
DB:       Notification.findByIdAndUpdate({ isRead: true, readAt: new Date() })
          অথবা Notification.updateMany({ userId, isRead: false })
```

---

### 💬 `/api/messages/` — Chat

#### `GET /api/messages`
```
কী করে:   User এর সব chat rooms দেখায়
Input:    —
Output:   { rooms: [{ roomId, lastMessage, unreadCount }] }
DB:       Message.aggregate([
            { $match: { senderId: userId OR readBy query } },
            { $group: { _id: "$roomId", lastMessage: { $last: "$$ROOT" } } }
          ])
```

#### `POST /api/messages`
```
কী করে:   নতুন message পাঠায়
Input:    { roomId, content, type? }
Output:   { success, message }
DB:       Message.create()
Note:     Socket.io দিয়ে real-time emit করে
```

#### `GET /api/messages/[roomId]`
```
কী করে:   Specific room এর messages দেখায়
Input:    ?page=&limit=50
Output:   { messages, hasMore }
DB:       Message.find({ roomId }).sort({ createdAt: -1 }).limit(50)
Steps:
  1. Messages load করে
  2. readBy তে userId push করে (read receipt)
```

---

## 🔄 PART 4: Data Flow Diagrams

### Student Course Enrollment Flow:
```
Student clicks "Buy Now"
        ↓
POST /api/transactions
  → Transaction created (status: pending)
  → Payment gateway redirect
        ↓
Payment gateway callback
        ↓
PUT /api/transactions
  → Transaction status: completed
  → POST /api/enrollments (auto-trigger)
      → Enrollment created
      → Course.stats.enrolledCount ++
      → User.stats.enrolledCourses ++
      → Notification created (payment success)
        ↓
Student এখন course access পাবে ✅
```

### Lesson Progress Update Flow:
```
Student watches video / completes quiz
        ↓
PUT /api/enrollments
  { courseId, lessonId, timeSpent: 15, completed: true }
        ↓
Enrollment updated:
  → completedLessons.push(lessonId)
  → progressPercentage = (completed/total) * 100
  → User.stats.totalTimeSpent += 15
        ↓
progressPercentage === 100?
  → YES: status = "completed"
         certificate.issued = true
         User.stats.completedCourses ++
         Notification: "Certificate Ready!"
  → NO:  continue...
```

### Instructor Payout Flow:
```
Admin clicks "Process Payout"
        ↓
POST /api/transactions
  { type: "payout", instructorId, amount, payoutMethod }
        ↓
Transaction created (status: pending)
  → Bank/bKash transfer initiate
        ↓
PUT /api/transactions
  { status: "completed", payoutReference }
        ↓
Notification to instructor: "Payout processed ৳15,000"
```

---

## 📋 PART 5: Middleware & Auth Pattern

### সব protected route এ এই pattern follow করো:

```typescript
// src/lib/auth.ts — helper function

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    return decoded;
  } catch {
    return null;
  }
}

// Usage in any route:
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "instructor") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // ... rest of the logic
}
```

---

## 🗂️ PART 6: Complete File List

### Models (6 files):
```
src/models/User.ts          ✅ update দরকার (notifications remove)
src/models/Course.ts        ✅ ready
src/models/Enrollment.ts    ✅ ready
src/models/Transaction.ts   ✅ ready
src/models/Message.ts       ❌ তৈরি করতে হবে
src/models/Notification.ts  ❌ তৈরি করতে হবে
src/models/index.ts         ❌ update দরকার (6 exports)
```

### API Routes (13 files):
```
src/app/api/auth/register/route.ts          ✅ আছে
src/app/api/auth/login/route.ts             ✅ আছে
src/app/api/auth/logout/route.ts            ✅ আছে
src/app/api/auth/verify-otp/route.ts        ✅ আছে
src/app/api/auth/become-instructor/route.ts ✅ আছে
src/app/api/auth/[action]/route.ts          ✅ আছে
src/app/api/profile/route.ts                ✅ আছে
src/app/api/courses/route.ts                ✅ আছে
src/app/api/courses/[id]/route.ts           ✅ আছে
src/app/api/enrollments/route.ts            ❌ তৈরি করতে হবে
src/app/api/transactions/route.ts           ❌ তৈরি করতে হবে
src/app/api/dashboard/route.ts              ❌ তৈরি করতে হবে
src/app/api/notifications/route.ts          ✅ আছে (check করো)
src/app/api/messages/route.ts               ✅ আছে (update দরকার)
src/app/api/messages/[roomId]/route.ts      ❌ তৈরি করতে হবে
src/app/api/chat/route.ts                   ✅ আছে (AI chat)
```

### Priority Order (কোনটা আগে করবে):
```
1. Message.ts + Notification.ts models তৈরি করো
2. models/index.ts update করো
3. /api/enrollments/route.ts তৈরি করো  ← সবচেয়ে important
4. /api/transactions/route.ts তৈরি করো
5. /api/dashboard/route.ts তৈরি করো
6. /api/messages/[roomId]/route.ts তৈরি করো
```

---

## ✅ Summary Table

| Route | Method | Auth | কী করে |
|-------|--------|------|--------|
| `/api/auth/register` | POST | ❌ | নতুন user তৈরি |
| `/api/auth/login` | POST | ❌ | Login + cookie |
| `/api/auth/logout` | POST | ✅ | Logout |
| `/api/profile` | GET | ✅ | নিজের profile |
| `/api/profile` | PUT | ✅ | Profile update |
| `/api/courses` | GET | ❌ | Published courses |
| `/api/courses` | POST | Instructor | নতুন course |
| `/api/courses/[id]` | GET | ❌ | Course detail |
| `/api/courses/[id]` | PUT | Instructor | Course update |
| `/api/enrollments` | GET | Student | আমার courses |
| `/api/enrollments` | POST | Student | Enroll |
| `/api/enrollments` | PUT | Student | Progress update |
| `/api/transactions` | GET | ✅ | My transactions |
| `/api/transactions` | POST | Student | Payment initiate |
| `/api/transactions` | PUT | ✅ | Payment callback |
| `/api/dashboard` | GET | ✅ | Dashboard data |
| `/api/notifications` | GET | ✅ | My notifications |
| `/api/notifications` | POST | Admin | Broadcast |
| `/api/notifications` | PUT | ✅ | Mark as read |
| `/api/messages` | GET | ✅ | Chat rooms |
| `/api/messages` | POST | ✅ | Send message |
| `/api/messages/[roomId]` | GET | ✅ | Room messages |
| `/api/chat` | POST | ✅ | AI chat |