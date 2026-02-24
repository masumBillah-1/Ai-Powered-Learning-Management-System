"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Icons ──────────────────────────────────────────────────────────────────
const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconCertificate = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconLogout = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
);
const IconFire = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400">
    <path d="M12 2c0 0-5 4-5 10a5 5 0 0 0 10 0C17 6 12 2 12 2zm0 14a3 3 0 0 1-3-3c0-3 3-6 3-6s3 3 3 6a3 3 0 0 1-3 3z"/>
  </svg>
);

// ── Mock Data ──────────────────────────────────────────────────────────────
const enrolledCourses = [
  { id: 1, title: "React & Next.js Masterclass", instructor: "Ahmed Hossain", progress: 68, totalLessons: 48, completedLessons: 33, duration: "24h 30m", rating: 4.8, category: "Web Dev", color: "from-blue-500 to-cyan-400", lastLesson: "Server Components Deep Dive" },
  { id: 2, title: "Python for Data Science", instructor: "Fatima Khan", progress: 35, totalLessons: 60, completedLessons: 21, duration: "32h 15m", rating: 4.9, category: "Data Science", color: "from-yellow-500 to-orange-400", lastLesson: "Pandas DataFrame Operations" },
  { id: 3, title: "UI/UX Design Fundamentals", instructor: "Rafi Islam", progress: 82, totalLessons: 36, completedLessons: 30, duration: "18h 45m", rating: 4.7, category: "Design", color: "from-pink-500 to-rose-400", lastLesson: "Prototyping with Figma" },
  { id: 4, title: "Node.js Backend Development", instructor: "Sakib Rahman", progress: 12, totalLessons: 52, completedLessons: 6, duration: "28h 00m", rating: 4.6, category: "Backend", color: "from-green-500 to-emerald-400", lastLesson: "REST API Design" },
];

const recentActivity = [
  { id: 1, action: "Completed lesson", detail: "Server Components Deep Dive", time: "2 hours ago", icon: "✅" },
  { id: 2, action: "Quiz passed", detail: "Python Basics Quiz — 92%", time: "Yesterday", icon: "🎯" },
  { id: 3, action: "Certificate earned", detail: "HTML & CSS Fundamentals", time: "3 days ago", icon: "🏆" },
  { id: 4, action: "New enrollment", detail: "Node.js Backend Development", time: "5 days ago", icon: "📚" },
];

const upcomingDeadlines = [
  { id: 1, title: "React Project Submission", course: "React & Next.js", dueDate: "Feb 28", daysLeft: 4, urgent: true },
  { id: 2, title: "Data Analysis Assignment", course: "Python for Data Science", dueDate: "Mar 5", daysLeft: 9, urgent: false },
  { id: 3, title: "Design Portfolio Review", course: "UI/UX Design", dueDate: "Mar 10", daysLeft: 14, urgent: false },
];

const navItems = [
  { id: "home", label: "Dashboard", icon: <IconHome /> },
  { id: "courses", label: "My Courses", icon: <IconBook /> },
  { id: "progress", label: "Progress", icon: <IconChart /> },
  { id: "certificates", label: "Certificates", icon: <IconCertificate /> },
  { id: "settings", label: "Settings", icon: <IconSettings /> },
];

