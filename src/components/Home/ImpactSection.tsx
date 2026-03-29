"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaBuilding, FaHeadset, FaTrophy } from 'react-icons/fa';

const ImpactSection = () => {
  const stats = [
    {
      id: 1,
      icon: <FaGlobeAmericas className="text-2xl md:text-3xl text-[#832388]" />,
      value: "50+",
      label: "Countries Reached",
    },
    {
      id: 2,
      icon: <FaBuilding className="text-2xl md:text-3xl text-[#E3436B]" />,
      value: "1200+",
      label: "Global Placements",
    },
    {
      id: 3,
      icon: <FaHeadset className="text-2xl md:text-3xl text-[#F0772F]" />,
      value: "85%",
      label: "Remote Careers",
    },
    {
      id: 4,
      icon: <FaTrophy className="text-2xl md:text-3xl text-[#832388]" />,
      value: "94%",
      label: "Success Ratio",
    },
  ];

  const phGradient = "linear-gradient(to right, #832388, #E3436B, #F0772F)";

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* Main Glass Card Container (Updated Rounded Corners & Padding) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group p-[1px] md:p-[1.5px] rounded-3xl md:rounded-[40px] overflow-hidden shadow-xl"
        >

          {/* --- Animated Cyber-Glow Border --- */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage: `conic-gradient(from 0deg, transparent 40%, #832388, #E3436B, #F0772F, transparent)`,
            }}
            className="absolute inset-[-150%] z-0"
          />

          {/* Inner Content Area with Reduced Padding */}
          <div className="relative z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[23px] md:rounded-[39px] py-10 md:py-14 px-6 shadow-inner transition-colors">

            {/* Optimized Headline (Shortened and Sized Down) */}
            <div className="text-center mb-10 md:mb-14">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-xs font-black tracking-[0.3em] text-[#E3436B] uppercase mb-2 block"
              >
                Global Impact
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-xl md:text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-white leading-snug"
              >
                Driving Real Career <span className="text-transparent bg-clip-text" style={{ backgroundImage: phGradient }}>Growth</span> Worldwide
              </motion.h2>
            </div>

            {/* Stats Grid (Updated Layout for Compact View) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-4 items-center">
              {stats.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center relative text-center group/item"
                >
                  {/* Icon with Floating Effect (Scaled Down) */}
                  <div className="mb-3 p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-800/50 group-hover/item:bg-white dark:group-hover/item:bg-slate-700 transition-all duration-300 shadow-sm group-hover/item:shadow-lg">
                    {item.icon}
                  </div>

                  {/* Value/Number (Scaled Down) */}
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-0.5">
                    {item.value}
                  </h3>

                  {/* Label (Scaled Down) */}
                  <p className="text-gray-500 dark:text-gray-400 font-bold text-xs md:text-sm tracking-tight uppercase px-1">
                    {item.label}
                  </p>

                  {/* Desktop Divider (Updated Height and Color) */}
                  {index !== stats.length - 1 && (
                    <div className="hidden md:block absolute -right-0 top-1/2 -translate-y-1/2 h-10 w-[1px] bg-gradient-to-b from-transparent via-gray-100 dark:via-slate-800 to-transparent"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative Background Blur Circles */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#832388]/10 blur-[80px] -z-10" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#F0772F]/10 blur-[80px] -z-10" />
        </motion.div>

      </div>
    </section>
  );
};

export default ImpactSection;