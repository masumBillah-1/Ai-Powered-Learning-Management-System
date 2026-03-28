"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaPalette, FaBullhorn, FaPlay, FaGlobeAmericas, FaMobileAlt, FaDatabase, FaRobot, FaShieldAlt, FaRocket } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const LearnSection = () => {
  const learningData = [
    { title: "MERN Stack Dev", icon: <FaCode />, desc: "Master full-stack web development from HTML/CSS to React and Node.js.", color: "#832388" },
    { title: "App Development", icon: <FaMobileAlt />, desc: "Build cross-platform mobile apps for Android and iOS using Flutter.", color: "#3B82F6" },
    { title: "UI/UX Design", icon: <FaPalette />, desc: "Design modern user interfaces and experiences with Figma and Adobe XD.", color: "#DB2777" },
    { title: "AI & Data Science", icon: <FaRobot />, desc: "Learn Python, Machine Learning, and build advanced AI models.", color: "#F59E0B" },
    { title: "Digital Marketing", icon: <FaBullhorn />, desc: "Grow brands using SEO, Facebook Ads, and content marketing strategies.", color: "#1D4ED8" },
    { title: "Video Editing", icon: <FaPlay />, desc: "Master motion graphics and video storytelling with Premiere Pro.", color: "#EF4444" },
    { title: "AI Productivity", icon: <HiSparkles />, desc: "Supercharge your workflow 10x faster using ChatGPT and AI tools.", color: "#8B5CF6" },
    { title: "Graphic Design", icon: <FaPalette />, desc: "Create stunning visual identities and logos with Photoshop & Illustrator.", color: "#06B6D4" },
    { title: "Cyber Security", icon: <FaShieldAlt />, desc: "Protect networks and learn the fundamentals of ethical hacking.", color: "#4B5563" },
    { title: "Freelancing", icon: <FaGlobeAmericas />, desc: "Complete guide to building a successful career on Upwork and Fiverr.", color: "#F97316" }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Modern Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 mb-6"
          >
            <FaRocket className="text-[#E3436B] text-xs" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Future-Ready Skills
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-800 dark:text-white leading-tight"
          >
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]">Premium Courses</span>
          </motion.h2>
        </div>

        {/* Unique Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {learningData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="group relative h-full"
            >
              {/* Animated Glow Background */}
              <div
                className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-3xl"
                style={{ backgroundColor: item.color }}
              />

              {/* Main Card */}
              <div className="relative h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-start shadow-sm hover:shadow-2xl transition-all duration-500">

                {/* Icon Box */}
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-8 relative transition-all duration-500 shadow-inner overflow-hidden"
                  style={{ backgroundColor: `${item.color}10`, color: item.color }}
                >
                  {/* Floating Particle Effect Inside Icon Box */}
                  <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent to-white" />
                  <span className="relative z-10">{item.icon}</span>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${item.color}, #F0772F)` }}>
                  {item.title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                  {item.desc}
                </p>

                {/* Bottom Interactive Element */}
                <div className="mt-8 flex items-center gap-2 group/btn cursor-pointer">
                  <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-700 transition-all duration-500 group-hover:w-12 group-hover:bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${item.color}, transparent)` }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                    View Details
                  </span>
                </div>

                {/* Corner Decorative Number */}
                <span className="absolute top-8 right-8 text-4xl font-black text-slate-50 dark:text-slate-800/30 pointer-events-none group-hover:opacity-10 transition-opacity">
                  {index < 9 ? `0${index + 1}` : index + 1}
                </span>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 py-10 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-left">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">Confused about where to start?</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Join 50,000+ students already learning with us.</p>
          </div>
          <button className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            Get Free Consultation
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default LearnSection;