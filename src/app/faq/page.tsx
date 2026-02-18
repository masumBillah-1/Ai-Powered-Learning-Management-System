"use client";
import React, { useState } from "react";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";

const FullFAQPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const allFaqs = [
    { q: "Who is this course for?", a: "This course is for anyone who wants to start their career as a professional web developer, regardless of their background." },
    { q: "How do you guarantee a job or internship?", a: "We provide dedicated support through our job placement cell to students who complete the course successfully." },
    { q: "Will AI replace web developers?", a: "No, AI is a tool that helps developers become more efficient, and we teach you how to use it." },
    { q: "Can non-CSE students get a job?", a: "Absolutely. Many of our successful students are from non-CSE backgrounds." },
    { q: "Can I do this course while working?", a: "Yes, the curriculum is designed to be flexible for students and working professionals." },
    { q: "What is the prerequisite for this course?", a: "Basic computer knowledge and a strong desire to learn are enough." },
    { q: "Will I get support if I get stuck?", a: "Yes, we have a dedicated support system available 24/7 to help you with your code." },
    { q: "Do I need a high-end laptop?", a: "A basic laptop with 8GB RAM and an i3 processor is sufficient for this course." },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
 
      
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6710C2] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C81D77] blur-[150px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-[900px] mx-auto pt-24 pb-32 px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
              Frequently Asked <br />
              <span style={{ 
                background: "linear-gradient(90deg, #832388, #E3436B, #F0772F)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>Questions_</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* FAQ List Area */}
        <div className="bg-[#0f0f15]/80 backdrop-blur-xl border border-gray-800 rounded-[32px] p-4 md:p-8 shadow-2xl">
          <div className="space-y-2">
            {allFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`transition-all duration-300 rounded-2xl ${
                  openIndex === index ? "bg-white/5" : "hover:bg-white/5"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span className="text-base md:text-lg font-bold text-gray-200">
                    {faq.q}
                  </span>
                  <span className={`${openIndex === index ? "text-[#E3436B]" : "text-gray-500"} transition-colors`}>
                    {openIndex === index ? <FaChevronCircleUp size={24}/> : <FaChevronCircleDown size={24}/>}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed animate-fadeIn">
                    <div className="h-[1px] bg-gray-800 mb-4 w-full"></div>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

    
    </div>
  );
};

export default FullFAQPage;