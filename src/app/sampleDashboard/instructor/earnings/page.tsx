"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, Star, Users, 
  Calendar, ChevronLeft, ChevronRight 
} from 'lucide-react';

const Earnings = () => {
  // Chart Data
  const chartData = [
    { name: 'Jan', earnings: 25000 },
    { name: 'Feb', earnings: 40000 },
    { name: 'Mar', earnings: 30000 },
    { name: 'Apr', earnings: 55000 },
    { name: 'May', earnings: 25000 },
    { name: 'Jun', earnings: 35000 },
    { name: 'Jul', earnings: 28000 },
    { name: 'Aug', earnings: 50000 },
    { name: 'Sep', earnings: 20000 },
    { name: 'Oct', earnings: 40000 },
    { name: 'Nov', earnings: 20000 },
    { name: 'Dec', earnings: 50000 },
  ];

  const recentEarnings = [
    { id: "ORD010", date: "28 Jan 2025", course: "Information about UI/UX Design Degree", amount: 160 },
    { id: "ORD009", date: "22 Jan 2025", course: "Wordpress for Beginners - Master Wordpress Quickly", amount: 140 },
    { id: "ORD008", date: "17 Jan 2025", course: "Sketch from A to Z (2022): Become an app designer", amount: 200 },
    { id: "ORD007", date: "08 Jan 2025", course: "Learn Angular Fundamental From beginning to advance", amount: 170 },
    { id: "ORD006", date: "03 Jan 2025", course: "C# Developers Double Your Coding Speed", amount: 120 },
  ];

  const stats = [
    { label: "Revenue", value: "$8420", subtitle: "Earning this month", icon: <DollarSign />, color: "bg-green-500" },
    { label: "Courses Ratings", value: "4.8", subtitle: "Rating this month", icon: <Star />, color: "bg-pink-500" },
    { label: "Students Enrolled", value: "12000", subtitle: "New this month", icon: <Users />, color: "bg-indigo-600" },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen space-y-8">
      <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Earnings</h1>

      {/* --- Top Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-5"
          >
            <div className={`${stat.color} p-4 rounded-xl text-white shadow-lg shadow-gray-200 dark:shadow-none`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white">{stat.value}</h3>
              <p className="text-xs font-bold text-gray-400 mt-0.5">{stat.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Area Chart Section --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-black text-gray-800 dark:text-white">Earnings by Year</h2>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm font-bold text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors">
            <Calendar size={16} /> 2025
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0F7B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF0F7B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} tickFormatter={(value) => `${value/1000}K`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#FF0F7B', fontWeight: 800 }}
              />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="#FF0F7B" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorEarnings)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* --- Recent Earnings Table --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden"
      >
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-black text-gray-800 dark:text-white">Earnings</h2>
          <div className="text-xs font-bold text-gray-400 flex items-center gap-2 border rounded-lg px-3 py-1.5">
             <Calendar size={14} /> 02/25/2026 - 03/03/2026
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-[11px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {recentEarnings.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-400">{order.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500 dark:text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-black text-gray-700 dark:text-gray-200 group-hover:text-pink-600 transition-colors">
                    {order.course}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-800 dark:text-white text-right">
                    ${order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Earnings;