"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaPalette, FaBullhorn } from 'react-icons/fa';

const LearnSection = () => {
  const learningData = [
    {
      title: "Web Development",
      icon: <FaCode className="text-[#6366F1]" />,
      desc: "HTML, CSS থেকে শুরু করে React এবং Node.js পর্যন্ত সবকিছু শিখে হয়ে ওঠো একজন ফুল-স্ট্যাক ডেভেলপার। নিজের আইডিয়াকে বাস্তবে রূপ দাও কোডিংয়ের মাধ্যমে।",
      gradient: "from-[#832388] via-[#E3436B] to-[#F0772F]",
      delay: 0
    },
    {
      title: "Graphic Design",
      icon: <FaPalette className="text-[#EC4899]" />,
      desc: "কালার থিওরি, টাইপোগ্রাফি এবং মডার্ন ডিজাইন টুলস ব্যবহার করে আকর্ষণীয় ইউজার ইন্টারফেস এবং ব্র্যান্ড আইডেন্টিটি তৈরি করতে শেখো।",
      gradient: "from-[#00c6ff] via-[#0072ff] to-[#00c6ff]",
      delay: 0.2
    },
    {
      title: "Digital Marketing",
      icon: <FaBullhorn className="text-[#F59E0B]" />,
      desc: "সোশ্যাল মিডিয়া স্ট্র্যাটেজি, SEO এবং কন্টেন্ট মার্কেটিংয়ের মাধ্যমে কিভাবে একটি ব্র্যান্ডকে মানুষের কাছে পৌঁছে দিতে হয় তার সিক্রেট টেকনিকগুলো শেখো।",
      gradient: "from-[#f093fb] via-[#f5576c] to-[#f093fb]",
      delay: 0.4
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0b1120] overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white"
          >
            আমাদের <span className="relative inline-block px-8 py-2 ml-2 text-white italic bg-gradient-to-r from-[#F0772F] via-[#E3436B] to-[#832388] rounded-full shadow-2xl">কোর্সসমূহ_</span>
          </motion.h2>
        </div>

        {/* Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {learningData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative p-[2px] group rounded-[3rem] overflow-hidden"
            >
              {/* --- Moving Gradient Border Animation --- */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className={`absolute inset-[-100%] bg-gradient-to-r ${item.gradient} opacity-40 group-hover:opacity-100 transition-opacity`}
              />

              {/* Main Card Body */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                className="relative bg-white dark:bg-[#0f172a] p-10 rounded-[3rem] h-full flex flex-col items-center text-center z-10"
              >
                {/* Icon Container with Glow */}
                <div className="relative mb-8">
                   <div className={`absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r ${item.gradient}`} />
                   <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="relative bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl text-6xl shadow-inner"
                   >
                    {item.icon}
                   </motion.div>
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white mb-5 tracking-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#F0772F] group-hover:to-[#832388] transition-all">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-base lg:text-lg">
                  {item.desc}
                </p>

                {/* Bottom Decorative Line */}
                <div className={`mt-auto pt-6 w-16 h-1 rounded-full bg-gradient-to-r ${item.gradient} opacity-30 group-hover:w-full transition-all duration-500`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnSection;