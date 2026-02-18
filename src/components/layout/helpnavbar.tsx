"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell, FiBookmark } from "react-icons/fi";
import {
  LuFileText,
  LuMap,
  LuRocket,
  LuListTodo
} from "react-icons/lu";

const HelpNavbar: React.FC = () => {
  const pathname = usePathname();

  const subLinks = [
    { label: "All Post", href: "/help", icon: <LuFileText /> },
    { label: "Roadmap", href: "/help/roadmap", icon: <LuMap /> },
    { label: "Release log", href: "/help/release-log", icon: <LuRocket /> },
    { label: "Feature Requests", href: "/help/requests", icon: <LuListTodo /> },
  ];

  return (
    <header className="w-full bg-[#05010d] text-white select-none border-b border-gray-900">
      {/* --- TOP SECTION (Logo & Profile) --- */}
      <div className="flex items-center justify-between px-6 py-4">

        {/* Logo Area */}
        <div className="flex flex-col leading-none">
          <h1 className="text-[22px] font-black tracking-tight text-[#A855F7]">
            HELP DESK
          </h1>
          <span className="text-[10px] text-gray-400 font-medium">
            Brain Boost
          </span>
        </div>

        {/* Right Side actions */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-300 cursor-pointer hover:text-white transition-colors">
            My Classes
          </span>

          <div className="flex items-center gap-5">
            {/* Notification */}
            <div className="relative cursor-pointer">
              <FiBell className="text-xl text-gray-300" />
              <span className="absolute -top-2 -right-2 bg-[#EF4444] text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                7
              </span>
            </div>

            <FiBookmark className="text-xl text-gray-300 cursor-pointer" />

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700">
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

            {/* Dark Mode Toggle Switch (Image style) */}
            <div className="flex items-center bg-gray-700 w-11 h-6 rounded-full relative cursor-pointer p-1">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 flex items-center justify-center shadow-sm">
                <span className="text-[8px] text-black">☀️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION (Sub-navigation) --- */}
      <nav className="flex items-center gap-10 px-6 mt-2">
        {subLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-all duration-300 group ${isActive
                  ? "border-[#D946EF] text-[#D946EF]"
                  : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
            >
              <span className={`text-lg ${isActive ? "text-[#D946EF]" : "text-gray-500 group-hover:text-gray-300"}`}>
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