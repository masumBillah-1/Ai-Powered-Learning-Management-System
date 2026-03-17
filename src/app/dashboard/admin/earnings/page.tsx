"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

type Tab = "overview" | "payouts" | "statements";

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
}

interface IBreakdown {
  courseId: string;
  courseName: string;
  amount: number;
  enrollments: number;
}

export default function AdminEarningsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<IStats | null>(null);
  const [payouts, setPayouts] = useState<IPayout[]>([]);
  const [statements, setStatements] = useState<IStatement[]>([]);
  const [breakdown, setBreakdown] = useState<IBreakdown[]>([]);

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

  const fetchEarnings = async () => {
    try {
      setLoading(true);
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
      } else {
        console.error("Payout action failed:", data.error);
      }
    } catch (err) {
      console.error("Error updating payout:", err);
    }
  };

  const tabs: Tab[] = ["overview", "payouts", "statements"];

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

  return (
    <div className="min-h-screen ">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black tracking-tight">Earnings</h1>
          <p className="text-sm opacity-50 mt-1">Platform revenue & payout management</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-base-200 text-xs font-semibold opacity-60">
          <Clock size={13} /> Last updated: just now
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

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-base-200 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer"
            style={activeTab === tab ? { background: "#832388", color: "#fff" } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider opacity-50 mb-6">Revenue Breakdown by Course</h3>
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
              <div className="space-y-5">
                {breakdown.map((r, i) => {
                  const maxAmount = breakdown[0]?.amount || 1;
                  const pct = Math.round((r.amount / maxAmount) * 100);
                  return (
                    <div key={r.courseId}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black opacity-20">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-sm font-bold">{r.courseName}</span>
                        </div>
                        <span className="text-sm font-black" style={{ color: "#832388" }}>৳{r.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 rounded-full bg-base-300 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#832388", opacity: 0.7 }} />
                      </div>
                      <p className="text-xs opacity-40 mt-1 text-right">{r.enrollments} enrollments</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm opacity-50">No revenue data available</p>
              </div>
            )}
          </div>
        )}

        {/* Payouts */}
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
            ) : payouts.length > 0 ? (
              <>
                <table className="table table-md w-full">
                  <thead>
                    <tr>
                      {["Instructor", "Amount", "Requested", "Status", "Action"].map(h => (
                        <th key={h} className="text-xs font-bold uppercase tracking-wider opacity-50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => {
                      const s = statusStyle(p.status);
                      return (
                        <tr key={p._id} className="hover">
                          <td className="font-bold">{p.instructor}</td>
                          <td className="font-black text-base" style={{ color: "#832388" }}>৳{p.amount.toLocaleString()}</td>
                          <td className="text-sm opacity-60">{formatDate(p.requested)}</td>
                          <td>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                              {s.label}
                            </span>
                          </td>
                          <td>
                            {p.status === "pending" && (
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
                            )}
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
                <p className="text-sm opacity-50">No pending payouts</p>
              </div>
            )}
          </div>
        )}

        {/* Statements */}
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
                      {["#", "Instructor", "Course", "Student", "Date", "Amount"].map(h => (
                        <th key={h} className="text-xs font-bold uppercase tracking-wider opacity-50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {statements.map((s, i) => (
                      <tr key={s._id} className="hover">
                        <td className="text-xs font-black opacity-25">{String(i + 1).padStart(2, "0")}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#832388] flex items-center justify-center flex-shrink-0">
                              {s.instructorPhoto ? (
                                <img
                                  src={s.instructorPhoto}
                                  alt={s.instructor}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-white text-xs font-bold">${s.instructor.charAt(0).toUpperCase()}</span>`;
                                  }}
                                />
                              ) : (
                                <span className="text-white text-xs font-bold">
                                  {s.instructor.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-sm">{s.instructor}</span>
                          </div>
                        </td>
                        <td>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-info/10 text-info">
                            {s.course}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FF0F7B] flex items-center justify-center flex-shrink-0">
                              {s.studentPhoto ? (
                                <img
                                  src={s.studentPhoto}
                                  alt={s.student}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-white text-xs font-bold">${s.student.charAt(0).toUpperCase()}</span>`;
                                  }}
                                />
                              ) : (
                                <span className="text-white text-xs font-bold">
                                  {s.student.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-sm opacity-70">{s.student}</span>
                          </div>
                        </td>
                        <td className="text-xs opacity-50">{formatDate(s.date)}</td>
                        <td className="font-black text-base" style={{ color: "#00C48C" }}>৳{s.amount.toLocaleString()}</td>
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
