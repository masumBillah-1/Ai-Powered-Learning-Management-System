"use client";
import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CheckCircle, GraduationCap, Layers, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', v: 45 }, { name: 'Feb', v: 52 }, { name: 'Mar', v: 48 },
  { name: 'Apr', v: 61 }, { name: 'May', v: 55 }, { name: 'Jun', v: 67 },
  { name: 'Jul', v: 70 }, { name: 'Aug', v: 75 }, { name: 'Sep', v: 85 },
  { name: 'Oct', v: 90 }, { name: 'Nov', v: 95 }, { name: 'Dec', v: 110 },
];

const COLORS: Record<string, string> = {
  purple: '#6710C2', pink: '#FF0F7B', green: '#00C48C',
  indigo: '#6366F1', cyan: '#0EA5E9', orange: '#F89B29',
};

const StatCard = ({ icon, label, value, color, trend }: {
  icon: React.ReactElement; label: string; value: string; color: string; trend: string;
}) => {
  const c = COLORS[color];
  return (
    <div className="bg-base-100 border border-base-300 p-5 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden">
      <div className="absolute -top-4 -right-4 w-14 h-14 rounded-full opacity-10" style={{ backgroundColor: c }} />
      <div className="flex justify-between items-center mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: c + '18', color: c }}>
          {React.cloneElement(icon, { size: 17 } as any)}
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${trend.startsWith('+') ? 'bg-success/10 text-success' : 'bg-base-200 opacity-50'}`}>
          {trend}
        </span>
      </div>
      <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">{label}</p>
      <h4 className="text-xl font-black mt-0.5" style={{ color: c }}>{value}</h4>
    </div>
  );
};

const CourseRow = ({ title, enrolled, status, price }: {
  title: string; enrolled: string; status: string; price: string;
}) => (
  <tr className="border-t border-base-300 hover:bg-base-200/40 transition-colors">
    <td className="px-6 py-4 text-sm font-bold">{title}</td>
    <td className="px-6 py-4 text-center text-sm opacity-50 font-semibold">{enrolled}</td>
    <td className="px-6 py-4 text-center text-sm font-black" style={{ color: '#00C48C' }}>{price}</td>
    <td className="px-6 py-4 text-right">
      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
        status === 'Live' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
      }`}>{status}</span>
    </td>
  </tr>
);

export default function Indashboard() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const t = localStorage.getItem("theme") || "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    const iv = setInterval(() => {
      const cur = localStorage.getItem("theme") || "light";
      if (cur !== theme) { setTheme(cur); document.documentElement.setAttribute("data-theme", cur); }
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={<GraduationCap />} label="Students"   value="1,248"      color="purple" trend="+12%" />
        <StatCard icon={<BookOpen />}      label="Courses"    value="08"          color="pink"   trend="Stable" />
        <StatCard icon={<CheckCircle />}   label="Completion" value="86%"         color="green"  trend="+5%" />
        <StatCard icon={<Users />}         label="Followers"  value="542"         color="indigo" trend="+18%" />
        <StatCard icon={<Layers />}        label="Lessons"    value="156"         color="cyan"   trend="+24" />
        <StatCard icon={<DollarSign />}    label="Earnings"   value="৳1,12,486"  color="orange" trend="+15%" />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Chart */}
        <div className="xl:col-span-2 bg-base-100 border border-base-300 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <p className="font-black text-sm">Revenue Analytics</p>
              <p className="text-xs opacity-40 mt-0.5">Monthly income</p>
            </div>
            <select className="select select-xs bg-base-200 border-base-300 rounded-lg font-bold focus:outline-none">
              <option>2026</option><option>2025</option>
            </select>
          </div>
          <div style={{ width: "100%", height: "220px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={18}>
                <defs>
                  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6710C2" />
                    <stop offset="100%" stopColor="#FF0F7B" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#2a2a2a" : "#f0f0f0"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? "#555" : "#aaa" }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: isDark ? "#555" : "#aaa" }} />
                <Tooltip cursor={{ fill: isDark ? "#1a1a1a" : "#f8f8f8" }}
                  contentStyle={{ borderRadius: 12, border: "none", backgroundColor: isDark ? "#1a1a1a" : "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", fontSize: 12 }} />
                <Bar dataKey="v" fill="url(#bg)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Enrolled */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5">
          <p className="font-black text-sm mb-4">Recent Enrolled</p>
          <div className="space-y-0">
            {["Rahim Uddin", "Sumaiya Islam", "Tanvir Ahmed"].map((name, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-base-300 last:border-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#6710C2,#FF0F7B)" }}>
                  {name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-none">{name}</p>
                  <p className="text-xs opacity-40 mt-0.5">React Course</p>
                </div>
                <span className="text-[10px] opacity-30 font-bold">{["2m", "1h", "3h"][i]} ago</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 rounded-xl border-2 border-dashed border-base-300 text-xs font-black opacity-40 hover:opacity-70 hover:border-[#6710C2] hover:text-[#6710C2] transition-all cursor-pointer">
            View All
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-base-300 flex justify-between items-center">
          <div>
            <p className="font-black text-sm">Active Courses</p>
            <p className="text-xs opacity-40 mt-0.5">Published & draft</p>
          </div>
          <button className="text-xs font-black px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-70" style={{ color: '#6710C2', backgroundColor: '#6710C215' }}>
            Manage All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-base-200/60">
                {["Course", "Enrolled", "Price", "Status"].map((h, i) => (
                  <th key={h} className={`px-6 py-3 text-[10px] font-black opacity-40 uppercase tracking-widest ${i > 0 ? "text-center" : ""} ${i === 3 ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CourseRow title="Next.js 14 Ultimate Guide" enrolled="420" status="Live"  price="৳7,800" />
              <CourseRow title="UI/UX Mastery with Figma"  enrolled="128" status="Live"  price="৳3,950" />
              <CourseRow title="Backend with Node.js"      enrolled="85"  status="Draft" price="৳4,800" />
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
