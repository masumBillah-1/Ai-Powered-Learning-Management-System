# 🎯 Demo Login System & Access Control Guide

## 📋 Demo Login Credentials

### 1️⃣ Admin Demo Account
```
Email: admin@demo.com
Password: demo123
```

### 2️⃣ Instructor Demo Account
```
Email: instructor@demo.com
Password: demo123
```

### 3️⃣ Student Demo Account
```
Email: student@demo.com
Password: demo123
```

---

## 🔐 Role-Based Access Control

### 🎓 STUDENT Role - কি করতে পারবে:

#### ✅ Access আছে:
- **Dashboard**: `/dashboard/student` - নিজের learning progress দেখা
- **Profile**: `/dashboard/profile` - নিজের profile edit করা
- **Courses**: `/dashboard/student/courses` - enrolled courses দেখা
- **Assignments**: `/dashboard/student/assignments` - assignments submit করা
- **Announcements**: `/dashboard/announcements` - সব announcements দেখা
- **Quiz**: `/dashboard/student/quiz` - quiz দেওয়া
- **Certificates**: `/dashboard/student/certificates` - certificates download করা
- **Blog**: `/dashboard/blog` - blog posts পড়া
- **Messages**: `/dashboard/messages` - instructor/admin এর সাথে message করা
- **Settings**: `/dashboard/settings` - account settings change করা
- **Leaderboard**: `/leaderboard` - leaderboard দেখা
- **Learn**: `/learn/[courseId]` - enrolled course এর lessons দেখা (শুধু unlocked lessons)

#### ❌ Access নেই:
- Instructor dashboard (`/dashboard/instructor/*`)
- Admin dashboard (`/dashboard/admin/*`)
- Course creation/editing
- User management
- Earnings/revenue reports
- System settings
- অন্য student এর private data

---

### 👨‍🏫 INSTRUCTOR Role - কি করতে পারবে:

#### ✅ Access আছে:
- **Dashboard**: `/dashboard/instructor` - teaching analytics দেখা
- **Profile**: `/dashboard/profile` - নিজের profile edit করা
- **Courses**: `/dashboard/instructor/courses` - নিজের courses manage করা
  - Course create করা
  - Course edit করা
  - Course delete করা
  - Modules/Lessons add করা
- **Announcements**: `/dashboard/announcements` - announcements দেখা ও পাঠানো
- **Assignments**: `/dashboard/instructor/assignments` - assignments create ও grade করা
- **Students**: `/dashboard/instructor/students` - enrolled students দেখা
- **Quiz**: `/dashboard/instructor/quiz` - quiz create করা
- **Quiz Results**: `/dashboard/instructor/quiz-results` - student results দেখা
- **Earnings**: `/dashboard/instructor/earnings` - নিজের earnings দেখা
- **Blog**: `/dashboard/blog` - blog posts লেখা ও publish করা
- **Messages**: `/dashboard/messages` - students/admin এর সাথে message করা
- **Settings**: `/dashboard/settings` - account settings change করা
- **Learn**: `/learn/[courseId]` - সব courses এর সব lessons দেখা (full access)

#### ❌ Access নেই:
- Admin dashboard (`/dashboard/admin/*`)
- System-wide settings
- User role management
- অন্য instructor এর courses edit করা
- Platform-wide earnings report
- Database status monitoring

---

### 👑 ADMIN Role - কি করতে পারবে:

#### ✅ Access আছে (FULL ACCESS):
- **Dashboard**: `/dashboard/admin` - complete platform analytics
- **Profile**: `/dashboard/profile` - নিজের profile edit করা
- **Courses**: `/dashboard/admin/courses` - সব courses manage করা
  - যেকোনো course approve/reject করা
  - যেকোনো course edit/delete করা
  - Course visibility control করা
- **Users**: `/dashboard/admin/users` - সব users manage করা
  - User create/edit/delete করা
  - User role change করা (student → instructor)
  - User ban/unban করা
  - User activity monitor করা
- **Announcements**: `/dashboard/announcements` - platform-wide announcements পাঠানো
- **Earnings**: `/dashboard/admin/earnings` - complete revenue analytics
  - Platform total earnings
  - Instructor-wise earnings
  - Transaction history
- **Blog**: `/dashboard/blog` - সব blog posts manage করা
- **Messages**: `/dashboard/messages` - সবার সাথে message করা
- **Settings**: `/dashboard/settings` - system settings control করা
  - Demo login enable/disable করা
  - Email settings
  - Payment gateway settings
  - Platform configurations
- **Database Status**: `/api/admin/db-status` - MongoDB connection monitor করা
- **Admin History**: `/api/admin/history/[adminId]` - admin activity logs দেখা
- **Learn**: `/learn/[courseId]` - সব courses এর সব lessons দেখা (full access)

#### ❌ Access নেই:
- কিছুই না! Admin এর সব access আছে 🎉

---

## 🔒 Security Features

### 1. JWT Token Authentication
- সব API routes JWT token verify করে
- Token expire হলে auto logout
- Token localStorage এ secure store করা

