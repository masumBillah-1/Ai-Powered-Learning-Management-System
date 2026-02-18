"use client";
import React from "react";

const JoinNow = () => {
  return (
    <section className="py-20 px-4 bg-white dark:bg-[#0b1120] transition-colors duration-300">
      <div 
        className="max-w-[1200px] mx-auto rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl"
        style={{ 
          background: "linear-gradient(180deg, #110821 0%, #050505 100%)",
        }}
      >
        {/* Grid Background Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#6710C2 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
        </div>

        <div className="relative z-10">
          {/* Main Heading */}
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            So Why Wait Any Longer?
          </h2>

          {/* Sub Heading with Gradient */}
          <h3 className="text-2xl md:text-4xl font-black mb-8">
            <span style={{ 
              background: "linear-gradient(90deg, #FF0F7B, #F89B29)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Learn Web Development, Shape Your Future</span>
          </h3>
          
          {/* Description */}
          <p className="max-w-[800px] mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mb-12">
            In this age of technology, knowing web development is not just a skill—it is the key to building a strong career. 
            BrainBoost has brought you a bootcamp where you will learn from absolute zero to a professional level.
          </p>

          {/* Enrollment Button with Shimmer Animation */}
          <button 
            style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
            className="text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95 animate-shimmer relative overflow-hidden group"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinNow;