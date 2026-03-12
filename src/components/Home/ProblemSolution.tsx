"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiActivity, FiZap, FiTarget } from "react-icons/fi";

const ProblemSolution = () => {
  const data = [
    {
      problem: "কী শিখব, কতটুকু শিখব, কোথা থেকে শুরু করব কিছুই বুঝি না।",
      problemEmoji: "😒",
      solution: "আমরা পুরো আউটলাইন, গাইডলাইন, কনটেন্ট রেডি করেই তোমার সাথে আছি।",
      solutionEmoji: "😊",
      color: "from-orange-500 via-rose-500 to-purple-600",
      icon: <FiTarget className="text-orange-500" />,
    },
    {
      problem: "স্কিল ও নলেজ নেই।",
      problemEmoji: "😟",
      solution:
        "৬ মাসে লার্নিং জার্নিতে যদি সিরিয়াস হও - নিজের নলেজ ও স্কিল দুইটাই পাবে।",
      solutionEmoji: "😎",
      color: "from-blue-600 via-indigo-500 to-purple-500",
      icon: <FiZap className="text-blue-500" />,
    },
    {
      problem: "ইন্টার্নশিপ বা চাকরি পর্যন্ত পৌঁছানোর আগেই হার মেনে যাই।",
      problemEmoji: "😫",
      solution:
        "তোমার জব ইন্টার্ন নিশ্চিত না হওয়া পর্যন্ত আমরা তোমাকে ছাড়ব না।",
      solutionEmoji: "🤝",
      color: "from-emerald-500 via-teal-500 to-cyan-600",
      icon: <FiActivity className="text-emerald-500" />,
    },
    {
      problem: "রেগুলারিটি বজায় রাখতে পারি না - মাঝপথেই থেমে যাই।",
      problemEmoji: "😰",
      solution:
        "ডেডিকেটেড লাইভ সাপোর্ট, গাইডলাইন, ২৪/৭ কমিউনিটি সাপোর্টে থেমে যাওয়ার চান্স নেই।",
      solutionEmoji: "🔥",
      color: "from-pink-500 via-rose-500 to-amber-500",
      icon: <FiZap className="text-pink-500" />,
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#020617] relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1200px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-rose-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Modern Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Transforming Struggles
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-7xl font-black text-slate-800 dark:text-white leading-[1.1] tracking-tight">
            শেখার পথে <span className="text-rose-500">প্যারা</span> অনেক,
            <br />
            <span className="italic font-serif font-light text-slate-400 dark:text-slate-500">
              কিন্তু সমাধান মাত্র
            </span>{" "}
            <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
              একটিই!
            </span>
          </h2>
        </div>

        {/* Bento Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full bg-slate-50 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 overflow-hidden transition-all duration-500 hover:border-rose-500/30">
                {/* Background Number */}
                <div className="absolute -top-10 -right-10 text-[15rem] font-black text-slate-200/30 dark:text-slate-800/10 pointer-events-none select-none group-hover:text-rose-500/5 transition-colors duration-700">
                  {index + 1}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Problem Section */}
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                        {item.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Common Struggle
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="text-4xl mt-1">{item.problemEmoji}</span>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {item.problem}
                      </h3>
                    </div>
                  </div>

                  {/* Dynamic Connector */}
                  <div className="flex items-center gap-4 mb-10 overflow-hidden">
                    <div className="h-[2px] w-full bg-gradient-to-r from-rose-500 to-transparent opacity-20" />
                    <motion.div
                      animate={{ x: [-10, 10, -10] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <FiArrowRight className="text-slate-300 dark:text-slate-600 text-2xl" />
                    </motion.div>
                  </div>

                  {/* Solution Section */}
                  <div className="mt-auto relative">
                    <div className="absolute -inset-6 bg-gradient-to-r from-rose-500/5 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
                          The Ultimate Solution
                        </span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="text-4xl mt-1 drop-shadow-lg">
                          {item.solutionEmoji}
                        </span>
                        <p
                          className={`text-xl md:text-2xl font-black leading-tight bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                        >
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Glow Bar */}
                <div
                  className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${item.color} transition-all duration-700 group-hover:w-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