// ── Progress Ring ──────────────────────────────────────────────────────────
const ProgressRing = ({ progress, size = 60, stroke = 5 }: { progress: number; size?: number; stroke?: number }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#grad)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }} />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#832388" />
          <stop offset="100%" stopColor="#F0772F" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({ name: "Student", email: "", photoURL: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const firstName = user?.name?.split(" ")[0] || "Student";
  const overallProgress = Math.round(enrolledCourses.reduce((a, c) => a + c.progress, 0) / enrolledCourses.length);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#05010D] text-white flex overflow-hidden" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0D0818] border-r border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-black text-sm">S</div>
            <div>
              <p className="font-bold text-sm">SmartLMS</p>
              <p className="text-[10px] text-white/40">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeNav === item.id
                  ? "bg-gradient-to-r from-[#832388]/30 to-[#F0772F]/10 text-white border border-[#832388]/30"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5"
              }`}>
              <span className={activeNav === item.id ? "text-[#E3436B]" : ""}>{item.icon}</span>
              {item.label}
              {activeNav === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E3436B]" />}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden">
              {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : firstName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || "Student"}</p>
              <p className="text-[11px] text-white/40 truncate">{user?.email || ""}</p>
            </div>
            <button onClick={handleLogout} className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0">
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#05010D]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white/60 hover:text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-64">
              <IconSearch />
              <input type="text" placeholder="Search courses..." className="bg-transparent text-sm text-white/70 placeholder-white/30 outline-none w-full" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
              <IconBell />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E3436B]" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center font-bold text-sm overflow-hidden">
              {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : firstName[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">

          {/* ── Welcome Banner ── */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A0D2E] to-[#0D0818] border border-white/5 p-8">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #832388 0%, transparent 60%), radial-gradient(circle at 20% 80%, #F0772F 0%, transparent 50%)" }} />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-white/50 text-sm mb-1">Welcome back 👋</p>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{firstName}!</h1>
                <p className="text-white/60 text-sm">You have <span className="text-[#E3436B] font-semibold">3 deadlines</span> coming up. Keep it up!</p>
                <div className="flex items-center gap-2 mt-3">
                  <IconFire />
                  <span className="text-sm text-white/70"><span className="text-orange-400 font-bold">7 day</span> learning streak!</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <ProgressRing progress={overallProgress} size={88} stroke={7} />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">{overallProgress}%</span>
                    <span className="text-[9px] text-white/40">Overall</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Total Progress</p>
                  <p className="font-bold text-lg">{enrolledCourses.reduce((a,c) => a + c.completedLessons, 0)}</p>
                  <p className="text-white/40 text-xs">lessons done</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Enrolled", value: enrolledCourses.length, sub: "courses", color: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/20", accent: "text-blue-400" },
              { label: "Completed", value: "1", sub: "courses", color: "from-green-500/20 to-green-600/5", border: "border-green-500/20", accent: "text-green-400" },
              { label: "Certificates", value: "1", sub: "earned", color: "from-yellow-500/20 to-yellow-600/5", border: "border-yellow-500/20", accent: "text-yellow-400" },
              { label: "Study Time", value: "42h", sub: "this month", color: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/20", accent: "text-purple-400" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border} p-5`}>
                <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
                <p className="text-white font-medium text-sm mt-1">{stat.label}</p>
                <p className="text-white/30 text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Courses + Sidebar ── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Enrolled Courses */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">My Courses</h2>
                <Link href="#" className="text-sm text-[#E3436B] hover:underline">View all →</Link>
              </div>

              <div className="space-y-3">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="group rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 p-5">
                    <div className="flex items-start gap-4">
                      {/* Color dot */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-lg`}>
                        {course.title[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm leading-tight">{course.title}</h3>
                          <span className="text-xs text-white/40 flex-shrink-0">{course.progress}%</span>
                        </div>
                        <p className="text-white/40 text-xs mb-3">{course.instructor} · {course.category}</p>

                        {/* Progress bar */}
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                          <div className={`h-full bg-gradient-to-r ${course.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${course.progress}%` }} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-white/30">
                            <span className="flex items-center gap-1"><IconClock />{course.duration}</span>
                            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          </div>
                          <button className="flex items-center gap-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg transition-colors">
                            <IconPlay /> Continue
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">

              {/* Deadlines */}
              <div>
                <h2 className="text-lg font-bold mb-4">Upcoming Deadlines</h2>
                <div className="space-y-3">
                  {upcomingDeadlines.map(d => (
                    <div key={d.id} className={`rounded-xl border p-4 ${d.urgent ? "bg-red-500/10 border-red-500/20" : "bg-white/[0.03] border-white/5"}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium leading-tight">{d.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${d.urgent ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white/50"}`}>
                          {d.daysLeft}d left
                        </span>
                      </div>
                      <p className="text-xs text-white/40">{d.course} · Due {d.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map(a => (
                    <div key={a.id} className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{a.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{a.action}</p>
                        <p className="text-xs text-white/40 truncate">{a.detail}</p>
                        <p className="text-[11px] text-white/25 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Recommended Courses ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recommended for You</h2>
              <Link href="#" className="text-sm text-[#E3436B] hover:underline">Browse all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Machine Learning with Python", instructor: "Dr. Karim", rating: 4.9, students: "12.4k", duration: "40h", price: "৳ 1,299", color: "from-violet-500 to-purple-600" },
                { title: "TypeScript Advanced Patterns", instructor: "Nadia Islam", rating: 4.8, students: "8.2k", duration: "22h", price: "৳ 999", color: "from-cyan-500 to-blue-600" },
                { title: "Digital Marketing Mastery", instructor: "Imran Ali", rating: 4.7, students: "15.1k", duration: "28h", price: "৳ 799", color: "from-pink-500 to-red-500" },
              ].map((c, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden group cursor-pointer">
                  <div className={`h-32 bg-gradient-to-br ${c.color} relative flex items-center justify-center`}>
                    <span className="text-4xl font-black text-white/20">{c.title[0]}</span>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 leading-tight">{c.title}</h3>
                    <p className="text-white/40 text-xs mb-3">{c.instructor}</p>
                    <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                      <span className="flex items-center gap-1 text-yellow-400"><IconStar />{c.rating}</span>
                      <span>{c.students} students</span>
                      <span>{c.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#E3436B]">{c.price}</span>
                      <button className="text-xs bg-gradient-to-r from-[#832388] to-[#F0772F] px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition">
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}