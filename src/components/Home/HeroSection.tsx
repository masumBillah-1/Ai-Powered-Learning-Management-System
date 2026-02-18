"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // আপনার প্রজেক্টের নির্দিষ্ট গ্রাডিয়েন্ট কালার
  const phGradient = "bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";
  const phTextGradient = "text-transparent bg-clip-text bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";

  return (
    <div className="w-full bg-[#fcfaff] dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <HiSparkles className="text-[#E3436B] animate-pulse text-sm md:text-base" />
              <span className="text-[10px] md:text-xs font-black text-[#832388] dark:text-purple-300 uppercase tracking-widest">
                AI-Powered Smart Learning
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-[#1e1e2f] dark:text-white leading-[1.2] lg:leading-[1.1]">
              শেখার ধরন হোক <br className="hidden sm:block" />
              <span className={phTextGradient}>
                স্মার্ট ও পারসোনালাইজড
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium px-2 sm:px-0">
              আমাদের AI আপনার শেখার গতি বুঝবে এবং আপনাকে দিবে সঠিক গাইডলাইন। অটোমেটেড গ্রেডিং ও স্মার্ট সামারিতে পড়াশোনা হবে আরও সহজ।
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-5 pt-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 md:px-10 py-3.5 md:py-4 ${phGradient} text-white font-black rounded-xl md:rounded-2xl shadow-xl transition-all text-sm md:text-base`}
              >
                <FaRocket /> শুরু করো ফ্রিতে
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 md:px-10 py-3.5 md:py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-white font-black rounded-xl md:rounded-2xl hover:shadow-lg transition-all text-sm md:text-base"
              >
                <FaPlay className="text-[10px] text-[#E3436B]" /> ওরিয়েন্টেশন ভিডিও
              </motion.button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-8 pt-4">
              <span className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
                <FaCheckCircle className="text-[#F0772F]" /> AI ভিত্তিক মূল্যায়ন
              </span>
              <span className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-700 dark:text-slate-300">
                <FaCheckCircle className="text-[#F0772F]" /> স্মার্ট ড্যাশবোর্ড
              </span>
            </div>
          </motion.div>

          {/* Right Side: Visual Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative group order-1 lg:order-2"
          >
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 bg-[#E3436B]/20 rounded-full blur-[60px] md:blur-[100px] -z-10"></div>
            
            {/* Main Video Wrapper */}
            <div className="relative rounded-2xl md:rounded-[40px] overflow-hidden border-[6px] md:border-[12px] border-white dark:border-slate-800 shadow-[0_10px_30px_rgba(0,0,0,0.1)] md:shadow-[0_20px_50px_rgba(0,0,0,0.15)] aspect-video bg-black">
              
              {!isPlaying ? (
                <div 
                  className="absolute inset-0 z-30 cursor-pointer flex items-center justify-center" 
                  onClick={() => setIsPlaying(true)}
                >
                  <img 
                    src="https://img.youtube.com/vi/z58Sh8IndkY/maxresdefault.jpg" 
                    alt="Video Thumbnail" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                  
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all duration-500">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 ${phGradient} rounded-full flex items-center justify-center shadow-2xl relative z-40`}
                    >
                      <FaPlay className="text-white text-xl md:text-3xl ml-1 md:ml-2" />
                    </motion.div>
                  </div>
                </div>
              ) : (
                <iframe 
                  className="w-full h-full relative z-10"
                  src="https://www.youtube.com/embed/z58Sh8IndkY?autoplay=1" 
                  title="AI Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Floating Info Card */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 bg-white dark:bg-slate-900 p-3 md:p-5 rounded-2xl md:rounded-[2rem] shadow-xl md:shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-3 md:gap-4 z-50"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl">
                🎓
              </div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-sm md:text-lg leading-tight">১০+ কোর্স</h4>
                <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase">সবই AI গাইডেড</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;