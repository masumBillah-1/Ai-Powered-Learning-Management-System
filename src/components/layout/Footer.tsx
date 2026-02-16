"use client";
import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] text-gray-400 py-16 px-4">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 px-4 sm:px-6 lg:px-12">
        
        {/* Section 1: Brand & Logo */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3">
             <div 
                className="w-10 h-10 flex items-center justify-center rounded-xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}
              >
                <span className="text-white text-xl font-black">B</span>
              </div>
            <span className="text-2xl font-bold text-white tracking-tighter">
              Brain<span style={{ color: "#6710C2" }}>Boost</span>
            </span>
          </Link>
         
          <p className="text-sm leading-relaxed max-w-xs">
            Office: Level-4, 34, Awal Centre, Banani, Dhaka <br />
            Support: web@brainboost.com <br />
            Helpline: 01322810867 (Available : Sat - Thu, 10:00 AM to 7:00 PM)
          </p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-6">Explore</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/courses" className="hover:text-white transition">Success Stories</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Our Blog</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Section 3: Legal */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-lg mb-6">Policy</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/refund" className="hover:text-white transition">Refund Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">Terms and Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Section 4: Social & App */}
        <div className="space-y-6">
          <h3 className="text-white font-bold text-lg mb-6">Follow Us</h3>
          <div className="flex gap-4">
            <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-[#1877F2]
 transition duration-300">
              <FaFacebook size={20} className="text-white" />
            </Link>
            <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-br from-[#405DE6] via-[#C13584] to-[#FCAF45]
 transition duration-300">
              <FaInstagram size={20} className="text-white" />
            </Link>
            <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition duration-300">
              <FaLinkedin size={20} className="text-white" />
            </Link>
            <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-red-600 transition duration-300">
              <FaYoutube size={20} className="text-white" />
            </Link>
          </div>
          <div className="pt-4">
             <p className="text-xs text-gray-500">Copyright © 2026 BrainBoost</p>
          </div>
        </div>
      </div>

      {/* Bottom Border Gradient */}
      <div 
        className="mt-12 h-1 w-full opacity-30"
        style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
      ></div>
    </footer>
  );
};

export default Footer;