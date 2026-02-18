"use client";
import React from "react";
import { motion } from "framer-motion";

const BootcampBanner = () => {
  return (
    <section className="py-12 px-4 md:px-0">
      <div className="max-w-[1200px] mx-auto bg-[#0c0422] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative">
        
        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-10">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2"
          >
            <p className="text-gray-400 text-lg mb-4 font-medium tracking-wide">
              AI Powered
            </p>
            
            <h1 className="text-white text-4xl md:text-6xl font-bold leading-tight mb-8">
              Complete <span className="bg-gradient-to-r from-[#C81D77] to-[#8B2FF1] bg-clip-text text-transparent">Digital Creator</span> <br />
              Bootcamp Batch 1
            </h1>

            <button className="px-10 py-4 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white text-xl font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-purple-500/20 active:scale-95">
              Enroll Now
            </button>
          </motion.div>

          {/* Right Side: Image with Grid Background */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full md:w-1/2 relative group"
          >
            {/* White card container like the image */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-rotate-1">
              <img 
                src="https://i.ibb.co.com/xqm5NbG6/thalia-tran-d1-Wj9q-U5-C-o-unsplash.jpg" 
                alt="Bootcamp" 
                className="w-full h-auto object-cover"
              />
              
              {/* Overlay elements like icons can be added here */}
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none"></div>
            </div>
          </motion.div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6710C2] blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C81D77] blur-[120px] opacity-20 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default BootcampBanner;