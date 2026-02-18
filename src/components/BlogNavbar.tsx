"use client";
import React from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import Logo from "./layout/Logo";


const BlogNavbar = () => {
  return (
    <nav className="bg-[#fdf2ff] py-4 border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Logo />

        {/* Middle: Links */}
        <div className="hidden md:flex items-center space-x-8 font-bold text-gray-700">
          <Link href="/" className="text-[#a123cc] hover:text-purple-800">Home</Link>
          <Link href="#" className="hover:text-[#a123cc]">PH Books</Link>
          <Link href="#" className="hover:text-[#a123cc]">Courses ▾</Link>
          <Link href="#" className="hover:text-[#a123cc]">Blogs ▾</Link>
        </div>

        {/* Right: Search Bar */}
        <div className="relative max-w-[250px] w-full hidden sm:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white border border-gray-200 py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
          <FaSearch className="absolute right-3 top-3 text-blue-400" />
        </div>
      </div>
    </nav>
  );
};

export default BlogNavbar;