### 2. Role-Based Route Protection
```typescript
// Dashboard layout automatically redirects unauthorized users
if (isUnauthorizedPath(pathname, userRole)) {
  router.replace(roleDashboard[userRole]);
}
```

### 3. API Level Authorization
```typescript
// Example: Only admin can access user management
const user = await User.findById(decoded.userId);
if (user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
}
```

### 4. Frontend Route Guards
```typescript
// Shared paths accessible by all roles
const sharedPaths = [
  "/dashboard/profile",
  "/dashboard/messages",
  "/dashboard/settings",
  "/dashboard/announcements",
  "/dashboard/blog",
];
```

---

## 🎨 Demo Login UI Features

### 1. Quick Demo Buttons
- Login page এ 3টি demo button আছে (Admin, Instructor, Student)
- One-click login - কোনো typing লাগে না
- Admin settings থেকে enable/disable করা যায়

### 2. Demo Login Toggle
```typescript
// Admin can control demo login visibility
const settings = await SystemSettings.findOne();
settings.showDemoLogin = true/false;
```

### 3. Visual Indicators
- প্রতিটি role এর জন্য আলাদা color theme:
  - **Student**: Green (#00C48C)
  - **Instructor**: Orange (#F89B29)
  - **Admin**: Pink (#FF0F7B)

---

## 🚀 Demo Login Flow

### Step 1: User clicks demo button
```typescript
handleDemoLogin("admin") // or "instructor" or "student"
```

### Step 2: Auto-fill credentials
```typescript
const credentials = demoCredentials[role];
// { email: "admin@demo.com", password: "demo123" }
```

### Step 3: API Login
```typescript
POST /api/auth/login
Body: { email, password }
```

### Step 4: Store token & user data
```typescript
localStorage.setItem("token", result.token);
localStorage.setItem("user", JSON.stringify(result.user));
```

### Step 5: Redirect to role dashboard
```typescript
router.replace(roleDashboard[role]);
// Admin → /dashboard/admin
// Instructor → /dashboard/instructor
// Student → /dashboard/student
```

---

## 📊 Feature Comparison Table

| Feature | Student | Instructor | Admin |
|---------|---------|------------|-------|
| View own dashboard | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| Enroll in courses | ✅ | ❌ | ✅ |
| Create courses | ❌ | ✅ | ✅ |
| Edit any course | ❌ | Own only | ✅ |
| View all users | ❌ | Limited | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |
| View earnings | Own | Own | All |
| System settings | ❌ | ❌ | ✅ |
| Send announcements | ❌ | Limited | ✅ |
| Access all lessons | Enrolled only | Own courses | All |
| Message anyone | Instructors/Admin | Students/Admin | Everyone |
| Create blog posts | ❌ | ✅ | ✅ |
| Take quizzes | ✅ | ❌ | ❌ |
| Grade assignments | ❌ | ✅ | ✅ |
| View leaderboard | ✅ | ✅ | ✅ |
| Download certificates | ✅ | ❌ | ❌ |

---

## 🛡️ Protected Routes Summary

### Student Only Routes:
```
/dashboard/student
/dashboard/student/courses
/dashboard/student/assignments
/dashboard/student/quiz
/dashboard/student/certificates
```

### Instructor Only Routes:
```
/dashboard/instructor
/dashboard/instructor/courses
/dashboard/instructor/courses/create
/dashboard/instructor/assignments
/dashboard/instructor/students
/dashboard/instructor/quiz
/dashboard/instructor/quiz-results
/dashboard/instructor/earnings
```

### Admin Only Routes:
```
/dashboard/admin
/dashboard/admin/courses
/dashboard/admin/users
/dashboard/admin/earnings
/api/admin/settings
/api/admin/db-status
/api/admin/history/[adminId]
```

### Shared Routes (All Roles):
```
/dashboard/profile
/dashboard/messages
/dashboard/settings
/dashboard/announcements
/dashboard/blog
/leaderboard
```

---

## 🎯 Testing Demo Accounts

### Test করার জন্য:
1. Login page এ যান: `http://localhost:3000/login`
2. Demo button click করুন (Admin/Instructor/Student)
3. Auto-login হবে
4. Role-specific dashboard দেখবেন
5. Different features test করুন

### Demo Account এ কি করা যাবে না:
- Real payment processing (test mode এ থাকবে)
- Email sending (console এ log হবে)
- External API calls (mock data দেখাবে)

---

## 📝 Notes

1. **Demo accounts সবসময় available থাকবে** - database এ pre-seeded
2. **Demo login button admin settings থেকে hide করা যায়**
3. **Production এ demo accounts disable করা recommended**
4. **Demo accounts এর data reset করা যায় admin panel থেকে**

---

## 🔧 Admin Settings Control

Admin dashboard থেকে demo login control করা যায়:

```typescript
// GET /api/admin/settings
{
  "showDemoLogin": true/false
}

// PUT /api/admin/settings
{
  "showDemoLogin": false // Hide demo buttons
}
```

---

**Last Updated**: March 26, 2026
**Version**: 2.0
