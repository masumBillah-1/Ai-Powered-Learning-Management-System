"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Grid, List, MapPin, 
  Calendar, BookOpen, MessageCircle 
} from 'lucide-react';

const Students = () => {
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const studentData = [
    { id: 1, name: "Ronald Richard", location: "Newyork", date: "22 Aug 2025", courses: 10, img: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Mona Nancy", location: "Los Angels", date: "15 Jul 2025", courses: 8, img: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Patrick Alleman", location: "Alabama", date: "18 Jun 2025", courses: 12, img: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Olive Paxson", location: "Brisbane", date: "03 May 2025", courses: 7, img: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Chris Thomas", location: "Newyork", date: "14 Apr 2025", courses: 4, img: "https://i.pravatar.cc/150?u=5" },
    { id: 6, name: "Joyce Perron", location: "Ontoro", date: "17 Mar 2025", courses: 6, img: "https://i.pravatar.cc/150?u=6" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen"
    >
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Students</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white dark:bg-slate-900 border dark:border-slate-800 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
            <List size={20} />
          </button>
          <button className="p-2 bg-pink-500 text-white rounded-lg shadow-md">
            <Grid size={20} />
          </button>
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="flex justify-end mb-8">
        <div className="relative w-full max-w-xs group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-pink-500 text-sm transition-all"
          />
        </div>
      </div>

      {/* --- Students Grid --- */}
      <motion.div 
        variants={containerVars}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {studentData.map((student) => (
          <motion.div 
            key={student.id}
            variants={cardVars}
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-800 group"
          >
            {/* Student Image */}
            <div className="relative mb-4 overflow-hidden rounded-xl h-48">
              <img 
                src={student.img} 
                alt={student.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Name & Message Icon */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 group-hover:text-pink-500 transition-colors cursor-pointer">
                {student.name}
              </h3>
              <button className="p-2 bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-pink-500 rounded-full transition-colors border border-gray-100 dark:border-slate-700">
                <MessageCircle size={18} />
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-4">
              <MapPin size={14} />
              <span className="hover:underline cursor-pointer">{student.location}</span>
            </div>

            <hr className="dark:border-slate-800 mb-4" />

            {/* Info Footer */}
            <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-indigo-500" />
                {student.date}
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-pink-500" />
                {student.courses} Courses
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- Pagination --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4 text-sm border-t dark:border-slate-800 pt-8">
        <p className="text-gray-500 dark:text-gray-400 font-medium">Page 1 of 2</p>
        <div className="flex items-center gap-2">
          {['<', '1', '2', '3', '>'].map((btn, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                btn === '1' 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-800 border dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-pink-500'
              }`}
            >
              {btn}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Students;