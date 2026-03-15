"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, CalendarDays, TrendingUp, Download, BookOpen, RefreshCw, AlertCircle } from 'lucide-react';

interface CourseStat { courseId: string; title: string; price: number; enrollments: number; earnings: number; }
interface Transaction { id: string; enrollmentId: string; date: string; course: string; studentName: string; studentPhoto: string; amount: number; }
interface MonthPoint { name: string; earnings: number; year: number; month: number; }
interface EarningsData {
  totalEarnings: number; thisMonthEarnings: number; totalStudents: number; totalCourses: number;
  courseStats: CourseStat[]; allMonthlyData: MonthPoint[]; recentTransactions: Transaction[];
}

const RANGE_OPTIONS = [
  { label: "Last 1 Month", value: 1 },
  { label: "Last 3 Months", value: 3 },
  { label: "Last 6 Months", value: 6 },
  { label: "Last 12 Months", value: 12 },
];

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

export default function EarningsPage() {
  const [theme, setTheme] = useState("light");
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartRange, setChartRange] = useState(12);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    const iv = setInterval(() => {
      const t = localStorage.getItem("theme") || "light";
      if (t !== theme) { setTheme(t); document.documentElement.setAttribute('data-theme', t); }
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  const fetchEarnings = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const cRes = await fetch("/api/courses?mine=true&limit=200", { credentials: "include", headers });
      const cData = await cRes.json();
      if (!cRes.ok) throw new Error(cData.error || "Courses fetch failed");
      const courses: any[] = cData.courses || [];

      if (courses.length === 0) {
        setData({ totalEarnings: 0, thisMonthEarnings: 0, totalStudents: 0, totalCourses: 0, courseStats: [], allMonthlyData: [], recentTransactions: [] });
        return;
      }

      let instructorId = "";
      try { const u = JSON.parse(localStorage.getItem("user") || "{}"); instructorId = u?._id || u?.id || ""; } catch { }

      const eUrl = instructorId
        ? `/api/enrollments?instructorId=${instructorId}&populate=student&limit=500`
        : `/api/enrollments?mine=true&populate=student&limit=500`;

      const eRes = await fetch(eUrl, { credentials: "include", headers });
      const eData = await eRes.json();
      if (!eRes.ok) throw new Error(eData.error || "Enrollments fetch failed");
      const enrollments: any[] = eData.enrollments || [];

      const courseMap = new Map(courses.map((c: any) => [c._id.toString(), c]));
      const statsMap = new Map<string, CourseStat>();

      for (const e of enrollments) {
        const cId = e.courseId?.toString() || "";
        const course = courseMap.get(cId);
        if (!course) continue;
        const price = course.pricing?.type === "free" ? 0 : (course.pricing?.discountPrice || course.pricing?.price || 0);
        if (!statsMap.has(cId)) statsMap.set(cId, { courseId: cId, title: course.title, price, enrollments: 0, earnings: 0 });
        const s = statsMap.get(cId)!;
        s.enrollments += 1;
        s.earnings += price;
      }

      const totalEarnings = Array.from(statsMap.values()).reduce((s, c) => s + c.earnings, 0);
      const totalStudents = new Set(enrollments.map((e: any) => e.studentId?.toString())).size;
      const courseStats = Array.from(statsMap.values()).sort((a, b) => b.earnings - a.earnings);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthEarnings = enrollments
        .filter((e: any) => new Date(e.enrolledAt) >= monthStart)
        .reduce((sum: number, e: any) => {
          const course = courseMap.get(e.courseId?.toString() || "");
          if (!course) return sum;
          return sum + (course.pricing?.type === "free" ? 0 : (course.pricing?.discountPrice || course.pricing?.price || 0));
        }, 0);

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyMap = new Map<string, number>();
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlyMap.set(`${d.getFullYear()}-${d.getMonth()}`, 0);
      }
      for (const e of enrollments) {
        const d = new Date(e.enrolledAt);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthlyMap.has(key)) continue;
        const course = courseMap.get(e.courseId?.toString() || "");
        if (!course) continue;
        const price = course.pricing?.type === "free" ? 0 : (course.pricing?.discountPrice || course.pricing?.price || 0);
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + price);
      }
      const allMonthlyData: MonthPoint[] = Array.from(monthlyMap.entries()).map(([key, earnings]) => {
        const [year, month] = key.split("-").map(Number);
        return { name: monthNames[month], earnings, year, month };
      });

      const recent = [...enrollments]
        .sort((a: any, b: any) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
        .slice(0, 10);

      const recentTransactions: Transaction[] = recent.map((e: any, i: number) => {
        const course = courseMap.get(e.courseId?.toString() || "");
        const student = e.studentData || {};
        const price = course?.pricing?.type === "free" ? 0 : (course?.pricing?.discountPrice || course?.pricing?.price || 0);
        return {
          id: `ORD-${String(i + 1).padStart(3, "0")}`,
          enrollmentId: e._id,
          date: e.enrolledAt,
          course: course?.title || "Unknown Course",
          studentName: student?.name || "Unknown",
          studentPhoto: student?.photoURL || "",
          amount: price,
        };
      });

      setData({ totalEarnings, thisMonthEarnings, totalStudents, totalCourses: courses.length, courseStats, allMonthlyData, recentTransactions });
    } catch (err: any) {
      setError(err.message || "Earnings load করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEarnings(); }, [fetchEarnings]);

  const chartData = useMemo(() => {
    if (!data?.allMonthlyData) return [];
    return data.allMonthlyData.slice(-chartRange);
  }, [data, chartRange]);

  const rangeEarnings = useMemo(() => chartData.reduce((s, d) => s + d.earnings, 0), [chartData]);

  const stats = [
    { label: "Total Earnings", value: data ? fmt(data.totalEarnings) : "$0", subtitle: "All time", icon: DollarSign, color: '#832388', bg: '#f3e8ff', bgDark: '#2a1f35' },
    { label: "This Month", value: data ? fmt(data.thisMonthEarnings) : "$0", subtitle: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }), icon: TrendingUp, color: '#00C48C', bg: '#d1fae5', bgDark: '#0f2520' },
    { label: "Students", value: data ? data.totalStudents.toString() : "0", subtitle: "Unique students", icon: Users, color: '#F89B29', bg: '#fef3c7', bgDark: '#2a1f15' },
    { label: "Courses", value: data ? data.totalCourses.toString() : "0", subtitle: "Your courses", icon: BookOpen, color: '#E3436B', bg: '#fce7f3', bgDark: '#2a1520' },
  ];

  return (
    <div className="min-h-screen space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Instructor Panel</p>
          <h1 className="text-2xl font-black tracking-tight">Earnings</h1>
        </div>
        <button onClick={fetchEarnings} disabled={loading} className="btn btn-sm btn-ghost gap-1.5">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span className="text-xs">Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-error flex items-center gap-2 text-sm">
          <AlertCircle size={16} /><span>{error}</span>
          <button className="ml-auto btn btn-xs" onClick={fetchEarnings}>Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme === 'dark' ? stat.bgDark : stat.bg }}>
                <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs opacity-60 font-semibold uppercase truncate">{stat.label}</p>
                <h3 className="text-2xl font-bold" style={{ color: stat.color }}>
                  {loading ? <span className="loading loading-spinner loading-sm" /> : stat.value}
                </h3>
                <p className="text-xs opacity-50 truncate">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold">Earnings Overview</h2>
              {!loading && data && (
                <p className="text-sm opacity-50 mt-0.5">
                  {RANGE_OPTIONS.find(o => o.value === chartRange)?.label}
                  <span className="font-bold ml-2" style={{ color: '#832388' }}>{fmt(rangeEarnings)}</span>
                </p>
              )}
            </div>

            {/* ✅ Simple DaisyUI select — সবসময় কাজ করে */}
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="opacity-40 flex-shrink-0" />
              <select
                value={chartRange}
                onChange={e => setChartRange(Number(e.target.value))}
                className="select select-sm select-bordered bg-base-100 font-semibold cursor-pointer"
                style={{ minWidth: 155 }}
              >
                {RANGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <span className="loading loading-spinner loading-lg" style={{ color: '#832388' }} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#832388" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#832388" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2a2a2a' : '#f0f0f0'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: theme === 'dark' ? '#aaa' : '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: theme === 'dark' ? '#aaa' : '#94a3b8' }}
                  tickFormatter={(v) => v >= 1000 ? `$${v / 1000}k` : `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }}
                  formatter={(value) => [`$${value ?? 0}`, 'Earnings']}
                  itemStyle={{ color: '#832388', fontWeight: 700 }}
                  labelStyle={{ fontWeight: 600, opacity: 0.6 }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#832388" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Course Breakdown */}
      {!loading && data && data.courseStats.length > 0 && (
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body p-6">
            <h2 className="text-lg font-bold mb-6">Course Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase opacity-60">Course</th>
                    <th className="text-center text-xs font-bold uppercase opacity-60">Price</th>
                    <th className="text-center text-xs font-bold uppercase opacity-60">Enrollments</th>
                    <th className="text-right text-xs font-bold uppercase opacity-60">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {data.courseStats.map((c) => (
                    <tr key={c.courseId} className="hover">
                      <td className="font-semibold text-sm">{c.title}</td>
                      <td className="text-center text-sm">
                        {c.price === 0
                          ? <span className="badge badge-sm" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>Free</span>
                          : <span className="opacity-70">${c.price}</span>}
                      </td>
                      <td className="text-center font-bold" style={{ color: '#F89B29' }}>{c.enrollments}</td>
                      <td className="text-right font-bold" style={{ color: '#00C48C' }}>${c.earnings.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="font-bold opacity-50 text-sm">Total</td>
                    <td className="text-center font-bold" style={{ color: '#F89B29' }}>{data.courseStats.reduce((s, c) => s + c.enrollments, 0)}</td>
                    <td className="text-right font-black text-xl" style={{ color: '#832388' }}>${data.totalEarnings.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <button className="btn btn-sm gap-2 cursor-pointer text-white border-0"
              style={{ background: 'linear-gradient(135deg,#832388,#E3436B)' }}>
              <Download size={14} /> Export
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg" style={{ color: '#832388' }} />
            </div>
          ) : !data || data.recentTransactions.length === 0 ? (
            <div className="text-center py-16 opacity-40">
              <DollarSign className="w-12 h-12 mx-auto mb-3" />
              <p className="font-semibold">কোনো transaction নেই</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase opacity-60">Order</th>
                    <th className="text-xs font-bold uppercase opacity-60">Student</th>
                    <th className="text-xs font-bold uppercase opacity-60">Date</th>
                    <th className="text-xs font-bold uppercase opacity-60">Course</th>
                    <th className="text-right text-xs font-bold uppercase opacity-60">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.map((t) => (
                    <tr key={t.enrollmentId} className="hover">
                      <td className="font-semibold opacity-50 text-xs">{t.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          {t.studentPhoto
                            ? <img src={t.studentPhoto} className="w-7 h-7 rounded-full object-cover flex-shrink-0" alt="" />
                            : <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg,#832388,#FF0F7B)' }}>
                              {t.studentName.charAt(0).toUpperCase()}
                            </div>}
                          <span className="text-sm font-semibold">{t.studentName}</span>
                        </div>
                      </td>
                      <td className="text-sm opacity-60 whitespace-nowrap">{formatDate(t.date)}</td>
                      <td className="font-semibold text-sm max-w-[180px] truncate">{t.course}</td>
                      <td className="text-right font-bold" style={{ color: '#00C48C' }}>
                        {t.amount === 0 ? <span className="text-xs opacity-40">Free</span> : `$${t.amount}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}