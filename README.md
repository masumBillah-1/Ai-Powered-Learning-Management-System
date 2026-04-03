# 🎓 SmartLms-Pro - AI-Powered Learning Management System

<div align="center">

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwincss)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5.5-5A0EF8)
![License](https://img.shields.io/badge/license-MIT-green)

**SmartLms-Pro is a state-of-the-art, AI-infused educational ecosystem designed to redefine online learning. It offers a seamless, interactive experience for students, powerful management tools for instructors, and comprehensive oversight for administrators.**

[✨ Key Features](#-key-features) • [🛠️ Tech Stack](#-technology-stack) • [🎨 Design System](#-design-system) • [🚀 Getting Started](#-getting-started) • [📂 Architecture](#-project-structure)

</div>

---

## 🌟 Overview

SmartLms-Pro is not just another LMS; it's a personalized learning journey. By leveraging AI-powered insights, real-time communication via Socket.io, and a gamified experience, we've built a platform that keeps learners engaged and helps instructors succeed.

### 🎯 Core Objectives

- **Adaptive Learning:** AI-driven course recommendations and content analysis.
- **Role-Centric Experience:** Tailored dashboards for Students, Instructors, and Admins.
- **Modern Performance:** Built on Next.js 15 for blazing-fast server-side rendering and edge optimization.
- **Engagement First:** Gamification elements like points, streaks, and leaderboards.

---

## ✨ Key Features

### 👨‍🎓 For Students
- **Smart Learning Path:** Browse and enroll in courses with AI-personalized suggestions.
- **Interactive Syllabus:** Engagement-focused course materials with progress tracking.
- **Gamified Achievements:** Earn badges, track learning streaks, and climb the leaderboard.
- **Integrated Helpdesk:** Real-time support and FAQ access.

### 👨‍🏫 For Instructors
- **Course Studio:** Powerful course creation tools with rich media support via Cloudinary.
- **Student Analytics:** Detailed insights into student progress and engagement.
- **Revenue Management:** Track earnings and manage payouts via Stripe integration.
- **Live Interaction:** Connect with students through integrated messaging systems.

### 👨‍💼 For Administrators
- **System Command Center:** Full control over users, courses, and platform settings.
- **Financial Oversight:** Manage platform commissions, revenue reporting, and payouts.
- **Compliance & Approval:** Workflow for reviewing and approving new instructor-led courses.
- **Global Announcements:** Broadcast important updates across the entire platform.

---

## 🎨 Design System

SmartLms-Pro features a premium "Cyber-Energy" UI with smooth animations and a vibrant color palette.

### 🌈 Color Palette

| Usage | Light Theme | Dark Theme | Hex Codes |
|-------|-------------|------------|-----------|
| **Primary** | Hot Pink | Hot Pink | `#FF0F7B` |
| **Secondary**| Brand Orange | Brand Orange | `#F89B29` |
| **Accent** | Brand Purple | Brand Purple | `#832388` |
| **Surface** | Pure White (`#FFFFFF`) | Dark Navy (`#0B1120`) | - |
| **Border** | Soft Gray (`#F3F4F6`) | Steel Gray (`#1F2937`) | - |

> [!TIP]
> We use dynamic gradients like `linear-gradient(135deg, #FF0F7B 0%, #F89B29 100%)` for primary CTAs to create a high-energy feel.

### 📝 Typography
- **Primary (Bengali):** `Hind Siliguri` - Optimized for high readability in local context.
- **Secondary (English):** `Geist` - Modern, clean sans-serif for technical and administrative tasks.

---

## 🛠️ Technology Stack

### **Frontend & UI**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + DaisyUI 5
- **Animations:** Framer Motion + Lottie
- **Visualization:** Recharts

### **Backend & Database**
- **Runtime:** Node.js
- **API Strategy:** Next.js API Routes (JSON Web Token Authentication)
- **Database:** MongoDB (Managed via Mongoose)
- **Real-time:** Socket.io for live notifications and messaging.

### **Integrations**
- **AI Engine:** Anthropic Claude SDK + AI-powered YouTube transcript processing.
- **Payments:** Stripe (PCI Compliant Checkout & Payouts).
- **Storage:** Cloudinary (High-performance image/video hosting).
- **Authentication:** Custom JWT-based Identity Management + Firebase integration.

---

## 📁 Project Structure

```bash
Ai-Powered-Learning-Management-System/
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)/         # Authentication (Login, Register, OTP)
│   │   ├── (public)/       # Landing Page, Blog, FAQ
│   │   ├── dashboard/      # Admin, Instructor, & Student Portals
│   │   ├── learn/          # Core Course Player & Learning Path
│   │   └── api/            # Serverless API Endpoints
│   ├── components/         # Reusable Component Library
│   ├── models/             # Mongoose Data Models
│   ├── db/                 # MongoDB Connection Logic
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Shared Utilities & SDKs
│   └── server/             # Standalone Socket.io Server logic
├── public/                 # Static Assets
├── next.config.ts          # Project-specific Configuration
└── package.json            # Dependencies & Scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18.x or higher
- MongoDB instance (Atlas or Local)
- Cloudinary, Stripe, and Anthropic API Keys

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/masumBillah-1/Ai-Powered-Learning-Management-System.git

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your credentials:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Auth
JWT_SECRET=your_jwt_secret

# Third-party
STRIPE_SECRET_KEY=...
CLOUDINARY_URL=...
ANTHROPIC_API_KEY=...
```

### 4. Running the Project
```bash
# Start the Next.js development server
npm run dev

# (Optional) Start the Socket.io server
npm run socket:dev
```

---

## 🛡️ Security
- **JWT Protection:** Secure stateless sessions.
- **Data Encryption:** Sensitive information hashed using `bcryptjs`.
- **Safe Payments:** Fully handled by Stripe for maximum safety.

---

<div align="center">
Built with ❤️ for a Smarter Future.
</div>
