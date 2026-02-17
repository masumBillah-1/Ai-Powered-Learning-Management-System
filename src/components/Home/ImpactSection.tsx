"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaBuilding, FaHeadset, FaTrophy } from 'react-icons/fa';

const ImpactSection = () => {
  const stats = [
    {
      id: 1,
      icon: <FaGlobeAmericas className="text-4xl text-[#832388]" />,
      count: "৬০+",
      label: "দেশে",
    },
    {
      id: 2,
      icon: <FaBuilding className="text-4xl text-[#E3436B]" />,
      count: "৫৪০০+",
      label: "গ্লোবাল জব প্লেসমেন্ট",
    },
    {
      id: 3,
      icon: <FaHeadset className="text-4xl text-[#F0772F]" />,
      count: "১৯০০+",
      label: "রিমোট জব",
    },
    {
      id: 4,
      icon: <FaTrophy className="text-4xl text-[#832388]" />,
      count: "৮৫-৯০%",
      label: "জব সাকসেস রেশিও",
    },
  ];

  // প্রজেক্টের থিম গ্রাডিয়েন্ট
  const phGradient = "linear-gradient(to right, #832388, #E3436B, #F0772F)";

  return (
    <section className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative group"
        >
          
          {/* Updated Partial Gradient Border with your project colors */}
          <div 
            className="absolute inset-0 rounded-[35px] pointer-events-none border-2 border-transparent"
            style={{
              backgroundImage: phGradient,
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskImage: 'linear-gradient(to right, black 80%, transparent 100%)' 
            }}
          ></div>

          <div className="relative bg-white dark:bg-slate-900 rounded-[35px] py-16 px-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
            
            {/* Section Title with Gradient Text */}
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
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
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -8 }}
                  className="flex flex-col items-center relative"
                >
                  
                  {/* Vertical Divider for Desktop */}
                  {index !== 0 && (
                    <div className="hidden lg:block absolute left-0 h-16 w-[1px] bg-gray-100 dark:bg-slate-800"></div>
                  )}

                  <div className="mb-4 transform transition-transform group-hover:scale-110">
                    {item.icon}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-1">
                    {item.count}
                  </h3>

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