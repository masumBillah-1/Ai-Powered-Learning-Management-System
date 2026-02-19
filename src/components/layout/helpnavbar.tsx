"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell, FiBookmark, FiSun, FiMoon } from "react-icons/fi";
import {
  LuFileText,
  LuMap,
  LuRocket,
  LuListTodo
} from "react-icons/lu";

const HelpNavbar = () => {
  const pathname = usePathname();
  
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // 3. Effect to handle Theme Switching
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const subLinks = [
    { label: "All Post", href: "/help", icon: <LuFileText /> },
    { label: "Roadmap", href: "/help/roadmap", icon: <LuMap /> },
    { label: "Release log", href: "/help/release", icon: <LuRocket /> },
    { label: "Feature Requests", href: "/help/feature", icon: <LuListTodo /> },
  ];

  return (
    <header className="w-full bg-white dark:bg-[#05010d] text-black dark:text-white select-none border-b border-gray-200 dark:border-gray-900 transition-colors duration-300">
      
      {/* --- TOP SECTION --- */}
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <h1 className="text-[22px] font-black tracking-tight text-[#A855F7]">
            HELP DESK
          </h1>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            Brain Boost
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
            My Classes
          </span>

          <div className="flex items-center gap-5">
            {/* Notification Icon */}
            <div className="relative cursor-pointer">
              <FiBell className="text-xl text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                7
              </span>
            </div>

            <FiBookmark className="text-xl text-gray-600 dark:text-gray-300 cursor-pointer" />

            {/* Profile Section */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700">
                <Image
                  src="https://i.pravatar.cc/150?u=sakib"
                  alt="Sakib"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-semibold">Hi, Sakib</span>
            </div>

            {/* --- TOGGLE BUTTON --- */}
            <div 
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center w-12 h-6 rounded-full relative cursor-pointer p-1 transition-all duration-300 ${
                darkMode ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <div 
                className={`w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 ${
                  darkMode ? "translate-x-6" : "translate-x-0"
                }`}
              >
                {darkMode ? (
                  <FiMoon className="text-[10px] text-purple-600" />
                ) : (
                  <FiSun className="text-[10px] text-orange-500" />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- NAVIGATION SECTION --- */}
      <nav className="flex items-center gap-10 px-6 mt-2">
        {subLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-all duration-300 group ${
                isActive
                  ? "border-[#D946EF] text-[#D946EF]"
                  : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <span className={`text-lg ${isActive ? "text-[#D946EF]" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}>
                {link.icon}
              </span>
              <span className="text-[15px] font-semibold">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default HelpNavbar;