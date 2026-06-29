# 🎓 SmartLms-Pro — AI-Powered Learning Management System

<div align="center">

<img src="https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge" alt="Status"/>
<img src="https://img.shields.io/badge/Next.js-15.3-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
<img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind"/>
<img src="https://img.shields.io/badge/DaisyUI-5.5-5A0EF8?style=for-the-badge" alt="DaisyUI"/>
<img src="https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB"/>
<img src="https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io" alt="Socket.io"/>
<img src="https://img.shields.io/badge/Stripe-Integrated-635BFF?style=for-the-badge&logo=stripe" alt="Stripe"/>
<img src="https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge" alt="License"/>

<br/><br/>

> **SmartLms-Pro** is a next-generation, AI-infused educational ecosystem built to redefine online learning. It delivers a seamless, interactive experience for students, powerful management tools for instructors, and comprehensive administrative oversight — all within a single, blazing-fast platform.
 <div align="center">

## 🌐 Live Demo

### 🚀 https://smartlms-pro.vercel.app/

</div>

<br/>

[✨ Features](#-key-features) &nbsp;•&nbsp;
[🛠️ Tech Stack](#️-technology-stack) &nbsp;•&nbsp;
[🎨 Design System](#-design-system) &nbsp;•&nbsp;
[📁 Architecture](#-project-structure) &nbsp;•&nbsp;
[🚀 Getting Started](#-getting-started) &nbsp;•&nbsp;
[🛡️ Security](#️-security) &nbsp;•&nbsp;
[🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

SmartLms-Pro is not just another LMS — it's a fully personalized learning journey. By leveraging **Anthropic Claude AI**, **real-time Socket.io communication**, **Stripe-powered payments**, and a **gamified engagement system**, we've built a platform that keeps learners motivated and helps instructors thrive.

### 🎯 Core Objectives

| Objective | Description |
|-----------|-------------|
| 🤖 **Adaptive Learning** | AI-driven course recommendations, content summarization & analysis via Claude SDK |
| 🧑‍💼 **Role-Centric UX** | Tailored dashboards for Students, Instructors, and Administrators |
| ⚡ **Modern Performance** | Next.js 15 App Router with SSR, ISR & Edge optimization |
| 🎮 **Engagement First** | Gamification with points, streaks, badges & leaderboards |
| 💳 **Monetization Ready** | Full Stripe integration for course sales & instructor payouts |
| 🔴 **Real-time Everything** | Live notifications, messaging & updates via Socket.io |

---

## ✨ Key Features

### 👨‍🎓 For Students

- 🔍 **Smart Course Discovery** — Browse and enroll with AI-personalized recommendations powered by Claude
- 📚 **Interactive Learning Path** — Structured syllabus with progress tracking and completion milestones
- 🎥 **AI Video Intelligence** — YouTube transcript extraction with AI-generated summaries and Q&A
- 🏆 **Gamified Achievements** — Earn badges, maintain streaks, and compete on the leaderboard
- 💬 **Integrated Support** — Real-time helpdesk with Socket.io-powered live chat
- 📊 **Personal Dashboard** — Visual progress reports using Recharts

### 👨‍🏫 For Instructors

- 🎬 **Course Studio** — Rich content creation with Cloudinary-powered media uploads (video, images, docs)
- 🤖 **AI Content Assistant** — Claude-powered tools for generating course outlines, quizzes & summaries
- 📈 **Student Analytics** — Deep insights into engagement, completion rates, and performance
- 💰 **Revenue Management** — Track earnings, manage Stripe payouts and commission reports
- 📣 **Live Communication** — Real-time messaging with enrolled students via Socket.io
- 📝 **Assessment Builder** — Create quizzes and assignments with auto-grading support

### 👨‍💼 For Administrators

- 🖥️ **Command Center** — Full control over users, courses, categories, and platform configuration
- 💹 **Financial Oversight** — Revenue reporting, commission management, and payout approvals
- ✅ **Course Approval Workflow** — Review, approve, or reject instructor-submitted courses
- 📢 **Global Announcements** — Broadcast platform-wide updates via email and in-app notifications
- 👥 **User Management** — Role assignment, account suspension, and activity monitoring
- 🔐 **Security Controls** — Protected admin actions with master password verification

---

## 🛠️ Technology Stack

### 🖥️ Frontend & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3 | App Router, SSR, API Routes |
| **React** | 19 | UI Component Architecture |
| **TypeScript** | 5.x | Type Safety & Developer Experience |
| **Tailwind CSS** | 4.0 | Utility-First Styling |
| **DaisyUI** | 5.5 | Pre-built Component Themes |
| **Framer Motion** | 12.x | Smooth Page & Element Animations |
| **Lottie React** | 2.x | High-quality Micro-animations |
| **Recharts** | 3.x | Analytics & Data Visualization |
| **React Hook Form** | 7.x | Performant Form Management |
| **Lucide React** | 0.57 | Consistent Icon System |

### ⚙️ Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Server Runtime |
| **MongoDB** | 7.x | Primary NoSQL Database |
| **Mongoose** | 9.x | ODM & Schema Management |
| **Socket.io** | 4.8 | Real-time Bidirectional Communication |
| **Express** | 5.x | Standalone Socket.io Server |
| **JWT (jose)** | 6.x | Stateless Authentication |
| **bcryptjs** | 3.x | Password Hashing & Encryption |

### 🔌 Third-Party Integrations

| Service | SDK/Package | Purpose |
|---------|------------|---------|
| **Anthropic Claude** | `@anthropic-ai/sdk` | AI Content Generation & Analysis |
| **Stripe** | `stripe` + `@stripe/react-stripe-js` | Payments, Checkout & Payouts |
| **Cloudinary** | `cloudinary` + `next-cloudinary` | Media Storage & Optimization |
| **Firebase** | `firebase` | OAuth & Social Authentication |
| **Nodemailer / Resend** | Both integrated | Transactional Email Delivery |
| **YouTube Transcript** | `youtube-transcript` | AI-powered Video Content Extraction |

---

## 🎨 Design System

SmartLms-Pro features a premium **"Cyber-Energy"** aesthetic — vibrant, bold, and modern. Designed to energize learners and establish a strong brand identity.

### 🌈 Color Palette

| Role | Light Theme | Dark Theme | Hex |
|------|-------------|------------|-----|
| **Primary** | Hot Pink | Hot Pink | `#FF0F7B` |
| **Secondary** | Brand Orange | Brand Orange | `#F89B29` |
| **Accent** | Brand Purple | Brand Purple | `#832388` |
| **Surface** | Pure White | Dark Navy | `#FFFFFF` / `#0B1120` |
| **Border** | Soft Gray | Steel Gray | `#F3F4F6` / `#1F2937` |

> **Primary CTA Gradient:** `linear-gradient(135deg, #FF0F7B 0%, #F89B29 100%)`
>
> Used on buttons, banners, and hero sections for a high-energy, attention-grabbing feel.

### ✍️ Typography

| Font | Usage | Reason |
|------|-------|--------|
| `Hind Siliguri` | Bengali / Primary | Optimized for Bangla readability |
| `Geist` | English / UI | Modern, clean sans-serif for technical interfaces |

---

## 📁 Project Structure

```bash
SmartLms-Pro/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── (auth)/                   # Auth flows: Login, Register, OTP, Reset
│   │   ├── (public)/                 # Public pages: Landing, Blog, FAQ, Pricing
│   │   ├── dashboard/
│   │   │   ├── admin/                # Admin portal: Users, Revenue, Approvals
│   │   │   ├── instructor/           # Instructor portal: Courses, Analytics, Earnings
│   │   │   └── student/              # Student portal: My Courses, Progress, Leaderboard
│   │   ├── learn/                    # Course player & learning experience
│   │   │   ├── [courseId]/           # Dynamic course route
│   │   │   └── [courseId]/[lessonId] # Individual lesson player
│   │   └── api/                      # Serverless API endpoints
│   │       ├── auth/                 # JWT login, register, refresh
│   │       ├── courses/              # CRUD operations for courses
│   │       ├── payments/             # Stripe webhook & checkout
│   │       ├── ai/                   # Claude AI endpoints
│   │       └── socket/               # Socket event handlers
│   │
│   ├── components/                   # Reusable UI component library
│   │   ├── ui/                       # Base components (Button, Modal, Card)
│   │   ├── dashboard/                # Dashboard-specific components
│   │   ├── course/                   # Course cards, player, progress bars
│   │   └── shared/                   # Navbar, Footer, Sidebar, Toast
│   │
│   ├── models/                       # Mongoose schemas
│   │   ├── User.ts                   # User model with role management
│   │   ├── Course.ts                 # Course & curriculum schema
│   │   ├── Enrollment.ts             # Student-course relationships
│   │   └── Payment.ts                # Transaction records
│   │
│   ├── db/                           # MongoDB connection & config
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Utilities: JWT, Cloudinary, Stripe, Claude
│   └── server/                       # Standalone Socket.io server (Express)
│
├── public/                           # Static assets (images, icons, fonts)
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind & DaisyUI theme config
└── package.json                      # Dependencies & npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed and configured:

- ✅ **Node.js** v18.x or higher
- ✅ **MongoDB** — [Atlas Cloud](https://www.mongodb.com/atlas) or local instance
- ✅ **API Keys** — Anthropic, Stripe, Cloudinary, Firebase

### 1. Clone the Repository

```bash
git clone https://github.com/masumBillah-1/Ai-Powered-Learning-Management-System.git
cd Ai-Powered-Learning-Management-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# ─── Database ────────────────────────────────────────
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# ─── Authentication ──────────────────────────────────
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# ─── Stripe Payments ────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ─── Cloudinary Media Storage ────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# ─── Anthropic Claude AI ─────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...

# ─── Firebase (OAuth) ────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# ─── Email (Nodemailer) ──────────────────────────────
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# ─── Socket.io Server ────────────────────────────────
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
SOCKET_PORT=4000

# ─── App URL ─────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Admin Security ──────────────────────────────────
ADMIN_DELETE_PASSWORD=your_strong_admin_password
```

> ⚠️ **Never commit `.env.local` to version control.** Ensure `.env.local` is in your `.gitignore`.

### 4. Run the Development Server

```bash
# Start the Next.js development server (Port 3000)
npm run dev

# In a separate terminal — start the Socket.io server (Port 4000)
npm run socket:dev
```

Visit **[http://localhost:3000](http://localhost:3000)** to see the app in action.

### 5. Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server on port 3000 |
| `npm run build` | Build the project for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run socket` | Start the Socket.io server (production) |
| `npm run socket:dev` | Start the Socket.io server with hot-reload (development) |

---

## 🗺️ Roadmap

- [x] Core LMS with role-based dashboards
- [x] AI-powered content generation with Claude SDK
- [x] Stripe checkout & instructor payout system
- [x] Real-time notifications & chat with Socket.io
- [x] YouTube transcript extraction & AI summarization
- [x] Gamification (badges, streaks, leaderboard)
- [ ] Mobile app (React Native)
- [ ] AI-generated certificate of completion
- [ ] Multi-language support (i18n)
- [ ] Advanced quiz engine with adaptive difficulty
- [ ] Live class / webinar integration

---

## 🛡️ Security

| Layer | Implementation |
|-------|----------------|
| **Authentication** | JWT with `jose` library — stateless, signed tokens |
| **Password Security** | `bcryptjs` hashing with salt rounds |
| **Payment Security** | Stripe handles all card data — PCI compliant by default |
| **Admin Actions** | Master password verification for sensitive operations |
| **Input Validation** | `react-hook-form` on the frontend + API-layer checks |
| **Environment Secrets** | All keys stored in `.env.local` — never exposed to client |
| **OAuth** | Firebase-backed social login (GitHub, Google) |

---

## 🤝 Contributing

Contributions are always welcome! Here's how to get started:

```bash
# Fork the repo, then create your feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature description"

# Push to your branch
git push origin feature/your-feature-name

# Open a Pull Request
```

Please make sure your code follows the existing TypeScript and ESLint conventions.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### 🌟 If this project helped you, please give it a star!

**Built with ❤️ for a Smarter Future in Education**

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-masumBillah--1-181717?style=for-the-badge&logo=github)](https://github.com/masumBillah-1/Ai-Powered-Learning-Management-System)

</div>
