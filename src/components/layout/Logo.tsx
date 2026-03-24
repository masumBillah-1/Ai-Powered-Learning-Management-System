"use client";
import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "default";
}

const Logo = ({ size = "default" }: LogoProps) => {
  const isSm = size === "sm";

  return (
    <div className="flex-shrink-0">
      <Link href="/" className="flex items-center gap-2 group no-underline">

        {/* Icon */}
        <div className="relative flex-shrink-0">
          <img
            src="/mortarboard.png"
            alt="CareerCanvas Logo"
            className={`relative select-none group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ${isSm ? "w-9 h-9" : "w-12 h-12"}`}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col leading-none min-w-0">
          <div className="flex items-center">
            <span className={`font-[1000] tracking-tighter text-gray-900 dark:text-white transition-colors duration-300 ${isSm ? "text-[18px]" : "text-2xl"}`}>
              Career
            </span>
            <span className={`font-[1000] tracking-tighter bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] bg-clip-text text-transparent ${isSm ? "text-[18px]" : "text-2xl"}`}>
              Canvas
            </span>
          </div>

          {!isSm && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">ELEVATE</span>
              <div className="w-1 h-1 rounded-full bg-gradient-to-r from-[#FF0F7B] to-[#F89B29]" />
              <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">SKILLS</span>
            </div>
          )}
        </div>

      </Link>
    </div>
  );
};

export default Logo;