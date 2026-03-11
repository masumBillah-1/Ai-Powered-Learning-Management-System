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
    } catch { }
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
  Home: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>),
  Book: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>),
  Chart: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>),
  Cert: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>),
  Settings: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" /></svg>),
  Bell: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>),
  Search: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
  Logout: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>),
  Play: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>),
  Clock: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
  Star: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>),
  Check: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
  Download: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>),
  User: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
  Lock: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>),
  Fire: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="#fb923c"><path d="M12 2c0 0-5 4-5 10a5 5 0 0 0 10 0C17 6 12 2 12 2zm0 14a3 3 0 0 1-3-3c0-3 3-6 3-6s3 3 3 6a3 3 0 0 1-3 3z" /></svg>),
  Sun: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>),
  Moon: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>),
  Chevron: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>),
  Menu: () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>),
};

// ── Mock Data ──────────────────────────────────────────────────────────────
const courses = [
  { id: 1, title: "React & Next.js Masterclass", instructor: "Ahmed Hossain", progress: 68, totalLessons: 48, completedLessons: 33, duration: "24h 30m", rating: 4.8, category: "Web Dev", color: "from-blue-500 to-cyan-400", lastLesson: "Server Components Deep Dive", enrolled: "Jan 10, 2025" },
  { id: 2, title: "Python for Data Science", instructor: "Fatima Khan", progress: 35, totalLessons: 60, completedLessons: 21, duration: "32h 15m", rating: 4.9, category: "Data Science", color: "from-yellow-500 to-orange-400", lastLesson: "Pandas DataFrame Operations", enrolled: "Jan 22, 2025" },
  { id: 3, title: "UI/UX Design Fundamentals", instructor: "Rafi Islam", progress: 82, totalLessons: 36, completedLessons: 30, duration: "18h 45m", rating: 4.7, category: "Design", color: "from-pink-500 to-rose-400", lastLesson: "Prototyping with Figma", enrolled: "Dec 5, 2024" },
  { id: 4, title: "Node.js Backend Development", instructor: "Sakib Rahman", progress: 12, totalLessons: 52, completedLessons: 6, duration: "28h 00m", rating: 4.6, category: "Backend", color: "from-green-500 to-emerald-400", lastLesson: "REST API Design", enrolled: "Feb 1, 2025" },
  { id: 5, title: "HTML & CSS Fundamentals", instructor: "Nadia Islam", progress: 100, totalLessons: 24, completedLessons: 24, duration: "12h 00m", rating: 4.8, category: "Web Dev", color: "from-orange-500 to-red-400", lastLesson: "CSS Grid Layout", enrolled: "Nov 15, 2024" },
];
const certs = [
  { id: 1, title: "HTML & CSS Fundamentals", instructor: "Nadia Islam", date: "Dec 20, 2024", code: "CERT-2024-001", color: "from-orange-500 to-red-400" },
  { id: 2, title: "JavaScript Basics", instructor: "Karim Hossain", date: "Nov 5, 2024", code: "CERT-2024-002", color: "from-yellow-500 to-orange-400" },
];
const activity = [
  { id: 1, action: "Completed lesson", detail: "Server Components Deep Dive", time: "2 hours ago", icon: "✅" },
  { id: 2, action: "Quiz passed", detail: "Python Basics Quiz — 92%", time: "Yesterday", icon: "🎯" },
  { id: 3, action: "Certificate earned", detail: "HTML & CSS Fundamentals", time: "3 days ago", icon: "🏆" },
  { id: 4, action: "New enrollment", detail: "Node.js Backend Development", time: "5 days ago", icon: "📚" },
];
const deadlines = [
  { id: 1, title: "React Project Submission", course: "React & Next.js", dueDate: "Feb 28", daysLeft: 4, urgent: true },
  { id: 2, title: "Data Analysis Assignment", course: "Python for Data Science", dueDate: "Mar 5", daysLeft: 9, urgent: false },
  { id: 3, title: "Design Portfolio Review", course: "UI/UX Design", dueDate: "Mar 10", daysLeft: 14, urgent: false },
];
const weekly = [
  { day: "Mon", h: 2.5 }, { day: "Tue", h: 1.8 }, { day: "Wed", h: 3.2 },
  { day: "Thu", h: 0.5 }, { day: "Fri", h: 2.0 }, { day: "Sat", h: 4.5 }, { day: "Sun", h: 1.2 },
];

