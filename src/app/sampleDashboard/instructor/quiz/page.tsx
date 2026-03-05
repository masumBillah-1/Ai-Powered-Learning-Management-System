"use client";

import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {

  Plus, Edit2, Trash2, MessageSquare,

  Clock, X, ChevronDown

} from 'lucide-react';
import Link from 'next/link';



const Quiz = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);



  // Animation Variants

  const containerVars = {

    hidden: { opacity: 0 },

    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }

  };



  const itemVars = {

    hidden: { y: 20, opacity: 0 },

    visible: { y: 0, opacity: 1 }

  };



  const quizData = [

    { id: 1, title: "Information About UI/UX Design Degree", questions: 25, duration: "30 Minutes" },

    { id: 2, title: "Learn JavaScript and Express to become a Expert", questions: 15, duration: "25 Minutes" },

    { id: 3, title: "Introduction to Python Programming", questions: 22, duration: "15 Minutes" },

    { id: 4, title: "Build Responsive Websites with HTML5 and CSS3", questions: 30, duration: "50 Minutes" },

    { id: 5, title: "Information About Photoshop Design Degree", questions: 20, duration: "20 Minutes" },

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

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Quiz</h1>

        <motion.button

          whileHover={{ scale: 1.05 }}

          whileTap={{ scale: 0.95 }}

          onClick={() => setIsModalOpen(true)}

          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-all flex items-center gap-2"

        >

          Add Quiz

        </motion.button>

      </div>



      {/* --- Quiz List --- */}

      <div className="space-y-4">

        {quizData.map((quiz) => (

          <motion.div

            key={quiz.id}

            variants={itemVars}

            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all"

          >

            <div>

              <h3 className="text-[16px] font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-pink-500 transition-colors">

                {quiz.title}

              </h3>

              <div className="flex items-center gap-4 text-sm text-gray-500">

                <span className="flex items-center gap-1.5"><MessageSquare size={16} className="text-gray-400" /> {quiz.questions} Questions</span>

                <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" /> {quiz.duration}</span>

              </div>

            </div>

           

            <div className="flex items-center gap-6">

              <Link href="/dashboard/instructor/quiz/results" className="text-blue-600 hover:underline text-sm font-bold">View Results</Link>

              <div className="flex items-center gap-2">

                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 rounded-lg"><Edit2 size={18} /></button>

                <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 size={18} /></button>

              </div>

            </div>

          </motion.div>

        ))}

      </div>



      {/* --- Add New Quiz Modal --- */}

      <AnimatePresence>

        {isModalOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Backdrop */}

            <motion.div

              initial={{ opacity: 0 }}

              animate={{ opacity: 1 }}

              exit={{ opacity: 0 }}

              onClick={() => setIsModalOpen(false)}

              className="absolute inset-0 bg-black/40 backdrop-blur-sm"

            />

           

            {/* Modal Content */}

            <motion.div

              initial={{ scale: 0.9, opacity: 0, y: 20 }}

              animate={{ scale: 1, opacity: 1, y: 0 }}

              exit={{ scale: 0.9, opacity: 0, y: 20 }}

              className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"

            >

              {/* Modal Header */}

              <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">

                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Add New Quiz</h2>

                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">

                  <X size={20} className="text-gray-500" />

                </button>

              </div>



              {/* Modal Body */}

              <div className="p-8 space-y-6">

                <div>

                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Course <span className="text-red-500">*</span></label>

                  <div className="relative">

                    <select className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-pink-500 appearance-none text-gray-600">

                      <option>Select</option>

                    </select>

                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />

                  </div>

                </div>



                <div>

                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quiz Title <span className="text-red-500">*</span></label>

                  <input type="text" className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-pink-500" />

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>

                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">No of Questions <span className="text-red-500">*</span></label>

                    <input type="number" className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-pink-500" />

                  </div>

                  <div>

                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Total Marks <span className="text-red-500">*</span></label>

                    <input type="number" className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-pink-500" />

                  </div>

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>

                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Pass Mark <span className="text-red-500">*</span></label>

                    <input type="number" className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-pink-500" />

                  </div>

                  <div>

                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration <span className="text-red-500">*</span></label>

                    <div className="relative">

                      <input type="time" defaultValue="02:05" className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-pink-500" />

                    </div>

                  </div>

                </div>

              </div>



              {/* Modal Footer */}

              <div className="p-6 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-3">

                <button

                  onClick={() => setIsModalOpen(false)}

                  className="px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors"

                >

                  Cancel

                </button>

                <button className="px-6 py-2.5 rounded-lg font-bold text-white bg-purple-500 hover:bg-purple-600 shadow-lg shadow-pink-200 dark:shadow-none transition-all">

                  Add Quiz

                </button>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </motion.div>

  );

};



export default Quiz;