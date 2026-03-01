"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Theme Hook (identical to student/instructor) ───────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lms-theme");
      if (saved) setDark(saved === "dark");
    } catch {}
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("lms-theme", next ? "dark" : "light");
  };
  return { dark, toggle };
};

// ── Theme helper ───────────────────────────────────────────────────────────
const th = (dark: boolean, d: string, l: string) => dark ? d : l;

// ── Icons ──────────────────────────────────────────────────────────────────
const I = {
  Home:     () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Users:    () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Book:     () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
  Chart:    () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  Settings: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  Bell:     () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>),
  Search:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Logout:   () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Menu:     () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>),
  Sun:      () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Moon:     () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Shield:   () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  Eye:      () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  Edit:     () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash:    () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Check:    () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  X:        () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Star:     () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  Clock:    () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Video:    () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>),
  TrendUp:  () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
  Alert:    () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  Lock:     () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  Chevron:  () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>),
  User:     () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  UserPlus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>),
};

// ── Mock Data ──────────────────────────────────────────────────────────────
const allUsers = [
  { id: 1, name: "Ahmed Hossain",   email: "ahmed@email.com",  role: "student",    status: "active",  avatar: "AH", courses: 3,  joined: "Jan 10, 2025",  lastActive: "2h ago" },
  { id: 2, name: "Dr. Fatima Khan", email: "fatima@email.com", role: "instructor", status: "active",  avatar: "FK", courses: 4,  joined: "Dec 5, 2024",   lastActive: "5h ago" },
  { id: 3, name: "Rafi Islam",      email: "rafi@email.com",   role: "student",    status: "pending", avatar: "RI", courses: 1,  joined: "Feb 1, 2025",   lastActive: "1d ago" },
  { id: 4, name: "Sakib Rahman",    email: "sakib@email.com",  role: "instructor", status: "active",  avatar: "SR", courses: 2,  joined: "Nov 15, 2024",  lastActive: "2d ago" },
  { id: 5, name: "Nadia Islam",     email: "nadia@email.com",  role: "student",    status: "banned",  avatar: "NI", courses: 5,  joined: "Oct 22, 2024",  lastActive: "3d ago" },
  { id: 6, name: "Karim Hossain",   email: "karim@email.com",  role: "instructor", status: "pending", avatar: "KH", courses: 0,  joined: "Feb 5, 2025",   lastActive: "4d ago" },
];

const allCourses = [
  { id: 1, title: "React & Next.js Masterclass",   instructor: "Dr. Fatima Khan", students: 324, revenue: 9720,  rating: 4.8, status: "published", color: "from-blue-500 to-cyan-400",    category: "Web Dev",     lessons: 48 },
  { id: 2, title: "Python for Data Science",        instructor: "Karim Hossain",   students: 567, revenue: 17010, rating: 4.9, status: "published", color: "from-yellow-500 to-orange-400", category: "Data Science", lessons: 60 },
  { id: 3, title: "UI/UX Design Fundamentals",      instructor: "Sakib Rahman",    students: 289, revenue: 8670,  rating: 4.7, status: "pending",   color: "from-pink-500 to-rose-400",    category: "Design",       lessons: 36 },
  { id: 4, title: "Node.js Backend Development",    instructor: "Dr. Fatima Khan", students: 198, revenue: 5940,  rating: 4.6, status: "draft",     color: "from-green-500 to-emerald-400", category: "Backend",      lessons: 52 },
  { id: 5, title: "Advanced TypeScript",             instructor: "Ahmed Hossain",   students: 412, revenue: 12360, rating: 4.9, status: "published", color: "from-purple-500 to-indigo-400", category: "Programming",  lessons: 42 },
];

const revenueData = [
  { month: "Sep", v: 18200 }, { month: "Oct", v: 21500 },
  { month: "Nov", v: 19800 }, { month: "Dec", v: 26400 },
  { month: "Jan", v: 31200 }, { month: "Feb", v: 35600 },
];

const userGrowth = [
  { month: "Sep", s: 280, i: 3 }, { month: "Oct", s: 350, i: 4 },
  { month: "Nov", s: 420, i: 3 }, { month: "Dec", s: 510, i: 5 },
  { month: "Jan", s: 490, i: 4 }, { month: "Feb", s: 590, i: 6 },
];