// ── Progress Ring ──────────────────────────────────────────────────────────
const Ring = ({ v, size = 88, stroke = 7 }: { v: number; size?: number; stroke?: number }) => {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#g)" strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c - (v / 100) * c} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#832388" /><stop offset="100%" stopColor="#F0772F" />
      </linearGradient></defs>
    </svg>
  );
};

// ── Theme helper ───────────────────────────────────────────────────────────
const th = (dark: boolean, d: string, l: string) => dark ? d : l;

// ══════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════════════════
const HomePage = ({ firstName, overallProgress, dark }: any) => {
  const card = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300 shadow-sm");
  const sub = th(dark, "text-white/40", "text-gray-400");
  const muted = th(dark, "text-white/30", "text-gray-400");
  const heading = th(dark, "text-white", "text-gray-900");
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A0D2E] to-[#0D0818] border border-white/5 p-8">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #832388 0%, transparent 60%), radial-gradient(circle at 20% 80%, #F0772F 0%, transparent 50%)" }} />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-white/50 text-sm mb-1">Welcome back 👋</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{firstName}!</h1>
            <p className="text-white/60 text-sm">You have <span className="text-[#E3436B] font-semibold">3 deadlines</span> coming up.</p>
            <div className="flex items-center gap-2 mt-3"><I.Fire /><span className="text-sm text-white/70"><span className="text-orange-400 font-bold">7 day</span> streak!</span></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative"><Ring v={overallProgress} />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-white">{overallProgress}%</span>
                <span className="text-[9px] text-white/40">Overall</span>
              </div>
            </div>
            <div>
              <p className="text-white/40 text-xs mb-1">Lessons done</p>
              <p className="font-bold text-lg text-white">{courses.reduce((a, c) => a + c.completedLessons, 0)}</p>
              <p className="text-white/40 text-xs">total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Enrolled", value: courses.length, sub: "courses", c: "from-blue-500/20 to-blue-600/5", b: "border-blue-500/20", a: "text-blue-400" },
          { label: "Completed", value: "1", sub: "courses", c: "from-green-500/20 to-green-600/5", b: "border-green-500/20", a: "text-green-400" },
          { label: "Certificates", value: certs.length, sub: "earned", c: "from-yellow-500/20 to-yellow-600/5", b: "border-yellow-500/20", a: "text-yellow-400" },
          { label: "Study Time", value: "42h", sub: "this month", c: "from-purple-500/20 to-purple-600/5", b: "border-purple-500/20", a: "text-purple-400" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${s.c} border ${s.b} p-5`}>
            <p className={`text-2xl font-bold ${s.a}`}>{s.value}</p>
            <p className={`font-medium text-sm mt-1 ${heading}`}>{s.label}</p>
            <p className={`text-xs ${muted}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Courses + Right panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h2 className={`text-lg font-bold ${heading}`}>My Courses</h2>
          {courses.slice(0, 3).map(c => (
            <div key={c.id} className={`rounded-2xl border transition-all duration-300 p-5 ${card}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-lg`}>{c.title[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-semibold text-sm leading-tight ${heading}`}>{c.title}</h3>
                    <span className={`text-xs flex-shrink-0 ${sub}`}>{c.progress}%</span>
                  </div>
                  <p className={`text-xs mb-3 ${sub}`}>{c.instructor} · {c.category}</p>
                  <div className={`h-1.5 rounded-full overflow-hidden mb-3 ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                    <div className={`h-full bg-gradient-to-r ${c.color} rounded-full`} style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-3 text-xs ${muted}`}>
                      <span className="flex items-center gap-1"><I.Clock />{c.duration}</span>
                      <span>{c.completedLessons}/{c.totalLessons}</span>
                    </div>
                    <button className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${dark ? "text-white bg-white/10 hover:bg-white/15" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`}>
      <I.Play /> Continue
    </button>
  </div>
                </div >
              </div >
            </div >
          ))}
        </div >

  <div className="space-y-5">
    <div>
      <h2 className={`text-lg font-bold mb-4 ${heading}`}>Upcoming Deadlines</h2>
      <div className="space-y-3">
        {deadlines.map(d => (
          <div key={d.id} className={`rounded-xl border p-4 ${d.urgent ? "bg-red-500/10 border-red-500/20" : dark ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-200"}`}>
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className={`text-sm font-medium leading-tight ${heading}`}>{d.title}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${d.urgent ? "bg-red-500/20 text-red-400" : dark ? "bg-white/10 text-white/50" : "bg-gray-100 text-gray-500"}`}>{d.daysLeft}d</span>
            </div>
            <p className={`text-xs ${sub}`}>{d.course} · {d.dueDate}</p>
          </div>
        ))}
      </div>
    </div>
    <div>
      <h2 className={`text-lg font-bold mb-4 ${heading}`}>Recent Activity</h2>
      <div className="space-y-3">
        {activity.map(a => (
          <div key={a.id} className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0">{a.icon}</span>
            <div className="min-w-0">
              <p className={`text-sm font-medium ${heading}`}>{a.action}</p>
              <p className={`text-xs truncate ${sub}`}>{a.detail}</p>
              <p className={`text-[11px] mt-0.5 ${muted}`}>{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
      </div >
    </div >
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
  const filtered = courses.filter(c => filter === "completed" ? c.progress === 100 : filter === "in-progress" ? c.progress < 100 : true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${heading}`}>My Courses</h2>
          <p className={`text-sm mt-1 ${sub}`}>{courses.length} courses enrolled</p>
        </div>
        <div className="flex gap-2">
          {["all", "in-progress", "completed"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white" : th(dark, "bg-white/5 text-white/50 hover:text-white hover:bg-white/10", "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800")
                }`}>
              {f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${card}`}>
            <div className={`h-2 bg-gradient-to-r ${c.color}`} />
            <div className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.color} flex-shrink-0 flex items-center justify-center text-white font-bold`}>{c.title[0]}</div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm leading-tight mb-0.5 ${heading}`}>{c.title}</h3>
                  <p className={`text-xs ${sub}`}>{c.instructor}</p>
                </div>
                {c.progress === 100 && (
                  <span className="flex-shrink-0 bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                    <I.Check />Done
                  </span>
                )}
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className={sub}>{c.completedLessons}/{c.totalLessons} lessons</span>
                  <span className={`font-medium ${heading}`}>{c.progress}%</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                  <div className={`h-full bg-gradient-to-r ${c.color} rounded-full`} style={{ width: `${c.progress}%` }} />
                </div>
              </div>
              <div className={`flex items-center justify-between text-xs mb-4 ${sub}`}>
                <span className="flex items-center gap-1"><I.Clock />{c.duration}</span>
                <span className="flex items-center gap-1 text-yellow-400"><I.Star />{c.rating}</span>
                <span>{c.enrolled}</span>
              </div>
              <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${c.progress === 100 ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white hover:opacity-90"
                }`}>
                {c.progress === 100 ? <><I.Check />Completed</> : <><I.Play />Continue</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// PROGRESS PAGE
// ══════════════════════════════════════════════════════════════════════════
const ProgressPage = ({ dark }: any) => {
  const maxH = Math.max(...weekly.map(d => d.h));
  const totalH = weekly.reduce((a, d) => a + d.h, 0).toFixed(1);
  const overall = Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length);
  const heading = th(dark, "text-white", "text-gray-900");
  const sub = th(dark, "text-white/40", "text-gray-400");
  const box = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${heading}`}>Progress</h2>
        <p className={`text-sm mt-1 ${sub}`}>Track your learning journey</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall", value: `${overall}%`, sub: "all courses", a: "text-purple-400", b: "border-purple-500/20", bg: "from-purple-500/10 to-purple-600/5" },
          { label: "This Week", value: `${totalH}h`, sub: "study time", a: "text-blue-400", b: "border-blue-500/20", bg: "from-blue-500/10 to-blue-600/5" },
          { label: "Lessons", value: courses.reduce((a, c) => a + c.completedLessons, 0), sub: "done", a: "text-green-400", b: "border-green-500/20", bg: "from-green-500/10 to-green-600/5" },
          { label: "Quizzes", value: "8", sub: "passed", a: "text-yellow-400", b: "border-yellow-500/20", bg: "from-yellow-500/10 to-yellow-600/5" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl bg-gradient-to-br ${s.bg} border ${s.b} p-5`}>
            <p className={`text-2xl font-bold ${s.a}`}>{s.value}</p>
            <p className={`font-medium text-sm mt-1 ${heading}`}>{s.label}</p>
            <p className={`text-xs ${sub}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <h3 className={`font-bold mb-6 ${heading}`}>Weekly Study Hours</h3>
        <div className="flex items-end gap-3 h-40">
          {weekly.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className={`text-xs ${sub}`}>{d.h}h</span>
              <div className="w-full rounded-t-lg overflow-hidden" style={{ height: `${(d.h / maxH) * 120}px` }}>
                <div className="w-full h-full bg-gradient-to-t from-[#832388] to-[#F0772F] opacity-80 hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
              <span className={`text-xs ${sub}`}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course progress */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <h3 className={`font-bold mb-5 ${heading}`}>Course-wise Progress</h3>
        <div className="space-y-5">
          {courses.map(c => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-xs font-bold`}>{c.title[0]}</div>
                  <div>
                    <p className={`text-sm font-medium ${heading}`}>{c.title}</p>
                    <p className={`text-xs ${sub}`}>{c.completedLessons}/{c.totalLessons} lessons</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${c.progress === 100 ? "text-green-400" : heading}`}>{c.progress}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                <div className={`h-full bg-gradient-to-r ${c.color} rounded-full transition-all duration-700`} style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <h3 className={`font-bold mb-2 ${heading}`}>
          Learning Streak — February 2025
        </h3>

        <div className="grid grid-cols-20 gap-1 w-150">
          {Array.from({ length: 30 }, (_, i) => {
            const day = i + 1;
            const on = [
              1, 2, 4, 5, 6, 8, 9, 10, 11, 14, 15, 17, 18, 19, 22, 23, 24, 25
            ].includes(day);

            return (
              <div
                key={day}
                className={`aspect-square w-5 rounded-md flex items-center justify-center text-[10px] font-medium transition-all
            ${on
                    ? "bg-gradient-to-br from-[#832388] to-[#F0772F] text-white"
                    : dark
                      ? "bg-white/5 text-white/20"
                      : "bg-gray-100 text-gray-400"
                  }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <p className={`text-xs mt-3 ${sub}`}>
          🔥 Current streak:
          <span className="text-orange-400 font-bold ml-1">
            7 days
          </span>
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// CERTIFICATES PAGE
// ══════════════════════════════════════════════════════════════════════════
const CertificatesPage = ({ dark }: any) => {
  const heading = th(dark, "text-white", "text-gray-900");
  const sub = th(dark, "text-white/40", "text-gray-400");
  const box = th(dark, "bg-white/[0.03] border-white/5 hover:border-white/10", "bg-white border-gray-200 hover:border-gray-300 shadow-sm");

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${heading}`}>Certificates</h2>
        <p className={`text-sm mt-1 ${sub}`}>{certs.length} certificates earned</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {certs.map(cert => (
          <div key={cert.id} className={`rounded-2xl border overflow-hidden transition-all ${box}`}>
            <div className={`relative h-44 bg-gradient-to-br ${cert.color} p-6 flex flex-col justify-between overflow-hidden`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs text-white">S</div>
                  <span className="text-white/80 text-xs font-medium">SmartLMS</span>
                </div>
                <p className="text-white/70 text-xs">Certificate of Completion</p>
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-bold text-lg leading-tight">{cert.title}</h3>
                <p className="text-white/70 text-xs mt-1">{cert.instructor}</p>
              </div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl">🏆</div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-xs ${sub}`}>Issued on</p>
                  <p className={`text-sm font-medium ${heading}`}>{cert.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${sub}`}>Certificate ID</p>
                  <p className="text-sm font-mono text-[#E3436B]">{cert.code}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[#832388] to-[#F0772F] text-white hover:opacity-90 transition">
                  <I.Download /> Download
                </button>
                <button className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${th(dark, "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white", "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700")}`}>Share</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl border p-6 ${th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm")}`}>
        <h3 className={`font-bold mb-4 ${heading}`}>Upcoming Certificates</h3>
        <div className="space-y-3">
          {courses.filter(c => c.progress < 100).slice(0, 3).map(c => (
            <div key={c.id} className={`flex items-center gap-4 p-3 rounded-xl border ${th(dark, "bg-white/[0.02] border-white/5", "bg-gray-50 border-gray-100")}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{c.title[0]}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${heading}`}>{c.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`h-1.5 flex-1 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                    <div className={`h-full bg-gradient-to-r ${c.color} rounded-full`} style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className={`text-xs flex-shrink-0 ${sub}`}>{c.progress}%</span>
                </div>
              </div>
              <span className={`text-xs flex-shrink-0 ${sub}`}>{100 - c.progress}% left</span>
            </div>
          ))}
        </div>
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
  const [notifs, setNotifs] = useState({ email: true, push: false, deadline: true, newCourse: false });
  const [saved, setSaved] = useState(false);
  const heading = th(dark, "text-white", "text-gray-900");
  const sub = th(dark, "text-white/60", "text-gray-500");
  const box = th(dark, "bg-white/[0.03] border-white/5", "bg-white border-gray-200 shadow-sm");
  const input = th(dark, "bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#832388]", "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#832388]");
  const rowBtn = th(dark, "bg-white/[0.02] hover:bg-white/5 border-white/5 hover:border-white/10", "bg-gray-50 hover:bg-gray-100 border-gray-100 hover:border-gray-200");

  const save = () => {
    localStorage.setItem("user", JSON.stringify({ ...user, name }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className={`text-2xl font-bold ${heading}`}>Settings</h2>
        <p className={`text-sm mt-1 ${sub}`}>Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className={`flex items-center gap-3 mb-5 ${heading}`}><I.User /><h3 className="font-bold">Profile Information</h3></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center text-2xl font-bold text-white overflow-hidden flex-shrink-0">
            {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : name[0]?.toUpperCase()}
          </div>
          <div>
            <p className={`font-medium ${heading}`}>{name}</p>
            <p className={`text-sm ${sub}`}>{email}</p>
            <p className="text-xs text-[#E3436B] mt-1">Student</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className={`text-sm block mb-1.5 ${sub}`}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className={`w-full h-11 px-4 rounded-xl border text-sm outline-none transition ${input}`} placeholder="Your name" />
          </div>
          <div>
            <label className={`text-sm block mb-1.5 ${sub}`}>Email Address</label>
            <input value={email} readOnly className={`w-full h-11 px-4 rounded-xl border text-sm outline-none opacity-50 cursor-not-allowed ${input}`} />
          </div>
          <button onClick={save} className={`px-6 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 ${saved ? "bg-green-500/20 text-green-400" : "bg-gradient-to-r from-[#832388] to-[#F0772F] text-white hover:opacity-90"}`}>
            {saved ? <><I.Check />Saved!</> : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className={`flex items-center gap-3 mb-5 ${heading}`}><I.Bell /><h3 className="font-bold">Notifications</h3></div>
        <div className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", sub: "Receive updates via email" },
            { key: "push", label: "Push Notifications", sub: "Browser push notifications" },
            { key: "deadline", label: "Deadline Reminders", sub: "Get reminded before deadlines" },
            { key: "newCourse", label: "New Course Alerts", sub: "Notify when new courses added" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className={`text-sm font-medium ${heading}`}>{item.label}</p>
                <p className={`text-xs mt-0.5 ${sub}`}>{item.sub}</p>
              </div>
              <button onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${notifs[item.key as keyof typeof notifs] ? "bg-gradient-to-r from-[#832388] to-[#F0772F]" : dark ? "bg-white/10" : "bg-gray-200"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[item.key as keyof typeof notifs] ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className={`rounded-2xl border p-6 ${box}`}>
        <div className={`flex items-center gap-3 mb-5 ${heading}`}><I.Lock /><h3 className="font-bold">Security</h3></div>
        <div className="space-y-3">
          {[
            { title: "Change Password", sub: "Update your login password" },
            { title: "Two-Factor Authentication", sub: "Add extra security to your account" },
          ].map((row, i) => (
            <button key={i} className={`w-full flex items-center justify-between p-4 rounded-xl border transition text-left ${rowBtn}`}>
              <div>
                <p className={`text-sm font-medium ${heading}`}>{row.title}</p>
                <p className={`text-xs mt-0.5 ${sub}`}>{row.sub}</p>
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
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════
const navItems = [
  { id: "home", label: "Dashboard", Icon: I.Home },
  { id: "courses", label: "My Courses", Icon: I.Book },
  { id: "progress", label: "Progress", Icon: I.Chart },
  { id: "certificates", label: "Certificates", Icon: I.Cert },
  { id: "settings", label: "Settings", Icon: I.Settings },
];

const pageTitles: Record<string, string> = {
  home: "Dashboard", courses: "My Courses", progress: "Progress", certificates: "Certificates", settings: "Settings"
};

export default function StudentDashboard() {
  const router = useRouter();
  const { dark, toggle } = useTheme();
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({ name: "Student", email: "", photoURL: "" });
  const [mounted, setMounted] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const s = localStorage.getItem("user");
      if (s) setUser(JSON.parse(s));
    } catch { }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handlePlayVideo = (videoUrl: string, title: string) => {
    setSelectedVideo({ url: videoUrl, title });
  };

  const firstName = user?.name?.split(" ")[0] || "Student";
  const overallProgress = Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length);

  if (!mounted) return null;

  // Theme tokens
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
    <div className={`min-h-screen ${bg} ${sText} flex overflow-hidden transition-colors duration-300`} style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 ${sidebar} border-r flex flex-col transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className={`p-6 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-black text-sm text-white">S</div>
            <Link href={'/'}>
              <p className={`font-bold text-sm ${sText}`}>SmartLMS</p>
              <p className={`text-[10px] ${sSub}`}>Student Portal</p>
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
              <p className={`text-sm font-semibold truncate ${sText}`}>{user?.name || "Student"}</p>
              <p className={`text-[11px] truncate ${sSub}`}>{user?.email || ""}</p>
            </div>
            <button onClick={handleLogout} className={`hover:text-red-400 transition-colors flex-shrink-0 ${sSub}`} title="Logout">
              <I.Logout />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className={`sticky top-0 z-30 ${header} backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between gap-4 transition-colors duration-300`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`lg:hidden transition-colors ${hSub} hover:text-[#E3436B]`}><I.Menu /></button>
            <div>
              <h1 className={`font-bold text-base ${hText}`}>{pageTitles[activeNav]}</h1>
              <p className={`text-xs hidden sm:block ${hSub}`}>SmartLMS Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 border rounded-xl px-4 py-2 w-52 ${searchCls}`}>
              <I.Search />
              <input type="text" placeholder="Search..." className="bg-transparent text-sm outline-none w-full" />
            </div>

            {/* ✅ Dark / Light Toggle */}
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
  { activeNav === "home" && <HomePage firstName={firstName} overallProgress={overallProgress} dark={dark} onPlayVideo={handlePlayVideo} /> }
  { activeNav === "courses" && <CoursesPage dark={dark} /> }
  { activeNav === "progress" && <ProgressPage dark={dark} /> }
  { activeNav === "certificates" && <CertificatesPage dark={dark} /> }
  { activeNav === "settings" && <SettingsPage user={user} dark={dark} /> }
        </main >
      </div >

    {/* Video Modal */ }
    < VideoModal
  isOpen = {!!selectedVideo
}
onClose = {() => setSelectedVideo(null)}
videoUrl = { selectedVideo?.url || ""}
title = { selectedVideo?.title || ""}
      />
    </div >
  );
}
