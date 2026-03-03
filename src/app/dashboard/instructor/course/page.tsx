"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Grid, List, Edit2, Star, 
  PlayCircle, HelpCircle, Clock 
} from 'lucide-react';

const Course = () => {
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Stats Data with your specific gradients
  const stats = [
    { label: 'Active Courses', count: 45, gradient: 'linear-gradient(90deg, #C81D77, #6710C2)' },
    { label: 'Pending Courses', count: 21, gradient: 'linear-gradient(90deg, #FF0F7B, #F89B29)' },
    { label: 'Draft Courses', count: 15, gradient: 'linear-gradient(90deg, #832388, #E3436B, #F0772F)' },
    { label: 'Free Courses', count: 16, gradient: 'linear-gradient(90deg, #C81D77, #6710C2)' },
    { label: 'Paid Courses', count: 21, gradient: 'linear-gradient(90deg, #FF0F7B, #F89B29)' },
  ];

  const courseList = [
    { id: 1, name: "Information About UI/UX Design Degree", students: 600, price: 160, rating: 4.5, reviews: 300, status: "Published", lessons: 11, quizzes: 2, hours: "03:15:00" },
    { id: 2, name: "Wordpress for Beginners - Master Wordpress Quickly", students: 500, price: 180, rating: 4.2, reviews: 430, status: "Pending", lessons: 11, quizzes: 2, hours: "03:15:00" },
    { id: 3, name: "Sketch from A to Z (2024): Become an app designer", students: 300, price: 200, rating: 4.7, reviews: 140, status: "Draft", lessons: 11, quizzes: 2, hours: "03:15:00" },
    { id: 4, name: "Build Responsive Real World Websites with Crash Course", students: 400, price: 220, rating: 4.4, reviews: 260, status: "Published", lessons: 11, quizzes: 2, hours: "03:15:00" },
    { id: 5, name: "Learn JavaScript and Express to become a Expert", students: 700, price: 170, rating: 4.8, reviews: 180, status: "Published", lessons: 11, quizzes: 2, hours: "03:15:00" },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVars}
      className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen"
    >
      
      {/* 1. Top Stats Cards with Custom Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            variants={itemVars}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{ background: stat.gradient }} // Dynamic Gradient Applied Here
            className="p-5 rounded-2xl text-white shadow-lg cursor-default border border-white/10"
          >
            <p className="text-sm font-medium opacity-90">{stat.label}</p>
            <h2 className="text-3xl font-bold mt-1 tracking-tight">{stat.count}</h2>
          </motion.div>
        ))}
      </div>

      {/* 2. Main Content Card */}
      <motion.div 
        variants={itemVars}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-800"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-extrabold dark:text-white tracking-tight">Courses</h1>
          <div className="flex items-center gap-2">
            <button 
              style={{ background: 'linear-gradient(90deg, #C81D77, #6710C2)' }}
              className="p-2.5 text-white rounded-xl shadow-md transition-opacity hover:opacity-90"
            >
              <List size={20} />
            </button>
            <button className="p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 transition-colors">
              <Grid size={20} />
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select className="px-4 py-2.5 border rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all">
            <option>All Status</option>
            <option>Published</option>
            <option>Pending</option>
          </select>
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search your courses..." 
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* 3. Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-widest border-b dark:border-slate-800">
                <th className="pb-5 font-bold px-2">Course Details</th>
                <th className="pb-5 font-bold text-center">Students</th>
                <th className="pb-5 font-bold text-center">Price</th>
                <th className="pb-5 font-bold">Ratings</th>
                <th className="pb-5 font-bold text-center">Status</th>
                <th className="pb-5 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {courseList.map((course) => (
                <motion.tr 
                  key={course.id}
                  variants={itemVars}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                  className="group transition-colors"
                >
                  <td className="py-6 px-2">
                    <div className="flex items-center gap-4">
                      <div 
                        style={{ background: 'linear-gradient(90deg, #832388, #E3436B, #F0772F)', opacity: 0.9 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform"
                      >
                         <PlayCircle className="text-white" size={28} />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-1 group-hover:text-purple-600 transition-colors">{course.name}</h4>
                        <div className="flex items-center gap-3 text-[12px] text-gray-500 dark:text-gray-400 font-medium">
                          <span className="flex items-center gap-1"><PlayCircle size={14}/> {course.lessons} Lessons</span>
                          <span className="flex items-center gap-1"><HelpCircle size={14}/> {course.quizzes} Quizzes</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> {course.hours}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">{course.students}</td>
                  <td className="py-6 text-center text-sm font-extrabold text-gray-900 dark:text-white">${course.price}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold dark:text-gray-200">{course.rating}</span>
                      <span className="text-gray-400 text-[11px]">({course.reviews})</span>
                    </div>
                  </td>
                  <td className="py-6 text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                      course.status === 'Published' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                      course.status === 'Pending' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="py-6 text-right">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-purple-600 rounded-xl transition-all"
                    >
                      <Edit2 size={18} />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Animated Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-4 text-sm border-t dark:border-slate-800 pt-8">
          <p className="text-gray-500 dark:text-gray-400 font-medium">Showing page 1 of 12</p>
          <div className="flex items-center gap-2">
            {['<', '1', '2', '3', '>'].map((btn, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={btn === '1' ? { background: 'linear-gradient(90deg, #C81D77, #6710C2)' } : {}}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all shadow-sm ${
                  btn === '1' 
                  ? 'text-white' 
                  : 'bg-white dark:bg-slate-800 border dark:border-slate-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {btn}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Course;