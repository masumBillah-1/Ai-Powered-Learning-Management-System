"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const Assignments = () => {
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const assignmentData = [
    {
      id: 1,
      title: "Building Your First Landing Page",
      course: "Course: Sketch from A to Z (2024): Become an app designer",
      marks: 80,
      submits: 2,
      status: "Published"
    },
    {
      id: 2,
      title: "Building a Basic Angular Application",
      course: "Course: Learn Angular Fundamentals Beginners Guide",
      marks: 60,
      submits: 4,
      status: "Draft"
    },
    {
      id: 3,
      title: "Basic Arithmetic Operations",
      course: "Course: Learn JavaScript and Express to become a Expert",
      marks: 30,
      submits: 3,
      status: "Published"
    },
    {
      id: 4,
      title: "Basic Calculations",
      course: "Course: Introduction to Programming - Python & Java",
      marks: 50,
      submits: 5,
      status: "Published"
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen font-sans"
    >
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Assignments</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ background: 'linear-gradient(90deg, #FF0F7B, #F89B29)' }}
          className="flex items-center gap-2 px-6 py-2.5 text-white font-bold rounded-full shadow-lg hover:shadow-pink-200 dark:hover:shadow-none transition-all"
        >
          <Plus size={18} strokeWidth={3} /> Add Assignment
        </motion.button>
      </div>

      {/* --- Table Container --- */}
      <motion.div 
        variants={itemVars}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden"
      >
        {/* Search & Filter Header */}
        <div className="p-6 flex flex-col md:flex-row gap-4 border-b dark:border-slate-800">
          <select className="px-4 py-2 border rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-pink-500 outline-none">
            <option>Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* --- Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Assignment Name</th>
                <th className="px-6 py-4 text-center">Total Marks</th>
                <th className="px-6 py-4 text-center">Total Submit</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {assignmentData.map((assignment) => (
                <motion.tr 
                  key={assignment.id}
                  variants={itemVars}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                  className="group transition-colors"
                >
                  <td className="px-6 py-6">
                    <h4 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-pink-600 transition-colors cursor-pointer">
                      {assignment.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {assignment.course}
                    </p>
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {assignment.marks}
                  </td>
                  <td className="px-6 py-6 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {assignment.submits}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-tight ${
                      assignment.status === 'Published' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                      : 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${assignment.status === 'Published' ? 'bg-green-600' : 'bg-cyan-500'}`} />
                      {assignment.status}
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

export default Assignments;