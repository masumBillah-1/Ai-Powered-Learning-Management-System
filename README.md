# 🎓 CareerCanvas - AI-Powered Learning Management System

<div align="center">

![Project Status](https://img.shields.io/badge/status-in%20development-blue)
![Next.js](https://img.shields.io/badge/Next.js-16+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**A modern, full-featured Learning Management System with AI-powered features, role-based dashboards, and gamification elements.**

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Color Scheme](#-color-scheme-analysis) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [🎨 Color Scheme Analysis](#-color-scheme-analysis)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Team Collaboration](#-team-collaboration)
- [Git Workflow](#-git-workflow)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

This Learning Management System (LMS) is built to provide a comprehensive educational platform with three distinct user roles: **Students**, **Instructors**, and **Admins**. The platform features AI-powered recommendations, gamification, and real-time analytics.

### 🎯 Project Goals

- ✅ Create an intuitive learning experience for students
- ✅ Empower instructors with course management tools
- ✅ Provide admins with comprehensive analytics
- ✅ Implement AI-driven personalization
- ✅ Gamify the learning process

---

## 🎨 Color Scheme Analysis

### 🌈 Primary Brand Colors (Core Palette)

<div align="center">

| Color | Hex Code | Usage | Preview |
|-------|----------|-------|---------|
| **Hot Pink** | `#FF0F7B` | Primary brand color | ![#FF0F7B](https://via.placeholder.com/50x30/FF0F7B/FFFFFF?text=+) |
| **Orange** | `#F89B29` | Secondary brand color | ![#F89B29](https://via.placeholder.com/50x30/F89B29/FFFFFF?text=+) |
| **Purple** | `#832388` | Tertiary brand color | ![#832388](https://via.placeholder.com/50x30/832388/FFFFFF?text=+) |
| **Rose Pink** | `#E3436B` | Accent color | ![#E3436B](https://via.placeholder.com/50x30/E3436B/FFFFFF?text=+) |
| **Yellow** | `#FDE047` | Highlight color | ![#FDE047](https://via.placeholder.com/50x30/FDE047/000000?text=+) |

</div>

### 🎯 CSS Variables (HeroSection)

```css
:root {
  --bp: #FF0F7B;   /* Brand Pink */
  --bo: #F89B29;   /* Brand Orange */
  --bpu: #832388;  /* Brand Purple */
  --br: #E3436B;   /* Brand Rose */
  --by: #FDE047;   /* Brand Yellow */
}
```

### 🌟 Gradient Combinations

#### **Primary Gradients:**
1. **Main Gradient:** `linear-gradient(135deg, #FF0F7B 0%, #E3436B 50%, #F89B29 100%)`
2. **Secondary Gradient:** `linear-gradient(135deg, #832388 0%, #E3436B 55%, #F89B29 100%)`
3. **Button Gradient:** `from-[#832388] via-[#E3436B] to-[#F0772F]`

### 🌓 Theme Colors

#### **Light Theme:**
- **Background:** `#ffffff`
- **Foreground:** `#171717`
- **Nav Background:** `#ffffff`
- **Border:** `#f3f4f6`

#### **Dark Theme:**
- **Background:** `#0b1120`, `#05010D`
- **Foreground:** `#ededed`
- **Nav Background:** `#0b1120`
- **Border:** `#1f2937`
- **Card Background:** `#120B1E`
- **Card Border:** `#2D2438`

### 🎨 Component-Specific Colors

#### **FAQ Component:**
| Tag | Color | Preview |
|-----|-------|---------|
| Curriculum | `#FF0F7B` | ![#FF0F7B](https://via.placeholder.com/30x20/FF0F7B/FFFFFF?text=+) |
| Beginner | `#00C48C` | ![#00C48C](https://via.placeholder.com/30x20/00C48C/FFFFFF?text=+) |
| Projects | `#F89B29` | ![#F89B29](https://via.placeholder.com/30x20/F89B29/FFFFFF?text=+) |
| Career | `#832388` | ![#832388](https://via.placeholder.com/30x20/832388/FFFFFF?text=+) |
| Schedule | `#61DAFB` | ![#61DAFB](https://via.placeholder.com/30x20/61DAFB/000000?text=+) |
| Tools | `#E3436B` | ![#E3436B](https://via.placeholder.com/30x20/E3436B/FFFFFF?text=+) |

#### **Timeline Component:**
- **Success Green:** `#00ED64` ![#00ED64](https://via.placeholder.com/30x20/00ED64/FFFFFF?text=+)

#### **SplashScreen:**
- **Light Background:** `from-white via-purple-50 to-orange-50`
- **Dark Background:** `from-[#05010D] via-[#120B1E] to-[#1a0f2e]`

### 📧 Email Template Colors
- **Header Gradient:** `linear-gradient(135deg,#832388 0%,#E3436B 50%,#F0772F 100%)`
- **Button Gradient:** `linear-gradient(90deg,#832388,#E3436B,#F0772F)`
- **Text Colors:** `#1f2937`, `#6b7280`, `#9ca3af`
- **Warning Box:** `#fee2e2` background, `#ef4444` border
- **Info Box:** `#fef3c7` background, `#f59e0b` border

### 🛠️ Utility Colors

| Type | Colors | Usage |
|------|--------|-------|
| **Success** | `#10b981`, `#4ade80`, `#00C48C`, `#00ED64` | Success states, completed actions |
| **Error** | `#ef4444`, `#991b1b` | Error messages, failed actions |
| **Warning** | `#f59e0b`, `#92400e` | Warning messages, caution states |
| **Info** | `#6366f1` | Information messages |
| **Gray Scale** | `#f9fafb`, `#e5e7eb`, `#6b7280`, `#9ca3af` | Text, borders, backgrounds |

### 🎯 Color Usage Pattern

#### **Consistent Brand Application:**
1. **Primary Actions:** Hot Pink (`#FF0F7B`) to Orange (`#F89B29`) gradient
2. **Secondary Actions:** Purple (`#832388`) to Rose (`#E3436B`) gradient  
3. **Highlights:** Yellow (`#FDE047`)
4. **Success States:** Various greens
5. **Error States:** Red variants
6. **Text:** Grayscale with brand color accents

### 🏆 Brand Identity

Your color scheme creates a **vibrant, modern, and energetic** brand identity perfect for an educational platform. The pink-to-orange gradient suggests **creativity and innovation**, while the purple adds **sophistication and depth**.

**The colors are consistently applied across:**
- ✅ Buttons and CTAs
- ✅ Email templates  
- ✅ Loading screens
- ✅ Component highlights
- ✅ Text gradients
- ✅ Background elements

This creates a **cohesive visual experience** throughout the entire application.

---

## ✨ Key Features

### 👨‍🎓 For Students
- 📚 Browse and enroll in courses
- 📊 Track learning progress
- 🏆 Earn badges and points
- 📈 View personalized recommendations
- 💬 Interactive course materials

### 👨‍🏫 For Instructors
- ➕ Create and manage courses
- 📝 Approve student enrollments
- 📊 View course analytics
- 📤 Upload course materials
- 👥 Monitor student progress

### 👨‍💼 For Admins
- 👥 Manage users and roles
- 📊 System-wide analytics
- 🎯 Course approval workflow
- 📈 Revenue and enrollment tracking
- ⚙️ System configuration

### 🤖 AI Features (Planned)
- 🎯 Personalized course recommendations
- 🧠 Adaptive learning paths
- ✍️ AI-assisted grading
- 📝 Automated content summarization

### 🎮 Gamification
- 🏅 Achievement badges
- ⭐ Point system
- 🏆 Leaderboards
- 🔥 Learning streaks

---

## 📋 Complete Dashboard Structure

## 📋 Complete Dashboard Structure

### 📊 Dashboard Overview

| Role | Pages | Shared Pages | Total Files |
|------|-------|--------------|-------------|
| **Shared** | profile, messages, settings | 3 | 3 |
| **Student** | dashboard + 4 pages | - | 5 |
| **Instructor** | dashboard + 7 pages | - | 8 |
| **Admin** | dashboard + 4 pages | - | 5 |
| **Total** | - | - | **21 files** |

---

### 📁 Final Complete Dashboard Structure

```
dashboard/
│
├── layout.tsx                          # role দেখে sidebar + navbar control
│
├── 📂 profile/
│   └── page.tsx                        # সবার জন্য ১টা
│       ├── Top: avatar, নাম, role badge, edit button
│       ├── Info: email, phone, bio, social links
│       ├── Stats: (role দেখে আলাদা)
│       │   ├── Student → enrolled, completed, certificates
│       │   ├── Instructor → courses, students, rating
│       │   └── Admin → role type, last login
│       └── Activity: (role দেখে আলাদা)
│           ├── Student → recent quiz scores
│           ├── Instructor → recent course activity
│           └── Admin → recent platform actions
│
├── 📂 messages/
│   └── page.tsx                        # সবার জন্য ১টা
│       ├── Left: conversation list + search
│       └── Right: chat window
│           ├── Student → instructor এর সাথে
│           ├── Instructor → student + admin
│           └── Admin → সবার সাথে
│
├── 📂 settings/
│   └── page.tsx                        # সবার জন্য ১টা
│       ├── Tab 1: Profile (সবার)
│       │   ├── Avatar upload
│       │   └── নাম, email, phone, bio
│       ├── Tab 2: Security (সবার)
│       │   ├── Password change
│       │   └── 2FA toggle
│       ├── Tab 3: Notifications (সবার)
│       │   ├── Email toggle
│       │   └── Push toggle
│       ├── Tab 4: Payout Info (শুধু Instructor)
│       │   ├── Bank name, account number
│       │   └── Routing number
│       └── Tab 5: Platform (শুধু Admin)
│           ├── Site name, logo
│           ├── Maintenance mode
│           └── Commission rate
│
├── 📂 student/
│   │
│   ├── page.tsx                        # Student Dashboard
│   │   ├── Welcome card (নাম + ছবি)
│   │   ├── Enrolled courses + progress bar
│   │   ├── Upcoming assignment deadlines
│   │   ├── Recent quiz scores
│   │   └── Certificates earned count
│   │
│   ├── courses/
│   │   └── page.tsx
│   │       ├── Course cards (thumbnail, progress %)
│   │       ├── Continue watching button
│   │       └── Filter: In Progress / Completed
│   │
│   ├── assignments/
│   │   └── page.tsx
│   │       ├── Assignment list (course, deadline)
│   │       ├── Status: Pending / Submitted / Graded
│   │       ├── Submit button
│   │       └── Grade + feedback দেখা
│   │
│   ├── quiz/
│   │   └── page.tsx
│   │       ├── Available quizzes (course wise)
│   │       ├── Status: Not Started / Completed
│   │       ├── Start quiz button
│   │       └── Score history
│   │
│   └── certificates/
│       └── page.tsx
│           ├── Earned certificate cards
│           ├── Course name + completion date
│           ├── Download PDF button
│           └── Share to LinkedIn button
│
├── 📂 instructor/
│   │
│   ├── layout.tsx                      # instructor sidebar
│   │
│   ├── page.tsx                        # Instructor Dashboard
│   │   ├── Welcome card (নাম + rating)
│   │   ├── Stats: students, courses, earnings
│   │   ├── Recent student activity
│   │   ├── Pending assignments to review
│   │   └── Monthly earnings chart
│   │
│   ├── courses/
│   │   └── page.tsx
│   │       ├── Created course cards
│   │       ├── Students count + rating
│   │       ├── Status: Published / Draft
│   │       ├── Add new course button
│   │       └── Edit / Delete option
│   │
│   ├── announcements/
│   │   └── page.tsx
│   │       ├── Announcement list (title, date)
│   │       ├── Create new announcement
│   │       ├── Target: course / all students
│   │       └── Edit / Delete option
│   │
│   ├── assignments/
│   │   └── page.tsx
│   │       ├── Created assignments list
│   │       ├── Submissions count
│   │       ├── Review / Grade submissions
│   │       └── Add new assignment button
│   │
│   ├── students/
│   │   └── page.tsx
│   │       ├── Enrolled students table
│   │       ├── Course wise filter
│   │       ├── Progress per student
│   │       └── Message student button
│   │
│   ├── quiz/
│   │   └── page.tsx
│   │       ├── Created quizzes list
│   │       ├── Add new quiz + questions
│   │       └── Publish / Unpublish toggle
│   │
│   ├── quiz-results/
│   │   └── page.tsx
│   │       ├── Student wise results table
│   │       ├── Average score per quiz
│   │       └── Pass / Fail breakdown chart
│   │
│   └── earnings/
│       └── page.tsx                    # 💰 3 Tabs in 1 File
│           ├── Tab 1: Overview
│           │   ├── Total earned (lifetime)
│           │   ├── This month earned
│           │   ├── Pending payout amount
│           │   └── Monthly bar chart
│           ├── Tab 2: Payout
│           │   ├── Available balance
│           │   ├── Request payout button
│           │   ├── Minimum payout notice
│           │   └── Payout history table
│           │       ├── Date
│           │       ├── Amount
│           │       └── Status (Pending/Paid)
│           └── Tab 3: Statements
│               ├── Month filter dropdown
│               ├── Transactions table
│               │   ├── Course name
│               │   ├── Student name
│               │   ├── Date
│               │   └── Amount
│               └── Download CSV button
│
└── 📂 admin/
    │
    ├── page.tsx                        # Admin Dashboard
    │   ├── Platform stats (users, courses, revenue)
    │   ├── New registrations today
    │   ├── Active courses count
    │   ├── Recent transactions
    │   └── User growth chart
    │
    ├── courses/
    │   └── page.tsx
    │       ├── All courses table
    │       ├── Filter: instructor, status, category
    │       └── Approve / Reject / Remove
    │
    ├── users/
    │   └── page.tsx                    # 👥 2 Tabs in 1 File
    │       ├── Tab 1: Students
    │       │   ├── Search bar
    │       │   ├── Students table
    │       │   │   ├── Avatar + নাম
    │       │   │   ├── Email
    │       │   │   ├── Enrolled courses count
    │       │   │   ├── Join date
    │       │   │   └── Block / Unblock button
    │       │   └── Total students count
    │       └── Tab 2: Instructors
    │           ├── Search bar
    │           ├── Instructors table
    │           │   ├── Avatar + নাম
    │           │   ├── Email
    │           │   ├── Total courses + students
    │           │   ├── Verified badge
    │           │   └── Verify / Block button
    │           └── Total instructors count
    │
    ├── announcements/
    │   └── page.tsx
    │       ├── All announcements list
    │       ├── Create announcement
    │       ├── Target: all / specific role
    │       └── Edit / Delete option
    │
    └── earnings/
        └── page.tsx                    # 💰 3 Tabs in 1 File
            ├── Tab 1: Overview
            │   ├── Total platform revenue
            │   ├── This month revenue
            │   ├── Total instructors paid
            │   └── Revenue line chart
            ├── Tab 2: Payouts
            │   ├── Pending requests table
            │   │   ├── Instructor name
            │   │   ├── Amount requested
            │   │   ├── Date
            │   │   └── Approve / Reject button
            │   └── Completed payouts history
            └── Tab 3: Statements
                ├── Filter (by instructor, month)
                ├── All transactions table
                │   ├── Instructor name
                │   ├── Course name
                │   ├── Student name
                │   ├── Date
                │   └── Amount
                └── Export CSV button
```

---

### 🎯 Key Implementation Notes

#### 💡 Single File with Tabs Approach
- **Earnings Pages**: একটাই `page.tsx` file, ভেতরে 3 tabs (Overview, Payout, Statements)
- **Users Page**: একটাই `page.tsx` file, ভেতরে 2 tabs (Students, Instructors)  
- **Settings Page**: একটাই `page.tsx` file, role দেখে tabs conditionally render

#### 🔄 State Management Pattern
```typescript
const [activeTab, setActiveTab] = useState('overview');
const { user } = useAuth(); // role check করার জন্য

// Role-based tab rendering
{user.role === 'instructor' && (
  <Tab>Payout Info</Tab>
)}
```

#### 📱 Responsive Design
- Mobile: Tabs হবে dropdown/select
- Desktop: Horizontal tab navigation
- Sidebar: Role-based menu items

#### 🎨 UI Components Reused
- `<TabContainer>` - All tabbed pages
- `<DataTable>` - All table displays  
- `<StatsCard>` - Dashboard metrics
- `<FilterBar>` - Search and filters

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js) | React Framework |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript) | Type Safety |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC?logo=tailwind-css) | Styling |
| ![DaisyUI](https://img.shields.io/badge/DaisyUI-4.0+-5A0EF8) | UI Components |
| ![Framer Motion](https://img.shields.io/badge/Framer%20Motion-latest-pink) | Animations |
| ![Recharts](https://img.shields.io/badge/Recharts-latest-8884d8) | Data Visualization |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js) | Runtime |
| ![Express](https://img.shields.io/badge/Express-4.0+-lightgrey?logo=express) | API Framework |
| ![NextAuth](https://img.shields.io/badge/NextAuth.js-latest-purple) | Authentication |
| ![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green?logo=mongodb) | Database |

### DevOps & Tools
| Technology | Purpose |
|------------|---------|
| ![Vercel](https://img.shields.io/badge/Vercel-black?logo=vercel) | Frontend Hosting |
| ![AWS](https://img.shields.io/badge/AWS-S3-orange?logo=amazon-aws) | File Storage |
| ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-CI/CD-blue?logo=github-actions) | Automation |



---

## 📁 Project Structure

```
edusmartai-lms/
│
├── 📂 src/
│   │
│   ├── 📂 app/                              
│   │   │
│   │   ├── 📂 (auth)/                       
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   │
│   │   ├── 📂 (public)/                     
│   │   │   ├── page.tsx                     # Home (Hero, Featured Courses, Testimonials)
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                 # All Courses Grid
│   │   │   │   └── [id]/page.tsx            # Course Details
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   │
│   │   ├── 📂 enrollment/
│   │   │   └── [courseId]/page.tsx          # Enrollment Form
│   │   │
│   │   ├── 📂 dashboard/                    
│   │   │   ├── layout.tsx                   # Sidebar Layout
│   │   │   │
│   │   │   ├── 📂 admin/
│   │   │   │   ├── page.tsx                 # Overview
│   │   │   │   ├── manage-users/page.tsx
│   │   │   │   ├── all-courses/page.tsx
│   │   │   │   ├── all-enrollments/page.tsx
│   │   │   │   └── analytics/page.tsx
│   │   │   │
│   │   │   ├── 📂 instructor/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── add-course/page.tsx
│   │   │   │   ├── manage-courses/page.tsx
│   │   │   │   ├── pending-enrollments/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   │
│   │   │   └── 📂 student/
│   │   │       ├── page.tsx                 # Overview (Streak, Points, Badges)
│   │   │       ├── my-courses/page.tsx
│   │   │       ├── track-progress/[courseId]/page.tsx
│   │   │       ├── achievements/page.tsx    # Gamification
│   │   │       ├── leaderboard/page.tsx
│   │   │       ├── certificates/page.tsx
│   │   │       └── profile/page.tsx
│   │   │
│   │   ├── 📂 api/                          
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── register/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   │
│   │   │   ├── courses/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/route.ts
│   │   │   │   └── featured/route.ts
│   │   │   │
│   │   │   ├── enrollments/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   │
│   │   │   ├── progress/
│   │   │   │   └── [courseId]/route.ts
│   │   │   │
│   │   │   ├── gamification/
│   │   │   │   ├── points/route.ts
│   │   │   │   ├── badges/route.ts
│   │   │   │   └── leaderboard/route.ts
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── student/route.ts
│   │   │   │   ├── instructor/route.ts
│   │   │   │   └── admin/route.ts
│   │   │   │
│   │   │   ├── certificates/
│   │   │   │   ├── generate/route.ts
│   │   │   │   └── verify/route.ts
│   │   │   │
│   │   │   └── ai/                          # AI Features
│   │   │       ├── recommendations/route.ts
│   │   │       ├── adaptive-path/route.ts
│   │   │       ├── summarize/
│   │   │       │   ├── video/route.ts
│   │   │       │   └── pdf/route.ts
│   │   │       └── evaluate-essay/route.ts
│   │   │
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── 📂 components/
│   │   │
│   │   ├── 📂 ui/                           # Reusable UI
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── 📂 layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   │
│   │   ├── 📂 forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── CourseForm.tsx
│   │   │   └── EnrollmentForm.tsx
│   │   │
│   │   ├── 📂 home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedCourses.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   └── TestimonialCarousel.tsx
│   │   │
│   │   ├── 📂 courses/
│   │   │   ├── CourseCard.tsx
│   │   │   ├── CourseGrid.tsx
│   │   │   ├── CourseDetails.tsx
│   │   │   └── VideoPlayer.tsx
│   │   │
│   │   ├── 📂 dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── UserManagementTable.tsx
│   │   │   │   ├── CourseManagementTable.tsx
│   │   │   │   └── AnalyticsCharts.tsx
│   │   │   │
│   │   │   ├── instructor/
│   │   │   │   ├── MyCoursesList.tsx
│   │   │   │   └── EnrollmentRequests.tsx
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── MyCoursesGrid.tsx
│   │   │   │   ├── ProgressTracker.tsx
│   │   │   │   ├── LeaderboardTable.tsx
│   │   │   │   ├── AchievementBadges.tsx
│   │   │   │   └── CertificateCard.tsx
│   │   │   │
│   │   │   └── shared/
│   │   │       └── StatsCard.tsx
│   │   │
│   │   └── 📂 ai/                           # AI Components
│   │       ├── PersonalizedRecommendations.tsx
│   │       ├── ContentSummarizer.tsx
│   │       └── AdaptiveLearning.tsx
│   │
│   ├── 📂 lib/
│   │   ├── mongodb.ts
│   │   ├── auth.ts
│   │   ├── jwt.ts
│   │   ├── validation.ts
│   │   └── utils.ts
│   │
│   ├── 📂 models/                           # Mongoose Models
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Enrollment.ts
│   │   ├── Progress.ts
│   │   ├── Achievement.ts
│   │   └── Certificate.ts
│   │
│   ├── 📂 types/
│   │   ├── user.types.ts
│   │   ├── course.types.ts
│   │   ├── enrollment.types.ts
│   │   └── index.ts
│   │
│   ├── 📂 hooks/
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   └── useToast.ts
│   │
│   ├── 📂 context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── 📂 services/                         # API Service Layer
│   │   ├── authService.ts
│   │   ├── courseService.ts
│   │   ├── enrollmentService.ts
│   │   └── aiService.ts
│   │
│   └── 📂 middleware/
│       └── authMiddleware.ts
│
├── 📂 public/
│   ├── images/
│   │   ├── logo.svg
│   │   └── hero-bg.jpg
│   └── icons/
│
├── .env.local
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```
---
## 📁 Server Project Structure

```
src/
├── app/api/
│   ├── auth/
│   │   ├── register/route.ts   ← নতুন user তৈরি
│   │   ├── login/route.ts      ← login + JWT দেবে
│   │   └── logout/route.ts     ← cookie clear
│   ├── users/
│   │   ├── route.ts            ← সব user দেখা (admin)
│   │   └── [id]/route.ts       ← single user update/delete
│   ├── courses/
│   │   ├── route.ts            ← course list + create
│   │   └── [id]/route.ts       ← single course
│   ├── enrollments/
│   │   ├── route.ts            ← enroll করা
│   │   └── [id]/route.ts       ← progress update
│   └── achievements/
│       └── route.ts            ← badge/points দেখা
│
├── models/
│   ├── User.ts         ← সব user এক জায়গায় (role দিয়ে আলাদা)
│   ├── Course.ts       ← course schema
│   ├── Enrollment.ts   ← student + course relation
│   ├── Progress.ts     ← lesson progress
│   └── Achievement.ts  ← badge, points, streak
│
├── services/
│   ├── auth.service.ts         ← register/login logic
│   ├── user.service.ts         ← user CRUD logic
│   ├── course.service.ts       ← course logic
│   ├── enrollment.service.ts   ← enrollment logic
│   └── achievement.service.ts  ← gamification logic
│
├── db/
│   └── connect.ts      ← MongoDB connection (একবার connect)
│
├── middleware/
│   ├── auth.middleware.ts   ← JWT verify করবে
│   └── role.middleware.ts   ← admin/instructor check
│
├── validators/
│   ├── auth.validator.ts    ← email, password check
│   ├── user.validator.ts    ← profile update check
│   └── course.validator.ts  ← course data check
│
├── utils/
│   ├── generateToken.ts    ← JWT বানাবে
│   ├── hashPassword.ts     ← bcrypt hash
│   ├── comparePassword.ts  ← password match
│   └── apiResponse.ts      ← { success, data } format
│
├── config/
│   └── env.ts          ← JWT_SECRET, MONGODB_URI
│
└── types/
    └── index.ts        ← UserRole, JwtPayload types
```
---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB Atlas** account (free tier available)
- **GitHub** account

### Installation

1️⃣ **Clone the Repository**

```bash
git clone https://github.com/your-org/ai-lms-project.git
cd ai-lms-project
```

2️⃣ **Install Dependencies**

```bash
npm install
# or
yarn install
```

3️⃣ **Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your credentials (see [Environment Variables](#-environment-variables))

4️⃣ **Run Development Server**

```bash
npm run dev
# or
yarn dev
```

5️⃣ **Open in Browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 👥 Team Collaboration

### Team Structure (6 Members)

| Member | Role | Responsibilities |
|--------|------|------------------|
| **Member 1** | Team Lead | Architecture, Auth System, MongoDB Setup, Git Management |
| **Member 2** | Frontend Dev | Home Page, Navbar/Footer, Public Pages, Responsive Design |
| **Member 3** | Frontend Dev | Courses Pages, Enrollment Form, Loading States |
| **Member 4** | Backend Dev | API Routes, MongoDB Models, File Uploads |
| **Member 5** | Dashboard Dev | Admin Dashboard, Analytics, User Management |
| **Member 6** | Dashboard Dev | Instructor/Student Dashboards, Progress Tracking, Gamification |

### 📅 Daily Standup Template

Each team member updates daily:

```markdown
**Yesterday:**
- ✅ Completed navbar component
- ✅ Fixed mobile responsive issues

**Today:**
- 🔨 Working on footer component
- 🎨 Starting course card design

**Blockers:**
- ⚠️ Need API endpoint for user data
- ⏳ Waiting for design mockups
```

---

## 🔄 Git Workflow

### Branch Strategy

```
main              # Production-ready code
  ↓
develop           # Development branch (merge features here)
  ↓
feature/*         # Individual feature branches
```

### Feature Branches by Team Member

```bash
feature/auth-system           # Member 1
feature/home-page             # Member 2
feature/courses-page          # Member 3
feature/api-courses           # Member 4
feature/admin-dashboard       # Member 5
feature/student-dashboard     # Member 6
```

### 📝 Workflow Steps

#### 1️⃣ Initial Setup (Team Lead)

```bash
# Create and push develop branch
git checkout -b develop
git push origin develop
```

#### 2️⃣ Team Members Setup

```bash
# Clone repository
git clone https://github.com/your-org/ai-lms-project.git
cd ai-lms-project

# Switch to develop
git checkout develop

# Create your feature branch
git checkout -b feature/your-feature-name
```

#### 3️⃣ Daily Development Workflow

**Before starting work:**
```bash
git checkout feature/your-feature-name
git pull origin develop
```

**While working:**
```bash
# Check changes
git status

# Stage files
git add .

# Commit with conventional message
git commit -m "feat: add responsive navbar"

# Push to remote
git push origin feature/your-feature-name
```

#### 4️⃣ Creating Pull Request

1. Go to GitHub repository
2. Click **Pull Requests** → **New Pull Request**
3. Set: `base: develop` ← `compare: feature/your-feature-name`
4. Add title and description
5. Request review from team lead

**PR Template:**
```markdown
## Changes Made
- ✅ Added responsive navbar component
- ✅ Implemented user authentication dropdown
- ✅ Added mobile menu toggle

## Screenshots
[Add screenshots if UI changes]

## Testing
- [x] Tested on desktop
- [x] Tested on mobile
- [x] No console errors

## Related Issue
Closes #123
```

### 📌 Commit Message Convention

Format: `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, CSS changes
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): add JWT token generation"
git commit -m "fix(navbar): resolve mobile menu toggle"
git commit -m "style(dashboard): update card spacing"
git commit -m "docs(readme): add Git workflow section"
```

---

## 🗄️ Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string,              // hashed with bcrypt
  role: "student" | "instructor" | "admin",
  photoURL: string,
  status: "active" | "suspended",
  createdAt: Date,
  updatedAt: Date
}
```

### Courses Collection

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  category: string,
  level: "Beginner" | "Intermediate" | "Advanced",
  price: number,
  duration: string,
  startDate: Date,
  instructor: ObjectId,          // Reference to Users
  thumbnail: string,
  videoURL: string,
  materials: [
    { type: string, url: string }
  ],
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollments Collection

```typescript
{
  _id: ObjectId,
  student: ObjectId,             // Reference to Users
  course: ObjectId,              // Reference to Courses
  status: "pending" | "approved" | "rejected",
  progress: number,              // 0-100
  completedLessons: [ObjectId],
  enrolledAt: Date,
  completedAt: Date,
  paymentStatus: "pending" | "completed"
}
```

---

## 🔐 Environment Variables

Create a `.env.local` file with the following:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-lms

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=ai-lms-uploads

# OR Cloudinary (alternative)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 🎨 UI/UX Guidelines

### Color Palette Implementation

```css
/* Primary Brand Colors */
.brand-pink { color: #FF0F7B; }
.brand-orange { color: #F89B29; }
.brand-purple { color: #832388; }
.brand-rose { color: #E3436B; }
.brand-yellow { color: #FDE047; }

/* Background Gradients */
.gradient-primary { background: linear-gradient(135deg, #FF0F7B 0%, #E3436B 50%, #F89B29 100%); }
.gradient-secondary { background: linear-gradient(135deg, #832388 0%, #E3436B 55%, #F89B29 100%); }

/* Button Styles */
.btn-primary { @apply bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]; }
```

### DaisyUI Theme Integration

```css
primary:    #FF0F7B (Hot Pink)
secondary:  #F89B29 (Orange)
accent:     #E3436B (Rose Pink)
neutral:    #832388 (Purple)
base-100:   #ffffff (Light) / #05010D (Dark)
```

### Spacing Standards

- **Sections:** `py-12` (3rem)
- **Cards:** `p-6` (1.5rem)
- **Buttons:** `px-4 py-2`

### Typography

```css
Headings:   text-3xl font-bold
Body:       text-base
Small:      text-sm text-gray-600
```

### Responsive Breakpoints

| Device | Breakpoint | Tailwind |
|--------|------------|----------|
| Mobile | < 640px | `sm:` |
| Tablet | 640px - 1024px | `md:` / `lg:` |
| Desktop | > 1024px | `xl:` / `2xl:` |

---

## 🧪 Troubleshooting

### Common Issues

**Port already in use:**
```bash
npx kill-port 3000
```

**MongoDB connection error:**
- ✅ Check `.env.local` credentials
- ✅ Whitelist IP in MongoDB Atlas
- ✅ Verify database name

**Git merge conflicts:**
- ✅ Pull latest changes before pushing
- ✅ Communicate with team
- ✅ Resolve conflicts in VS Code

---

## 🛠️ Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "formulahendry.auto-rename-tag",
    "mongodb.mongodb-vscode"
  ]
}
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

---

## 📞 Support

For questions or issues:

- 🐛 [Create GitHub Issue](https://github.com/your-org/ai-lms-project/issues)
- 💬 Contact Team Lead
- 📧 Email: support@ai-lms.com

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

---

## 🎨 Color Showcase

<div align="center">

### 🌈 Brand Color Palette

```
🎨 Primary Colors:
┌─────────────────────────────────────────────────────────────┐
│  #FF0F7B  │  #F89B29  │  #832388  │  #E3436B  │  #FDE047  │
│ Hot Pink  │  Orange   │  Purple   │ Rose Pink │  Yellow   │
└─────────────────────────────────────────────────────────────┘

🌟 Gradient Combinations:
┌─────────────────────────────────────────────────────────────┐
│ Primary:   #FF0F7B → #E3436B → #F89B29                     │
│ Secondary: #832388 → #E3436B → #F89B29                     │
│ Button:    #832388 → #E3436B → #F0772F                     │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 Usage Examples

**Buttons & CTAs:** ![Button](https://via.placeholder.com/100x30/832388/FFFFFF?text=Click+Me)

**Success States:** ![Success](https://via.placeholder.com/100x30/00C48C/FFFFFF?text=Success)

**Error States:** ![Error](https://via.placeholder.com/100x30/ef4444/FFFFFF?text=Error)

**Warning States:** ![Warning](https://via.placeholder.com/100x30/f59e0b/FFFFFF?text=Warning)

</div>

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- DaisyUI for beautiful components
- MongoDB for robust database
- All contributors to this project

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ by the AI-LMS Team**

[⬆ Back to Top](#-ai-powered-learning-management-system)

</div>
