"use client";
import React from "react";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="flex-shrink-0">
      <Link href="/" className="flex items-center gap-3 group">

        {/* Icon */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-all duration-500" />
          <img
            src="/mortarboard.png"
            alt="CareerCanvas Logo"
            className="relative w-12 h-12 select-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span
              className="text-2xl font-[1000] tracking-tighter transition-colors duration-300 text-gray-900 dark:text-white"
            >
              Career
            </span>
            <span className="text-2xl font-[1000] tracking-tighter bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] bg-clip-text text-transparent">
              Canvas
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">ELEVATE</span>
            <div className="w-1 h-1 rounded-full bg-gradient-to-r from-[#FF0F7B] to-[#F89B29]" />
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">SKILLS</span>
          </div>
        </div>

      </Link>
    </div>
  );
};

export default Logo;