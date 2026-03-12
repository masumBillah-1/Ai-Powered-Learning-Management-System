
"use client";
import React from "react";
import Link from "next/link";
import { 
  FaFacebook, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedin, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhoneAlt,
  FaApple,
  FaGooglePlay,
  FaWindows
} from "react-icons/fa";
import Logo from "./Logo";

const footerLinks = [
  { name: "About Us", path: "/about" },
  { name: "Success Page", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "Refund policy", path: "/refound" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms and condition", path: "/terms" },
  { name: "Newsletter", path: "/privacy" },

  // New Link
  { name: "Become an Instructor", path: "/become-instructor" },
];
const Footer = () => {
  return (
    // Important: We use !important styles via Tailwind for background to override any conflicts
    <footer className="w-full bg-[#F9F5FF] dark:bg-[#0b1120] pt-16 pb-6 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: BrainBoost Logo & Contact */}
          <div className="space-y-6">
            <Logo />
            <div className="space-y-4 text-[15px] text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-400" />
                <span>Level-4, 34, Awal Centre, Banani, Dhaka</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <span>web@brainboost.com</span>
              </div>
            </div>

            {/* Support Card - Dark Mode Contrast Fix */}
            <div className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">যেকোন জিজ্ঞাসায় ফোন করো</p>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
                  <FaPhoneAlt className="text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-extrabold text-lg text-gray-800 dark:text-white leading-tight">01322-901105</p>
                  <p className="font-extrabold text-lg text-gray-800 dark:text-white leading-tight">01322-810874</p>
                  <p className="text-[11px] text-gray-500 mt-1">(Sat - Thu, 10:00 AM to 7:00 PM)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="lg:pl-10">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">লিঙ্কসমূহ</h4>
            <ul className="space-y-4 text-sm font-medium">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] dark:hover:text-[#F89B29] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Media with Dark Mode Icons */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">সোশ্যাল মিডিয়া</h4>
            <div className="space-y-4">
              <a
                href="https://www.facebook.com/"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FaFacebook />
                </div>{" "}
                ফেসবুক
              </a>
              <a
                href="https://www.instagram.com/?hl=en"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                  <FaInstagram />
                </div>{" "}
                ইন্সটাগ্রাম
              </a>
              <a
                href="https://www.youtube.com/"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                  <FaYoutube />
                </div>{" "}
                ইউটিউব
              </a>
              <a
                href="https://www.linkedin.com/feed/"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/40 rounded-full text-blue-700 dark:text-blue-300 group-hover:scale-110 transition-transform">
                  <FaLinkedin />
                </div>{" "}
                লিঙ্কডইন
              </a>
            </div>
          </div>

          {/* Column 4: App Download - Pure Dark Style as per Image */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">অ্যাপ ডাউনলোড করো</h4>
            <div className="space-y-4">
              <button className="flex items-center gap-3 w-full max-w-[200px] bg-[#1a1a1a] dark:bg-black text-white p-3 rounded-xl hover:opacity-80 transition-all border border-gray-800">
                <FaApple size={28} />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-gray-400">
                    Download on the
                  </p>
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-base font-bold">App Store</p>
                  </a>
                </div>
              </button>
              
              <button className="flex items-center gap-3 w-full max-w-[200px] bg-[#1a1a1a] dark:bg-black text-white p-3 rounded-xl hover:opacity-80 transition-all border border-gray-800">
                <FaGooglePlay size={22} className="text-green-400" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-gray-400">
                    Get it on
                  </p>
                  <a
                    href="https://play.google.com/store/apps?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-base font-bold">Google Play</p>
                  </a>
                </div>
              </button>

              <button className="flex items-center gap-3 w-full max-w-[200px] bg-[#1a1a1a] dark:bg-black text-white p-3 rounded-xl hover:opacity-80 transition-all border border-gray-800">
                <FaWindows size={22} className="text-blue-400" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-gray-400">
                    Download for
                  </p>
                  <a
                    href="https://apps.microsoft.com/home?hl=en-US&gl=BD"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-base font-bold">Microsoft</p>
                  </a>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end text-[13px] text-gray-500 dark:text-gray-400 font-medium">
          <p>© 2026 BrainBoost. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
