"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const HeroSection = () => {
  // আপনার প্রজেক্টের নির্দিষ্ট গ্রাডিয়েন্ট কালার
  const phGradient = "bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";
  const phTextGradient = "text-transparent bg-clip-text bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";

  return (
    <div className="w-full bg-[#fcfaff] dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="container mx-auto px-6 lg:px-16 pt-12 pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <HiSparkles className="text-[#E3436B] animate-pulse" />
              <span className="text-xs font-black text-[#832388] dark:text-purple-300 uppercase tracking-widest">
                AI-Powered Smart Learning
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#1e1e2f] dark:text-white leading-[1.1]">
              শেখার ধরন হোক <br />
              <span className={phTextGradient}>
                স্মার্ট ও পারসোনালাইজড
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              আমাদের AI আপনার শেখার গতি বুঝবে এবং আপনাকে দিবে সঠিক গাইডলাইন। অটোমেটেড গ্রেডিং ও স্মার্ট সামারিতে পড়াশোনা হবে আরও সহজ।
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-10 py-4 ${phGradient} text-white font-black rounded-2xl shadow-xl transition-all`}
              >
                <FaRocket /> শুরু করো ফ্রিতে
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-10 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-white font-black rounded-2xl hover:shadow-lg transition-all"
              >
                <FaPlay className="text-xs text-[#E3436B]" /> ওরিয়েন্টেশন ভিডিও
              </motion.button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6">
              <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <FaCheckCircle className="text-[#F0772F]" /> AI ভিত্তিক মূল্যায়ন
              </span>
              <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <FaCheckCircle className="text-[#F0772F]" /> স্মার্ট ড্যাশবোর্ড
              </span>
            </div>
          </motion.div>

          {/* Right Side: Visual Content (PH Style) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative group"
          >
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#E3436B]/20 rounded-full blur-[100px] -z-10"></div>
            
            {/* Image Container with PH-style Thick Border */}
            <div className="relative rounded-[40px] overflow-hidden border-[12px] border-white dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Smart Learning" 
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-[1.5s]"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all duration-500">
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  className={`w-24 h-24 ${phGradient} rounded-full flex items-center justify-center shadow-2xl cursor-pointer`}
                >
                  <FaPlay className="text-white text-3xl ml-2" />
                </motion.div>
              </div>
            </div>

            {/* Floating Info Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-8 bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 hidden md:flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-3xl">
                🎓
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight">১০+ কোর্স</h4>
                <p className="text-sm font-bold text-gray-500">সবই AI গাইডেড</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

     
    </div>
  );
};

export default HeroSection;