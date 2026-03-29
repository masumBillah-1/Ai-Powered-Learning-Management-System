"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiTrendingUp, FiShield, FiClock, FiMap } from "react-icons/fi";

const ProblemSolution = () => {
  const data = [
    {
      problem: "Feeling lost without a clear learning roadmap.",
      solution: "AI-powered structured paths designed for your goals.",
      icon: <FiMap />,
      color: "from-rose-500 to-orange-500",
      tag: "Direction"
    },
    {
      problem: "Struggling to maintain consistency and focus.",
      solution: "24/7 community support & personal mentors to keep you on track.",
      icon: <FiClock />,
      color: "from-blue-500 to-indigo-600",
      tag: "Consistency"
    },
    {
      problem: "Fear of not being job-ready after months of study.",
      solution: "Real-world projects and direct placement assistance.",
      icon: <FiTrendingUp />,
      color: "from-emerald-500 to-teal-600",
      tag: "Career"
    },
    {
      problem: "Overwhelmed by complex technical concepts.",
      solution: "Simplified, bite-sized lessons with hands-on practice.",
      icon: <FiShield />,
      color: "from-purple-500 to-pink-600",
      tag: "Clarity"
    },
  ];

  return (
    <section className="py-24 bg-[#fcfaff] dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 mb-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
              Bridge the Gap
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight"
          >
            From Hurdles to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#832388] to-[#F0772F]">High-Growth</span>
          </motion.h2>
        </div>

        {/* Advanced Animated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                rotateX: index % 2 === 0 ? 2 : -2,
                rotateY: index % 2 === 0 ? -2 : 2
              }}
              className="group relative perspective-1000"
            >
              {/* Soft Outer Glow */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

              <div className="relative h-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col overflow-hidden">

                {/* Icon Section with Floating Animation */}
                <div className="flex justify-between items-start mb-10">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl shadow-lg shadow-fuchsia-500/20`}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {item.tag}
                  </span>
                </div>

                {/* Problem: Subtle Gray-out on Hover */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest opacity-70">
                    <FiAlertCircle className="group-hover:rotate-12 transition-transform" /> The Struggle
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-400 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-all duration-300">
                    {item.problem}
                  </h3>
                </div>

                {/* Dynamic Connecting Line */}
                <div className="relative h-1 w-full bg-slate-50 dark:bg-slate-800 mb-8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "0%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`absolute inset-0 bg-gradient-to-r ${item.color}`}
                  />
                </div>

                {/* Solution: Highlight on Hover */}
                <div className="mt-auto transform group-hover:translate-y-[-5px] transition-transform duration-500">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-3">
                    <FiCheckCircle className="group-hover:scale-125 transition-transform" /> The Breakthrough
                  </div>
                  <p className={`text-xl md:text-2xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent group-hover:scale-[1.03] origin-left transition-transform duration-500`}>
                    {item.solution}
                  </p>
                </div>

                {/* Glassmorphism Flare Effect */}
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1200ms] ease-in-out pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-4 italic">
            "Your only limit is your soul."
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-[#E3436B]/20 transition-all"
          >
            Start Your Journey
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default ProblemSolution;