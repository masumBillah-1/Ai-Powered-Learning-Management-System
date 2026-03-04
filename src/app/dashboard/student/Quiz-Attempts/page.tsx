"use client";

import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const QuizAttemptsPage = () => {
  const quizAttempts = [
    { id: 1, title: "Information About UI/UX Design Degree", questions: "05" },
    { id: 2, title: "Learn JavaScript and Express to become a Expert", questions: "10" },
    { id: 3, title: "Introduction to Python Programming", questions: "08" },
    { id: 4, title: "Build Responsive Websites with HTML5 and CSS3", questions: "05" },
    { id: 5, title: "Information About Photoshop Design Degree", questions: "10" },
    { id: 6, title: "C# Developers Double Your Coding with Visual Studio", questions: "07" },
  ];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section: Font size adjusted to text-2xl */}
        <h1 className="text-2xl font-black text-[#171717] mb-6 tracking-tight">
          My Quiz Attempts
        </h1>

        {/* Quiz List Container */}
        <div className="space-y-4">
          {quizAttempts.map((quiz) => (
            <div 
              key={quiz.id} 
              className="group flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 hover:border-[#FF4667] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="space-y-1">
                {/* Quiz Title: Font size adjusted to text-lg */}
                <h3 className="text-[17px] font-black text-[#171717] group-hover:text-[#FF4667] transition-colors leading-tight">
                  {quiz.title}
                </h3>
                {/* Meta text: Font size adjusted to text-sm */}
                <p className="text-sm font-bold text-gray-400">
                  Number of Questions : <span className="text-gray-500">{quiz.questions}</span>
                </p>
              </div>

              {/* Action Arrow Icon: Size slightly reduced */}
              <div className="p-2.5 bg-gray-100 rounded-full text-gray-400 group-hover:bg-[#FF4667] group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ArrowRight size={18} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Section: Matching original design with smaller scale */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6">
          <p className="text-xs font-black text-gray-300 uppercase tracking-widest italic">
            Page 1 of 2
          </p>
          
          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all">
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers: Box size reduced */}
            <button className="w-9 h-9 flex items-center justify-center bg-[#FF4667] text-white rounded-xl text-sm font-black shadow-lg shadow-pink-100">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-100 text-gray-400 hover:border-[#FF4667] hover:text-[#FF4667] rounded-xl text-sm font-black transition-all">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center border border-gray-100 text-gray-400 hover:border-[#FF4667] hover:text-[#FF4667] rounded-xl text-sm font-black transition-all">
              3
            </button>

            {/* Next Button */}
            <button className="p-2 border border-gray-100 rounded-xl text-gray-400 hover:bg-gray-50 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizAttemptsPage;