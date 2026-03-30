"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBell, FiBookmark, FiSun, FiMoon } from "react-icons/fi";
import { LuFileText, LuMap, LuRocket, LuListTodo } from "react-icons/lu";

// ✅ Navbar.tsx এর মতোই একই pattern
interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  role: string;
}

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

const HelpNavbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    // ✅ localStorage থেকে user নেওয়া — Navbar.tsx এর মতোই
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  // ✅ প্রথম নাম — "Sakib Al Hasan" → "Sakib"
  const firstName = user?.name?.split(" ")[0] || "Guest";
  const firstLetter = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";

  const subLinks = [
    { label: "All Post", href: "/helpdesk/allpost", icon: <LuFileText /> },
    { label: "Roadmap", href: "/helpdesk/roadmap", icon: <LuMap /> },
    { label: "Release log", href: "/helpdesk/release", icon: <LuRocket /> },
    { label: "Feature Requests", href: "/helpdesk/feature", icon: <LuListTodo /> },
  ];

  return (
    <header className="text-base-content mx-auto max-w-7xl select-none border-b border-base-300 transition-colors duration-300">

      {/* ── Top ── */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col leading-none">
          <h1 className="text-[22px] font-black tracking-tight text-primary">HELP DESK</h1>
          <span className="text-[10px] opacity-60 font-medium">Smartlms-Pro</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">
            <Link href={
              user?.role === "instructor"
                ? "/dashboard/instructor/courses"
                : user?.role === "admin"
                  ? "/dashboard/admin/courses"
                  : "/dashboard/student/courses"
            }>
              {user?.role === "instructor" ? "My Courses" : user?.role === "admin" ? "All Courses" : "My Classes"}
            </Link>
          </span>

          <div className="flex items-center gap-5">
            <div className="indicator cursor-pointer">
              <span className="indicator-item badge badge-error badge-xs text-white border-none font-bold">7</span>
              <FiBell className="text-xl opacity-70" />
            </div>
            <FiBookmark className="text-xl opacity-70 cursor-pointer" />

            {/* ✅ localStorage user — Navbar.tsx এর মতোই */}
            <div className="flex items-center gap-2 pl-2 border-l border-base-300">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#6710C2] flex-shrink-0">
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-white text-sm bg-gradient-to-br from-[#832388] to-[#F0772F]">
                    {firstLetter}
                  </div>
                )}
              </div>
              {/* ✅ "Hi, Sakib" */}
              <span className="text-sm font-semibold">Hi, {firstName}</span>
            </div>

            {/* Theme toggle */}
            <label className="swap swap-rotate btn btn-ghost btn-circle btn-sm">
              <input
                type="checkbox"
                onChange={toggleTheme}
                checked={theme === "dark"}
              />
              <FiSun className="swap-on  text-yellow-500 text-xl" />
              <FiMoon className="swap-off text-purple-500 text-xl" />
            </label>
          </div>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <nav className="flex items-center gap-10 px-6 mt-2">
        {subLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-all duration-300 group ${isActive
                ? "border-secondary text-secondary"
                : "border-transparent opacity-60 hover:opacity-100"
                }`}
            >
              <span className={`text-lg ${isActive ? "text-secondary" : "opacity-70 group-hover:opacity-100"}`}>
                {link.icon}
              </span>
              <span className="text-[15px] font-semibold">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default HelpNavbar;