"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';

const QuizAttemptsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle function
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const quizAttempts = [
    { id: 1, title: "Information About UI/UX Design Degree", questions: "05" },
    { id: 2, title: "Learn JavaScript and Express to become a Expert", questions: "10" },
    { id: 3, title: "Introduction to Python Programming", questions: "08" },
    { id: 4, title: "Build Responsive Websites with HTML5 and CSS3", questions: "05" },
    { id: 5, title: "Information About Photoshop Design Degree", questions: "10" },
    { id: 6, title: "C# Developers Double Your Coding with Visual Studio", questions: "07" },
  ];

  return (
    // Parent wrapper handles the 'dark' class
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-[#0F0F0F] p-4 md:p-8 font-sans transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          
          {/* Header & Toggle Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black text-[#171717] dark:text-white tracking-tight">
              My Quiz Attempts
            </h1>
            
            {/* Dark Mode Toggle Button */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-yellow-400 hover:ring-2 ring-[#FF4667] transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Quiz List Container */}
          <div className="space-y-4">
            {quizAttempts.map((quiz) => (
              <div 
                key={quiz.id} 
                className="group flex items-center justify-between bg-white dark:bg-[#1A1A1A] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#FF4667] dark:hover:border-[#FF4667] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="space-y-1">
                  <h3 className="text-[17px] font-black text-[#171717] dark:text-gray-100 group-hover:text-[#FF4667] transition-colors leading-tight">
                    {quiz.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
                    Number of Questions : <span className="text-gray-500 dark:text-gray-300">{quiz.questions}</span>
                  </p>
                </div>

                {/* Action Arrow Icon */}
                <div className="p-2.5 bg-gray-100 dark:bg-[#262626] rounded-full text-gray-400 group-hover:bg-[#FF4667] group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ArrowRight size={18} strokeWidth={2.5} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 dark:border-gray-800 pt-6">
            <p className="text-xs font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest italic">
              Page 1 of 2
            </p>
            
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-all">
                <ChevronLeft size={18} />
              </button>

              <button className="w-9 h-9 flex items-center justify-center bg-[#FF4667] text-white rounded-xl text-sm font-black shadow-lg shadow-pink-100 dark:shadow-none">
                1
              </button>
              
              {[2, 3].map((num) => (
                <button key={num} className="w-9 h-9 flex items-center justify-center border border-gray-100 dark:border-gray-800 text-gray-400 hover:border-[#FF4667] hover:text-[#FF4667] rounded-xl text-sm font-black transition-all">
                  {num}
                </button>
              ))}

              <button className="p-2 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptsPage;