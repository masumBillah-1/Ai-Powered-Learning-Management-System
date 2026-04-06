"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle, XCircle, RotateCw, BarChart2, List } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";


type Tab = "overview" | "pending" | "payouts" | "statements";

interface IStats {
  totalRevenue: number;
  thisMonthRevenue: number;
  instructorPayouts: number;
  platformProfit: number;
}

interface IPayout {
  _id: string;
  instructor: string;
  amount: number;
  requested: string;
  status: string;
  payoutMethod: string;
  accountDetails: string;
}

interface IStatement {
  _id: string;
  instructor: string;
  instructorPhoto?: string;
  course: string;
  student: string;
  studentPhoto?: string;
  date: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  paymentMethod: string;
}

interface IBreakdown {
  courseId: string;
  courseName: string;
  amount: number;
  enrollments: number;
}

const CHART_COLORS = [
  "#832388",
  "#FF0F7B",
  "#F89B29",
  "#00C48C",
  "#6366f1",
  "#06b6d4",
  "#f43f5e",
  "#a855f7",
  "#14b8a6",
  "#f97316",
];

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "pending", label: "Pending" },
  { key: "payouts", label: "Payouts" },
  { key: "statements", label: "Statements" },
];

/* ─── Custom Tooltip ────────────────────────────────────────────── */
interface TooltipEntry {
  value: number;
  payload: { enrollments?: number };
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(20,10,30,0.95)",
          border: "1px solid rgba(131,35,136,0.5)",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 8px 32px rgba(131,35,136,0.3)",
        }}
      >
        <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#832388", fontWeight: 900, fontSize: 15 }}>
          ৳{payload[0].value.toLocaleString()}
        </p>
        {payload[0].payload.enrollments !== undefined && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>
            {payload[0].payload.enrollments} enrollments
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function AdminEarningsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<IStats | null>(null);
  const [payouts, setPayouts] = useState<IPayout[]>([]);
  const [statements, setStatements] = useState<IStatement[]>([]);
  const [breakdown, setBreakdown] = useState<IBreakdown[]>([]);
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    const interval = setInterval(() => {
      const current = localStorage.getItem("theme") || "light";
      if (current !== theme) {
        setTheme(current);
        document.documentElement.setAttribute("data-theme", current);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/earnings", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
        setPayouts(data.payouts || []);
        setStatements(data.statements || []);
        setBreakdown(data.breakdown || []);
      } else {
        console.error("Failed to fetch earnings:", data.error);
      }
    } catch (err) {
      console.error("Error fetching earnings:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePayout = async (id: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/earnings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ payoutId: id, action }),
      });

      const data = await res.json();
      if (data.success) {
        setPayouts(prev =>
          prev.map(p => p._id === id ? { ...p, status: action === "approve" ? "completed" : "failed" } : p)
        );
        toast.success(`Payout ${action}d successfully`);
      } else {
        toast.error(data.error || "Payout action failed");
      }
    } catch (err) {
      toast.error("An error occurred while updating payout");
    }
  };

  const statusStyle = (status: string) => {
    if (status === "completed") return { bg: "bg-success/10", text: "text-success", label: "✓ Paid" };
    if (status === "failed") return { bg: "bg-error/10", text: "text-error", label: "✕ Rejected" };
    return { bg: "bg-warning/10", text: "text-warning", label: "Pending" };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  const statsData = [
    { label: "Total Revenue", value: `৳${(stats?.totalRevenue || 0).toLocaleString()}`, color: "#FF0F7B", pct: 100 },
    { label: "This Month", value: `৳${(stats?.thisMonthRevenue || 0).toLocaleString()}`, color: "#832388", pct: stats?.totalRevenue ? Math.round((stats.thisMonthRevenue / stats.totalRevenue) * 100) : 0 },
    { label: "Instructor Payouts", value: `৳${(stats?.instructorPayouts || 0).toLocaleString()}`, color: "#F89B29", pct: stats?.totalRevenue ? Math.round((stats.instructorPayouts / stats.totalRevenue) * 100) : 0 },
    { label: "Platform Profit", value: `৳${(stats?.platformProfit || 0).toLocaleString()}`, color: "#00C48C", pct: stats?.totalRevenue ? Math.round((stats.platformProfit / stats.totalRevenue) * 100) : 0 },
  ];

  /* Shorten course name for chart X-axis */
  const chartData = breakdown.map((r, i) => ({
    ...r,
    shortName: r.courseName.length > 18 ? r.courseName.slice(0, 16) + "…" : r.courseName,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black tracking-tight">Earnings</h1>
          <p className="text-sm opacity-50 mt-1">Platform revenue &amp; payout management</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchEarnings(true)}
            disabled={loading || refreshing}
            className="btn btn-sm btn-ghost gap-1.5 mt-2 cursor-pointer"
          >
            <RotateCw size={14} className={(loading || refreshing) ? "animate-spin" : ""} />
            <span className="text-xs">Refresh</span>
          </button>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-base-200 text-xs font-semibold opacity-60">
            <Clock size={13} /> Last updated: just now
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-base-100 border border-base-300 p-5 animate-pulse">
              <div className="h-4 bg-base-300 rounded w-24 mb-3" />
              <div className="h-8 bg-base-300 rounded w-32 mb-3" />
              <div className="h-2 bg-base-300 rounded w-full" />
            </div>
          ))
        ) : (
          statsData.map((s) => (
            <div key={s.label} className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-300 p-5">
              <div className="absolute top-0 left-0 h-1 w-full rounded-t-2xl" style={{ background: s.color }} />
              <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">{s.label}</p>
              <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
              <div className="mt-3 h-1 rounded-full bg-base-300">
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color, opacity: 0.6 }} />
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={11} style={{ color: s.color }} />
                <span className="text-xs font-semibold opacity-60">{s.pct}% of total</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-base-200 p-1 rounded-2xl w-fit relative">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-5 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 cursor-pointer z-10 select-none"
            style={
              activeTab === tab.key
                ? {
                    background: "linear-gradient(135deg,#832388,#FF0F7B)",
                    color: "#fff",
                    boxShadow: "0 4px 18px rgba(131,35,136,0.45)",
                  }
                : { color: "inherit" }
            }
          >
            {tab.label}
            {tab.key === "pending" && payouts.filter(p => p.status === "pending").length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center text-white"
                style={{ background: "#FF0F7B" }}
              >
                {payouts.filter(p => p.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">

        {/* ── Overview ─────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="p-6">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider opacity-50">Revenue Breakdown by Course</h3>
                <p className="text-[11px] opacity-30 mt-0.5">Sorted by highest earnings</p>
              </div>
              {/* Chart / List toggle */}
              <div className="flex gap-1 bg-base-200 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("chart")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  style={
                    viewMode === "chart"
                      ? { background: "linear-gradient(135deg,#832388,#FF0F7B)", color: "#fff" }
                      : {}
                  }
                >
                  <BarChart2 size={12} /> Chart
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  style={
                    viewMode === "list"
                      ? { background: "linear-gradient(135deg,#832388,#FF0F7B)", color: "#fff" }
                      : {}
                  }
                >
                  <List size={12} /> List
                </button>
              </div>
            </div>

            {loading ? (
              <div className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-base-300 rounded w-3/4 mb-2" />
                    <div className="h-2 bg-base-300 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : breakdown.length > 0 ? (
              viewMode === "chart" ? (
                /* ── Bar Chart ── */
                <div>
                  <ResponsiveContainer width="100%" height={360}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 24, right: 24, left: 0, bottom: 60 }}
                      barCategoryGap="30%"
                    >
                      <defs>
                        {chartData.map((entry, i) => (
                          <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                            <stop offset="100%" stopColor={entry.color} stopOpacity={0.4} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="shortName"
                        tick={{ fontSize: 11, fontWeight: 600, fill: "rgba(255,255,255,0.45)" }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-35}
                        textAnchor="end"
                        height={70}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`}
                        width={52}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(131,35,136,0.08)" }} />
                      <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={52}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={`url(#grad-${i})`} />
                        ))}
                        <LabelList
                          dataKey="amount"
                          position="top"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          formatter={(v: any) => `৳${(Number(v) / 1000).toFixed(1)}k`}
                          style={{ fontSize: 10, fontWeight: 700, fill: "rgba(255,255,255,0.55)" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {chartData.map((entry, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                        style={{
                          background: `${entry.color}18`,
                          border: `1px solid ${entry.color}40`,
                          color: entry.color,
                        }}
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ background: entry.color }}
                        />
                        {entry.shortName}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── List View ── */
                <div className="space-y-3">
                  {breakdown.map((r, i) => {
                    const maxAmount = breakdown[0]?.amount || 1;
                    const pct = Math.round((r.amount / maxAmount) * 100);
                    const color = CHART_COLORS[i % CHART_COLORS.length];
                    return (
                      <div
                        key={r.courseId}
                        className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-base-200/60"
                        style={{ border: `1px solid ${color}20` }}
                      >
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                          style={{ background: color }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-bold truncate pr-2">{r.courseName}</span>
                            <span className="text-sm font-black flex-shrink-0" style={{ color }}>
                              ৳{r.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-base-300 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}99)` }}
                            />
                          </div>
                          <p className="text-[10px] opacity-40 mt-1">{r.enrollments} enrollments · {pct}% of top</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-sm opacity-50">No revenue data available</p>
              </div>
            )}
          </div>
        )}

        {/* ── Pending Payouts ──────────────────────────────────── */}
        {activeTab === "pending" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-4 bg-base-300 rounded w-32" />
                    <div className="h-4 bg-base-300 rounded w-24" />
                    <div className="h-4 bg-base-300 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : payouts.filter(p => p.status === "pending").length > 0 ? (
              <>
                <table className="table table-md w-full">
                  <thead>
                    <tr>
                      {["Instructor", "Amount", "Method", "Details", "Requested", "Status", "Action"].map(h => (
                        <th key={h} className="text-xs font-bold uppercase tracking-wider opacity-50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.filter(p => p.status === "pending").map((p) => {
                      const s = statusStyle(p.status);
                      return (
                        <tr key={p._id} className="hover">
                          <td className="font-bold">{p.instructor}</td>
                          <td className="font-black text-base" style={{ color: "#832388" }}>৳{p.amount.toLocaleString()}</td>
                          <td>
                            <span className="px-2 py-0.5 rounded bg-base-300 text-[10px] font-black uppercase">{p.payoutMethod}</span>
                          </td>
                          <td className="text-xs font-medium opacity-70 max-w-[150px] truncate" title={p.accountDetails}>{p.accountDetails}</td>
                          <td className="text-sm opacity-60">{formatDate(p.requested)}</td>
                          <td>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                              {s.label}
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handlePayout(p._id, "approve")}
                                className="btn btn-xs gap-1 border-0 text-white cursor-pointer"
                                style={{ backgroundColor: "#00C48C" }}
                              >
                                <CheckCircle size={12} /> Approve
                              </button>
                              <button
                                onClick={() => handlePayout(p._id, "reject")}
                                className="btn btn-xs gap-1 cursor-pointer"
                                style={{ backgroundColor: "#FF0F7B", color: "#fff", border: "none" }}
                              >
                                <XCircle size={12} /> Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-base-300 bg-base-200/50">
                  <span className="text-xs opacity-50 font-semibold uppercase tracking-wider">Pending total:</span>
                  <span className="text-lg font-black" style={{ color: "#F89B29" }}>
                    ৳{payouts.filter(p => p.status === "pending").reduce((a, p) => a + p.amount, 0).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm opacity-50">No pending payout requests</p>
              </div>
            )}
          </div>
        )}

        {/* ── Payout History ───────────────────────────────────── */}
        {activeTab === "payouts" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-4 bg-base-300 rounded w-32" />
                    <div className="h-4 bg-base-300 rounded w-24" />
                    <div className="h-4 bg-base-300 rounded w-20" />
                  </div>
                ))}
              </div>
            ) : payouts.filter(p => p.status !== "pending").length > 0 ? (
              <>
                <table className="table table-md w-full">
                  <thead>
                    <tr>
                      {["Instructor", "Amount", "Method", "Details", "Date", "Status"].map(h => (
                        <th key={h} className="text-xs font-bold uppercase tracking-wider opacity-50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.filter(p => p.status !== "pending").map((p) => {
                      const s = statusStyle(p.status);
                      return (
                        <tr key={p._id} className="hover">
                          <td className="font-bold">{p.instructor}</td>
                          <td className="font-black text-base" style={{ color: "#832388" }}>৳{p.amount.toLocaleString()}</td>
                          <td>
                            <span className="px-2 py-0.5 rounded bg-base-300 text-[10px] font-black uppercase">{p.payoutMethod}</span>
                          </td>
                          <td className="text-xs font-medium opacity-70 max-w-[150px] truncate" title={p.accountDetails}>{p.accountDetails}</td>
                          <td className="text-sm opacity-60">{formatDate(p.requested)}</td>
                          <td>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                              {s.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-base-300 bg-base-200/50">
                  <span className="text-xs opacity-50 font-semibold uppercase tracking-wider">Global Total Payouts:</span>
                  <span className="text-lg font-black" style={{ color: "#00C48C" }}>
                    ৳{(stats?.instructorPayouts || 0).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm opacity-50">No payout history available</p>
              </div>
            )}
          </div>
        )}

        {/* ── Statements ───────────────────────────────────────── */}
        {activeTab === "statements" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="h-4 bg-base-300 rounded w-32" />
                    <div className="h-4 bg-base-300 rounded w-40" />
                    <div className="h-4 bg-base-300 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : statements.length > 0 ? (
              <>
                <table className="table table-md w-full">
                  <thead>
                    <tr>
                      {["#", "Instructor / Course", "Student / Date", "Method", "Gross", "Platform Fee", "Net Instructor"].map(h => (
                        <th key={h} className="text-[10px] font-black uppercase tracking-widest opacity-40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map((s, i) => (
                      <tr key={s._id} className="hover border-base-300">
                        <td className="text-[10px] font-black opacity-20">{String(i + 1).padStart(2, "0")}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 flex-shrink-0">
                              {s.instructorPhoto ? (
                                <img
                                  src={s.instructorPhoto}
                                  alt={s.instructor}
                                  className="w-8 h-8 rounded-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: "#832388" }}>
                                  {s.instructor.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm leading-tight">{s.instructor}</p>
                              <p className="text-[10px] opacity-50 mt-0.5 truncate max-w-[150px]">{s.course}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6 flex-shrink-0">
                              {s.studentPhoto ? (
                                <img src={s.studentPhoto} alt={s.student} className="w-6 h-6 rounded-full object-cover" />
                              ) : (
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: "#FF0F7B" }}>
                                  {s.student.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[13px] leading-tight">{s.student}</p>
                              <p className="text-[10px] opacity-40 mt-0.5">{formatDate(s.date)}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="px-2 py-0.5 rounded bg-base-300 text-[9px] font-black uppercase opacity-60">
                            {s.paymentMethod}
                          </span>
                        </td>
                        <td className="font-bold text-sm">৳{s.amount.toLocaleString()}</td>
                        <td className="font-bold text-sm text-error">৳{s.platformFee.toLocaleString()}</td>
                        <td className="font-black text-sm text-success">৳{s.netAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-base-300 bg-base-200/50">
                  <span className="text-xs opacity-50 font-semibold uppercase tracking-wider">Showing total:</span>
                  <span className="text-lg font-black" style={{ color: "#00C48C" }}>
                    ৳{statements.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm opacity-50">No transaction statements</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
