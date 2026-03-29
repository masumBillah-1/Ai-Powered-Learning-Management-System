"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiCompass, FiCode, FiBriefcase, FiArrowRight } from "react-icons/fi";

const StepSection = () => {
  const steps = [
    {
      id: "01",
      icon: <FiUserPlus className="text-2xl" />,
      title: "Join the Bootcamp",
      description:
        "Start your professional journey by enrolling in our comprehensive MERN stack program designed for the future.",
      color: "from-[#832388] to-[#E3436B]",
    },
    {
      id: "02",
      icon: <FiCompass className="text-2xl" />,
      title: "Guided Mentorship",
      description:
        "Receive personalized roadmaps and 1-on-1 support from industry experts to keep you on the right track.",
      color: "from-[#E3436B] to-[#F0772F]",
    },
    {
      id: "03",
      icon: <FiCode className="text-2xl" />,
      title: "Master the Skills",
      description:
        "Build real-world projects, complete rigorous assignments, and finish the curriculum with hands-on expertise.",
      color: "from-[#F0772F] to-[#E3436B]",
    },
    {
      id: "04",
      icon: <FiBriefcase className="text-2xl" />,
      title: "Launch Your Career",
      description:
        "Get direct job placement assistance, portfolio reviews, and interview prep to land your dream role.",
      color: "from-[#832388] to-[#F0772F]",
    },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Protiti card ekta por ekta asbe
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section className="py-20 md:py-32 bg-[#fcfaff] dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header Content */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/30 border border-fuchsia-200 dark:border-fuchsia-800"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#832388] dark:text-fuchsia-300">
              The Path to Mastery
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white leading-tight"
          >
            Your Career Success in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]">4 Simple Phases</span>
          </motion.h2>
        </div>

        {/* Steps Grid with Stagger Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={cardVariants}
              className="relative group"
            >
              {/* Connector Arrow (Desktop Only) with Floating Animation */}
              {index !== steps.length - 1 && (
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="hidden lg:block absolute top-1/2 -right-6 -translate-y-1/2 z-20 text-slate-200 dark:text-slate-800 group-hover:text-[#E3436B] transition-colors"
                >
                  <FiArrowRight className="text-2xl" />
                </motion.div>
              )}

              {/* Step Card */}
              <motion.div
                whileHover={{ y: -15 }} // Hover korle card upore uthbe
                className="h-full relative z-10 p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-[0_20px_50px_rgba(131,35,136,0.1)] transition-all duration-500 overflow-hidden"
              >

                {/* Background ID Blur - Fades in on Hover */}
                <div className="absolute -top-4 -right-4 text-7xl font-black text-slate-50 dark:text-slate-800/50 group-hover:text-[#E3436B]/10 transition-all duration-700 pointer-events-none">
                  {step.id}
                </div>

                {/* Icon Container with 360 Rotation on Hover */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg mb-8`}
                >
                  {step.icon}
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white mb-4 group-hover:text-[#E3436B] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Decorative Line that fills on Hover */}
                <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${step.color} group-hover:w-full transition-all duration-700`} />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons with Spring Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-6 mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-10 py-4 rounded-full bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white font-bold shadow-lg hover:shadow-2xl transition-all cursor-pointer"
          >
            Start Your Transformation
          </motion.button>

          <motion.button
            whileHover={{ backgroundColor: "rgba(227,67,107,0.05)" }}
            className="px-10 py-4 rounded-full border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
          >
            Talk to an Expert
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default StepSection;