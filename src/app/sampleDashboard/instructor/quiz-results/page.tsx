"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Award, Timer, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const QuizResults = () => {
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const resultsData = [
    { id: 1, name: "Thompson Hicks", score: 75, attempts: "04", time: "22 Aug 2025, 09:00 AM", img: "https://i.pravatar.cc/150?u=11" },
    { id: 2, name: "Jennifer Tovar", score: 50, attempts: "03", time: "10 Aug 2025, 09:15 AM", img: "https://i.pravatar.cc/150?u=12" },
    { id: 3, name: "James Schulte", score: 60, attempts: "02", time: "26 Jul 2025, 02:20 PM", img: "https://i.pravatar.cc/150?u=13" },
    { id: 4, name: "Kristy Cardona", score: 55, attempts: "02", time: "12 Jul 2025, 11:40 AM", img: "https://i.pravatar.cc/150?u=14" },
    { id: 5, name: "William Aragon", score: 45, attempts: "04", time: "02 Jul 2025, 04:30 PM", img: "https://i.pravatar.cc/150?u=15" },
    { id: 6, name: "Shirley Lis", score: 60, attempts: "01", time: "25 Jun 2025, 08:10 AM", img: "https://i.pravatar.cc/150?u=16" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen font-sans"
    >
      {/* --- Course Title Header --- */}
      <motion.div 
        variants={itemVars}
        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-center mb-8"
      >
        <div className="w-full md:w-48 h-32 bg-indigo-900 rounded-xl overflow-hidden relative group">
           <img 
             src="https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg" 
             alt="Quiz Thumbnail" 
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
           />
           <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Information About UI/UX Design Degree</h1>
          <div className="flex items-center gap-6 text-sm text-gray-500 font-bold">
            <span className="flex items-center gap-2 italic">📝 25 Questions</span>
            <span className="flex items-center gap-2 italic">🕒 30 Minutes</span>
          </div>
        </div>
      </motion.div>

      {/* --- Stats Overview Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Participants", value: "30", icon: <Users size={24}/>, color: "bg-pink-50 text-pink-600", iconBg: "bg-pink-200/50" },
          { label: "Scores", value: "03", icon: <Award size={24}/>, color: "bg-indigo-50 text-indigo-600", iconBg: "bg-indigo-200/50" },
          { label: "Average Time", value: "00:00:55", icon: <Timer size={24}/>, color: "bg-purple-50 text-purple-600", iconBg: "bg-purple-200/50" }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={itemVars}
            whileHover={{ y: -5 }}
            className={`${stat.color} p-6 rounded-2xl flex items-center justify-between border border-white/50 shadow-sm`}
          >
            <div>
              <p className="text-sm font-bold opacity-70 mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black">{stat.value}</h4>
            </div>
            <div className={`${stat.iconBg} p-4 rounded-2xl`}>
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Results Table --- */}
      <motion.div 
        variants={itemVars}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-6 py-5">Student Name</th>
                <th className="px-6 py-5">Score</th>
                <th className="px-6 py-5">Attempts</th>
                <th className="px-6 py-5">Finish Time</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {resultsData.map((row) => (
                <motion.tr 
                  key={row.id}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                  className="group transition-colors"
                >
                  <td className="px-6 py-5 flex items-center gap-3">
                    <img src={row.img} alt={row.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-pink-600 transition-colors">
                      {row.name}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-600 dark:text-gray-400">
                    {row.score}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-600 dark:text-gray-400">
                    {row.attempts}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-500 dark:text-gray-500">
                    {row.time}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* --- Pagination --- */}
      <div className="flex justify-between items-center mt-8">
        <p className="text-sm font-bold text-gray-400">Page 1 of 2</p>
        <div className="flex items-center gap-2">
           <button className="p-2 bg-white border rounded-lg text-gray-400 hover:text-pink-500 transition-colors"><ChevronLeft size={20}/></button>
           {[1, 2, 3].map(num => (
             <button key={num} className={`w-10 h-10 rounded-lg font-black text-sm transition-all ${num === 1 ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'bg-white border text-gray-600 hover:border-pink-500'}`}>
               {num}
             </button>
           ))}
           <button className="p-2 bg-white border rounded-lg text-gray-400 hover:text-pink-500 transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizResults;