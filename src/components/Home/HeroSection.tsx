"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import Link from 'next/link';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const phGradient = "bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";
  const phTextGradient = "text-transparent bg-clip-text bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";

  const words = ["Learn", "Like", "Never", "Before"];
  const wordVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.15 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] as any },
    }),
  };

  return (
    <div className="w-full bg-[#faf8ff] dark:bg-[#09080f] transition-colors duration-300 overflow-hidden relative">

      {/* Decorative orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] bg-[#832388]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] bg-[#E3436B]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #832388 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: 0.04,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-16 pt-4 md:pt-6 pb-16 md:pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-12">

          {/* ── LEFT: Headline ── */}
          <div className="w-full lg:w-[52%] space-y-6 text-center lg:text-left order-2 lg:order-1 lg:pt-0">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800"
            >
              <HiSparkles className="text-[#E3436B] animate-pulse text-sm" />
              <span className="text-[10px] font-black text-[#832388] dark:text-purple-300 uppercase tracking-[0.2em]">
                The Next Evolution of Learning
              </span>
            </motion.div>

            {/* MAIN HEADLINE */}
            <div className="space-y-0">

              {/* CSS rotate animation injected */}
              <style>{`
                @keyframes rotateWord {
                  0%  { opacity: 0; transform: translateY(100%); }
                  6%  { opacity: 1; transform: translateY(0); }
                  22% { opacity: 1; transform: translateY(0); }
                  28% { opacity: 0; transform: translateY(-100%); }
                  100%{ opacity: 0; transform: translateY(-100%); }
                }
                .word-rotate-wrap {
                  display: inline-block;
                  vertical-align: bottom;
                  overflow: hidden;
                  position: relative;
                  height: 1.1em;
                  min-width: 320px;
                }
                .word-rotate-wrap span {
                  position: absolute;
                  left: 0;
                  bottom: 0;
                  opacity: 0;
                  animation: rotateWord 9.6s linear infinite;
                  background: linear-gradient(90deg, #832388, #E3436B, #F0772F);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  white-space: nowrap;
                }
                .word-rotate-wrap span:nth-child(1) { animation-delay: 0s; }
                .word-rotate-wrap span:nth-child(2) { animation-delay: 2.4s; }
                .word-rotate-wrap span:nth-child(3) { animation-delay: 4.8s; }
                .word-rotate-wrap span:nth-child(4) { animation-delay: 7.2s; }
              `}</style>

              {/* Row 1 — staggered word reveal */}
              <div className="flex flex-wrap gap-x-[0.25em] justify-center lg:justify-start">
                {words.map((word, i) => (
                  <motion.span
                    key={word}
                    custom={i}
                    variants={wordVariants}
                    initial="hidden"
                    animate={mounted ? "visible" : "hidden"}
                    className="inline-block font-black leading-[1.1] tracking-tight text-[#1a1230] dark:text-white"
                    style={{
                      fontFamily: "'Georgia', 'Times New Roman', serif",
                      fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Row 2 — "Think" + CSS inline rotating word on same line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-end justify-center lg:justify-start"
                style={{ lineHeight: 1.1 }}
              >
                <span
                  className="font-black tracking-tight text-[#1a1230] dark:text-white"
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                    lineHeight: 1.1,
                  }}
                >
                  Think&nbsp;
                </span>
                {/* CSS keyframe rotate — all words cycle inline */}
                <span
                  className="word-rotate-wrap font-black tracking-tight"
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                    lineHeight: 1.1,
                  }}
                >
                  <span>Smarter.</span>
                  <span>Bolder.</span>
                  <span>Bigger.</span>
                  <span>Better.</span>
                </span>
              </motion.div>

              {/* Animated gradient rule */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8, ease: "easeInOut" }}
                style={{ originX: 0 }}
                className="h-[3px] w-44 md:w-64 mx-auto lg:mx-0 rounded-full bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] mt-3"
              />
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-[#4a4a6a] dark:text-gray-400 text-sm md:text-[15px] leading-[1.8] max-w-[480px] mx-auto lg:mx-0 font-medium"
            >
              Don't just study—<strong className="text-[#1a1230] dark:text-white font-bold">evolve.</strong> Our AI-driven ecosystem crafts a personalized path to mastery, ensuring every minute brings you closer to career success.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.5 }}
              className="flex justify-center lg:justify-start pt-1"
            >
              <Link href="/courses">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative flex items-center justify-center gap-3 px-8 py-3.5 ${phGradient} text-white font-bold rounded-full shadow-lg text-sm md:text-base group cursor-pointer overflow-hidden`}
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-white/20 skew-x-12 transition-transform duration-700 ease-in-out" />
                  Start Your Transformation
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 pt-1"
            >
              {["Precision Path", "24/7 AI Mentor"].map((label) => (
                <span key={label} className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300">
                  <FaCheckCircle className="text-[#F0772F] flex-shrink-0" /> {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Video ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[48%] relative group order-1 lg:order-2 lg:mt-0 lg:pt-12"
          >
            <div className="absolute top-2/1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-80 md:h-80 bg-[#E3436B]/20 rounded-full blur-[80px] -z-10 pointer-events-none" />

            <div className="relative rounded-2xl md:rounded-[32px] overflow-hidden border-[6px] md:border-[10px] border-white dark:border-slate-800 shadow-[0_20px_60px_rgba(131,35,136,0.18)] dark:shadow-[0_20px_60px_rgba(227,67,107,0.12)] aspect-video bg-black">
              {!isPlaying ? (
                <div className="absolute inset-0 z-30 cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src="https://img.youtube.com/vi/z58Sh8IndkY/maxresdefault.jpg"
                    alt="Success Story"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-center justify-center group-hover:from-black/60 transition-all duration-500">
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-14 h-14 md:w-20 lg:w-24 ${phGradient} rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30`}
                    >
                      <FaPlay className="text-white text-xl md:text-3xl ml-1 md:ml-2" />
                    </motion.div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full relative z-10"
                  src="https://www.youtube.com/embed/z58Sh8IndkY?autoplay=1"
                  title="Success Roadmap"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </div>

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-2 md:-bottom-5 md:-left-5 bg-white dark:bg-slate-900 p-2.5 md:p-3 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-2.5 z-50"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-lg md:text-xl">🚀</div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-xs md:text-sm leading-tight">Future-Ready</h4>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Smart Curriculum</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;