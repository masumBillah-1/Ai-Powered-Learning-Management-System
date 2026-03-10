"use client";

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, Star, Users, 
  Calendar, TrendingUp, Download
} from 'lucide-react';

export default function EarningsPage() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme !== theme) {
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme]);

  const chartData = [
    { name: 'Jan', earnings: 2500 }, { name: 'Feb', earnings: 4000 },
    { name: 'Mar', earnings: 3000 }, { name: 'Apr', earnings: 5500 },
    { name: 'May', earnings: 2500 }, { name: 'Jun', earnings: 3500 },
    { name: 'Jul', earnings: 2800 }, { name: 'Aug', earnings: 5000 },
    { name: 'Sep', earnings: 2000 }, { name: 'Oct', earnings: 4000 },
    { name: 'Nov', earnings: 2000 }, { name: 'Dec', earnings: 5000 },
  ];

  const recentEarnings = [
    { id: "ORD010", date: "28 Jan 2025", course: "UI/UX Design Degree", amount: 160 },
    { id: "ORD009", date: "22 Jan 2025", course: "Wordpress for Beginners", amount: 140 },
    { id: "ORD008", date: "17 Jan 2025", course: "Sketch from A to Z", amount: 200 },
    { id: "ORD007", date: "08 Jan 2025", course: "Learn Angular Fundamentals", amount: 170 },
    { id: "ORD006", date: "03 Jan 2025", course: "C# Developers Course", amount: 120 },
  ];

  const stats = [
    { label: "Revenue", value: "$8,420", subtitle: "This month", icon: DollarSign, color: '#832388', bg: '#f3e8ff', bgDark: '#2a1f35' },
    { label: "Course Rating", value: "4.8", subtitle: "Average rating", icon: Star, color: '#F89B29', bg: '#fef3c7', bgDark: '#2a1f15' },
    { label: "Students", value: "1,200", subtitle: "New this month", icon: Users, color: '#FF0F7B', bg: '#fce7f3', bgDark: '#2a1520' },
  ];

  return (
    <div className="min-h-screen space-y-6">
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body p-5 flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" 
                style={{ backgroundColor: theme === 'dark' ? stat.bgDark : stat.bg }}>
                <stat.icon className="w-7 h-7" style={{ color: stat.color }} />
              </div>
              <div className="flex-1">
                <p className="text-xs opacity-60 font-semibold uppercase">{stat.label}</p>
                <h3 className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</h3>
                <p className="text-xs opacity-60">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Earnings Overview</h2>
            <div className="badge badge-lg gap-2 font-semibold">
              <Calendar size={14} /> 2025
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#832388" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#832388" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2a2a2a' : '#f0f0f0'} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} 
                tick={{fontSize: 12, fontWeight: 600, fill: theme === 'dark' ? '#aaa' : '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} 
                tick={{fontSize: 12, fontWeight: 600, fill: theme === 'dark' ? '#aaa' : '#94a3b8'}} 
                tickFormatter={(value) => `$${value/1000}k`} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', border: 'none', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  backgroundColor: theme === 'dark' ? '#1A1A1A' : '#ffffff'
                }}
                itemStyle={{ color: '#832388', fontWeight: 700 }}
              />
              <Area type="monotone" dataKey="earnings" stroke="#832388" 
                strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Earnings Table */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Transactions</h2>
            <button className="btn btn-sm gap-2 cursor-pointer" 
              style={{ backgroundColor: '#832388', color: 'white', border: 'none' }}>
              <Download size={14} /> Export
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-xs font-bold uppercase opacity-60">Order ID</th>
                  <th className="text-xs font-bold uppercase opacity-60">Date</th>
                  <th className="text-xs font-bold uppercase opacity-60">Course</th>
                  <th className="text-right text-xs font-bold uppercase opacity-60">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentEarnings.map((order) => (
                  <tr key={order.id} className="hover">
                    <td className="font-semibold opacity-70">{order.id}</td>
                    <td className="text-sm opacity-60">{order.date}</td>
                    <td className="font-bold hover:text-[#832388] transition-colors cursor-pointer">
                      {order.course}
                    </td>
                    <td className="text-right font-bold" style={{ color: '#00C48C' }}>
                      ${order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}