"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

// ── Icons ──────────────────────────────────────────────────────────────────
const I = {
  Home: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Book: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
  Chart: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  Users: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Settings: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  Bell: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>),
  Search: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Logout: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Plus: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Eye: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  Edit: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Clock: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Star: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  CheckCircle: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
  TrendingUp: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
  User: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Sun: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
  Moon: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Menu: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>),
  Video: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>),
  File: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>),
  Message: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
};

// ── Mock Data ──────────────────────────────────────────────────────────────
const courses = [
  { id: 1, title: "React & Next.js Masterclass", students: 324, rating: 4.8, revenue: 9720, published: true, lessons: 48, duration: "24h 30m", color: "from-blue-500 to-cyan-400", category: "Web Dev", lastUpdated: "2 days ago", enrolled: 18, avgProgress: 68 },
  { id: 2, title: "Python for Data Science", students: 567, rating: 4.9, revenue: 17010, published: true, lessons: 60, duration: "32h 15m", color: "from-yellow-500 to-orange-400", category: "Data Science", lastUpdated: "1 week ago", enrolled: 32, avgProgress: 45 },
  { id: 3, title: "UI/UX Design Fundamentals", students: 289, rating: 4.7, revenue: 8670, published: true, lessons: 36, duration: "18h 45m", color: "from-pink-500 to-rose-400", category: "Design", lastUpdated: "3 days ago", enrolled: 12, avgProgress: 72 },
  { id: 4, title: "Node.js Backend Development", students: 198, rating: 4.6, revenue: 5940, published: false, lessons: 52, duration: "28h 00m", color: "from-green-500 to-emerald-400", category: "Backend", lastUpdated: "5 hours ago", enrolled: 8, avgProgress: 0 },
  { id: 5, title: "Advanced TypeScript", students: 412, rating: 4.9, revenue: 12360, published: true, lessons: 42, duration: "21h 30m", color: "from-purple-500 to-indigo-400", category: "Programming", lastUpdated: "4 days ago", enrolled: 25, avgProgress: 58 },
];

const recentStudents = [
  { id: 1, name: "Ahmed Hossain", course: "React & Next.js", progress: 68, lastActive: "2 hours ago", avatar: "AH" },
  { id: 2, name: "Fatima Khan", course: "Python for Data Science", progress: 35, lastActive: "5 hours ago", avatar: "FK" },
  { id: 3, name: "Rafi Islam", course: "UI/UX Design", progress: 82, lastActive: "1 day ago", avatar: "RI" },
  { id: 4, name: "Sakib Rahman", course: "Node.js Backend", progress: 12, lastActive: "3 days ago", avatar: "SR" },
  { id: 5, name: "Nadia Islam", course: "Advanced TypeScript", progress: 91, lastActive: "1 hour ago", avatar: "NI" },
];

const activity = [
  { id: 1, action: "New enrollment", detail: "Ahmed Hossain joined React & Next.js", time: "5 min ago", icon: "👤", color: "text-blue-400" },
  { id: 2, action: "Course completed", detail: "Nadia Islam finished Advanced TypeScript", time: "2 hours ago", icon: "🎉", color: "text-green-400" },
  { id: 3, action: "Review received", detail: "5-star review on Python for Data Science", time: "4 hours ago", icon: "⭐", color: "text-yellow-400" },
  { id: 4, action: "Question posted", detail: "Rafi Islam asked about React Hooks", time: "Yesterday", icon: "❓", color: "text-purple-400" },
  { id: 5, action: "Revenue milestone", detail: "Reached $50k total earnings", time: "2 days ago", icon: "💰", color: "text-emerald-400" },
];

const monthlyRevenue = [
  { month: "Jan", amount: 8200 },
  { month: "Feb", amount: 9500 },
  { month: "Mar", amount: 11200 },
  { month: "Apr", amount: 13800 },
  { month: "May", amount: 12400 },
  { month: "Jun", amount: 15600 },
];

const weeklyStats = [
  { day: "Mon", enrollments: 12 },
  { day: "Tue", enrollments: 8 },
  { day: "Wed", enrollments: 15 },
  { day: "Thu", enrollments: 10 },
  { day: "Fri", enrollments: 18 },
  { day: "Sat", enrollments: 22 },
  { day: "Sun", enrollments: 14 },
];

