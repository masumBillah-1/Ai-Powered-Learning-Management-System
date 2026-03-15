"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, BookOpen, DollarSign, ArrowRight,
  AlertCircle, Clock, CheckCircle2, RefreshCw, GraduationCap,
  ShieldCheck, Zap, BarChart3
} from "lucide-react";

interface IDashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  publishedCourses: number;
  pendingCourses: number;
  rejectedCourses: number;
  totalRevenue: number;
  totalEnrollments: number;
}

interface IRecentTransaction {
  _id: string;
  studentId?: { name?: string; photoURL?: string };
  courseName?: string;
  amount: number;
  createdAt: string;
  status: string;
}

interface IPendingCourse {
  _id: string;
  title: string;
  instructorId?: { name?: string; photoURL?: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const PRIMARY = "#C81D77";
  const PURPLE  = "#832388";

  const [stats, setStats]         = useState<IDashboardStats | null>(null);
  const [transactions, setTrans]  = useState<IRecentTransaction[]>([]);
  const [pendingCourses, setPending] = useState<IPendingCourse[]>([]);
  const [loading, setLoading]     = useState(true);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const coursesRes  = await fetch("/api/courses");
      const coursesData = await coursesRes.json();
      const courses     = coursesData.courses || [];

      const published  = courses.filter((c: any) => c.status === "published").length;
      const pending    = courses.filter((c: any) => c.status === "pending").length;
      const rejected   = courses.filter((c: any) => c.status === "rejected").length;
      const totalEnroll = courses.reduce((a: number, c: any) => a + (c.enrolledCount || 0), 0);
      const revenue    = courses
        .filter((c: any) => c.pricing?.type === "paid")
        .reduce((a: number, c: any) => a + (c.pricing?.price || 0) * (c.enrolledCount || 0), 0);

      const pendingList: IPendingCourse[] = courses
        .filter((c: any) => c.status === "pending")
        .slice(0, 4)
        .map((c: any) => ({
          _id:          c._id,
          title:        c.title,
          instructorId: c.instructorId,
          createdAt:    c.createdAt,
        }));
      setPending(pendingList);

      let txList: IRecentTransaction[] = [];
      try {
        const txRes  = await fetch("/api/transactions?limit=5&sort=latest");
        const txData = await txRes.json();
        if (txRes.ok) txList = txData.transactions || txData.data || [];
      } catch (_) {}
      setTrans(txList.slice(0, 4));

      let totalStudents     = 0;
      let totalInstructors  = 0;
      try {
        const usersRes  = await fetch("/api/users?role=student&countOnly=true");
        const usersData = await usersRes.json();
        totalStudents   = usersData.total || usersData.count || 0;

        const instrRes  = await fetch("/api/users?role=instructor&countOnly=true");
        const instrData = await instrRes.json();
        totalInstructors = instrData.total || instrData.count || 0;
      } catch (_) {}

      setStats({
        totalStudents,
        totalInstructors,
        totalCourses:     courses.length,
        publishedCourses: published,
        pendingCourses:   pending,
        rejectedCourses:  rejected,
        totalRevenue:     revenue,
        totalEnrollments: totalEnroll,
      });

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const statCards = [
    {
      label:   "Total Students",
      value:   stats?.totalStudents    ?? 0,
      change:  "+12%",
      icon:    GraduationCap,
      color:   PRIMARY,
      glow:    "rgba(200,29,119,0.12)",
      href:    "/dashboard/admin/students",
    },
    {
      label:   "Instructors",
      value:   stats?.totalInstructors ?? 0,
      change:  "+5%",
      icon:    Users,
      color:   PURPLE,
      glow:    "rgba(131,35,136,0.12)",
      href:    "/dashboard/admin/instructors",
    },
    {
      label:   "Total Courses",
      value:   stats?.totalCourses     ?? 0,
      change:  "+8%",
      icon:    BookOpen,
      color:   "#0EA5E9",
      glow:    "rgba(14,165,233,0.12)",
      href:    "/dashboard/admin/courses",
    },
    {
      label:   "Est. Revenue",
      value:   `৳${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      change:  "+21%",
      icon:    DollarSign,
      color:   "#00C48C",
      glow:    "rgba(0,196,140,0.12)",
      href:    "/dashboard/admin/earnings",
    },
  ];

  const quickStats = [
    { label: "Pending",    value: stats?.pendingCourses   ?? 0, color: "#F59E0B" },
    { label: "Published",  value: stats?.publishedCourses ?? 0, color: "#00C48C" },
    { label: "Enrollments",value: stats?.totalEnrollments ?? 0, color: PRIMARY   },
  ];

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now  = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60)  return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const colors = [PRIMARY, PURPLE, "#0EA5E9", "#00C48C"];

  return (
    <div className="min-h-screen" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.3s ease" }}>

      {/* ── Header ── */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#00C48C" }} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-40">Live Dashboard</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome back, Admin 👋</h1>
          <p className="text-sm opacity-40 mt-1">Here&apos;s what&apos;s happening on your platform today.</p>
        </div>

        {/* Quick stats pill */}
        <div className="flex items-center gap-1 bg-base-100 border border-base-300 rounded-2xl px-4 py-2.5 shadow-sm">
          {quickStats.map((q, i) => (
            <React.Fragment key={q.label}>
              {i > 0 && <div className="w-px h-6 bg-base-300 mx-2" />}
              <div className="text-center px-1">
                {loading
                  ? <div className="skeleton h-5 w-8 rounded mb-0.5" />
                  : <p className="text-base font-black leading-none" style={{ color: q.color }}>{q.value}</p>}
                <p className="text-xs opacity-40 font-semibold mt-0.5 whitespace-nowrap">{q.label}</p>
              </div>
            </React.Fragment>
          ))}
          <button onClick={fetchAll} disabled={loading} className="ml-3 btn btn-xs btn-ghost btn-circle opacity-40 hover:opacity-100">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <Link href={s.href} key={s.label}
            className="rounded-2xl bg-base-100 border border-base-300 p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 block">
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-60 blur-xl group-hover:opacity-100 transition-opacity duration-500"
              style={{ backgroundColor: s.glow }} />
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ background: `linear-gradient(90deg,${s.color},transparent)` }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-30">{s.label}</p>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.glow }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
              </div>
              {loading
                ? <div className="skeleton h-8 w-20 rounded mb-2" />
                : <p className="text-3xl font-black mb-2">{s.value}</p>}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit"
                style={{ backgroundColor: s.glow }}>
                <TrendingUp size={10} style={{ color: s.color }} />
                <span className="text-xs font-bold" style={{ color: s.color }}>{s.change}</span>
                <span className="text-xs opacity-40">this month</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Transactions */}
        <div className="lg:col-span-2 rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}15` }}>
                <BarChart3 size={15} style={{ color: PRIMARY }} />
              </div>
              <div>
                <p className="font-black text-sm">Recent Transactions</p>
                <p className="text-xs opacity-40">Latest enrollments & payments</p>
              </div>
            </div>
            <Link href="/dashboard/admin/earnings"
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:gap-2"
              style={{ color: PRIMARY, backgroundColor: `${PRIMARY}12` }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-32 rounded" />
                    <div className="skeleton h-2 w-24 rounded" />
                  </div>
                  <div className="skeleton h-4 w-16 rounded" />
                </div>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <>
              {transactions.map((t, i) => {
                const name = (t.studentId as any)?.name || "Student";
                return (
                  <div key={t._id} className="flex items-center gap-4 px-6 py-4 hover:bg-base-200/40 transition-colors border-b border-base-300 last:border-0">
                    <span className="text-xs font-black opacity-20 w-5 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm"
                      style={{ background: `linear-gradient(135deg,${colors[i % colors.length]},${colors[i % colors.length]}99)` }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black leading-tight">{name}</p>
                      <p className="text-xs opacity-40 mt-0.5 truncate">{t.courseName || "Course"}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black" style={{ color: PRIMARY }}>৳{t.amount?.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <Clock size={9} className="opacity-30" />
                        <span className="text-xs opacity-30">{formatDate(t.createdAt)}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: "rgba(0,196,140,0.1)", color: "#00C48C" }}>
                      <CheckCircle2 size={10} /> Paid
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center justify-between px-6 py-3 bg-base-200/40 border-t border-base-300">
                <span className="text-xs opacity-40 font-semibold">Total revenue</span>
                <span className="text-sm font-black" style={{ color: PRIMARY }}>৳{(stats?.totalRevenue ?? 0).toLocaleString()}</span>
              </div>
            </>
          ) : (
            /* Fallback: No transactions yet — show empty state with enrolled student names from courses */
            <div className="divide-y divide-base-300">
              {(stats?.totalEnrollments ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${PRIMARY}12` }}>
                    <BarChart3 size={20} style={{ color: PRIMARY }} />
                  </div>
                  <p className="font-black text-sm text-center">No transactions yet</p>
                  <p className="text-xs opacity-40 text-center mt-1">Transactions will appear here once students enroll</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-3 bg-base-200/30">
                    <p className="text-xs opacity-40 font-semibold uppercase tracking-wider">Platform Summary</p>
                  </div>
                  {[
                    { label: "Total Revenue",     value: `৳${(stats?.totalRevenue ?? 0).toLocaleString()}`,  color: PRIMARY,   icon: DollarSign  },
                    { label: "Total Enrollments", value: `${stats?.totalEnrollments ?? 0}`,                  color: "#00C48C", icon: Users       },
                    { label: "Published Courses", value: `${stats?.publishedCourses ?? 0}`,                  color: PURPLE,    icon: BookOpen    },
                    { label: "Pending Review",    value: `${stats?.pendingCourses   ?? 0}`,                  color: "#F59E0B", icon: AlertCircle },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center gap-4 px-6 py-4 hover:bg-base-200/40 transition-colors">
                      <span className="text-xs font-black opacity-20 w-5 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${item.color}15` }}>
                        <item.icon size={16} style={{ color: item.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black leading-tight">{item.label}</p>
                      </div>
                      <p className="text-sm font-black flex-shrink-0" style={{ color: item.color }}>{item.value}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-6 py-3 bg-base-200/40 border-t border-base-300">
                    <span className="text-xs opacity-40 font-semibold">Total revenue</span>
                    <span className="text-sm font-black" style={{ color: PRIMARY }}>৳{(stats?.totalRevenue ?? 0).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Pending Actions */}
        <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-base-300 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${PRIMARY}15` }}>
              <Zap size={14} style={{ color: PRIMARY }} />
            </div>
            <div>
              <p className="font-black text-sm">Pending Actions</p>
              <p className="text-xs opacity-40">Requires your attention</p>
            </div>
            {(stats?.pendingCourses ?? 0) > 0 && (
              <span className="ml-auto text-xs font-black px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "#F59E0B" }}>
                {stats?.pendingCourses}
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3 w-28 rounded" />
                    <div className="skeleton h-2 w-20 rounded" />
                  </div>
                  <div className="skeleton h-7 w-16 rounded-xl" />
                </div>
              ))}
            </div>
          ) : pendingCourses.length > 0 ? (
            <>
              {pendingCourses.map((course) => {
                const instName = (course.instructorId as any)?.name || "Instructor";
                return (
                  <div key={course._id} className="flex items-center gap-3 px-5 py-4 hover:bg-base-200/40 transition-colors border-b border-base-300 last:border-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${PRIMARY}12` }}>
                      <BookOpen size={15} style={{ color: PRIMARY }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle size={11} style={{ color: "#F59E0B" }} />
                        <p className="text-sm font-black truncate">{course.title}</p>
                      </div>
                      <p className="text-xs opacity-40 truncate mt-0.5">by {instName} · {formatDate(course.createdAt)}</p>
                    </div>
                    <Link href="/dashboard/admin/courses"
                      className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl text-white border-0 hover:opacity-85 transition-all"
                      style={{ background: `linear-gradient(135deg,${PRIMARY},${PURPLE})` }}>
                      Review
                    </Link>
                  </div>
                );
              })}
              {(stats?.pendingCourses ?? 0) > 4 && (
                <div className="px-5 py-3 bg-base-200/40 border-t border-base-300 text-center">
                  <Link href="/dashboard/admin/courses?filter=pending"
                    className="text-xs font-bold flex items-center justify-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: PRIMARY }}>
                    +{(stats?.pendingCourses ?? 0) - 4} more pending <ArrowRight size={10} />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ backgroundColor: "rgba(0,196,140,0.1)" }}>
                <ShieldCheck size={22} color="#00C48C" />
              </div>
              <p className="font-black text-sm text-center">All clear!</p>
              <p className="text-xs opacity-40 text-center mt-1">No pending courses to review</p>
            </div>
          )}

          <div className="px-5 py-3 bg-base-200/40 border-t border-base-300">
            <Link href="/dashboard/admin/courses" className="text-xs font-bold opacity-40 hover:opacity-70 transition-opacity flex items-center gap-1">
              View all courses <ArrowRight size={10} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}