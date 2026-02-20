"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronCircleDown } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FullFAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const allFaqs = [
    { 
      q: "What skills will I learn in this masterclass?", 
      a: "Our curriculum covers a comprehensive journey through Web Development (Next.js & MERN Stack), Graphics Design (UI/UX & Branding), and Digital Marketing (Meta Ads, SEO & Content Strategy)." 
    },
    { 
      q: "Can I transition from one track to another?", 
      a: "Yes! While we recommend mastering one skill at a time, our modular learning system allows you to understand how Design, Development, and Marketing work together to build a successful business." 
    },
    { 
      q: "Do I need expensive software for Graphics Design?", 
      a: "No. While we teach professional tools like Adobe Suite and Figma, we also introduce high-quality free alternatives to help you get started without any extra cost." 
    },
    { 
      q: "How does the Digital Marketing module help my career?", 
      a: "We focus on result-driven marketing. You will learn how to run profitable Facebook/Google ads, optimize websites for search engines (SEO), and use AI tools for automated marketing." 
    },
    { 
      q: "Will I work on real-world projects?", 
      a: "Absolutely. You will build a professional portfolio featuring 5+ real-world projects, including e-commerce platforms, branding identity sets, and marketing campaign case studies." 
    },
    { 
      q: "What kind of support can I expect when I'm stuck?", 
      a: "We offer 24/7 dedicated technical support through our Discord community and live Zoom sessions. Our mentors are always ready to debug your code or review your designs." 
    },
    { 
      q: "Is this course suitable for complete beginners?", 
      a: "Yes. We designed this course to take you from absolute zero to a job-ready professional. No prior experience in coding or design is required." 
    },
    { 
      q: "Do you provide job placement assistance?", 
      a: "Yes. Our Job Placement Cell helps you with CV optimization, portfolio reviews, and connects you with top local and international tech companies upon successful course completion." 
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#C81D77]/30">
      <Navbar/>
      {/* Background Glow Effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6710C2] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#C81D77] blur-[150px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-[950px] mx-auto pt-24 pb-32 px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight leading-tight">
            Frequently Asked <br />
            <span style={{ 
              background: "linear-gradient(90deg, #832388, #E3436B, #F0772F)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>Questions_</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* FAQ List Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-[#0f0f15]/80 backdrop-blur-xl border border-gray-800 rounded-[40px] p-2 md:p-8 shadow-2xl"
        >
          <div className="space-y-3">
            {allFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`transition-all duration-300 rounded-[24px] border border-transparent ${
                  openIndex === index ? "bg-white/5 border-gray-800" : "hover:bg-white/5"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 md:p-7 text-left outline-none"
                >
                  <span className={`text-base md:text-xl font-bold transition-colors ${
                    openIndex === index ? "text-white" : "text-gray-400"
                  }`}>
                    {faq.q}
                  </span>
                  <span className={`${openIndex === index ? "text-[#E3436B] rotate-180" : "text-gray-600"} transition-all duration-300`}>
                    <FaChevronCircleDown size={28}/>
                  </span>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-7 pb-8 text-gray-400 text-lg leading-relaxed">
                        <div className="h-[1px] bg-gradient-to-r from-gray-800 via-gray-700 to-transparent mb-6 w-full"></div>
                        <p className="max-w-[800px]">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 font-medium">
            Still have questions? <span className="text-[#E3436B] cursor-pointer hover:underline">Contact our support team</span>
          </p>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default FullFAQPage;