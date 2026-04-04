"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const About = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const team = [
    {
      name: "Akhi Akter",
      role: "Mern-Stack Developer",
      image: "https://i.ibb.co.com/qFkzk520/Chat-GPT-Image-Dec-17-2025-05-24-43-PM.png",
      github: "https://github.com/akhiakter25556",
      linkedin: "https://www.linkedin.com/in/akhi-akter-578880396/"
    },
    {
      name: "Juma Islam",
      role: "Frontend Developer",
      image: "https://i.ibb.co.com/krjgJw0/saree-removebg-preview.png",
      github: "https://github.com/Juma-islam",
      linkedin: "https://www.linkedin.com/in/juma-islam"
    },
    {
      name: "Sayma Ahmed Shimu",
      role: "Frontend Developer",
      image: "https://i.ibb.co.com/nND6Jbrz/mine-removebg-preview.png",
      github: "https://github.com/Sayma-Shimu",
      linkedin: "https://linkedin.com/"
    },
    {
      name: "Sakib Al Hasan",
      role: "Mern-Stack Developer",
      image: "https://i.ibb.co.com/RpFQKWTh/473419070-1296272228367678-2831504883843112837-n.jpg",
      github: "https://github.com/Sadman-Sakib-12",
      linkedin: "https://www.linkedin.com/in/sakib-al-hasan-898a173a2"
    },
    {
      name: "Bayjid Mia",
      role: "Frontend Developer",
      image: "https://i.ibb.co.com/8LdmVScp/1000072045-removebg-preview-1.png",
      github: "https://github.com/bayjidmia",
      linkedin: "https://www.linkedin.com/in/md-bayjid-mia-275b823a3/"
    },
    {
      name: "Masum Billah",
      role: "Mern-Stack Developer",
      image: "https://i.ibb.co.com/Fk1htvFj/Gemini-Generated-Image-iyhys1iyhys1iyhy.png",
      github: "https://github.com/masumBillah-1",
      linkedin: "https://www.linkedin.com/in/masumamms/"
    },
  ];

  return (
    <div className="bg-white dark:bg-[#020617] text-gray-900 dark:text-white min-h-screen py-24 relative overflow-hidden transition-colors duration-300">

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-16 max-w-7xl relative z-10">

        {/* Header */}
        <div className="text-center mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-purple-600 dark:text-purple-400 font-bold tracking-[0.3em] text-xs uppercase shadow-sm">
              Innovation & Passion
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mt-8 mb-6"
          >
            Meet the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
              Visionaries_
            </span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"
          />
        </div>

        {/* ───── DESKTOP accordion (md and above) ───── */}
        <div className="hidden md:flex gap-2 h-[440px] w-full max-w-[1150px] mx-auto px-4 pb-20">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex-1 rounded-sm overflow-hidden group cursor-pointer border border-white/10 shadow-2xl bg-[#1e293b]"
              style={{ transition: "flex 0.7s cubic-bezier(0.33, 1, 0.68, 1)" }}
              onMouseEnter={e => (e.currentTarget.style.flex = '3')}
              onMouseLeave={e => (e.currentTarget.style.flex = '1')}
            >
              <div className="absolute inset-0">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="absolute top-4 left-4 text-white/10 text-5xl font-black pointer-events-none select-none group-hover:opacity-0 transition-opacity duration-300">
                0{index + 1}
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <span
                  className="text-white/20 text-sm font-black uppercase tracking-[0.3em] whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {member.name.split(" ")[0]}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-150">
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] text-white font-black uppercase tracking-widest mb-3">
                  {member.role}
                </div>
                <h3 className="text-2xl font-black text-white mb-5 uppercase tracking-tight leading-tight">
                  {member.name}
                </h3>
                <div className="flex gap-3">
                  <motion.a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lg text-white transition-all hover:bg-white hover:text-black"
                  >
                    <FaGithub />
                  </motion.a>
                  <motion.a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lg text-white transition-all hover:bg-[#0077b5] hover:text-white"
                  >
                    <FaLinkedinIn />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ───── MOBILE cards (below md) ───── */}
        <div className="md:hidden grid grid-cols-2 gap-3 pb-16 px-1">
          {team.map((member, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                onClick={() => setActiveIndex(isActive ? null : index)}
                className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-[#0f172a] cursor-pointer"
                style={{
                  aspectRatio: isActive ? '3/4' : '2/3',
                  transition: 'aspect-ratio 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
                }}
              >
                {/* Full cover image */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{
                    transform: isActive ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)',
                  }}
                />

                {/* Gradient overlay — always present */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Index number top-left */}
                <div className="absolute top-2.5 left-3 text-white/20 text-xl font-black select-none">
                  0{index + 1}
                </div>

                {/* Expand/close icon top-right */}
                <div className="absolute top-2.5 right-3 w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  {isActive ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 8L8 2M2 2L8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 4L5 7L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {/* Bottom info — always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {/* Role badge */}
                  <div className="inline-block px-2 py-0.5 rounded-full bg-purple-500/25 border border-purple-500/30 text-purple-300 text-[9px] font-black uppercase tracking-wider mb-1.5">
                    {member.role}
                  </div>

                  {/* Name */}
                  <h3 className="text-white text-sm font-black uppercase tracking-tight leading-tight mb-0">
                    {member.name}
                  </h3>

                  {/* Social buttons — only when expanded */}
                  <div
                    className="flex gap-2 overflow-hidden transition-all duration-400"
                    style={{
                      maxHeight: isActive ? '48px' : '0px',
                      opacity: isActive ? 1 : 0,
                      marginTop: isActive ? '10px' : '0px',
                      transition: 'max-height 0.4s ease, opacity 0.3s ease, margin-top 0.3s ease',
                      transitionDelay: isActive ? '0.15s' : '0s',
                    }}
                  >
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                    >
                      <FaGithub size={11} />
                      GitHub
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold"
                    >
                      <FaLinkedinIn size={11} />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-40 relative overflow-hidden p-8 sm:p-16 rounded-[2rem] sm:rounded-[4rem] border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-slate-900/80 backdrop-blur-3xl text-center shadow-lg dark:shadow-none"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight text-gray-900 dark:text-white">
            ধন্যবাদ আমাদের সাথে থাকার জন্য
          </h2>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed text-base sm:text-lg">
            আমরা একটি স্বপ্ন নিয়ে কাজ করছি—সবাইকে দক্ষ করে গড়ে তোলা।{' '}
            <br className="hidden md:block" />
            আমাদের এই যাত্রায় আপনার অংশগ্রহণ আমাদের মূল শক্তি।
          </p>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-8 md:mt-10 inline-block w-12 h-12 rounded-full bg-gradient-to-b from-purple-500 to-pink-600 blur-[20px] opacity-40"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default About;