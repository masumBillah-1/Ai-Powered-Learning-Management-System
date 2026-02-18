"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaBuilding, FaHeadset, FaTrophy } from 'react-icons/fa';

const ImpactSection = () => {
  const stats = [
    {
      id: 1,
      icon: <FaGlobeAmericas className="text-4xl text-[#832388]" />,
 
      label: "দেশে",
    },
    {
      id: 2,
      icon: <FaBuilding className="text-4xl text-[#E3436B]" />,
  
      label: "গ্লোবাল জব প্লেসমেন্ট",
    },
    {
      id: 3,
      icon: <FaHeadset className="text-4xl text-[#F0772F]" />,
    
      label: "রিমোট জব",
    },
    {
      id: 4,
      icon: <FaTrophy className="text-4xl text-[#832388]" />,
  
      label: "জব সাকসেস রেশিও",
    },
  ];

  const phGradient = "linear-gradient(to right, #832388, #E3436B, #F0772F)";

  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-[2px] rounded-[38px] overflow-hidden" // বর্ডারের জন্য কন্টেইনার
        >
          
          {/* --- Animated Moving Border Magic --- */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage: `conic-gradient(from 0deg, transparent 60%, #832388, #E3436B, #F0772F)`,
            }}
            className="absolute inset-[-100%] z-0"
          />

          {/* Inner Content Area */}
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-[36px] py-16 px-4 shadow-2xl">
            
            {/* Section Title */}
            <motion.h2 
              className="text-2xl md:text-3xl font-black text-center text-slate-800 dark:text-white mb-16"
            >
              আমাদের <span className="text-transparent bg-clip-text" style={{ backgroundImage: phGradient }}>হিরোদের</span> ক্যারিয়ারে ব্রেইন-বুস্ট এর ইমপ্যাক্ট
            </motion.h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 items-center">
              {stats.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="flex flex-col items-center relative"
                >
                  {index !== 0 && (
                    <div className="hidden lg:block absolute left-0 h-16 w-[1px] bg-gray-100 dark:bg-slate-800"></div>
                  )}

                  <div className="mb-4 transform transition-transform duration-300">
                    {item.icon}
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 font-bold text-xs md:text-sm tracking-wide">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactSection;