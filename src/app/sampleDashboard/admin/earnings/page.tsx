"use client";
import { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

type Tab = "overview" | "payouts" | "statements";

export default function AdminEarningsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [theme, setTheme] = useState("light");

  // ── Dark/Light sync (AdminDashboard এর মতো same logic) ──
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

  const [payouts, setPayouts] = useState([
    { id: 1, instructor: "Karim Hossain", amount: "৳5,000", raw: 5000, requested: "Mar 1, 2024",  status: "pending" },
    { id: 2, instructor: "Sadia Islam",   amount: "৳2,500", raw: 2500, requested: "Feb 28, 2024", status: "pending" },
    { id: 3, instructor: "Tanvir Hasan",  amount: "৳3,500", raw: 3500, requested: "Feb 20, 2024", status: "paid"    },
  ]);

  const handlePayout = (id: number, action: "approve" | "reject") => {
    setPayouts(prev =>
      prev.map(p => p.id === id ? { ...p, status: action === "approve" ? "paid" : "rejected" } : p)
    );
  };

  const stats = [
    { label: "Total Revenue",      value: "৳4,82,000", color: "#FF0F7B", pct: 100 },
    { label: "This Month",         value: "৳48,500",   color: "#832388", pct: 10  },
    { label: "Instructor Payouts", value: "৳3,20,000", color: "#F89B29", pct: 66  },
    { label: "Platform Profit",    value: "৳1,62,000", color: "#00C48C", pct: 34  },
  ];

  const breakdown = [
    { label: "Web Dev Bootcamp",     amount: "৳2,25,000", pct: 75 },
    { label: "Python for Beginners", amount: "৳1,17,600", pct: 49 },
    { label: "UI/UX Design",         amount: "৳1,29,600", pct: 54 },
    { label: "React Advanced",       amount: "৳10,000",   pct: 10 },
  ];

  const statements = [
    { id: 1, instructor: "Karim Hossain", course: "Web Dev Bootcamp", student: "Rahim Uddin",   date: "Mar 1, 2024",  amount: "৳1,500" },
    { id: 2, instructor: "Karim Hossain", course: "Python Basics",    student: "Sumaiya Islam", date: "Mar 1, 2024",  amount: "৳1,200" },
    { id: 3, instructor: "Tanvir Hasan",  course: "UI/UX Design",     student: "Nusrat Jahan",  date: "Feb 28, 2024", amount: "৳1,800" },
    { id: 4, instructor: "Sadia Islam",   course: "React Advanced",   student: "Tanvir Ahmed",  date: "Feb 27, 2024", amount: "৳2,000" },
  ];

  const tabs: Tab[] = ["overview", "payouts", "statements"];

  const statusStyle = (status: string) => {
    if (status === "paid")     return { bg: "bg-success/10", text: "text-success", label: "✓ Paid"     };
    if (status === "rejected") return { bg: "bg-error/10",   text: "text-error",   label: "✕ Rejected" };
    return                            { bg: "bg-warning/10", text: "text-warning", label: "Pending"    };
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">

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
        {stats.map((s) => (
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
        ))}
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
            <div className="space-y-5">
              {breakdown.map((r, i) => (
                <div key={r.label}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black opacity-20">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-sm font-bold">{r.label}</span>
                    </div>
                    <span className="text-sm font-black" style={{ color: "#832388" }}>{r.amount}</span>
                  </div>
                  <div className="h-2 rounded-full bg-base-300 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "#832388", opacity: 0.7 }} />
                  </div>
                  <p className="text-xs opacity-40 mt-1 text-right">{r.pct}% of total revenue</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payouts */}
        {activeTab === "payouts" && (
          <div className="overflow-x-auto">
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
                    <tr key={p.id} className="hover">
                      <td className="font-bold">{p.instructor}</td>
                      <td className="font-black text-base" style={{ color: "#832388" }}>{p.amount}</td>
                      <td className="text-sm opacity-60">{p.requested}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                      </td>
                      <td>
                        {p.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePayout(p.id, "approve")}
                              className="btn btn-xs gap-1 border-0 text-white cursor-pointer"
                              style={{ backgroundColor: "#00C48C" }}
                            >
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handlePayout(p.id, "reject")}
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
                ৳{payouts.filter(p => p.status === "pending").reduce((a, p) => a + p.raw, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Statements */}
        {activeTab === "statements" && (
          <div className="overflow-x-auto">
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
                  <tr key={s.id} className="hover">
                    <td className="text-xs font-black opacity-25">{String(i + 1).padStart(2, "0")}</td>
                    <td className="font-bold text-sm">{s.instructor}</td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-info/10 text-info">
                        {s.course}
                      </span>
                    </td>
                    <td className="text-sm opacity-70">{s.student}</td>
                    <td className="text-xs opacity-50">{s.date}</td>
                    <td className="font-black text-base" style={{ color: "#00C48C" }}>{s.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-base-300 bg-base-200/50">
              <span className="text-xs opacity-50 font-semibold uppercase tracking-wider">Showing total:</span>
              <span className="text-lg font-black" style={{ color: "#00C48C" }}>৳6,500</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}