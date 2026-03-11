"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Users, BookOpen, DollarSign, ArrowRight, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export default function AdminDashboard() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    const iv = setInterval(() => {
      const cur = localStorage.getItem("theme") || "light";
      if (cur !== theme) { setTheme(cur); document.documentElement.setAttribute("data-theme", cur); }
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  // ── Only 2 colors used everywhere ──
  const PRIMARY = "#C81D77";
  const MUTED = "#6B7280";

  const stats = [
    { label: "Students", value: "1,240", change: "+12%", icon: Users },
    { label: "Instructors", value: "38", change: "+3%", icon: Users },
    { label: "Courses", value: "94", change: "+8%", icon: BookOpen },
    { label: "Revenue", value: "৳4,82,000", change: "+21%", icon: DollarSign },
  ];

  const transactions = [
    { name: "Rahim Uddin", initial: "R", course: "Web Dev Bootcamp", amount: "৳1,500", date: "Today, 10:00 AM" },
    { name: "Sumaiya Islam", initial: "S", course: "Python for Beginners", amount: "৳1,200", date: "Today, 9:30 AM" },
    { name: "Tanvir Ahmed", initial: "T", course: "React Advanced", amount: "৳2,000", date: "Yesterday" },
  ];

  const actions = [
    { type: "Course Approval", detail: "React Advanced by Karim", urgent: true, icon: BookOpen },
    { type: "Payout Request", detail: "৳5,000 from Karim Hossain", urgent: true, icon: DollarSign },
    { type: "New Instructor", detail: "Sadia Islam pending verify", urgent: false, icon: Users },
  ];

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Welcome back, Admin 👋</h1>
        <p className="text-sm opacity-40 mt-1">Platform overview for today</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={s.label} className="rounded-2xl bg-base-100 border border-base-300 p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
            {/* top accent only on first card */}
            {i === 0 && (
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: PRIMARY }} />
            )}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest opacity-30">{s.label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-base-200">
                <s.icon size={15} className="opacity-50" />
              </div>
            </div>
            <p className="text-3xl font-black mb-1">{s.value}</p>
            <div className="flex items-center gap-1">
              <TrendingUp size={11} style={{ color: PRIMARY }} />
              <span className="text-xs font-bold" style={{ color: PRIMARY }}>{s.change}</span>
              <span className="text-xs opacity-30 ml-0.5">this month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Transactions ── */}
        <div className="lg:col-span-2 rounded-2xl bg-base-100 border border-base-300 overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-base-300">
            <div>
              <p className="font-black text-sm">Recent Transactions</p>
              <p className="text-xs opacity-40 mt-0.5">Latest enrollments & payments</p>
            </div>
            <Link
              href="/sampleDashboard/admin/earnings"
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: PRIMARY, backgroundColor: PRIMARY + "12" }}
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>

          {transactions.map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-6 py-4 hover:bg-base-200/50 transition-colors border-b border-base-300 last:border-0"
            >
              <span className="text-xs font-bold opacity-20 w-4 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>

              {/* avatar — single color, varying opacity */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ backgroundColor: i === 0 ? PRIMARY : MUTED }}
              >
                {t.initial}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-black leading-tight">{t.name}</p>
                <p className="text-xs opacity-40 mt-0.5 truncate">{t.course}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black" style={{ color: PRIMARY }}>{t.amount}</p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <Clock size={9} className="opacity-30" />
                  <span className="text-xs opacity-30">{t.date}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: PRIMARY + "12", color: PRIMARY }}>
                  <CheckCircle2 size={10} /> Paid
                </span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between px-6 py-3 bg-base-200/40 border-t border-base-300">
            <span className="text-xs opacity-40 font-semibold">Today's collection</span>
            <span className="text-sm font-black" style={{ color: PRIMARY }}>৳2,700</span>
          </div>
        </div>

        {/* ── Pending Actions ── */}
        <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">

          <div className="px-5 py-4 border-b border-base-300">
            <p className="font-black text-sm">Pending Actions</p>
            <p className="text-xs opacity-40 mt-0.5">Requires your attention</p>
          </div>

          {actions.map((a, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-4 hover:bg-base-200/50 transition-colors border-b border-base-300 last:border-0"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: PRIMARY + "12" }}
              >
                <a.icon size={15} style={{ color: PRIMARY }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {a.urgent && <AlertCircle size={11} style={{ color: PRIMARY }} />}
                  <p className="text-sm font-black truncate">{a.type}</p>
                </div>
                <p className="text-xs opacity-40 truncate mt-0.5">{a.detail}</p>
              </div>

              <button
                className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-80 cursor-pointer"
                style={{ backgroundColor: a.urgent ? PRIMARY : MUTED }}
              >
                Review
              </button>
            </div>
          ))}

          <div className="px-5 py-3 bg-base-200/40 border-t border-base-300">
            <Link
              href="/sampleDashboard/admin/courses"
              className="text-xs font-bold opacity-40 hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              View all actions <ArrowRight size={10} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}