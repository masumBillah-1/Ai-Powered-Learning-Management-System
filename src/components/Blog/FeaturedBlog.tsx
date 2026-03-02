"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUser, FaArrowRight, FaClock } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const FeaturedBlog = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120] min-h-[500px] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4">
            <HiSparkles className="text-[#C81D77] animate-pulse" />
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">
              Featured Article
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
            Editor&apos;s Pick 🔥
          </h2>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-[#161d2f] rounded-[40px] overflow-hidden shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all duration-500 border border-gray-100 dark:border-gray-800 group"
        >
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Image with Purple Wave */}
            <motion.div 
              className="w-full md:w-1/2 relative h-[350px] md:h-[500px] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img 
                src="https://i.ibb.co.com/zH75B27y/Gemini-Generated-Image-4de9wp4de9wp4de9.png" 
                alt="Featured Blog" 
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2 }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Featured Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-6 left-6 px-4 py-2 rounded-full backdrop-blur-md bg-white/20 border border-white/30 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-bold">Trending Now</span>
              </motion.div>

              {/* Reading Time Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-md bg-black/30 border border-white/20 flex items-center gap-2"
              >
                <FaClock className="text-white text-sm" />
                <span className="text-white text-sm font-bold">5 min read</span>
              </motion.div>

              {/* Purple Overlay Wave effect */}
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]"
              >
                <svg 
                  viewBox="0 0 500 150" 
                  preserveAspectRatio="none" 
                  className="h-[100px] w-full fill-[#6710C2] dark:fill-[#8B2FF1] transition-colors duration-300"
                >
                  <path d="M0.00,49.98 C149.99,150.00 349.89,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                </svg>
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Category Badge */}
                <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-6 border border-purple-200 dark:border-purple-800">
                  Learning Management
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#C81D77] group-hover:to-[#6710C2] transition-all duration-300">
                  Best Learning Management Course in Bangladesh
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 font-bold mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-[#C81D77]" />
                    <span>Arif Almas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#6710C2]" />
                    <span>May 5, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-xs">(4.9)</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8 line-clamp-4">
                  Learning Management, আপনি কি ভেবেছেন প্রতিদিনের জীবনটা প্রোগ্রামিং ছাড়া কেমন হতো? 
                  সকালে ঘুম থেকে উঠে YouTube-এ গান শুনতে চান, কিন্তু অ্যাপই নেই! দুপুরে Daraz থেকে 
                  হেডফোন কিনতে গিয়েও দেখলেন সাইট লোড হয় না...
                </p>

                {/* CTA Button */}
                <Link href="/blog/best-learning-management-course-bangladesh">
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl hover:shadow-2xl relative overflow-hidden"
                    style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
                  >
                    <span className="relative z-10">Read Full Article</span>
                    <FaArrowRight className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </motion.button>
                </Link>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8">
                  {["Web Development", "Digital Marketing", "Graphics Design"].map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all cursor-pointer"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlog;
