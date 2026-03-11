"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, FileQuestion } from 'lucide-react';

interface QuizAttempt {
  id: number;
  title: string;
  questions: string;
}

const QuizAttemptsPage = () => {
  const [theme, setTheme] = useState("light");

  // Sync with dashboard layout's localStorage theme (same as EnrolledCoursesPage)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme !== theme) {
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme]);

  const quizAttempts: QuizAttempt[] = [
    { id: 1, title: "Information About UI/UX Design Degree", questions: "05" },
    { id: 2, title: "Learn JavaScript and Express to become a Expert", questions: "10" },
    { id: 3, title: "Introduction to Python Programming", questions: "08" },
    { id: 4, title: "Build Responsive Websites with HTML5 and CSS3", questions: "05" },
    { id: 5, title: "Information About Photoshop Design Degree", questions: "10" },
    { id: 6, title: "C# Developers Double Your Coding with Visual Studio", questions: "07" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Quiz Attempts</h1>
          <div className="badge badge-outline text-xs font-semibold px-3 py-3">
            {quizAttempts.length} Total
          </div>
        </div>

        {/* Quiz List */}
        <div className="flex flex-col gap-4">
          {quizAttempts.map((quiz, index) => (
            <div
              key={quiz.id}
              className="group flex items-center justify-between bg-base-100 border border-base-300 hover:border-[#FF0F7B] rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Left — Icon + Text */}
              <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: '#FF0F7B15' }}
                >
                  <FileQuestion size={22} style={{ color: '#FF0F7B' }} />
                </div>

                {/* Title + Meta */}
                <div className="space-y-1">
                  <h3 className="text-[15px] font-bold leading-snug group-hover:text-[#FF0F7B] transition-colors duration-200">
                    {quiz.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold opacity-50">Number of Questions:</span>
                    <span
                      className="badge badge-sm font-bold text-white border-0"
                      style={{ backgroundColor: '#FF0F7B' }}
                    >
                      {quiz.questions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — Arrow */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-base-200 group-hover:text-white transition-all duration-300 group-hover:translate-x-1"
                style={{}}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FF0F7B')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-base-300 pt-6">
          <p className="text-xs font-semibold opacity-50">
            Showing {quizAttempts.length} of {quizAttempts.length} results
          </p>

          <div className="flex items-center gap-2">
            <button className="btn btn-sm btn-ghost border border-base-300 cursor-pointer">
              <ChevronLeft size={18} />
            </button>

            <button
              className="btn btn-sm btn-circle text-white font-bold shadow-md border-0 cursor-pointer"
              style={{ backgroundColor: '#FF0F7B' }}
            >
              1
            </button>
            {[2, 3].map(num => (
              <button
                key={num}
                className="btn btn-sm btn-circle btn-ghost cursor-pointer"
              >
                {num}
              </button>
            ))}

            <button className="btn btn-sm btn-ghost border border-base-300 cursor-pointer">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizAttemptsPage;