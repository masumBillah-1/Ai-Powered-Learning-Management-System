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
