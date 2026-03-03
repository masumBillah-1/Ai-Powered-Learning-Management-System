// "use client";
// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Search, Bell, MessageSquare, 
//   Menu, ChevronDown, Settings, 
//   LogOut, User, Moon, Sun 
// } from 'lucide-react';

// const DashboardNavbar = () => {
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

//   return (
//     <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-3">
//       <div className="flex items-center justify-between gap-4">
        
//         {/* --- Left: Search Bar --- */}
//         <div className="flex-1 max-w-md hidden md:block">
//           <div className="relative group">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search anything..." 
//               className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium"
//             />
//           </div>
//         </div>

//         {/* --- Mobile Menu Icon --- */}
//         <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
//           <Menu size={24} />
//         </button>

//         {/* --- Right: Actions & Profile --- */}
//         <div className="flex items-center gap-2 md:gap-4">
          
//           {/* Theme Toggle (Optional) */}
//           <button className="p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
//             <Moon size={20} />
//           </button>

//           {/* Messages */}
//           <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
//             <MessageSquare size={20} />
//             <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
//           </button>

//           {/* Notifications Dropdown */}
//           <div className="relative">
//             <button 
//               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
//               className="relative p-2.5 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
//             >
//               <Bell size={20} />
//               <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-600 text-[10px] text-white font-black flex items-center justify-center rounded-full border-2 border-white">
//                 3
//               </span>
//             </button>

//             {/* Notification Dropdown Content */}
//             <AnimatePresence>
//               {isNotificationsOpen && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-4 overflow-hidden"
//                 >
//                   <div className="flex justify-between items-center mb-4">
//                     <h4 className="font-black text-slate-800 dark:text-white">Notifications</h4>
//                     <span className="text-[10px] font-bold text-indigo-600 cursor-pointer">Mark all as read</span>
//                   </div>
//                   <div className="space-y-3">
//                     {[1, 2].map((i) => (
//                       <div key={i} className="flex gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
//                         <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
//                           <User size={18} />
//                         </div>
//                         <div>
//                           <p className="text-xs font-bold text-slate-700">New student enrolled in your course!</p>
//                           <p className="text-[10px] text-slate-400 mt-0.5">2 mins ago</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Vertical Divider */}
//           <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800 mx-1"></div>

//           {/* Profile Dropdown */}
//           <div className="relative">
//             <button 
//               onClick={() => setIsProfileOpen(!isProfileOpen)}
//               className="flex items-center gap-3 pl-1 pr-2 py-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
//             >
//               <img 
//                 src="https://i.pravatar.cc/150?u=instructor" 
//                 alt="Admin" 
//                 className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-sm"
//               />
//               <div className="hidden lg:block text-left">
//                 <p className="text-xs font-black text-slate-800 dark:text-white leading-none">Eugene Andre</p>
//                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Instructor</p>
//               </div>
//               <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {/* Profile Dropdown Content */}
//             <AnimatePresence>
//               {isProfileOpen && (
//                 <motion.div 
//                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                   className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl p-2"
//                 >
//                   <div className="p-3 border-b border-slate-50 dark:border-slate-800 mb-1">
//                     <p className="text-xs font-bold text-slate-400">Signed in as</p>
//                     <p className="text-sm font-black text-slate-800 dark:text-white truncate">eugene.andre@example.com</p>
//                   </div>
                  
//                   <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
//                     <User size={16} /> My Profile
//                   </button>
//                   <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
//                     <Settings size={16} /> Account Settings
//                   </button>
                  
//                   <div className="h-[1px] bg-slate-50 dark:bg-slate-800 my-1 mx-2"></div>
                  
//                   <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
//                     <LogOut size={16} /> Sign Out
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// };

// export default DashboardNavbar;

"use client";
import { useState, useEffect, useRef } from "react";
import { 
  FaSun, FaMoon, FaBell, FaSearch, FaChevronDown, 
  FaUser, FaSignOutAlt, FaThLarge 
} from "react-icons/fa";
import Link from "next/link";

const DashboardNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 1. Initial Theme Load (Apnar logic onujayi)
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  // 2. Theme apply korar function
  const applyTheme = (currentTheme: string) => {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 3. Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="w-full bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        
        {/* --- Left: Search Bar --- */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search dashboard..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        </div>

        {/* --- Right Actions --- */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* THEME TOGGLE (Same as your Main Navbar) */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-purple-600 dark:text-yellow-400 hover:scale-110 transition-all border border-transparent dark:border-gray-700"
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* Notifications */}
          <button className="relative p-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <FaBell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a]"></span>
          </button>

          <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-1"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center text-white font-bold shadow-sm">
                A
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-xs font-bold text-gray-800 dark:text-white">Admin User</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase">Instructor</p>
              </div>
              <FaChevronDown size={12} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#161d2f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <FaUser className="text-indigo-500" /> My Profile
                </Link>
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <FaThLarge className="text-indigo-500" /> Back to Home
                </Link>
                <div className="h-[1px] bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;