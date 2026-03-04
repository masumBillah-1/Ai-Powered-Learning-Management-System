"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Grid, List, Edit2, Star, 
  PlayCircle, HelpCircle, Clock 
} from 'lucide-react';

const Course = () => {
  // Soft & Muted Stats Data
  const stats = [
    { label: 'Active Courses', count: 45, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    { label: 'Pending Courses', count: 21, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    { label: 'Draft Courses', count: 15, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    { label: 'Free Courses', count: 16, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    { label: 'Paid Courses', count: 21, bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100' },
  ];

  const courseList = [
    { id: 1, name: "Information About UI/UX Design Degree", students: 600, price: 160, rating: 4.5, reviews: 300, status: "Published", lessons: 11, quizzes: 2, hours: "03:15:00" },
    { id: 2, name: "Wordpress for Beginners - Master Wordpress Quickly", students: 500, price: 180, rating: 4.2, reviews: 430, status: "Pending", lessons: 11, quizzes: 2, hours: "03:15:00" },
    { id: 3, name: "Sketch from A to Z (2024): Become an app designer", students: 300, price: 200, rating: 4.7, reviews: 140, status: "Draft", lessons: 11, quizzes: 2, hours: "03:15:00" },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen font-sans">
      
      {/* 1. Muted Stats Cards (No Harsh Gradients) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -4 }}
            className={`${stat.bg} ${stat.border} border p-5 rounded-2xl transition-all shadow-sm`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider opacity-80 ${stat.text}`}>{stat.label}</p>
            <h2 className={`text-3xl font-black mt-1 ${stat.text}`}>{stat.count}</h2>
          </motion.div>
        ))}
      </div>

      {/* 2. Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Course Overview</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button className="p-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-indigo-600"><List size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600"><Grid size={18} /></button>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100">
              + Create Course
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by course name..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all border border-gray-100 dark:border-slate-700"
            />
          </div>
          <select className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer">
            <option>All Categories</option>
            <option>Design</option>
            <option>Development</option>
          </select>
        </div>

        {/* 3. Refined Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] border-b border-slate-50 dark:border-slate-800">
                <th className="pb-5 px-2">Course Name</th>
                <th className="pb-5 text-center">Students</th>
                <th className="pb-5 text-center">Price</th>
                <th className="pb-5">Status</th>
                <th className="pb-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {courseList.map((course) => (
                <tr key={course.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                  <td className="py-6 px-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <PlayCircle size={24} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{course.name}</h4>
                        <div className="flex gap-3 mt-1 text-[11px] font-bold text-slate-400 uppercase">
                          <span className="flex items-center gap-1"><Clock size={12}/> {course.hours}</span>
                          <span className="flex items-center gap-1"><HelpCircle size={12}/> {course.quizzes} Quiz</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 text-center text-sm font-bold text-slate-600 dark:text-slate-400">{course.students}</td>
                  <td className="py-6 text-center text-sm font-black text-slate-800 dark:text-white">${course.price}</td>
                  <td className="py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      course.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="py-6 text-right">
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Course;