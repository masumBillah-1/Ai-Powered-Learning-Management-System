"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const Announcements = () => {
  // Animation Settings
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const announcementData = [
    {
      id: 1,
      date: "22 Aug 2025, 05:40 PM",
      title: "Welcome to Introduction to Programming",
      course: "Course: Introduction to Programming - Python & Java",
      status: "Published"
    },
    {
      id: 2,
      date: "10 Aug 2025, 10:15 AM",
      title: "Essay Assignment Due Date Approaching",
      course: "Course: Sketch from A to Z (2024): Become an app designer",
      status: "Draft"
    },
    {
      id: 3,
      date: "26 Jul 2025, 01:30 PM",
      title: "Final Exam Schedule and Preparation Tips",
      course: "Course: Learn Angular Fundamentals Beginners Guide",
      status: "Published"
    },
    {
      id: 4,
      date: "15 May 2025, 04:00 PM",
      title: "New Video Lectures Added",
      course: "Course: Learn JavaScript and Express to become a Expert",
      status: "Published"
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen"
    >
      {/* --- Top Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Announcements</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ background: 'linear-gradient(90deg, #FF0F7B, #F89B29)' }}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-full shadow-lg transition-opacity hover:opacity-90"
        >
          <Plus size={20} strokeWidth={3} /> Add Announcement
        </motion.button>
      </div>

      {/* --- Main Content Box --- */}
      <motion.div 
        variants={itemVars}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden"
      >
       
        <div className="p-6 flex flex-col md:flex-row gap-4 border-b dark:border-slate-800">
          <select className="px-4 py-2.5 border rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 text-sm font-semibold focus:ring-2 focus:ring-pink-500 outline-none">
            <option>Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm transition-all"
            />
          </div>
        </div>

       
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Announcements</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {announcementData.map((item) => (
                <motion.tr 
                  key={item.id}
                  variants={itemVars}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                  className="group transition-colors"
                >
                  <td className="px-6 py-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {item.date}
                  </td>
                  <td className="px-6 py-6">
                    <h4 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-pink-600 transition-colors cursor-pointer">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                      {item.course}
                    </p>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight ${
                      item.status === 'Published' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                      : 'bg-blue-100 text-blue-500 dark:bg-blue-900/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Published' ? 'bg-green-600' : 'bg-blue-500'}`} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <motion.button whileTap={{ scale: 0.9 }} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-blue-500 rounded-lg">
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-500 hover:text-red-500 rounded-lg">
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Announcements;