"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Logo animation শেষ হওয়ার পর Welcome text দেখাও
    const logoTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 1500);

    // সব animation শেষ হওয়ার পর fade out করো
    const completeTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800);
    }, 3500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-white via-purple-50 to-orange-50 dark:from-[#05010D] dark:via-[#120B1E] dark:to-[#1a0f2e] flex items-center justify-center"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-[#FF0F7B] to-[#F89B29] rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-[#832388] to-[#E3436B] rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1.2,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }}
              className="mb-8"
            >
              <div className="relative mx-auto">
                {/* Glow Effect */}
                <motion.div 
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -inset-4 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] rounded-3xl blur-2xl"
                />
                
                {/* Main Logo */}
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="relative w-32 h-32 mx-auto bg-gradient-to-br from-[#FF0F7B] to-[#F89B29] rounded-3xl shadow-2xl flex items-center justify-center"
                >
                  {/* Letter 'S' */}
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-white text-7xl font-black italic transform -rotate-6 drop-shadow-2xl" 
                    style={{ 
                      fontFamily: "'Poppins', 'Inter', sans-serif",
                      textShadow: "4px 4px 0 rgba(0,0,0,0.2)"
                    }}
                  >
                    S
                  </motion.span>
                  
                  {/* Decorative Elements */}
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-4 border-white shadow-xl"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-300 rounded-full border-2 border-white"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Welcome Text Animation */}
            <AnimatePresence>
              {showWelcome && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.h1 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F89B29] bg-clip-text text-transparent"
                  >
                    Welcome
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex items-center justify-center gap-2 mb-6"
                  >
                    <span className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">to</span>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">Smartlms</span>
                      <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] bg-clip-text text-transparent">Pro</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;