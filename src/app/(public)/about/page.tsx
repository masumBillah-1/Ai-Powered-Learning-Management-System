"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const About = () => {
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
    <div className="bg-[#020617] text-white min-h-screen py-24 relative overflow-hidden">
      
      {/* Dynamic Background Blobs */}
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

      <div className="container mx-auto px-6 lg:px-16 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 font-bold tracking-[0.3em] text-xs uppercase">
              Innovation & Passion
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mt-8 mb-6"
          >
            Meet the <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">Visionaries_</span>
          </motion.h1>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "120px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full" 
          />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
          {team.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Card Decoration */}
              <div className="absolute -inset-2 bg-gradient-to-b from-purple-500/20 to-blue-500/20 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
              
              <div className="relative">
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-slate-900 shadow-2xl transition-all duration-500 group-hover:border-white/20">
                  
                  {/* Subtle Grain Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                  {/* Glass Hover UI */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 z-20 flex flex-col items-center justify-center gap-6">
                    <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-[-10px]">Follow on</p>
                    <div className="flex gap-4">
                      <motion.a 
                        href={member.github} 
                        target="_blank" 
                        whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}
                        className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl transition-all shadow-xl"
                      >
                        <FaGithub />
                      </motion.a>
                      <motion.a 
                        href={member.linkedin} 
                        target="_blank" 
                        whileHover={{ scale: 1.1, backgroundColor: "#0077b5", color: "#fff" }}
                        className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl transition-all shadow-xl"
                      >
                        <FaLinkedinIn />
                      </motion.a>
                    </div>
                  </div>
                  
                  {/* Base Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 z-10" />
                  
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
                  />
                </div>

                {/* Info Section */}
                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-purple-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="mt-3 relative inline-block">
                    <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative px-5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] text-purple-300 font-black uppercase tracking-[0.2em]">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA - More Cinematic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 relative overflow-hidden p-16 rounded-[4rem] border border-white/5 bg-gradient-to-br from-slate-900/80 to-transparent backdrop-blur-3xl text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">ধন্যবাদ আমাদের সাথে থাকার জন্য</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed text-lg">
            আমরা একটি স্বপ্ন নিয়ে কাজ করছি—সবাইকে দক্ষ করে গড়ে তোলা। <br className="hidden md:block" />
            আমাদের এই যাত্রায় আপনার অংশগ্রহণ আমাদের মূল শক্তি।
          </p>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mt-10 inline-block w-12 h-12 rounded-full bg-gradient-to-b from-purple-500 to-pink-600 blur-[20px] opacity-40"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default About;


