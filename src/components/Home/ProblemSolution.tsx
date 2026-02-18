"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ProblemSolution = () => {
  
  const data = [
    {
      problem: "কী শিখব, কতটুকু শিখব, কোথা থেকে শুরু করব কিছুই বুঝি না।",
      problemEmoji: "😒",
      solution: "আমরা পুরো আউটলাইন, গাইডলাইন, কনটেন্ট রেডি করেই তোমার সাথে আছি।",
      solutionEmoji: "😊",
      pColor: "from-[#2d0b2e] to-[#4c0519]",
      sColor: "from-[#064e3b] to-[#022c22]"
    },
    {
      problem: "স্কিল ও নলেজ নেই।",
      problemEmoji: "😒",
      solution: "৬ মাসে লার্নিং জার্নিতে যদি সিরিয়াস হও - নিজের নলেজ ও স্কিল দুইটাই পাবে।",
      solutionEmoji: "😊",
      pColor: "from-[#1e1b4b] to-[#312e81]",
      sColor: "from-[#14532d] to-[#064e3b]"
    },
    {
      problem: "ইন্টার্নশিপ বা চাকরি পর্যন্ত পৌঁছানোর আগেই হার মেনে যাই।",
      problemEmoji: "😒",
      solution: "তোমার জব ইন্টার্ন নিশ্চিত না হওয়া পর্যন্ত আমরা তোমাকে ছাড়ব না।",
      solutionEmoji: "😊",
      pColor: "from-[#4c0519] to-[#832388]/20",
      sColor: "from-[#065f46] to-[#064e3b]"
    },
    {
      problem: "রেগুলারিটি বজায় রাখতে পারি না - মাঝপথেই থেমে যাই।",
      problemEmoji: "😒",
      solution: "ডেডিকেটেড লাইভ সাপোর্ট, গাইডলাইন, ২৪/৭ কমিউনিটি সাপোর্টে থেমে যাওয়ার চান্স নেই।",
      solutionEmoji: "😊",
      pColor: "from-[#312e81] to-[#1e1b4b]",
      sColor: "from-[#064e3b] to-[#0f766e]"
    },
  ];

  return (
    /* py-12 add kora hoyeche jeno rounded kona bojha jay */
    <section className="py-12 bg-white dark:bg-[#020617] overflow-hidden relative">
      
      {/* --- Main Rounded Background Wrapper --- */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="bg-[#0b1120] text-white py-24 px-6 lg:px-16 rounded-[4rem] relative overflow-hidden shadow-2xl border border-white/5">
          
          {/* Background Glows (Inside the rounded box) */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#832388]/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F0772F]/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            {/* Animated Headers */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-24">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 px-12 py-5 rounded-full shadow-2xl"
              >
                <h2 className="text-xl md:text-3xl font-black tracking-tight text-rose-500">
                    তোমার প্যারা <span className="inline-block animate-bounce">😒</span>
                </h2>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="text-2xl font-black text-slate-700 hidden md:block"
              > VS </motion.div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 px-12 py-5 rounded-full shadow-2xl"
              >
                <h2 className="text-xl md:text-3xl font-black tracking-tight text-emerald-500">
                    আমাদের সমাধান <span className="inline-block animate-pulse">😃</span>
                </h2>
              </motion.div>
            </div>

            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative">
              
              {/* Central Dashed Connector */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] border-t-2 border-dashed border-slate-800/30 -translate-y-1/2 z-0" />

              {data.map((item, index) => (
                <div key={index} className="flex flex-col gap-12 lg:gap-16 relative z-10">
                  
                  {/* Problem Card */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    initial={{ opacity: 0, y: -40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${item.pColor} p-8 rounded-[3.5rem] min-h-[220px] flex flex-col items-center justify-center text-center shadow-2xl border border-white/5 group`}
                  >
                    <span className="text-5xl mb-4 drop-shadow-2xl">{item.problemEmoji}</span>
                    <p className="text-[15px] font-bold leading-relaxed px-1">{item.problem}</p>
                  </motion.div>

                  {/* Solution Card */}
                  <motion.div 
                    whileHover={{ y: 8, scale: 1.02 }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className={`bg-gradient-to-br ${item.sColor} p-8 rounded-[3.5rem] min-h-[220px] flex flex-col items-center justify-center text-center shadow-2xl border border-white/5 group`}
                  >
                    <span className="text-5xl mb-4 drop-shadow-2xl">{item.solutionEmoji}</span>
                    <p className="text-[15px] font-bold leading-relaxed px-1">{item.solution}</p>
                  </motion.div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;