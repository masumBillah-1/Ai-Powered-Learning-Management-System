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
  
 
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
 
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    
    
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const subLinks = [
    { label: "All Post", href: "/help/allpost", icon: <LuFileText /> },
    { label: "Roadmap", href: "/help/roadmap", icon: <LuMap /> },
    { label: "Release log", href: "/help/release", icon: <LuRocket /> },
    { label: "Feature Requests", href: "/help/feature", icon: <LuListTodo /> },
  ];

  return (
 
    <header className=" text-base-content mx-auto max-w-7xl select-none border-b border-base-300 transition-colors duration-300">
      
      {/* --- TOP SECTION --- */}
      <div className="flex   items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <h1 className="text-[22px] font-black tracking-tight text-primary">
            HELP DESK
          </h1>
          <span className="text-[10px] opacity-60 font-medium">
         Smartlms-Pro
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium opacity-70 cursor-pointer hover:opacity-100 transition-opacity">
           <Link  href="/dashboard/my-classes">My Classes</Link> 
          </span>

          <div className="flex items-center gap-5">
            {/* Notification Icon */}
            <div className="indicator cursor-pointer">
              <span className="indicator-item badge badge-error badge-xs text-white border-none font-bold">
                7
              </span>
              <FiBell className="text-xl opacity-70" />
            </div>

            <FiBookmark className="text-xl opacity-70 cursor-pointer" />

            {/* Profile Section */}
            <div className="flex items-center gap-2 pl-2 border-l border-base-300">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-base-300">
                  <Image
                    src="https://i.pravatar.cc/150?u=sakib"
                    alt="Sakib"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-sm font-semibold">Hi, Sakib</span>
            </div>

            {/* --- TOGGLE BUTTON (DaisyUI Swap) --- */}
            <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm">
              <input 
                type="checkbox" 
                onChange={toggleTheme} 
                checked={theme === "light"} 
              />
             
              <FiSun className="swap-on text-orange-500 text-xl" />
              {/* Moon Icon */}
              <FiMoon className="swap-off text-purple-500 text-xl" />
            </label>

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
                  ? "border-secondary text-secondary"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <span className={`text-lg ${isActive ? "text-secondary" : "opacity-70 group-hover:opacity-100"}`}>
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