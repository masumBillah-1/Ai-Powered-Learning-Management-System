"use client";

import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const team = [
    { name: "Akhi Akter", role: "Chief Executive Officer (CEO)", image: "https://i.ibb.co.com/qFkzk520/Chat-GPT-Image-Dec-17-2025-05-24-43-PM.png" },
    { name: "Juma Islam", role: "Chief Product Officer (CPO)", image: "https://i.ibb.co.com/krjgJw0/saree-removebg-preview.png" },
    { name: "Sayma Ahmed Shimu", role: "Chief Operating Officer (COO)", image: "https://i.ibb.co.com/nND6Jbrz/mine-removebg-preview.png" },
    { name: "Sakib Al Hasan", role: "Lead Developer", image: "https://i.ibb.co.com/RpFQKWTh/473419070-1296272228367678-2831504883843112837-n.jpg" },
    { name: "Bayjid Mia", role: "Software Engineer", image: "https://i.ibb.co.com/8LdmVScp/1000072045-removebg-preview-1.png" },
    { name: "Masum Billah", role: "UI/UX Designer", image: "https://i.ibb.co.com/5hXmNFCm/484624221-2525246021156921-5746599839737274879-n.jpg" },
    { name: "Tanvir Hossain", role: "App Developer", image: "https://i.ibb.co/xL7L3z0/rakib.png" },
    { name: "Nabila Islam", role: "Content Manager", image: "https://i.ibb.co/yYyH6m0/anika.png" },
  ];

  return (
    <div className="bg-[#0b1120] text-white min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-16 max-w-7xl relative">
        
        {/* Header - Matching image_2f7ccc.jpg */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-medium tracking-tight"
          >
            Meet Our Team_
          </motion.h1>
        </div>

        {/* Team Grid - 4 Columns on Large Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {team.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.1 }}
              className="flex flex-col items-center group"
            >
              {/* Shield Shape Image Card */}
              <div className="relative w-full aspect-[4/5] mb-6">
                <div className="absolute inset-0 bg-slate-800/50 rounded-[2.5rem] overflow-hidden border border-white/5 transition-all group-hover:border-white/20">
                  
                  {/* Purple Ribbon/Background Shape */}
                  <div className="absolute top-1/4 -left-4 w-20 h-40 bg-[#4c1d95]/40 -rotate-12 z-0 group-hover:bg-[#4c1d95]/60 transition-colors" />
                  
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-top relative z-10 grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Info Area */}
              <div className="text-center">
                <h3 className="text-lg lg:text-xl font-bold mb-1 tracking-wide transition-colors group-hover:text-purple-400">
                  {member.name}
                </h3>
                <p className="text-[10px] lg:text-xs text-slate-500 font-black tracking-[0.2em]">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#832388]/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      </div>
    </div>
  );
};

export default About;