// ── Theme helper ───────────────────────────────────────────────────────────
const th = (dark: boolean, d: string, l: string) => dark ? d : l;

// ══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════════════════
const HomePage = ({ firstName, dark }: any) => {
  const card = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300 shadow-sm");
  const sub = th(dark, "text-white/40", "text-gray-400");
  const muted = th(dark, "text-white/30", "text-gray-400");
  const heading = th(dark, "text-white", "text-gray-900");
  
  const totalStudents = courses.reduce((a, c) => a + c.students, 0);
  const totalRevenue = courses.reduce((a, c) => a + c.revenue, 0);
  const avgRating = (courses.reduce((a, c) => a + c.rating, 0) / courses.length).toFixed(1);
  const activeCourses = courses.filter(c => c.published).length;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A0D2E] to-[#0D0818] border border-white/5 p-8">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 80% 50%, #832388 0%, transparent 60%), radial-gradient(circle at 20% 80%, #F0772F 0%, transparent 50%)"}} />
        <div className="relative z-10">
          <p className="text-white/50 text-sm mb-1">Good morning! 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back, {firstName}!</h1>
          <p className="text-white/60 text-sm mb-4">You have <span className="text-[#E3436B] font-semibold">{recentStudents.filter(s => s.lastActive.includes('hour')).length} new activities</span> today.</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total Students", value: totalStudents, icon: "👥", color: "from-blue-500/20 to-blue-600/10" },
              { label: "Active Courses", value: activeCourses, icon: "📚", color: "from-green-500/20 to-green-600/10" },
              { label: "Avg Rating", value: avgRating, icon: "⭐", color: "from-yellow-500/20 to-yellow-600/10" },
              { label: "This Month", value: `$${(totalRevenue/1000).toFixed(1)}k`, icon: "💰", color: "from-purple-500/20 to-purple-600/10" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-xl bg-gradient-to-br ${stat.color} backdrop-blur-sm border border-white/10 p-4`}>
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Revenue", value:`$${(totalRevenue/1000).toFixed(1)}k`, sub:"all time", c:"from-emerald-500/20 to-emerald-600/5", b:"border-emerald-500/20", a:"text-emerald-400", icon: <I.TrendingUp /> },
          { label:"Students", value:totalStudents, sub:"enrolled", c:"from-blue-500/20 to-blue-600/5", b:"border-blue-500/20", a:"text-blue-400", icon: <I.Users /> },
          { label:"Courses", value:courses.length, sub:`${activeCourses} published`, c:"from-purple-500/20 to-purple-600/5", b:"border-purple-500/20", a:"text-purple-400", icon: <I.Book /> },
          { label:"Completion", value:"72%", sub:"avg rate", c:"from-orange-500/20 to-orange-600/5", b:"border-orange-500/20", a:"text-orange-400", icon: <I.CheckCircle /> },
        ].map((s,i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${s.c} border ${s.b} p-5`}>
            <div className="flex items-start justify-between mb-3">
              <div className={s.a}>{s.icon}</div>
              <span className={`text-xs ${muted}`}>↑ 12%</span>
            </div>
            <p className={`text-2xl font-bold ${s.a}`}>{s.value}</p>
            <p className={`font-medium text-sm mt-1 ${heading}`}>{s.label}</p>
            <p className={`text-xs ${muted}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Courses + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold ${heading}`}>My Courses</h2>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${dark ? "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white hover:opacity-90" : "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white hover:opacity-90"}`}>
              <I.Plus /> Create Course
            </button>
          </div>
          
          {courses.slice(0, 4).map(c => (
            <div key={c.id} className={`rounded-2xl border transition-all duration-300 p-5 ${card}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-lg`}>
                  {c.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className={`font-semibold text-sm leading-tight ${heading}`}>{c.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs ${sub}`}>{c.category}</span>
                        <span className={`text-xs flex items-center gap-1 ${sub}`}>
                          <I.Users />{c.students}
                        </span>
                        <span className="text-xs flex items-center gap-1 text-yellow-400">
                          <I.Star />{c.rating}
                        </span>
                      </div>
                    </div>
                    {c.published ? (
                      <span className="flex-shrink-0 bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-lg font-medium">
                        Published
                      </span>
                    ) : (
                      <span className="flex-shrink-0 bg-orange-500/20 text-orange-400 text-[10px] px-2 py-1 rounded-lg font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-4 text-xs mt-3 mb-3 ${muted}`}>
                    <span className="flex items-center gap-1"><I.Video />{c.lessons} lessons</span>
                    <span className="flex items-center gap-1"><I.Clock />{c.duration}</span>
                    <span className="font-medium text-emerald-400">${(c.revenue/1000).toFixed(1)}k</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white bg-white/10 hover:bg-white/15" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`}>
                      <I.Eye /> View
                    </button>
                    <button className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white bg-white/10 hover:bg-white/15" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`}>
                      <I.Edit /> Edit
                    </button>
                    <button className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white bg-white/10 hover:bg-white/15" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`}>
                      <I.Chart /> Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div>
            <h2 className={`text-lg font-bold mb-4 ${heading}`}>Recent Activity</h2>
            <div className="space-y-3">
              {activity.map(a => (
                <div key={a.id} className={`rounded-xl border p-4 ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200"}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${heading}`}>{a.action}</p>
                      <p className={`text-xs truncate ${sub}`}>{a.detail}</p>
                      <p className={`text-[11px] mt-0.5 ${muted}`}>{a.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={`text-lg font-bold mb-4 ${heading}`}>Recent Students</h2>
            <div className="space-y-3">
              {recentStudents.slice(0, 4).map(s => (
                <div key={s.id} className={`rounded-xl border p-4 ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${heading}`}>{s.name}</p>
                      <p className={`text-xs truncate ${sub}`}>{s.course}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`h-1 flex-1 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                          <div className="h-full bg-gradient-to-r from-[#832388] to-[#F0772F] rounded-full" style={{width: `${s.progress}%`}} />
                        </div>
                        <span className={`text-[10px] flex-shrink-0 ${sub}`}>{s.progress}%</span>
                      </div>
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
// COURSES PAGE
// ══════════════════════════════════════════════════════════════════════════
const CoursesPage = ({ dark }: any) => {
  const [filter, setFilter] = useState("all");
  const heading = th(dark, "text-white", "text-gray-900");
  const sub = th(dark, "text-white/40", "text-gray-400");
  const card = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300");
  const muted = th(dark, "text-white/30", "text-gray-400");
  
  const filtered = courses.filter(c => 
    filter === "published" ? c.published : 
    filter === "draft" ? !c.published : true
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${heading}`}>My Courses</h2>
          <p className={`text-sm mt-1 ${sub}`}>{courses.length} courses • {courses.filter(c => c.published).length} published</p>
        </div>
        <div className="flex gap-2">
          {["all", "published", "draft"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f ? "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white" : 
                th(dark,"bg-white/5 text-white/50 hover:text-white hover:bg-white/10","bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800")
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
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
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0 flex items-center justify-center text-white font-bold`}>
                  {c.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm leading-tight mb-0.5 ${heading}`}>{c.title}</h3>
                  <p className={`text-xs ${sub}`}>{c.category}</p>
                </div>
                {c.published ? (
                  <span className="flex-shrink-0 bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-lg font-medium">
                    Live
                  </span>
                ) : (
                  <span className="flex-shrink-0 bg-orange-500/20 text-orange-400 text-[10px] px-2 py-1 rounded-lg font-medium">
                    Draft
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`rounded-lg p-3 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                  <p className={`text-xs ${sub}`}>Students</p>
                  <p className={`text-lg font-bold ${heading}`}>{c.students}</p>
                </div>
                <div className={`rounded-lg p-3 ${dark ? "bg-white/5" : "bg-gray-50"}`}>
                  <p className={`text-xs ${sub}`}>Revenue</p>
                  <p className="text-lg font-bold text-emerald-400">${(c.revenue/1000).toFixed(1)}k</p>
                </div>
              </div>

              <div className={`flex items-center justify-between text-xs mb-4 ${muted}`}>
                <span className="flex items-center gap-1"><I.Video />{c.lessons}</span>
                <span className="flex items-center gap-1"><I.Clock />{c.duration}</span>
                <span className="flex items-center gap-1 text-yellow-400"><I.Star />{c.rating}</span>
              </div>

              <div className="flex gap-2">
                <button className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                  <I.Edit /> Edit
                </button>
                <button className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                  <I.Chart /> Stats
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// ANALYTICS PAGE
// ══════════════════════════════════════════════════════════════════════════
const AnalyticsPage = ({ dark }: any) => {
  const heading = th(dark, "text-white", "text-gray-900");
  const sub = th(dark, "text-white/40", "text-gray-400");
  const box = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const muted = th(dark, "text-white/30", "text-gray-400");

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.amount));
  const maxEnrollments = Math.max(...weeklyStats.map(w => w.enrollments));

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${heading}`}>Analytics</h2>
        <p className={`text-sm mt-1 ${sub}`}>Track your performance and earnings</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$53.7k", change: "+23%", up: true, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-500/20" },
          { label: "New Students", value: "99", change: "+12%", up: true, color: "text-blue-400", bg: "from-blue-500/10 to-blue-600/5", border: "border-blue-500/20" },
          { label: "Avg Rating", value: "4.8", change: "+0.2", up: true, color: "text-yellow-400", bg: "from-yellow-500/10 to-yellow-600/5", border: "border-yellow-500/20" },
          { label: "Completion", value: "72%", change: "+5%", up: true, color: "text-purple-400", bg: "from-purple-500/10 to-purple-600/5", border: "border-purple-500/20" },
        ].map((m, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${m.bg} border ${m.border} p-5`}>
            <div className="flex items-start justify-between mb-2">
              <p className={`text-xs ${sub}`}>{m.label}</p>
              <span className={`text-xs font-medium ${m.up ? 'text-green-400' : 'text-red-400'}`}>
                {m.change}
              </span>
            </div>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold ${heading}`}>Revenue Overview</h3>
          <select className={`px-3 py-1.5 rounded-lg text-sm border ${dark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        </div>
        <div className="flex items-end gap-3 h-48">
          {monthlyRevenue.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className={`text-xs font-medium ${sub}`}>${(m.amount/1000).toFixed(1)}k</span>
              <div className="w-full rounded-t-xl overflow-hidden" style={{height: `${(m.amount / maxRevenue) * 160}px`}}>
                <div className="w-full h-full bg-gradient-to-t from-[#832388] to-[#F0772F] hover:opacity-90 transition-opacity cursor-pointer" />
              </div>
              <span className={`text-xs ${muted}`}>{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Enrollments */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl border p-6 ${box}`}>
          <h3 className={`font-bold mb-6 ${heading}`}>Weekly Enrollments</h3>
          <div className="flex items-end gap-2 h-32">
            {weeklyStats.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className={`text-[10px] ${sub}`}>{w.enrollments}</span>
                <div className="w-full rounded-t-lg overflow-hidden" style={{height: `${(w.enrollments / maxEnrollments) * 100}px`}}>
                  <div className={`w-full h-full ${dark ? "bg-blue-500/80" : "bg-blue-500"} hover:opacity-90 transition-opacity cursor-pointer`} />
                </div>
                <span className={`text-[10px] ${muted}`}>{w.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className={`rounded-2xl border p-6 ${box}`}>
          <h3 className={`font-bold mb-5 ${heading}`}>Top Performing</h3>
          <div className="space-y-4">
            {courses
              .sort((a, b) => b.revenue - a.revenue)
              .slice(0, 5)
              .map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${muted}`}>#{i + 1}</span>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {c.title[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${heading}`}>{c.title}</p>
                    <p className={`text-xs ${sub}`}>{c.students} students</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">${(c.revenue/1000).toFixed(1)}k</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// STUDENTS PAGE
// ══════════════════════════════════════════════════════════════════════════
const StudentsPage = ({ dark }: any) => {
  const heading = th(dark, "text-white", "text-gray-900");
  const sub = th(dark, "text-white/40", "text-gray-400");
  const box = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const muted = th(dark, "text-white/30", "text-gray-400");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${heading}`}>Students</h2>
          <p className={`text-sm mt-1 ${sub}`}>{courses.reduce((a, c) => a + c.students, 0)} total students</p>
        </div>
        <div className={`flex items-center gap-2 border rounded-xl px-4 py-2 ${dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
          <I.Search />
          <input type="text" placeholder="Search students..." className={`bg-transparent text-sm outline-none w-48 ${heading}`} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentStudents.map(s => (
          <div key={s.id} className={`rounded-2xl border p-5 transition-all ${box}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center text-white font-bold flex-shrink-0">
                {s.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${heading}`}>{s.name}</p>
                <p className={`text-xs ${sub}`}>{s.course}</p>
                <p className={`text-[10px] mt-0.5 ${muted}`}>Active {s.lastActive}</p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={sub}>Progress</span>
                <span className={`font-medium ${heading}`}>{s.progress}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                <div className="h-full bg-gradient-to-r from-[#832388] to-[#F0772F] rounded-full" style={{width: `${s.progress}%`}} />
              </div>
            </div>

            <div className="flex gap-2">
              <button className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                <I.Message /> Message
              </button>
              <button className={`flex-1 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                <I.Eye /> View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════════════════════════════════════
const SettingsPage = ({ user, dark }: any) => {
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [bio, setBio] = useState("Passionate educator with 5+ years of experience in web development and design.");
  const [saved, setSaved] = useState(false);
  
  const heading = th(dark, "text-white", "text-gray-900");
  const sub = th(dark, "text-white/60", "text-gray-500");
  const box = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const input = th(dark, "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#832388]", "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#832388]");

  const save = () => {
    localStorage.setItem("user", JSON.stringify({...user, name, bio}));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className={`text-2xl font-bold ${heading}`}>Settings</h2>
        <p className={`text-sm mt-1 ${sub}`}>Manage your instructor profile</p>
      </div>

      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className={`flex items-center gap-3 mb-5 ${heading}`}>
          <I.User />
          <h3 className="font-bold">Profile Information</h3>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center text-3xl font-bold text-white overflow-hidden flex-shrink-0">
            {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : name[0]?.toUpperCase()}
          </div>
          <div>
            <button className={`px-4 py-2 rounded-xl text-sm font-medium transition mb-2 ${dark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
              Change Photo
            </button>
            <p className={`text-xs ${sub}`}>JPG, PNG or GIF. Max 2MB</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`text-sm block mb-1.5 ${sub}`}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className={`w-full h-11 px-4 rounded-xl border text-sm outline-none transition ${input}`} />
          </div>
          <div>
            <label className={`text-sm block mb-1.5 ${sub}`}>Email Address</label>
            <input value={email} readOnly className={`w-full h-11 px-4 rounded-xl border text-sm outline-none opacity-50 cursor-not-allowed ${input}`} />
          </div>
          <div>
            <label className={`text-sm block mb-1.5 ${sub}`}>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition resize-none ${input}`} />
          </div>
          <button onClick={save} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition ${saved ? "bg-green-500/20 text-green-400" : "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white hover:opacity-90"}`}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 ${box}`}>
        <h3 className={`font-bold mb-5 ${heading}`}>Payout Settings</h3>
        <div className="space-y-4">
          <div>
            <label className={`text-sm block mb-1.5 ${sub}`}>Payment Method</label>
            <select className={`w-full h-11 px-4 rounded-xl border text-sm outline-none ${input}`}>
              <option>Bank Transfer</option>
              <option>PayPal</option>
              <option>Stripe</option>
            </select>
          </div>
          <div>
            <label className={`text-sm block mb-1.5 ${sub}`}>Minimum Payout</label>
            <input type="number" placeholder="100" className={`w-full h-11 px-4 rounded-xl border text-sm outline-none ${input}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
const navItems = [
  { id: "home", label: "Dashboard", Icon: I.Home },
  { id: "courses", label: "My Courses", Icon: I.Book },
  { id: "analytics", label: "Analytics", Icon: I.Chart },
  { id: "students", label: "Students", Icon: I.Users },
  { id: "settings", label: "Settings", Icon: I.Settings },
];

const pageTitles: Record<string, string> = {
  home: "Dashboard",
  courses: "My Courses",
  analytics: "Analytics",
  students: "Students",
  settings: "Settings",
};

export default function InstructorDashboard() {
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({ name: "Instructor", email: "", photoURL: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem("user");
      if (s) setUser(JSON.parse(s));
    } catch {}
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const firstName = user?.name?.split(" ")[0] || "Instructor";

  if (!mounted) return null;

  const bg = th(dark, "bg-[#05010D]", "bg-gray-50");
  const sidebar = th(dark, "bg-[#0D0818] border-white/5", "bg-white border-gray-200");
  const sText = th(dark, "text-white", "text-gray-900");
  const sSub = th(dark, "text-white/40", "text-gray-400");
  const navActive = th(dark, "bg-gradient-to-r from-[#832388]/30 to-[#F0772F]/10 border-[#832388]/30 text-white", "bg-gradient-to-r from-[#832388]/10 to-[#F0772F]/5 border-[#832388]/20 text-gray-900");
  const navIdle = th(dark, "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5", "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100");
  const userCard = th(dark, "bg-white/5", "bg-gray-100");
  const header = th(dark, "bg-[#05010D]/80 border-white/5", "bg-white/90 border-gray-200");
  const hText = th(dark, "text-white", "text-gray-900");
  const hSub = th(dark, "text-white/30", "text-gray-400");
  const searchCls = th(dark, "bg-white/5 border-white/10 text-white/70 placeholder-white/30", "bg-gray-100 border-gray-200 text-gray-700 placeholder-gray-400");
  const bellCls = th(dark, "bg-white/5 border-white/10 text-white/60 hover:text-white", "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-800");
  const toggleCls = th(dark, "bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10", "bg-gray-100 border-gray-200 text-indigo-500 hover:bg-gray-200");
  const divider = th(dark, "border-white/5", "border-gray-200");

  return (
    <div className={`min-h-screen ${bg} ${sText} flex overflow-hidden transition-colors duration-300`} style={{fontFamily: "'DM Sans', system-ui, sans-serif"}}>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${sidebar} border-r flex flex-col transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className={`p-6 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-black text-sm text-white">S</div>
            <Link href={'/'}>
              <p className={`font-bold text-sm ${sText}`}>SmartLMS</p>
              <p className={`text-[10px] ${sSub}`}>Instructor Portal</p>
            </Link>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => { setActiveNav(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${activeNav === id ? navActive : navIdle}`}>
              <span className={activeNav === id ? "text-[#E3436B]" : ""}><Icon /></span>
              {label}
              {activeNav === id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E3436B]" />}
            </button>
          ))}
        </nav>

        <div className={`p-4 border-t ${divider}`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl ${userCard}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden text-white">
              {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : firstName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${sText}`}>{user?.name || "Instructor"}</p>
              <p className={`text-[11px] truncate ${sSub}`}>{user?.email || ""}</p>
            </div>
            <button onClick={handleLogout} className={`hover:text-red-400 transition-colors flex-shrink-0 ${sSub}`} title="Logout">
              <I.Logout />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className={`sticky top-0 z-30 ${header} backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between gap-4 transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`lg:hidden transition-colors ${hSub} hover:text-[#E3436B]`}><I.Menu /></button>
            <div>
              <h1 className={`font-bold text-base ${hText}`}>{pageTitles[activeNav]}</h1>
              <p className={`text-xs hidden sm:block ${hSub}`}>SmartLMS Instructor Portal</p>
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
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E3436B]" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm overflow-hidden text-white">
              {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : firstName[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {activeNav === "home" && <HomePage firstName={firstName} dark={dark} />}
          {activeNav === "courses" && <CoursesPage dark={dark} />}
          {activeNav === "analytics" && <AnalyticsPage dark={dark} />}
          {activeNav === "students" && <StudentsPage dark={dark} />}
          {activeNav === "settings" && <SettingsPage user={user} dark={dark} />}
        </main>
      </div>
    </div>
  );
}