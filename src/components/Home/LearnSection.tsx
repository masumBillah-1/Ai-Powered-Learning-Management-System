"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaPalette, FaBullhorn, FaPlay, FaGlobeAmericas, FaMobileAlt, FaDatabase, FaRobot } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const LearnSection = () => {
  const learningData = [
    { title: "MERN Stack Dev", icon: <FaCode />, desc: "HTML, CSS থেকে React এবং Node.js পর্যন্ত শিখে হয়ে ওঠো ফুল-স্ট্যাক ডেভেলপার।", gradient: "#832388, #E3436B, #F0772F" },
    { title: "App Development", icon: <FaMobileAlt />, desc: "Flutter ব্যবহার করে একই কোডে Android এবং iOS অ্যাপ তৈরি করা শিখুন।", gradient: "#10B981, #3B82F6, #10B981" },
    { title: "UI/UX Design", icon: <FaPalette />, desc: "Figma ও Adobe XD দিয়ে মডার্ন ওয়েবসাইট ও অ্যাপ ইন্টারফেস ডিজাইন শিখুন।", gradient: "#F472B6, #DB2777, #F472B6" },
    { title: "AI & Data Science", icon: <FaRobot />, desc: "Python ও Machine Learning দিয়ে ডেটা এনালাইসিস এবং AI মডেল তৈরি শিখুন।", gradient: "#F59E0B, #D97706, #F59E0B" },
    { title: "Digital Marketing", icon: <FaBullhorn />, desc: "SEO, FB Ads এবং কন্টেন্ট মার্কেটিং দিয়ে ব্র্যান্ড গ্রোথ নিশ্চিত করার কৌশল।", gradient: "#3B82F6, #1D4ED8, #3B82F6" },
    { title: "Video Editing", icon: <FaPlay />, desc: "Premiere Pro ও After Effects দিয়ে মোশন গ্রাফিক্স ও এডিটিংয়ের মাস্টারক্লাস।", gradient: "#EF4444, #B91C1C, #EF4444" },
    { title: "AI Productivity", icon: <HiSparkles />, desc: "ChatGPT ও AI টুলস ব্যবহার করে আপনার দৈনন্দিন কাজকে ১০ গুণ দ্রুত করুন।", gradient: "#8B5CF6, #6D28D9, #8B5CF6" },
    { title: "Graphic Design", icon: <FaPalette />, desc: "Photoshop ও Illustrator দিয়ে লোগো ও ব্র্যান্ড আইডেন্টিটি ডিজাইন শিখুন।", gradient: "#06B6D4, #0891B2, #06B6D4" },
    { title: "Cyber Security", icon: <FaDatabase />, desc: "নেটওয়ার্ক সিকিউরিটি ও এথিক্যাল হ্যাকিংয়ের বেসিক থেকে অ্যাডভান্স।", gradient: "#4B5563, #1F2937, #4B5563" },
    { title: "Freelancing", icon: <FaGlobeAmericas />, desc: "Upwork ও Fiverr-এ সফল ক্যারিয়ার গড়ার কমপ্লিট গাইডলাইন।", gradient: "#F97316, #C2410C, #F97316" }
  ];

  return (
    <section className="py-12 md:py-20   w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full lg:max-w-[1440px]">
        
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-800 dark:text-white leading-tight"
          >
            আমাদের <span className="relative inline-block px-4 sm:px-8 py-2 text-white italic bg-gradient-to-r from-[#F0772F] via-[#E3436B] to-[#832388] rounded-full shadow-2xl text-xl sm:text-4xl md:text-5xl">কোর্সসমূহ_</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
          {learningData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
             
              className="relative p-[2px] group rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex h-full w-full shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500"
            >
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  background: `conic-gradient(from 0deg, transparent 50%, ${item.gradient.split(',')[0]} 80%, ${item.gradient.split(',')[1]} 100%)`,
                }}
                className="absolute inset-[-150%] opacity-30 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative bg-white dark:bg-[#0b1120] p-6 sm:p-8 rounded-[1.9rem] sm:rounded-[2.4rem] h-full flex flex-col items-center text-center z-10 w-full group-hover:bg-white/95 dark:group-hover:bg-[#0f172a]/95 transition-colors duration-300">
                
                <div className="mb-6 sm:mb-8 relative h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center shrink-0">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ borderColor: item.gradient.split(',')[1] }}
                  />
                  
                  <motion.div 
                    whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0], y: -5 }}
                    className="relative z-20 bg-slate-50 dark:bg-slate-800/80 p-4 sm:p-6 rounded-[15px] sm:rounded-[20px] text-4xl sm:text-5xl shadow-xl border border-white/20 text-slate-700 dark:text-white group-hover:shadow-2xl transition-all"
                    style={{ color: item.gradient.split(',')[1] }}
                  >
                    <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 rounded-full" style={{ backgroundColor: item.gradient.split(',')[1] }} />
                    <span className="relative z-10 shrink-0">{item.icon}</span>
                  </motion.div>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-xs sm:text-sm px-1">
                  {item.desc}
                </p>

                <div 
                  className="mt-auto pt-6 w-10 sm:w-12 h-1.5 rounded-full transition-all duration-700 group-hover:w-full group-hover:shadow-[0_0_20px_rgba(227,67,107,0.5)]"
                  style={{ background: `linear-gradient(to right, ${item.gradient})` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnSection;