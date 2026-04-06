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
          height: 1.15em;
          min-width: 160px;
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

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .btn-shimmer:hover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shimmer 0.7s ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-card { animation: float 4s ease-in-out infinite; }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(227, 67, 107, 0.4); }
          70% { box-shadow: 0 0 0 14px rgba(227, 67, 107, 0); }
          100% { box-shadow: 0 0 0 0 rgba(227, 67, 107, 0); }
        }
        .play-btn { animation: pulse-ring 2s ease-out infinite; }
      `}</style>

      {/* Decorative orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] bg-[#832388]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] bg-[#E3436B]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F0772F]/5 rounded-full blur-[140px] pointer-events-none hidden lg:block" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #832388 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: 0.04,
        }}
      />

      <div className="container mx-auto px-5 sm:px-8 lg:px-16 pt-8 sm:pt-10 lg:pt-6 pb-16 md:pb-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12">

          {/* ── RIGHT: Video — mobile এ আগে দেখাবে ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[48%] relative order-1 lg:order-2 lg:pt-12"
          >
            {/* Glow behind video */}
            <div className="absolute inset-0 -z-10 rounded-2xl md:rounded-[32px] bg-gradient-to-br from-[#832388]/20 via-[#E3436B]/15 to-[#F0772F]/20 blur-2xl scale-110" />

            {/* Video frame */}
            <div className="relative rounded-2xl md:rounded-[28px] overflow-hidden border-[5px] sm:border-[8px] border-white dark:border-slate-800 shadow-[0_16px_48px_rgba(131,35,136,0.2)] dark:shadow-[0_16px_48px_rgba(227,67,107,0.15)] aspect-video bg-black group">
              {!isPlaying ? (
                <div className="absolute inset-0 z-30 cursor-pointer" onClick={() => setIsPlaying(true)}>
                  <img
                    src="https://img.youtube.com/vi/z58Sh8IndkY/maxresdefault.jpg"
                    alt="Success Story"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`play-btn w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${phGradient} rounded-full flex items-center justify-center ring-4 ring-white/30`}>
                      <FaPlay className="text-white text-lg sm:text-xl md:text-2xl ml-1" />
                    </div>
                  </div>

                  {/* Watch label */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      Watch Success Story
                    </span>
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

            {/* Floating card — bottom left */}
            <div className="float-card absolute -bottom-4 -left-2 sm:-bottom-5 sm:-left-4 bg-white dark:bg-slate-900 p-2.5 sm:p-3 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 flex items-center gap-2.5 z-50">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-base sm:text-lg">🚀</div>
              <div>
                <h4 className="font-black text-slate-800 dark:text-white text-xs sm:text-sm leading-tight">Future-Ready</h4>
                <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Smart Curriculum</p>
              </div>
            </div>

            {/* Floating stat — top right */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-50"
            >
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Learners</p>
              <p className="text-sm sm:text-base font-black text-slate-800 dark:text-white">12,000+</p>
            </motion.div>
          </motion.div>

          {/* ── LEFT: Headline ── */}
          <div className="w-full lg:w-[52%] space-y-5 sm:space-y-6 text-center lg:text-left order-2 lg:order-1 lg:pt-4">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800"
            >
              <HiSparkles className="text-[#E3436B] animate-pulse text-sm" />
              <span className="text-[10px] font-black text-[#832388] dark:text-purple-300 uppercase tracking-[0.18em]">
                The Next Evolution of Learning
              </span>
            </motion.div>

            {/* MAIN HEADLINE */}
            <div className="space-y-1">
              {/* Row 1 */}
              <div className="flex flex-wrap gap-x-[0.22em] justify-center lg:justify-start overflow-hidden">
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
                      fontSize: "clamp(1.9rem, 6vw, 3.8rem)",
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              {/* Row 2 — Think + rotating word */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-end justify-center lg:justify-start flex-wrap"
                style={{ lineHeight: 1.1 }}
              >
                <span
                  className="font-black tracking-tight text-[#1a1230] dark:text-white"
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "clamp(1.9rem, 6vw, 3.8rem)",
                    lineHeight: 1.1,
                  }}
                >
                  Think&nbsp;
                </span>
                <span
                  className="word-rotate-wrap font-black tracking-tight"
                  style={{
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontSize: "clamp(1.9rem, 6vw, 3.8rem)",
                    lineHeight: 1.1,
                  }}
                >
                  <span>Smarter.</span>
                  <span>Bolder.</span>
                  <span>Bigger.</span>
                  <span>Better.</span>
                </span>
              </motion.div>

              {/* Gradient rule */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8, ease: "easeInOut" }}
                style={{ originX: 0 }}
                className="h-[3px] w-36 sm:w-52 md:w-64 mx-auto lg:mx-0 rounded-full bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] mt-3"
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
  className="flex flex-row gap-2 justify-center lg:justify-start pt-1"
>
  <Link href="/courses">
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`btn-shimmer relative flex items-center justify-center gap-2 px-4 py-2.5 sm:px-7 sm:py-3.5 ${phGradient} text-white font-bold rounded-full shadow-lg text-xs sm:text-base group cursor-pointer overflow-hidden`}
    >
      Start Your Transformation
      <FaArrowRight className="text-[10px] sm:text-xs group-hover:translate-x-1 transition-transform" />
    </motion.button>
  </Link>

  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full border-2 border-[#832388]/30 dark:border-purple-700/50 text-[#832388] dark:text-purple-300 font-bold text-xs sm:text-sm bg-white/60 dark:bg-white/5 backdrop-blur-sm"
  >
    Explore Courses
  </motion.button>
</motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 pt-1"
            >
              {["Precision Path", "24/7 AI Mentor", "Career Focused"].map((label) => (
                <span key={label} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
                  <FaCheckCircle className="text-[#F0772F] flex-shrink-0 text-sm" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Mobile social proof strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="flex items-center justify-center lg:justify-start gap-3 pt-1 lg:hidden"
            >
              <div className="flex -space-x-2">
                {["🧑‍💻", "👩‍🎓", "👨‍💼", "👩‍💻"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 border-2 border-white dark:border-slate-900 flex items-center justify-center text-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="text-[#E3436B] font-black">12,000+</span> learners already enrolled
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;