const recentActivity = [
  { id: 1, icon: "👤", action: "New instructor registered", detail: "Dr. Fatima Khan applied",    time: "5m ago",   color: "text-purple-400" },
  { id: 2, icon: "📚", action: "Course pending approval",  detail: "UI/UX Design Fundamentals",  time: "22m ago",  color: "text-yellow-400" },
  { id: 3, icon: "💰", action: "Revenue milestone",        detail: "Platform hit $140k total",   time: "1h ago",   color: "text-emerald-400" },
  { id: 4, icon: "⚠️", action: "Account flagged",          detail: "Suspicious login detected",  time: "3h ago",   color: "text-red-400" },
  { id: 5, icon: "🚀", action: "Mass enrollment",          detail: "50 students joined Python",  time: "5h ago",   color: "text-blue-400" },
];

const pendingApprovals = [
  { id: 1, type: "instructor", name: "Rafi Islam",    detail: "Applied for instructor role",   time: "1d ago",  avatar: "RI" },
  { id: 2, type: "course",     name: "UI/UX Design Fundamentals", detail: "By Sakib Rahman",  time: "2h ago",  avatar: "SC" },
  { id: 3, type: "instructor", name: "Karim Hossain", detail: "Applied for instructor role",   time: "4d ago",  avatar: "KH" },
];

