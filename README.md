# 🎓 AI-Powered Learning Management System

<div align="center">

![Project Status](https://img.shields.io/badge/status-in%20development-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**A modern, full-featured Learning Management System with AI-powered features, role-based dashboards, and gamification elements.**

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
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
ai-lms-project/
│
├── 📂 src/
│   ├── 📂 app/                      # Next.js App Router
│   │   ├── 📂 (auth)/               # Authentication Pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── 📂 (public)/             # Public Pages
│   │   │   ├── page.tsx             # Home
│   │   │   ├── courses/             # Course Listing & Details
│   │   │   ├── about/
│   │   │   └── contact/
│   │   │
│   │   ├── 📂 dashboard/            # Protected Dashboards
│   │   │   ├── admin/               # Admin Panel
│   │   │   ├── instructor/          # Instructor Panel
│   │   │   └── student/             # Student Panel
│   │   │
│   │   ├── 📂 api/                  # API Routes
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── users/
│   │   │   └── enrollments/
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── 📂 components/               # Reusable Components
│   │   ├── shared/                  # Navbar, Footer, etc.
│   │   ├── home/                    # Home Page Components
│   │   ├── courses/                 # Course Components
│   │   ├── dashboard/               # Dashboard Components
│   │   └── forms/                   # Form Components
│   │
│   ├── 📂 lib/                      # Utilities
│   │   ├── mongodb.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   │
│   ├── 📂 models/                   # Database Models
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   └── Enrollment.ts
│   │
│   ├── 📂 types/                    # TypeScript Types
│   └── 📂 hooks/                    # Custom React Hooks
│
├── 📂 public/                       # Static Assets
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── 📄 .env.local                    # Environment Variables
├── 📄 .gitignore
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
└── 📄 README.md
```

---



edusmartai-lms/
│
├── 📂 src/
│   │
│   ├── 📂 app/                              # Next.js 14 App Router
│   │   │
│   │   ├── 📂 (auth)/                       # Authentication Routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📂 (public)/                     # Public Routes
│   │   │   ├── page.tsx                     # Home Page
│   │   │   │                                # - Hero Banner
│   │   │   │                                # - Featured Courses (6 cards)
│   │   │   │                                # - How It Works
│   │   │   │                                # - Student Feedback Carousel
│   │   │   │                                # - Popular Instructors
│   │   │   │                                # - AI Course Suggestions
│   │   │   │
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                 # All Courses (3-column grid)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # Course Details (Private)
│   │   │   │                                # - Video/Image, Title, Description
│   │   │   │                                # - Category, Level, Duration, Start Date
│   │   │   │                                # - Enroll Button (Students only)
│   │   │   │
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── 📂 enrollment/                   # Enrollment System
│   │   │   └── [courseId]/
│   │   │       └── page.tsx                 # Enrollment Form
│   │   │                                    # - Student Email (auto-fill)
│   │   │                                    # - Course Title (read-only)
│   │   │                                    # - Payment Info/Price
│   │   │                                    # - First Name, Last Name
│   │   │                                    # - Contact Number
│   │   │                                    # - Additional Notes
│   │   │
│   │   ├── 📂 dashboard/                    # Dashboard Routes
│   │   │   ├── layout.tsx                   # Dashboard Layout with Sidebar
│   │   │   │
│   │   │   ├── 📂 admin/                    # Admin Dashboard
│   │   │   │   ├── page.tsx                 # Admin Overview
│   │   │   │   │                            # - Analytics: Courses, Enrollments, Users
│   │   │   │   │                            # - Bar, Line, Pie Charts
│   │   │   │   │
│   │   │   │   ├── manage-users/
│   │   │   │   │   └── page.tsx             # User Management
│   │   │   │   │                            # - Add/Update/Delete Users
│   │   │   │   │                            # - Approve/Suspend Instructors/Students
│   │   │   │   │                            # - Search & Pagination
│   │   │   │   │
│   │   │   │   ├── all-courses/
│   │   │   │   │   └── page.tsx             # Course Management
│   │   │   │   │                            # - Show/Hide courses on homepage
│   │   │   │   │                            # - Search & Pagination
│   │   │   │   │
│   │   │   │   ├── all-enrollments/
│   │   │   │   │   └── page.tsx             # Enrollment Management
│   │   │   │   │                            # - View all enrollments
│   │   │   │   │                            # - Suspend feedback collection
│   │   │   │   │
│   │   │   │   └── analytics/
│   │   │   │       └── page.tsx             # Instructor Effectiveness Report
│   │   │   │                                # - Instructor analytics
│   │   │   │                                # - Engagement metrics
│   │   │   │
│   │   │   ├── 📂 instructor/               # Instructor Dashboard
│   │   │   │   ├── page.tsx                 # Instructor Overview
│   │   │   │   │
│   │   │   │   ├── add-course/
│   │   │   │   │   └── page.tsx             # Add New Course
│   │   │   │   │                            # - Name, Description, Level
│   │   │   │   │                            # - Category, Price
│   │   │   │   │                            # - Video/PDF Upload
│   │   │   │   │
│   │   │   │   ├── manage-courses/
│   │   │   │   │   └── page.tsx             # Manage Courses
│   │   │   │   │                            # - Update/Delete courses
│   │   │   │   │                            # - Add lesson progress tracking
│   │   │   │   │
│   │   │   │   ├── pending-enrollments/
│   │   │   │   │   └── page.tsx             # Pending Enrollment Requests
│   │   │   │   │                            # - Approve/Reject students
│   │   │   │   │
│   │   │   │   ├── approved-enrollments/
│   │   │   │   │   └── page.tsx             # Approved Enrollments
│   │   │   │   │                            # - View enrolled students
│   │   │   │   │
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx             # Instructor Profile
│   │   │   │
│   │   │   └── 📂 student/                  # Student Dashboard
│   │   │       ├── page.tsx                 # Student Overview
│   │   │       │                            # - Learning streak
│   │   │       │                            # - Points & badges (Gamification)
│   │   │       │                            # - Leaderboard position
│   │   │       │
│   │   │       ├── my-courses/
│   │   │       │   └── page.tsx             # My Enrolled Courses
│   │   │       │                            # - View all courses
│   │   │       │                            # - Cancel if status = Pending
│   │   │       │
│   │   │       ├── track-progress/
│   │   │       │   └── [courseId]/
│   │   │       │       └── page.tsx         # Track Course Progress
│   │   │       │                            # - Lesson completion
│   │   │       │                            # - Quiz scores
│   │   │       │                            # - Timeline of progress
│   │   │       │                            # - Performance Analytics Dashboard
│   │   │       │                            # - Adaptive Learning Path
│   │   │       │
│   │   │       ├── achievements/
│   │   │       │   └── page.tsx             # Badges & Achievements
│   │   │       │                            # - Unlocked badges
│   │   │       │                            # - Points system
│   │   │       │
│   │   │       ├── leaderboard/
│   │   │       │   └── page.tsx             # Gamification Leaderboard
│   │   │       │
│   │   │       ├── certificates/
│   │   │       │   └── page.tsx             # My Certificates
│   │   │       │                            # - Download certificates
│   │   │       │                            # - QR code verification
│   │   │       │
│   │   │       └── profile/
│   │   │           └── page.tsx             # Student Profile
│   │   │
│   │   ├── 📂 api/                          # API Routes (Next.js)
│   │   │   │
│   │   │   ├── 📂 auth/                     # Authentication APIs
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts             # POST login (JWT)
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts             # POST register
│   │   │   │   └── logout/
│   │   │   │       └── route.ts             # POST logout
│   │   │   │
│   │   │   ├── 📂 courses/                  # Course APIs
│   │   │   │   ├── route.ts                 # GET all, POST create
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts             # GET, PUT, DELETE
│   │   │   │   └── featured/
│   │   │   │       └── route.ts             # GET featured (6 cards)
│   │   │   │
│   │   │   ├── 📂 enrollments/              # Enrollment APIs
│   │   │   │   ├── route.ts                 # GET all, POST enroll
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts             # GET, PUT (approve/reject), DELETE
│   │   │   │   └── student/
│   │   │   │       └── route.ts             # GET student enrollments
│   │   │   │
│   │   │   ├── 📂 users/                    # User Management APIs
│   │   │   │   ├── route.ts                 # GET all, POST create
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts             # GET, PUT, DELETE
│   │   │   │
│   │   │   ├── 📂 progress/                 # Progress Tracking APIs
│   │   │   │   ├── route.ts                 # POST update progress
│   │   │   │   └── [courseId]/
│   │   │   │       └── route.ts             # GET course progress
│   │   │   │
│   │   │   ├── 📂 quiz/                     # Quiz & Assignment APIs
│   │   │   │   ├── route.ts                 # GET all quizzes
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts             # GET quiz, POST submit
│   │   │   │   └── evaluate/
│   │   │   │       └── route.ts             # POST - Automated Quiz Evaluation
│   │   │   │
│   │   │   ├── 📂 certificates/             # Certificate APIs
│   │   │   │   ├── generate/
│   │   │   │   │   └── route.ts             # POST - Generate Certificate
│   │   │   │   └── verify/
│   │   │   │       └── route.ts             # GET - Verify with QR code
│   │   │   │
│   │   │   ├── 📂 gamification/             # Gamification APIs
│   │   │   │   ├── points/
│   │   │   │   │   └── route.ts             # GET/POST points
│   │   │   │   ├── badges/
│   │   │   │   │   └── route.ts             # GET badges
│   │   │   │   └── leaderboard/
│   │   │   │       └── route.ts             # GET leaderboard
│   │   │   │
│   │   │   ├── 📂 analytics/                # Analytics APIs
│   │   │   │   ├── student/
│   │   │   │   │   └── route.ts             # Student Performance Analytics
│   │   │   │   ├── instructor/
│   │   │   │   │   └── route.ts             # Instructor Effectiveness Report
│   │   │   │   └── admin/
│   │   │   │       └── route.ts             # Admin Analytics
│   │   │   │
│   │   │   └── 📂 ai/                       # AI Feature APIs
│   │   │       ├── recommendations/
│   │   │       │   └── route.ts             # AI Course Recommendations
│   │   │       │
│   │   │       ├── adaptive-path/
│   │   │       │   └── route.ts             # Adaptive Learning Path
│   │   │       │
│   │   │       ├── summarize/
│   │   │       │   ├── video/
│   │   │       │   │   └── route.ts         # Video Content Summarization
│   │   │       │   └── pdf/
│   │   │       │       └── route.ts         # PDF Summarization
│   │   │       │
│   │   │       └── evaluate-essay/
│   │   │           └── route.ts             # AI Essay Assessment (NLP)
│   │   │
│   │   ├── layout.tsx                       # Root Layout
│   │   ├── globals.css                      # Global Styles
│   │   ├── not-found.tsx                    # 404 Page
│   │   └── error.tsx                        # Error Page
│   │
│   ├── 📂 components/                       # Reusable Components
│   │   │
│   │   ├── 📂 ui/                           # Base UI Components (Reusable)
│   │   │   ├── Button.tsx                   # Reusable Button
│   │   │   ├── Input.tsx                    # Reusable Input
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx                    # For badges/achievements
│   │   │   ├── Avatar.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Table.tsx                    # For data tables
│   │   │   ├── Pagination.tsx               # Pagination component
│   │   │   ├── Spinner.tsx                  # Loading spinner
│   │   │   ├── Toast.tsx                    # Toast notifications
│   │   │   ├── ProgressBar.tsx              # Progress bars
│   │   │   └── Chart.tsx                    # Chart wrapper
│   │   │
│   │   ├── 📂 layout/                       # Layout Components
│   │   │   ├── Navbar.tsx                   # Main Navbar
│   │   │   │                                # Before Login: Logo, Home, Courses, About, Contact, Login, Register
│   │   │   │                                # After Login: Logo, Home, Courses, Dashboard, Avatar, Logout
│   │   │   ├── Footer.tsx                   # Footer with links
│   │   │   ├── Sidebar.tsx                  # Dashboard Sidebar
│   │   │   └── DashboardLayout.tsx          # Dashboard wrapper
│   │   │
│   │   ├── 📂 forms/                        # Form Components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx             # Name, Email, Password, Role, Photo URL
│   │   │   ├── CourseForm.tsx               # Add/Edit course
│   │   │   ├── EnrollmentForm.tsx           # Enrollment/booking form
│   │   │   ├── ProfileForm.tsx
│   │   │   └── QuizForm.tsx
│   │   │
│   │   ├── 📂 home/                         # Home Page Components
│   │   │   ├── HeroSection.tsx              # Hero Banner
│   │   │   ├── FeaturedCourses.tsx          # 6 Featured Course Cards
│   │   │   ├── HowItWorks.tsx               # Step-by-step process
│   │   │   ├── TestimonialCarousel.tsx      # Student Feedback Carousel
│   │   │   ├── PopularInstructors.tsx       # Instructor showcase
│   │   │   └── AIRecommendations.tsx        # AI Course Suggestions
│   │   │
│   │   ├── 📂 courses/                      # Course Components
│   │   │   ├── CourseCard.tsx               # Course card with image, name, level
│   │   │   ├── CourseGrid.tsx               # 3-column grid layout
│   │   │   ├── CourseDetails.tsx            # Full course details
│   │   │   ├── CourseFilters.tsx            # Filter by category/level
│   │   │   ├── VideoPlayer.tsx              # Video player for lectures
│   │   │   ├── CourseCurriculum.tsx         # Lesson list
│   │   │   └── EnrollButton.tsx             # Enroll CTA
│   │   │
│   │   ├── 📂 dashboard/                    # Dashboard Components
│   │   │   │
│   │   │   ├── 📂 admin/                    # Admin Components
│   │   │   │   ├── UserManagementTable.tsx  # User CRUD table
│   │   │   │   ├── CourseManagementTable.tsx
│   │   │   │   ├── EnrollmentTable.tsx
│   │   │   │   ├── AnalyticsCharts.tsx      # Bar, Line, Pie charts
│   │   │   │   └── AdminStats.tsx           # Stats cards
│   │   │   │
│   │   │   ├── 📂 instructor/               # Instructor Components
│   │   │   │   ├── MyCoursesList.tsx
│   │   │   │   ├── EnrollmentRequests.tsx   # Approve/Reject UI
│   │   │   │   ├── StudentProgressTable.tsx
│   │   │   │   └── EffectivenessReport.tsx  # Instructor analytics
│   │   │   │
│   │   │   ├── 📂 student/                  # Student Components
│   │   │   │   ├── MyCoursesGrid.tsx
│   │   │   │   ├── ProgressTracker.tsx      # Timeline & progress bars
│   │   │   │   ├── PerformanceChart.tsx     # Student analytics dashboard
│   │   │   │   ├── AdaptivePath.tsx         # Adaptive learning UI
│   │   │   │   ├── LeaderboardTable.tsx     # Gamification leaderboard
│   │   │   │   ├── AchievementBadges.tsx    # Badge showcase
│   │   │   │   ├── PointsCounter.tsx        # Points display
│   │   │   │   └── CertificateCard.tsx      # Certificate display
│   │   │   │
│   │   │   └── 📂 shared/                   # Shared Dashboard Components
│   │   │       ├── StatsCard.tsx            # Stat cards
│   │   │       ├── QuickActions.tsx
│   │   │       ├── RecentActivity.tsx
│   │   │       └── NotificationPanel.tsx
│   │   │
│   │   ├── 📂 ai/                           # AI Feature Components
│   │   │   ├── PersonalizedRecommendations.tsx
│   │   │   ├── ContentSummarizer.tsx        # Video/PDF summarization UI
│   │   │   ├── QuizEvaluator.tsx            # Automated grading UI
│   │   │   ├── EssayAssessment.tsx          # NLP essay feedback
│   │   │   └── AdaptiveLearning.tsx         # Adaptive path visualization
│   │   │
│   │   ├── 📂 video/                        # Video Features
│   │   │   ├── LiveClassPlayer.tsx          # Live class integration
│   │   │   ├── RecordedClassPlayer.tsx      # Recorded sessions
│   │   │   ├── VideoTimestamps.tsx          # AI timestamps
│   │   │   └── SearchableTranscript.tsx     # Searchable transcript
│   │   │
│   │   └── 📂 certificates/                 # Certificate Components
│   │       ├── CertificateTemplate.tsx      # Certificate design
│   │       ├── QRCodeGenerator.tsx          # QR code for verification
│   │       └── VerificationBadge.tsx        # Verification UI
│   │
│   ├── 📂 lib/                              # Utility Functions
│   │   ├── mongodb.ts                       # MongoDB connection
│   │   ├── auth.ts                          # Auth helpers (JWT)
│   │   ├── jwt.ts                           # JWT encode/decode
│   │   ├── bcrypt.ts                        # Password hashing
│   │   ├── validation.ts                    # Form validation
│   │   ├── formatters.ts                    # Date/number formatting
│   │   ├── constants.ts                     # App constants
│   │   ├── uploadFile.ts                    # File upload (Cloudinary/AWS S3)
│   │   └── utils.ts                         # General utilities
│   │
│   ├── 📂 models/                           # MongoDB Models (Mongoose)
│   │   ├── User.ts                          # User model (Student/Instructor/Admin)
│   │   ├── Course.ts                        # Course model
│   │   ├── Enrollment.ts                    # Enrollment model
│   │   ├── Quiz.ts                          # Quiz model
│   │   ├── Progress.ts                      # Student progress
│   │   ├── Achievement.ts                   # Badges & achievements
│   │   ├── Certificate.ts                   # Certificate model
│   │   ├── Leaderboard.ts                   # Leaderboard data
│   │   └── VideoRecording.ts                # Live class recordings
│   │
│   ├── 📂 types/                            # TypeScript Types
│   │   ├── index.ts                         # Re-export all types
│   │   ├── user.types.ts
│   │   ├── course.types.ts
│   │   ├── enrollment.types.ts
│   │   ├── quiz.types.ts
│   │   ├── progress.types.ts
│   │   ├── gamification.types.ts
│   │   ├── analytics.types.ts
│   │   └── api.types.ts
│   │
│   ├── 📂 hooks/                            # Custom React Hooks
│   │   ├── useAuth.ts                       # Auth state management
│   │   ├── useCourses.ts
│   │   ├── useEnrollment.ts
│   │   ├── useProgress.ts
│   │   ├── useGamification.ts               # Points/badges hook
│   │   ├── useAnalytics.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useToast.ts
│   │
│   ├── 📂 context/                          # React Context
│   │   ├── AuthContext.tsx                  # Auth context provider
│   │   ├── ThemeContext.tsx                 # Dark/Light mode
│   │   └── ToastContext.tsx                 # Toast notifications
│   │
│   ├── 📂 config/                           # Configuration
│   │   ├── site.ts                          # Site metadata
│   │   ├── navigation.ts                    # Nav links
│   │   ├── dashboardMenus.ts                # Dashboard menus
│   │   └── roles.ts                         # User role definitions
│   │
│   ├── 📂 services/                         # API Service Layer
│   │   ├── authService.ts                   # Auth API calls
│   │   ├── courseService.ts
│   │   ├── enrollmentService.ts
│   │   ├── userService.ts
│   │   ├── quizService.ts
│   │   ├── progressService.ts
│   │   ├── gamificationService.ts
│   │   ├── certificateService.ts
│   │   ├── analyticsService.ts
│   │   └── aiService.ts                     # AI feature API calls
│   │
│   └── 📂 middleware/                       # Middleware
│       ├── authMiddleware.ts                # JWT verification
│       └── roleMiddleware.ts                # Role-based access control
│
├── 📂 public/                               # Static Assets
│   ├── 📂 images/
│   │   ├── logo.svg
│   │   ├── hero-bg.jpg
│   │   ├── placeholder-course.png
│   │   └── badges/                          # Badge images
│   │       ├── beginner.svg
│   │       ├── intermediate.svg
│   │       └── expert.svg
│   │
│   ├── 📂 icons/
│   │   ├── dashboard.svg
│   │   ├── course.svg
│   │   ├── user.svg
│   │   └── certificate.svg
│   │
│   └── 📂 certificates/                     # Certificate templates
│       └── template.png
│
├── 📂 scripts/                              # Utility Scripts
│   ├── seed.ts                              # Database seeding
│   └── generateCertificate.ts               # Certificate generation script
│
├── 📄 .env.local                            # Environment Variables
│                                            # - MONGODB_URI
│                                            # - JWT_SECRET
│                                            # - NEXT_PUBLIC_API_URL
│                                            # - CLOUDINARY_URL (or AWS S3)
│                                            # - AWS_ACCESS_KEY (if using AWS)
│                                            # - AWS_SECRET_KEY
│                                            # - AWS_REGION
│
├── 📄 .env.example                          # Example env file
├── 📄 .gitignore
├── 📄 .eslintrc.json
├── 📄 .prettierrc
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
├── 📄 next.config.js
└── 📄 README.md


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

### Color Palette (DaisyUI)

```css
primary:    Brand color
secondary:  Accent color
accent:     Highlights
neutral:    Text/backgrounds
base:       Page background
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