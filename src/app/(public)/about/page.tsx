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
    <div className="bg-[#020617] text-white min-h-screen py-24 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-16 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-purple-400 font-bold tracking-widest text-sm uppercase mb-3"
          >
            Behind the Scenes
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tighter"
          >
            Meet Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Team_</span>
          </motion.h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mt-6 rounded-full" />
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {team.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col"
            >
              <div className="relative">
                {/* Image Container - Hover effects removed */}
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm">
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-40 z-10" />
                  
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-top relative z-0" 
                  />
                </div>

                {/* Name & Role Section */}
                <div className="mt-8 text-center px-4">
                  <h3 className="text-xl font-black mb-2 tracking-tight">
                    {member.name}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <p className="text-[10px] text-purple-300 font-bold uppercase tracking-[0.15em]">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-32 text-center p-12 rounded-[4rem] bg-gradient-to-b from-slate-900/50 to-transparent border border-white/5"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">ধন্যবাদ আমাদের সাথে থাকার জন্য</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium">
            আমরা একটি স্বপ্ন নিয়ে কাজ করছি—সবাইকে দক্ষ করে গড়ে তোলা। আমাদের এই যাত্রায় আপনার অংশগ্রহণ আমাদের অনুপ্রাণিত করে।
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;