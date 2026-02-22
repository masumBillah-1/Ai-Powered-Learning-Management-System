"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { FaSearch } from "react-icons/fa";
import Logo from "./layout/Logo";


const BlogNavbar = () => {
  const pathname = usePathname(); 


  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return isActive 
      ? "text-[#a123cc] font-bold" 
      : "text-gray-700 hover:text-[#a123cc] transition-colors font-bold"; 
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses", hasDropdown: true },
    { name: "Blogs", path: "/blog", hasDropdown: true },
  ];

  return (
    <nav className="bg-[#fdf2ff] py-4 border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Logo />

        {/* Middle: Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path} 
              className={getLinkStyle(link.path)}
            >
              {link.name} {link.hasDropdown && "▾"}
            </Link>
          ))}
        </div>

        {/* Right: Search Bar */}
        <div className="relative max-w-[250px] w-full hidden sm:block">
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white border border-gray-200 py-2 px-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400 text-gray-700"
          />
          <FaSearch className="absolute right-3 top-3 text-blue-400" />
        </div>
      </div>
    </nav>
  );
};

export default BlogNavbar;