// ══════════════════════════════════════════════════════════════════════════
// STATUS BADGE
// ══════════════════════════════════════════════════════════════════════════
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active:    "bg-emerald-500/20 text-emerald-400",
    pending:   "bg-yellow-500/20 text-yellow-400",
    banned:    "bg-red-500/20 text-red-400",
    published: "bg-emerald-500/20 text-emerald-400",
    draft:     "bg-gray-500/20 text-gray-400",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg capitalize ${map[status] ?? map.pending}`}>
      {status}
    </span>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════════════════
const HomePage = ({ dark }: { dark: boolean }) => {
  const card   = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300 shadow-sm");
  const box    = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const sub    = th(dark, "text-white/40", "text-gray-400");
  const muted  = th(dark, "text-white/30", "text-gray-400");
  const h      = th(dark, "text-white", "text-gray-900");

  const totalRevenue    = allCourses.reduce((a, c) => a + c.revenue, 0);
  const totalStudents   = allUsers.filter(u => u.role === "student").length;
  const totalInstruct   = allUsers.filter(u => u.role === "instructor").length;
  const pendingCount    = allUsers.filter(u => u.status === "pending").length;
  const maxR = Math.max(...revenueData.map(r => r.v));
  const maxS = Math.max(...userGrowth.map(u => u.s));

  return (
    <div className="space-y-8">

      {/* Banner — same style as student/instructor */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A0D2E] to-[#0D0818] border border-white/5 p-8">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #832388 0%, transparent 60%), radial-gradient(circle at 20% 80%, #F0772F 0%, transparent 50%)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white/50 text-sm">System Online</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Control Center</h1>
            <p className="text-white/60 text-sm">You have <span className="text-[#E3436B] font-semibold">{pendingCount} pending approvals</span> awaiting review.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Revenue",     val: `$${(totalRevenue/1000).toFixed(0)}k`, icon: "💰" },
              { label: "Students",    val: allUsers.filter(u=>u.role==="student").length + "k+", icon: "🎓" },
              { label: "Instructors", val: totalInstruct, icon: "👩‍🏫" },
              { label: "Courses",     val: allCourses.length, icon: "📚" },
            ].map((st, i) => (
              <div key={i} className="rounded-xl bg-white/[0.06] border border-white/10 p-3 text-center">
                <div className="text-xl mb-0.5">{st.icon}</div>
                <p className="text-lg font-bold text-white leading-none">{st.val}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards — same pattern as student/instructor stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",    val: `$${(totalRevenue/1000).toFixed(1)}k`, sub: "all time",          c: "from-emerald-500/20 to-emerald-600/5", b: "border-emerald-500/20", a: "text-emerald-400", icon: <I.TrendUp /> },
          { label: "Total Students",   val: allCourses.reduce((a,c)=>a+c.students,0).toLocaleString(), sub: "enrolled",   c: "from-blue-500/20 to-blue-600/5",    b: "border-blue-500/20",    a: "text-blue-400",    icon: <I.Users /> },
          { label: "Instructors",      val: totalInstruct,                          sub: "3 pending",         c: "from-purple-500/20 to-purple-600/5",  b: "border-purple-500/20",  a: "text-purple-400",  icon: <I.Shield /> },
          { label: "Pending Actions",  val: pendingCount,                           sub: "need review",       c: "from-rose-500/20 to-rose-600/5",      b: "border-rose-500/20",    a: "text-rose-400",    icon: <I.Alert /> },
        ].map((k, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${k.c} border ${k.b} p-5`}>
            <div className="flex items-start justify-between mb-3">
              <div className={k.a}>{k.icon}</div>
              <span className={`text-xs ${muted}`}>↑ 12%</span>
            </div>
            <p className={`text-2xl font-bold ${k.a}`}>{k.val}</p>
            <p className={`font-medium text-sm mt-1 ${h}`}>{k.label}</p>
            <p className={`text-xs ${muted}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts + right panel — same 3-col grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Revenue Chart */}
          <div className={`rounded-2xl border p-6 ${box}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-bold ${h}`}>Monthly Revenue</h3>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                <I.TrendUp /> +23.4%
              </span>
            </div>
            <div className="flex items-end gap-3 h-40">
              {revenueData.map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className={`text-xs ${sub}`}>${(r.v/1000).toFixed(0)}k</span>
                  <div className="w-full rounded-t-xl overflow-hidden" style={{ height: `${(r.v/maxR)*120}px` }}>
                    <div className="w-full h-full bg-gradient-to-t from-[#832388] to-[#F0772F] opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                  <span className={`text-xs ${muted}`}>{r.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Growth Chart */}
          <div className={`rounded-2xl border p-6 ${box}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-bold ${h}`}>User Growth</h3>
              <div className="flex items-center gap-3 text-[10px] font-semibold">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF0F7B] inline-block"/>Students</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F89B29] inline-block"/>Instructors</span>
              </div>
            </div>
            <div className="flex items-end gap-3 h-36">
              {userGrowth.map((u, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: "110px" }}>
                    <div className="flex-1 rounded-t-md bg-gradient-to-t from-[#FF0F7B] to-[#E3436B] opacity-75 hover:opacity-100 transition-opacity" style={{ height: `${(u.s/maxS)*100}px` }} />
                    <div className="flex-1 rounded-t-md bg-gradient-to-t from-[#F89B29] to-[#FDE047] opacity-75 hover:opacity-100 transition-opacity" style={{ height: `${Math.min((u.i/8)*100,100)}px` }} />
                  </div>
                  <span className={`text-xs ${muted}`}>{u.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-5">

          {/* Pending Approvals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${h}`}>Pending Approvals</h2>
              <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">
                {pendingApprovals.length} waiting
              </span>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map(p => (
                <div key={p.id} className={`rounded-xl border p-4 ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200"}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: p.type === "instructor" ? "linear-gradient(135deg,#832388,#E3436B)" : "linear-gradient(135deg,#FF0F7B,#F89B29)" }}>
                      {p.type === "instructor" ? "👩‍🏫" : "📚"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${h}`}>{p.name}</p>
                      <p className={`text-xs truncate ${sub}`}>{p.detail} · {p.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition">
                      <I.Check /> Approve
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition">
                      <I.X /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className={`text-lg font-bold mb-4 ${h}`}>Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map(a => (
                <div key={a.id} className={`rounded-xl border p-4 ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${h}`}>{a.action}</p>
                      <p className={`text-xs truncate ${sub}`}>{a.detail}</p>
                      <p className={`text-[11px] mt-0.5 ${muted}`}>{a.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// USERS PAGE
// ══════════════════════════════════════════════════════════════════════════
const UsersPage = ({ dark }: { dark: boolean }) => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const h    = th(dark, "text-white", "text-gray-900");
  const sub  = th(dark, "text-white/40", "text-gray-400");
  const card = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300 shadow-sm");
  const muted = th(dark, "text-white/30", "text-gray-400");

  const filtered = allUsers.filter(u =>
    (roleFilter   === "all" || u.role   === roleFilter) &&
    (statusFilter === "all" || u.status === statusFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${h}`}>User Management</h2>
          <p className={`text-sm mt-1 ${sub}`}>{allUsers.length} users · {allUsers.filter(u=>u.role==="student").length} students · {allUsers.filter(u=>u.role==="instructor").length} instructors</p>
        </div>
        <button className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#832388] to-[#F0772F] hover:opacity-90 transition">
          <I.UserPlus /> Add User
        </button>
      </div>

      {/* Filters — same pattern as student/instructor */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-2">
          {["all","student","instructor"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                roleFilter === r
                  ? "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white"
                  : th(dark,"bg-white/5 text-white/50 hover:text-white hover:bg-white/10","bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800")
              }`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {["all","active","pending","banned"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                statusFilter === s
                  ? "bg-gradient-to-r from-[#FF0F7B] to-[#E3436B] text-white"
                  : th(dark,"bg-white/5 text-white/50 hover:text-white hover:bg-white/10","bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800")
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* User Cards — same card style as student dashboard */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(u => (
          <div key={u.id} className={`rounded-2xl border transition-all duration-300 p-5 ${card}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white"
                style={{ background: u.role === "instructor" ? "linear-gradient(135deg,#832388,#E3436B)" : "linear-gradient(135deg,#FF0F7B,#F89B29)" }}>
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${h}`}>{u.name}</p>
                <p className={`text-xs ${sub}`}>{u.email}</p>
                <p className={`text-[10px] mt-0.5 ${muted}`}>Active {u.lastActive}</p>
              </div>
              <StatusBadge status={u.status} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${u.role === "instructor" ? "bg-purple-500/15 text-purple-400" : "bg-blue-500/15 text-blue-400"}`}>
                {u.role}
              </span>
              <span className={`text-xs ${sub}`}>{u.courses} courses · {u.joined}</span>
            </div>
            <div className="flex gap-2">
              <button className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                <I.Eye /> View
              </button>
              <button className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                <I.Edit /> Edit
              </button>
              <button className="py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25">
                <I.Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COURSES PAGE
// ══════════════════════════════════════════════════════════════════════════
const CoursesPage = ({ dark }: { dark: boolean }) => {
  const [filter, setFilter] = useState("all");
  const h     = th(dark, "text-white", "text-gray-900");
  const sub   = th(dark, "text-white/40", "text-gray-400");
  const card  = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300");
  const muted = th(dark, "text-white/30", "text-gray-400");

  const filtered = allCourses.filter(c => filter === "all" || c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${h}`}>Course Management</h2>
          <p className={`text-sm mt-1 ${sub}`}>{allCourses.length} courses · {allCourses.filter(c=>c.status==="pending").length} pending approval</p>
        </div>
        <div className="flex gap-2">
          {["all","published","pending","draft"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white"
                  : th(dark,"bg-white/5 text-white/50 hover:text-white hover:bg-white/10","bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800")
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c => (
          <div key={c.id} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${card}`}>
            <div className={`h-2 bg-gradient-to-r ${c.color}`} />
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0 flex items-center justify-center text-white font-bold`}>{c.title[0]}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm leading-tight mb-0.5 ${h}`}>{c.title}</h3>
                  <p className={`text-xs ${sub}`}>{c.instructor}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`rounded-lg p-3 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                  <p className={`text-xs ${sub}`}>Students</p>
                  <p className={`text-lg font-bold ${h}`}>{c.students}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                  <p className={`text-xs ${sub}`}>Revenue</p>
                  <p className="text-lg font-bold text-emerald-400">${(c.revenue/1000).toFixed(1)}k</p>
                </div>
              </div>
              <div className={`flex items-center justify-between text-xs mb-4 ${muted}`}>
                <span className="flex items-center gap-1"><I.Video />{c.lessons}</span>
                <span className="flex items-center gap-1 text-yellow-400"><I.Star />{c.rating}</span>
                <span>{c.category}</span>
              </div>
              {c.status === "pending" ? (
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:opacity-90 transition">
                    <I.Check /> Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition">
                    <I.X /> Reject
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                    <I.Eye /> View
                  </button>
                  <button className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                    <I.Edit /> Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// ANALYTICS PAGE (mirrors instructor analytics style exactly)
// ══════════════════════════════════════════════════════════════════════════
const AnalyticsPage = ({ dark }: { dark: boolean }) => {
  const h    = th(dark, "text-white", "text-gray-900");
  const sub  = th(dark, "text-white/40", "text-gray-400");
  const box  = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const muted = th(dark, "text-white/30", "text-gray-400");
  const maxR  = Math.max(...revenueData.map(r => r.v));

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${h}`}>Platform Analytics</h2>
        <p className={`text-sm mt-1 ${sub}`}>Comprehensive platform performance metrics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gross Revenue",   val: "$152.7k", change: "+23%", color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/20" },
          { label: "Active Users",    val: "1,872",   change: "+15%", color: "text-blue-400",    bg: "from-blue-500/10 to-blue-600/5",    border: "border-blue-500/20"    },
          { label: "Avg Order Value", val: "$43.90",  change: "+8%",  color: "text-purple-400",  bg: "from-purple-500/10 to-purple-600/5", border: "border-purple-500/20"  },
          { label: "Completion Rate", val: "72%",     change: "+5%",  color: "text-orange-400",  bg: "from-orange-500/10 to-orange-600/5", border: "border-orange-500/20"  },
        ].map((k, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${k.bg} border ${k.border} p-5`}>
            <div className="flex items-start justify-between mb-2">
              <p className={`text-xs ${sub}`}>{k.label}</p>
              <span className="text-xs font-medium text-emerald-400">{k.change}</span>
            </div>
            <p className={`text-2xl font-bold ${k.color}`}>{k.val}</p>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold ${h}`}>Revenue Overview</h3>
          <select className={`px-3 py-1.5 rounded-lg text-sm border ${dark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
        <div className="flex items-end gap-3 h-48">
          {revenueData.map((r, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className={`text-xs font-medium ${sub}`}>${(r.v/1000).toFixed(0)}k</span>
              <div className="w-full rounded-t-xl overflow-hidden" style={{ height: `${(r.v/maxR)*160}px` }}>
                <div className="w-full h-full bg-gradient-to-t from-[#832388] to-[#F0772F] hover:opacity-90 transition-opacity cursor-pointer" />
              </div>
              <span className={`text-xs ${muted}`}>{r.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 ${box}`}>
          <h3 className={`font-bold mb-5 ${h}`}>Top Instructors</h3>
          <div className="space-y-4">
            {[
              { name: "Dr. Fatima Khan", courses: 4, students: 891,  revenue: 26730, avatar: "FK" },
              { name: "Sakib Rahman",    courses: 2, students: 487,  revenue: 14610, avatar: "SR" },
              { name: "Karim Hossain",   courses: 3, students: 412,  revenue: 12360, avatar: "KH" },
            ].map((ins, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-base font-bold ${muted} w-5 text-center`}>#{i+1}</span>
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#832388,#E3436B)" }}>
                  {ins.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${h}`}>{ins.name}</p>
                  <p className={`text-[11px] ${sub}`}>{ins.courses} courses · {ins.students} students</p>
                </div>
                <p className="text-sm font-bold text-emerald-400">${(ins.revenue/1000).toFixed(1)}k</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${box}`}>
          <h3 className={`font-bold mb-5 ${h}`}>Category Performance</h3>
          <div className="space-y-4">
            {[
              { cat: "Web Development", pct: 84, color: "#61DAFB" },
              { cat: "Data Science",    pct: 72, color: "#F89B29" },
              { cat: "Design",          pct: 61, color: "#FF0F7B" },
              { cat: "Backend Dev",     pct: 45, color: "#832388" },
            ].map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm font-medium ${h}`}>{cat.cat}</span>
                  <span className={`text-xs ${sub}`}>{cat.pct}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.pct}%`, background: `linear-gradient(90deg, ${cat.color}66, ${cat.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE (mirrors student/instructor settings exactly)
// ══════════════════════════════════════════════════════════════════════════
const SettingsPage = ({ dark }: { dark: boolean }) => {
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({ newUser: true, courseApproval: true, payouts: false, reports: true });
  const h      = th(dark, "text-white", "text-gray-900");
  const sub    = th(dark, "text-white/60", "text-gray-500");
  const box    = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const input  = th(dark, "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#832388]", "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#832388]");
  const rowBtn = th(dark, "bg-white/[0.02] hover:bg-white/5 border-white/5 hover:border-white/10", "bg-gray-50 hover:bg-gray-100 border-gray-100 hover:border-gray-200");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className={`text-2xl font-bold ${h}`}>Settings</h2>
        <p className={`text-sm mt-1 ${sub}`}>Platform configuration &amp; admin preferences</p>
      </div>

      {/* General settings */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className={`flex items-center gap-3 mb-5 ${h}`}><I.Settings /><h3 className="font-bold">General Settings</h3></div>
        <div className="space-y-4">
          {[
            { label: "Platform Name",  placeholder: "SmartLMS",          type: "text" },
            { label: "Support Email",  placeholder: "admin@smartlms.io",  type: "email" },
            { label: "Platform URL",   placeholder: "https://smartlms.io", type: "url" },
          ].map((f, i) => (
            <div key={i}>
              <label className={`text-sm block mb-1.5 ${sub}`}>{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} className={`w-full h-11 px-4 rounded-xl border text-sm outline-none transition ${input}`} />
            </div>
          ))}
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${saved ? "bg-green-500/20 text-green-400" : "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white hover:opacity-90"}`}>
            {saved ? <><I.Check />Saved!</> : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className={`flex items-center gap-3 mb-5 ${h}`}><I.Bell /><h3 className="font-bold">Admin Notifications</h3></div>
        <div className="space-y-4">
          {[
            { key: "newUser",        label: "New User Registrations",   sub2: "Alert when new users sign up" },
            { key: "courseApproval", label: "Course Approval Requests", sub2: "Notify when courses need review" },
            { key: "payouts",        label: "Payout Processing",        sub2: "Alerts for instructor payouts" },
            { key: "reports",        label: "Weekly Reports",           sub2: "Auto-send platform summary" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className={`text-sm font-medium ${h}`}>{item.label}</p>
                <p className={`text-xs mt-0.5 ${sub}`}>{item.sub2}</p>
              </div>
              <button
                onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifs[item.key as keyof typeof notifs] ? "bg-gradient-to-r from-[#832388] to-[#F0772F]" : dark ? "bg-white/10" : "bg-gray-200"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[item.key as keyof typeof notifs] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className={`flex items-center gap-3 mb-5 ${h}`}><I.Shield /><h3 className="font-bold">Security &amp; Access</h3></div>
        <div className="space-y-3">
          {[
            { title: "Two-Factor Authentication", sub2: "Require 2FA for admin login" },
            { title: "IP Whitelist",               sub2: "Restrict admin access by IP" },
            { title: "Audit Logs",                 sub2: "View all admin action history" },
            { title: "API Access Keys",            sub2: "Manage platform API tokens" },
          ].map((row, i) => (
            <button key={i} className={`w-full flex items-center justify-between p-4 rounded-xl border transition text-left ${rowBtn}`}>
              <div>
                <p className={`text-sm font-medium ${h}`}>{row.title}</p>
                <p className={`text-xs mt-0.5 ${sub}`}>{row.sub2}</p>
              </div>
              <I.Chevron />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// NAV CONFIG — same structure as student/instructor
// ══════════════════════════════════════════════════════════════════════════
const navItems = [
  { id: "home",      label: "Dashboard",   Icon: I.Home    },
  { id: "users",     label: "Users",       Icon: I.Users   },
  { id: "courses",   label: "Courses",     Icon: I.Book    },
  { id: "analytics", label: "Analytics",   Icon: I.Chart   },
  { id: "settings",  label: "Settings",    Icon: I.Settings },
];
const pageTitles: Record<string, string> = {
  home: "Dashboard", users: "User Management",
  courses: "Course Management", analytics: "Analytics", settings: "Settings",
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD — layout identical to student/instructor
// ══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const [activeNav, setActiveNav]     = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!mounted) return null;

  // ── Exact same token names as student/instructor ──
  const bg        = th(dark, "bg-[#05010D]", "bg-gray-50");
  const sidebar   = th(dark, "bg-[#0D0818] border-white/5", "bg-white border-gray-200");
  const sText     = th(dark, "text-white", "text-gray-900");
  const sSub      = th(dark, "text-white/40", "text-gray-400");
  const navActive = th(dark, "bg-gradient-to-r from-[#832388]/30 to-[#F0772F]/10 border-[#832388]/30 text-white", "bg-gradient-to-r from-[#832388]/10 to-[#F0772F]/5 border-[#832388]/20 text-gray-900");
  const navIdle   = th(dark, "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5", "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100");
  const userCard  = th(dark, "bg-white/5", "bg-gray-100");
  const header    = th(dark, "bg-[#05010D]/80 border-white/5", "bg-white/90 border-gray-200");
  const hText     = th(dark, "text-white", "text-gray-900");
  const hSub      = th(dark, "text-white/30", "text-gray-400");
  const searchCls = th(dark, "bg-white/5 border-white/10 text-white/70 placeholder-white/30", "bg-gray-100 border-gray-200 text-gray-700 placeholder-gray-400");
  const bellCls   = th(dark, "bg-white/5 border-white/10 text-white/60 hover:text-white", "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-800");
  const toggleCls = th(dark, "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10", "bg-gray-100 border-gray-200 text-indigo-500 hover:bg-gray-200");
  const divider   = th(dark, "border-white/5", "border-gray-200");

  const pendingCount = allUsers.filter(u => u.status === "pending").length;

  return (
    <div className={`min-h-screen ${bg} ${sText} flex overflow-hidden transition-colors duration-300`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ══ SIDEBAR — identical structure to student/instructor ══ */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${sidebar} border-r flex flex-col transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Logo */}
        <div className={`p-6 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-black text-sm text-white">
              <I.Shield />
            </div>
            <Link href="/">
              <p className={`font-bold text-sm ${sText}`}>SmartLMS</p>
              <p className={`text-[10px] ${sSub}`}>Admin Portal</p>
            </Link>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setActiveNav(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${activeNav === id ? navActive : navIdle}`}>
              <span className={activeNav === id ? "text-[#E3436B]" : ""}><Icon /></span>
              {label}
              {activeNav === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E3436B]" />}
              {/* Pending badge on Users nav */}
              {id === "users" && pendingCount > 0 && activeNav !== "users" && (
                <span className="ml-auto text-[9px] font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}

          {/* Pending warning — unique admin feature */}
          {pendingCount > 0 && (
            <div className={`mt-3 p-3 rounded-xl border ${dark ? "bg-yellow-500/8 border-yellow-500/15" : "bg-yellow-50 border-yellow-200"}`}>
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <div>
                  <p className={`text-xs font-bold ${dark ? "text-yellow-400" : "text-yellow-700"}`}>{pendingCount} Pending</p>
                  <p className={`text-[10px] ${dark ? "text-yellow-400/60" : "text-yellow-600"}`}>Require attention</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* User card — same as student/instructor */}
        <div className={`p-4 border-t ${divider}`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${userCard}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm flex-shrink-0 text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${sText}`}>Admin</p>
              <p className={`text-[11px] truncate ${sSub}`}>admin@smartlms.io</p>
            </div>
            <button onClick={handleLogout} className={`hover:text-red-400 transition-colors flex-shrink-0 ${sSub}`} title="Logout">
              <I.Logout />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══ MAIN AREA — identical structure to student/instructor ══ */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Header */}
        <header className={`sticky top-0 z-30 ${header} backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between gap-4 transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`lg:hidden transition-colors ${hSub} hover:text-[#E3436B]`}>
              <I.Menu />
            </button>
            <div>
              <h1 className={`font-bold text-base ${hText}`}>{pageTitles[activeNav]}</h1>
              <p className={`text-xs hidden sm:block ${hSub}`}>SmartLMS Admin Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 border rounded-xl px-4 py-2 w-52 ${searchCls}`}>
              <I.Search />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-full" />
            </div>

            {/* Dark / Light toggle — same as student/instructor */}
            <button onClick={toggle} title={dark ? "Switch to Light" : "Switch to Dark"}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 ${toggleCls}`}>
              {dark ? <I.Sun /> : <I.Moon />}
            </button>

            {/* Notification bell */}
            <button className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${bellCls}`}>
              <I.Bell />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E3436B]" />
            </button>

            {/* Admin avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm text-white">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeNav === "home"      && <HomePage      dark={dark} />}
          {activeNav === "users"     && <UsersPage     dark={dark} />}
          {activeNav === "courses"   && <CoursesPage   dark={dark} />}
          {activeNav === "analytics" && <AnalyticsPage dark={dark} />}
          {activeNav === "settings"  && <SettingsPage  dark={dark} />}
        </main>
      </div>
    </div>
  );
}