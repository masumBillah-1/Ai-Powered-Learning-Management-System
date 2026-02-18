// "use client";

// import Link from "next/link";

// const Logo = () => {
//   return (
//     <div className="flex-shrink-0">
//             <Link href="/" className="flex items-center gap-3 group">
//               {/* B Logo Container - Exactly like Programming Hero's P */}
//               <div className="relative">
//                 {/* Background Blur Effect */}
//                 <div className="absolute -inset-1 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
                
//                 {/* Main Logo Box with Gradient - Same as PH's style */}
//                 <div className="relative w-[52px] h-[52px] bg-gradient-to-br from-[#FF0F7B] to-[#F89B29] rounded-2xl shadow-xl transform group-hover:scale-105 group-hover:rotate-[5deg] transition-all duration-300 flex items-center justify-center">
//                   {/* Bold 'B' Letter with PH Styling */}
//                   <span className="text-white text-4xl font-black italic transform -rotate-6 drop-shadow-lg" 
//                     style={{ 
//                       fontFamily: "'Poppins', 'Inter', sans-serif",
//                       textShadow: "2px 2px 0 rgba(0,0,0,0.1)"
//                     }}>
//                     B
//                   </span>
                  
//                   {/* Decorative White Dot (PH signature style) */}
//                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-white shadow-lg"></div>
                  
//                   {/* Small Decorative Dot */}
//                   <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full border border-white animate-pulse"></div>
//                 </div>
//               </div>

//               {/* BrainBoost Text with PH Style - Same as your original but enhanced */}
//               <div className="flex flex-col leading-none">
//                 <div className="flex items-center">
//                   <span className="text-2xl font-[1000] tracking-tighter text-[#1a1a1a]">
//                     Brain
//                   </span>
//                   <span className="text-2xl font-[1000] tracking-tighter bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] bg-clip-text text-transparent">
//                     Boost
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1.5 mt-0.5">
//                   <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">ELEVATE</span>
//                   <div className="w-1 h-1 rounded-full bg-gradient-to-r from-[#FF0F7B] to-[#F89B29]"></div>
//                   <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">SKILLS</span>
//                 </div>
//               </div>
//             </Link>
//           </div>
//   );
// };

// export default Logo;

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const Logo = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex-shrink-0">
      <Link href="/" className="flex items-center gap-3 group">
        {/* --- B Logo Container --- */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
          
          <div className="relative w-[52px] h-[52px] bg-gradient-to-br from-[#FF0F7B] to-[#F89B29] rounded-2xl shadow-xl transform group-hover:scale-105 group-hover:rotate-[5deg] transition-all duration-300 flex items-center justify-center">
            <span className="text-white text-4xl font-black italic transform -rotate-6 drop-shadow-lg" 
              style={{ 
                fontFamily: "'Poppins', 'Inter', sans-serif",
                textShadow: "2px 2px 0 rgba(0,0,0,0.1)"
              }}>
              B
            </span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full border border-white animate-pulse"></div>
          </div>
        </div>

        {/* --- BrainBoost Text --- */}
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            {/* Logic Change: Shorasori var(--foreground) use korchi jeta globals.css theke dark mode e white hobe */}
            <span 
              className="text-2xl font-[1000] tracking-tighter transition-colors duration-300"
              style={{ color: "var(--foreground)" }}
            >
              Brain
            </span>
            <span className="text-2xl font-[1000] tracking-tighter bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] bg-clip-text text-transparent">
              Boost
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">ELEVATE</span>
            <div className="w-1 h-1 rounded-full bg-gradient-to-r from-[#FF0F7B] to-[#F89B29]"></div>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">SKILLS</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;