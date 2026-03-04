"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, ChevronDown, Eye, 
  Edit2, Trash2, X, Upload, ChevronLeft, ChevronRight 
} from 'lucide-react';

const SupportTickets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ticketStats = [
    { label: "Total Tickets", count: 50, icon: "🎓", color: "bg-indigo-50 text-indigo-600" },
    { label: "Opened Tickets", count: 30, icon: "📖", color: "bg-pink-50 text-pink-600" },
    { label: "Closed Tickets", count: 25, icon: "✅", color: "bg-emerald-50 text-emerald-600" },
  ];

  const tickets = [
    { id: "#TIC010", date: "22 Aug 2025", subject: "Issue with Course Notification Emails", priority: "High", category: "Mailing Issues", status: "Opened" },
    { id: "#TIC009", date: "10 Aug 2025", subject: "I have a problem", priority: "Low", category: "Language Issues", status: "Inprogress" },
    { id: "#TIC008", date: "26 Jul 2025", subject: "Account Activation mail not received", priority: "High", category: "Mailing Issues", status: "Closed" },
    { id: "#TIC007", date: "12 Jul 2025", subject: "Enabling SSH service", priority: "High", category: "Installation Error", status: "Opened" },
    { id: "#TIC006", date: "02 Jul 2025", subject: "Payment Processed but not showed", priority: "Low", category: "Payment Issues", status: "Closed" },
  ];

  const getPriorityStyle = (p: string) => {
    if (p === 'High') return 'bg-red-50 text-red-500 border-red-100';
    if (p === 'Medium') return 'bg-cyan-50 text-cyan-500 border-cyan-100';
    return 'bg-emerald-50 text-emerald-500 border-emerald-100';
  };

  const getStatusStyle = (s: string) => {
    if (s === 'Opened') return 'bg-purple-500 text-white';
    if (s === 'Inprogress') return 'bg-amber-400 text-white';
    return 'bg-emerald-500 text-white';
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Support Tickets</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF4D6D] hover:bg-[#ff365a] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus size={18} strokeWidth={3} /> Add Ticket
        </button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {ticketStats.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">{stat.label}</p>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* --- Filters & Table Section --- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            {['Category', 'Priority', 'Status'].map(filter => (
              <button key={filter} className="flex items-center gap-2 px-4 py-2 border dark:border-slate-700 rounded-xl text-sm font-bold text-gray-500">
                {filter} <ChevronDown size={14} />
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-bold text-indigo-600">{t.id}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-400">{t.date}</td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600 dark:text-gray-300">{t.subject}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase ${getPriorityStyle(t.priority)}`}>
                      ● {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-500">{t.category}</td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase ${getStatusStyle(t.status)}`}>
                      ● {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Eye size={16} className="cursor-pointer hover:text-indigo-500" />
                      <Edit2 size={16} className="cursor-pointer hover:text-green-500" />
                      <Trash2 size={16} className="cursor-pointer hover:text-red-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Add Ticket Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-black text-gray-800">Add New Ticket</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Enter ticket subject" className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                    <select className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-500"><option>Mailing Issues</option></select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                    <select className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-500"><option>High</option></select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea rows={4} placeholder="Describe your issue..." className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-medium"></textarea>
                </div>
              </div>
              <div className="p-6 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 font-bold text-gray-500 hover:text-gray-800">Cancel</button>
                <button className="bg-[#FF4D6D] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-pink-100">Add Ticket</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportTickets;