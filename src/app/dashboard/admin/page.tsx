"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

// ── Theme Hook ─────────────────────────────────────────────────────────────
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
  User:     () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Book:     () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
  Megaphone: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>),
  Clipboard: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>),
  Users:    () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Quiz:     () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  Award:    () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>),
  Certificate: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
  DollarSign: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
  CreditCard: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>),
  FileText: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
  MessageSquare: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
  HelpCircle: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
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
  TrendUp:  () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
  Alert:    () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  Chevron:  () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>),
  UserPlus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>),
  Video:    () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>),
};

// ── Status Badge ───────────────────────────────────────────────────────────
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

// ── Types ──────────────────────────────────────────────────────────────────
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  instructor: string;
  students: number;
  revenue: number;
  rating: number;
  status: string;
  category: string;
  lessons: number;
}

interface AdminStats {
  totalRevenue: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  pendingUsers: number;
  pendingCourses: number;
  pendingTotal: number;
}

// ══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════════════════
const HomePage = ({ dark, stats, users, courses }: { dark: boolean; stats: AdminStats; users: User[]; courses: Course[] }) => {
  const card   = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300 shadow-sm");
  const box    = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const sub    = th(dark, "text-white/40", "text-gray-400");
  const muted  = th(dark, "text-white/30", "text-gray-400");
  const h      = th(dark, "text-white", "text-gray-900");

  const pendingUsers = users.filter(u => u.status === "pending");
  const pendingCourses = courses.filter(c => c.status === "pending");

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A0D2E] to-[#0D0818] border border-white/5 p-8">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #832388 0%, transparent 60%), radial-gradient(circle at 20% 80%, #F0772F 0%, transparent 50%)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white/50 text-sm">System Online</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Control Center</h1>
            <p className="text-white/60 text-sm">You have <span className="text-[#E3436B] font-semibold">{stats.pendingTotal} pending approvals</span> awaiting review.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Revenue",     val: `$${(stats.totalRevenue/1000).toFixed(0)}k`, icon: "💰" },
              { label: "Students",    val: stats.totalStudents, icon: "🎓" },
              { label: "Instructors", val: stats.totalInstructors, icon: "👩‍🏫" },
              { label: "Courses",     val: stats.totalCourses, icon: "📚" },
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",    val: `$${(stats.totalRevenue/1000).toFixed(1)}k`, sub: "all time",    c: "from-emerald-500/20 to-emerald-600/5", b: "border-emerald-500/20", a: "text-emerald-400", icon: <I.TrendUp /> },
          { label: "Total Students",   val: stats.totalStudents,                          sub: "enrolled",   c: "from-blue-500/20 to-blue-600/5",    b: "border-blue-500/20",    a: "text-blue-400",    icon: <I.Users /> },
          { label: "Instructors",      val: stats.totalInstructors,                       sub: `${stats.pendingUsers} pending`, c: "from-purple-500/20 to-purple-600/5",  b: "border-purple-500/20",  a: "text-purple-400",  icon: <I.Shield /> },
          { label: "Pending Actions",  val: stats.pendingTotal,                           sub: "need review", c: "from-rose-500/20 to-rose-600/5",      b: "border-rose-500/20",    a: "text-rose-400",    icon: <I.Alert /> },
        ].map((k, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${k.c} border ${k.b} p-5`}>
            <div className="flex items-start justify-between mb-3">
              <div className={k.a}>{k.icon}</div>
            </div>
            <p className={`text-2xl font-bold ${k.a}`}>{k.val}</p>
            <p className={`font-medium text-sm mt-1 ${h}`}>{k.label}</p>
            <p className={`text-xs ${muted}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 ${box}`}>
          <h3 className={`font-bold mb-5 ${h}`}>Pending Users ({pendingUsers.length})</h3>
          <div className="space-y-3">
            {pendingUsers.slice(0, 5).map(user => (
              <div key={user._id} className={`rounded-xl border p-4 ${card}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-[#832388] to-[#E3436B]">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${h}`}>{user.name}</p>
                    <p className={`text-xs truncate ${sub}`}>{user.email} · {user.role}</p>
                  </div>
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveUser(user._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition">
                    <I.Check /> Approve
                  </button>
                  <button 
                    onClick={() => handleRejectUser(user._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition">
                    <I.X /> Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingUsers.length === 0 && (
              <p className={`text-center py-8 ${sub}`}>No pending users</p>
            )}
          </div>
        </div>

        <div className={`rounded-2xl border p-6 ${box}`}>
          <h3 className={`font-bold mb-5 ${h}`}>Pending Courses ({pendingCourses.length})</h3>
          <div className="space-y-3">
            {pendingCourses.slice(0, 5).map(course => (
              <div key={course._id} className={`rounded-xl border p-4 ${card}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-[#FF0F7B] to-[#F89B29]">
                    {course.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${h}`}>{course.title}</p>
                    <p className={`text-xs truncate ${sub}`}>By {course.instructor}</p>
                  </div>
                  <StatusBadge status={course.status} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveCourse(course._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition">
                    <I.Check /> Approve
                  </button>
                  <button 
                    onClick={() => handleRejectCourse(course._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition">
                    <I.X /> Reject
                  </button>
                </div>
              </div>
            ))}
            {pendingCourses.length === 0 && (
              <p className={`text-center py-8 ${sub}`}>No pending courses</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  async function handleApproveUser(userId: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (res.ok) {
        toast.success("User approved!");
        window.location.reload();
      } else {
        toast.error("Failed to approve user");
      }
    } catch (error) {
      toast.error("Error approving user");
    }
  }

  async function handleRejectUser(userId: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("User rejected!");
        window.location.reload();
      } else {
        toast.error("Failed to reject user");
      }
    } catch (error) {
      toast.error("Error rejecting user");
    }
  }

  async function handleApproveCourse(courseId: string) {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (res.ok) {
        toast.success("Course approved!");
        window.location.reload();
      } else {
        toast.error("Failed to approve course");
      }
    } catch (error) {
      toast.error("Error approving course");
    }
  }

  async function handleRejectCourse(courseId: string) {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Course rejected!");
        window.location.reload();
      } else {
        toast.error("Failed to reject course");
      }
    } catch (error) {
      toast.error("Error rejecting course");
    }
  }
};

// ══════════════════════════════════════════════════════════════════════════
// USERS PAGE
// ══════════════════════════════════════════════════════════════════════════
const UsersPage = ({ dark, users }: { dark: boolean; users: User[] }) => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const h    = th(dark, "text-white", "text-gray-900");
  const sub  = th(dark, "text-white/40", "text-gray-400");
  const card = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300 shadow-sm");
  const muted = th(dark, "text-white/30", "text-gray-400");

  const filtered = users.filter(u =>
    (roleFilter   === "all" || u.role   === roleFilter) &&
    (statusFilter === "all" || u.status === statusFilter)
  );

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("User deleted!");
        window.location.reload();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "banned" : "active";
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`User ${newStatus}!`);
        window.location.reload();
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("Error updating user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${h}`}>User Management</h2>
          <p className={`text-sm mt-1 ${sub}`}>{users.length} users · {users.filter(u=>u.role==="student").length} students · {users.filter(u=>u.role==="instructor").length} instructors</p>
        </div>
      </div>

      {/* Filters */}
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

      {/* User Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(u => (
          <div key={u._id} className={`rounded-2xl border transition-all duration-300 p-5 ${card}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white"
                style={{ background: u.role === "instructor" ? "linear-gradient(135deg,#832388,#E3436B)" : "linear-gradient(135deg,#FF0F7B,#F89B29)" }}>
                {u.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${h}`}>{u.name}</p>
                <p className={`text-xs ${sub}`}>{u.email}</p>
                <p className={`text-[10px] mt-0.5 ${muted}`}>{new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <StatusBadge status={u.status} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg capitalize ${u.role === "instructor" ? "bg-purple-500/15 text-purple-400" : "bg-blue-500/15 text-blue-400"}`}>
                {u.role}
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleToggleStatus(u._id, u.status)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                  u.status === "active" 
                    ? "bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25" 
                    : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                }`}>
                {u.status === "active" ? "Ban" : "Activate"}
              </button>
              <button 
                onClick={() => handleDeleteUser(u._id)}
                className="py-2 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25">
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
const CoursesPage = ({ dark, courses }: { dark: boolean; courses: Course[] }) => {
  const [filter, setFilter] = useState("all");
  const h     = th(dark, "text-white", "text-gray-900");
  const sub   = th(dark, "text-white/40", "text-gray-400");
  const card  = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300");
  const muted = th(dark, "text-white/30", "text-gray-400");

  const filtered = courses.filter(c => filter === "all" || c.status === filter);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Course deleted!");
        window.location.reload();
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      toast.error("Error deleting course");
    }
  };

  const handleApproveCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      if (res.ok) {
        toast.success("Course approved!");
        window.location.reload();
      } else {
        toast.error("Failed to approve course");
      }
    } catch (error) {
      toast.error("Error approving course");
    }
  };

  const handleRejectCourse = async (courseId: string) => {
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "draft" }),
      });
      if (res.ok) {
        toast.success("Course rejected!");
        window.location.reload();
      } else {
        toast.error("Failed to reject course");
      }
    } catch (error) {
      toast.error("Error rejecting course");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${h}`}>Course Management</h2>
          <p className={`text-sm mt-1 ${sub}`}>{courses.length} courses · {courses.filter(c=>c.status==="pending").length} pending approval</p>
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
        {filtered.map(c => {
          const colors = ["from-blue-500 to-cyan-400", "from-yellow-500 to-orange-400", "from-pink-500 to-rose-400", "from-green-500 to-emerald-400", "from-purple-500 to-indigo-400"];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <div key={c._id} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${card}`}>
              <div className={`h-2 bg-gradient-to-r ${color}`} />
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex-shrink-0 flex items-center justify-center text-white font-bold`}>{c.title[0]}</div>
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
                    <button 
                      onClick={() => handleApproveCourse(c._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:opacity-90 transition">
                      <I.Check /> Approve
                    </button>
                    <button 
                      onClick={() => handleRejectCourse(c._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition">
                      <I.X /> Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                      <I.Eye /> View
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(c._id)}
                      className="py-2.5 px-3 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25">
                      <I.Trash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════════════════════════════════════
const SettingsPage = ({ dark }: { dark: boolean }) => {
  const [saved, setSaved] = useState(false);
  const h      = th(dark, "text-white", "text-gray-900");
  const sub    = th(dark, "text-white/60", "text-gray-500");
  const box    = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const input  = th(dark, "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#832388]", "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#832388]");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className={`text-2xl font-bold ${h}`}>Settings</h2>
        <p className={`text-sm mt-1 ${sub}`}>Platform configuration & admin preferences</p>
      </div>

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
    </div>
  );
};

// Announcements page is now in separate file: src/app/dashboard/admin/announcements/page.tsx

// ══════════════════════════════════════════════════════════════════════════
// NAV CONFIG - Exact same as image
// ══════════════════════════════════════════════════════════════════════════
const mainMenuItems = [
  { id: "home",          label: "Dashboard",       Icon: I.Home },
  { id: "profile",       label: "My Profile",      Icon: I.User },
  { id: "courses",       label: "Courses",         Icon: I.Book },
  { id: "announcements", label: "Announcements",   Icon: I.Megaphone },
  { id: "assignments",   label: "Assignments",     Icon: I.Clipboard },
  { id: "users",         label: "Students",        Icon: I.Users },
  { id: "quiz",          label: "Quiz",            Icon: I.Quiz },
  { id: "quiz-results",  label: "Quiz Results",    Icon: I.Award },
  { id: "certificates",  label: "Certificates",    Icon: I.Certificate },
  { id: "earnings",      label: "Earnings",        Icon: I.DollarSign },
  { id: "payout",        label: "Payout",          Icon: I.CreditCard },
  { id: "statements",    label: "Statements",      Icon: I.FileText },
  { id: "messages",      label: "Messages",        Icon: I.MessageSquare },
  { id: "support",       label: "Support Tickets", Icon: I.HelpCircle },
];

const accountMenuItems = [
  { id: "settings", label: "Settings", Icon: I.Settings },
  { id: "logout",   label: "Logout",   Icon: I.Logout },
];

const pageTitles: Record<string, string> = {
  home: "Dashboard",
  profile: "My Profile",
  users: "Students Management",
  courses: "Course Management",
  announcements: "Announcements",
  assignments: "Assignments",
  quiz: "Quiz Management",
  "quiz-results": "Quiz Results",
  certificates: "Certificates",
  earnings: "Earnings",
  payout: "Payout",
  statements: "Statements",
  messages: "Messages",
  support: "Support Tickets",
  settings: "Settings",
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const [activeNav, setActiveNav]     = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [users, setUsers]             = useState<User[]>([]);
  const [courses, setCourses]         = useState<Course[]>([]);
  const [stats, setStats]             = useState<AdminStats>({
    totalRevenue: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    pendingUsers: 0,
    pendingCourses: 0,
    pendingTotal: 0,
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.data.users);
        setCourses(data.data.courses);
        setStats(data.data.stats);
      } else {
        toast.error("Failed to load admin data");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!mounted) return null;

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

  if (loading) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#832388] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={sText}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} ${sText} flex overflow-hidden transition-colors duration-300`}
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${sidebar} border-r flex flex-col transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className={`p-6 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-black text-sm text-white">
              <I.Shield />
            </div>
            <Link href="/">
              <p className={`font-bold text-sm ${sText}`}>SmartLMS</p>
              <p className={`text-[10px] ${sSub}`}>Instructor Portal</p>
            </Link>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Main Menu Section */}
          <div className="mb-4">
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-4 ${sSub}`}>Main Menu</p>
            {mainMenuItems.map(({ id, label, Icon }) => {
              // Use Link for separate pages (announcements, quiz, courses)
              if (id === "announcements") {
                return (
                  <Link key={id} href="/dashboard/admin/announcements"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${navIdle}`}>
                    <span><Icon /></span>
                    {label}
                  </Link>
                );
              }
              
              if (id === "quiz") {
                return (
                  <Link key={id} href="/dashboard/admin/quiz"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${navIdle}`}>
                    <span><Icon /></span>
                    {label}
                  </Link>
                );
              }

              if (id === "courses") {
                return (
                  <Link key={id} href="/dashboard/admin/courses"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${navIdle}`}>
                    <span><Icon /></span>
                    {label}
                  </Link>
                );
              }
              
              return (
                <button key={id} onClick={() => { setActiveNav(id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${activeNav === id ? navActive : navIdle}`}>
                  <span className={activeNav === id ? "text-[#E3436B]" : ""}><Icon /></span>
                  {label}
                  {activeNav === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E3436B]" />}
                  {id === "users" && stats.pendingUsers > 0 && activeNav !== "users" && (
                    <span className="ml-auto text-[9px] font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                      {stats.pendingUsers}
                    </span>
                  )}
                  {id === "courses" && stats.pendingCourses > 0 && activeNav !== "courses" && (
                    <span className="ml-auto text-[9px] font-bold bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full">
                      {stats.pendingCourses}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Account Settings Section */}
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-4 ${sSub}`}>Account Settings</p>
            {accountMenuItems.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => { 
                if (id === "logout") {
                  handleLogout();
                } else {
                  setActiveNav(id); 
                  setSidebarOpen(false);
                }
              }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${activeNav === id ? navActive : navIdle}`}>
                <span className={activeNav === id ? "text-[#E3436B]" : ""}><Icon /></span>
                {label}
                {activeNav === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E3436B]" />}
              </button>
            ))}
          </div>

          {/* Pending Warning */}
          {stats.pendingTotal > 0 && (
            <div className={`mt-4 p-3 rounded-xl border ${dark ? "bg-yellow-500/8 border-yellow-500/15" : "bg-yellow-50 border-yellow-200"}`}>
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <div>
                  <p className={`text-xs font-bold ${dark ? "text-yellow-400" : "text-yellow-700"}`}>{stats.pendingTotal} Pending</p>
                  <p className={`text-[10px] ${dark ? "text-yellow-400/60" : "text-yellow-600"}`}>Require attention</p>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className={`p-4 border-t ${divider}`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${userCard}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm flex-shrink-0 text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${sText}`}>Eugene Andre</p>
              <p className={`text-[11px] truncate ${sSub}`}>Instructor</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN AREA */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
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

            <button onClick={toggle} title={dark ? "Switch to Light" : "Switch to Dark"}
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 ${toggleCls}`}>
              {dark ? <I.Sun /> : <I.Moon />}
            </button>

            <button className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${bellCls}`}>
              <I.Bell />
              {stats.pendingTotal > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E3436B]" />
              )}
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm text-white">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeNav === "home"     && <HomePage     dark={dark} stats={stats} users={users} courses={courses} />}
          {activeNav === "users"    && <UsersPage    dark={dark} users={users} />}
          {activeNav === "courses"  && <CoursesPage  dark={dark} courses={courses} />}
          {activeNav === "settings" && <SettingsPage dark={dark} />}
          {/* Announcements page is now at /dashboard/admin/announcements */}
        </main>
      </div>
    </div>
  );
}
