"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, ChevronDown, Eye, 
  Download, ChevronLeft, ChevronRight 
} from 'lucide-react';

const Statements = () => {
  const statementsData = [
    { id: "#ORD01", course: "Information About UI/UX Design Degree", date: "22 Aug 2025", amount: 160, method: "Paypal", status: "Completed" },
    { id: "#ORD009", course: "Build Responsive Real World Websites with Crash Course", date: "10 Aug 2025", amount: 180, method: "Bank Transfer", status: "Pending" },
    { id: "#ORD008", course: "C# Developers Double Your Coding Speed with Visual Studio", date: "26 Jul 2025", amount: 200, method: "Stripe", status: "Completed" },
    { id: "#ORD007", course: "Wordpress for Beginners - Master Wordpress Quickly", date: "12 Jul 2025", amount: 220, method: "Paypal", status: "Completed" },
    { id: "#ORD006", course: "Introduction to Python Programming", date: "02 Jul 2025", amount: 170, method: "Stripe", status: "Completed" },
    { id: "#ORD005", course: "Learn JavaScript and Express to become a Expert", date: "25 Jun 2025", amount: 150, method: "Bank Transfer", status: "Completed" },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-8 tracking-tight">Statements</h1>

      {/* --- Filters & Search Bar --- */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-t-2xl border border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors">
            Payment Method <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border dark:border-slate-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 transition-colors">
            Status <ChevronDown size={16} />
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium"
          />
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white dark:bg-slate-900 rounded-b-2xl shadow-sm border-x border-b border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-400 text-[11px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Payment Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {statementsData.map((row, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50/30 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-400">{row.id}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700 dark:text-gray-200 max-w-[250px]">
                    {row.course}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-400">{row.date}</td>
                  <td className="px-6 py-5 text-sm font-black text-gray-800 dark:text-white">${row.amount}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-500">{row.method}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${
                      row.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-100">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all border border-transparent hover:border-pink-100">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="p-6 border-t dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <p className="text-sm font-bold text-gray-400">Page 1 of 2</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-lg text-gray-400 hover:bg-gray-50"><ChevronLeft size={18} /></button>
            <button className="w-9 h-9 rounded-lg bg-pink-500 text-white font-black text-sm shadow-lg shadow-pink-200">1</button>
            <button className="w-9 h-9 rounded-lg border text-gray-500 font-bold text-sm hover:border-pink-500">2</button>
            <button className="w-9 h-9 rounded-lg border text-gray-500 font-bold text-sm hover:border-pink-500">3</button>
            <button className="p-2 border rounded-lg text-gray-400 hover:bg-gray-50"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statements;