// "use client";
// import React from "react";
// import Link from "next/link";
// import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
// import Logo from "./Logo";

// const Footer = () => {
//   return (
//     <footer className="bg-[#0b1120] text-gray-400 py-16 px-4">
//       <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 px-4 sm:px-6 lg:px-12">

//         {/* Section 1: Brand & Logo */}
//         <div className="space-y-6">
//           <Link href="/" className="flex items-center gap-3">
//              <div
//                 className="w-10 h-10 flex items-center justify-center rounded-xl shadow-lg"
//                 style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}
//               >
//                 <span className="text-white text-xl font-black">B</span>
//               </div>
//             <span className="text-2xl font-bold text-white tracking-tighter">
//               Brain<span style={{ color: "#6710C2" }}>Boost</span>
//             </span>
//           </Link>

//           <p className="text-sm leading-relaxed max-w-xs">
//             Office: Level-4, 34, Awal Centre, Banani, Dhaka <br />
//             Support: web@brainboost.com <br />
//             Helpline: 01322810867 (Available : Sat - Thu, 10:00 AM to 7:00 PM)
//           </p>
//         </div>

//         {/* Section 2: Quick Links */}
//         <div className="space-y-4">
//           <h3 className="text-white font-bold text-lg mb-6">Explore</h3>
//           <ul className="space-y-3 text-sm">
//             <li><Link href="/courses" className="hover:text-white transition">Success Stories</Link></li>
//             <li><Link href="/blog" className="hover:text-white transition">Our Blog</Link></li>
//             <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
//             <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
//           </ul>
//         </div>

//         {/* Section 3: Legal */}
//         <div className="space-y-4">
//           <h3 className="text-white font-bold text-lg mb-6">Policy</h3>
//           <ul className="space-y-3 text-sm">
//             <li><Link href="/refund" className="hover:text-white transition">Refund Policy</Link></li>
//             <li><Link href="/terms" className="hover:text-white transition">Terms and Conditions</Link></li>
//             <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
//           </ul>
//         </div>

//         {/* Section 4: Social & App */}
//         <div className="space-y-6">
//           <h3 className="text-white font-bold text-lg mb-6">Follow Us</h3>
//           <div className="flex gap-4">
//             <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-[#1877F2]
//  transition duration-300">
//               <FaFacebook size={20} className="text-white" />
//             </Link>
//             <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-br from-[#405DE6] via-[#C13584] to-[#FCAF45]
//  transition duration-300">
//               <FaInstagram size={20} className="text-white" />
//             </Link>
//             <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition duration-300">
//               <FaLinkedin size={20} className="text-white" />
//             </Link>
//             <Link href="#" className="p-3 bg-gray-800 rounded-full hover:bg-red-600 transition duration-300">
//               <FaYoutube size={20} className="text-white" />
//             </Link>
//           </div>
//           <div className="pt-4">
//              <p className="text-xs text-gray-500">Copyright © 2026 BrainBoost</p>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Border Gradient */}
//       <div
//         className="mt-12 h-1 w-full opacity-30"
//         style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
//       ></div>
//     </footer>
//   );
// };

// export default Footer;

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
  FaWindows,
} from "react-icons/fa";
import Logo from "./Logo";

const Footer = () => {
  return (
    // Important: We use !important styles via Tailwind for background to override any conflicts
    <footer className="w-full bg-[#F9F5FF] dark:bg-[#0b1120] pt-16 pb-6 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
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
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
                যেকোন জিজ্ঞাসায় ফোন করো
              </p>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
                  <FaPhoneAlt className="text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="font-extrabold text-lg text-gray-800 dark:text-white leading-tight">
                    01322-901105
                  </p>
                  <p className="font-extrabold text-lg text-gray-800 dark:text-white leading-tight">
                    01322-810874
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    (Sat - Thu, 10:00 AM to 7:00 PM)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="lg:pl-10">
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              লিঙ্কসমূহ
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                "About Us",
                "Success Page",
                "Blog",
                "Refund policy",
                "Privacy Policy",
                "Terms and condition",
                "Newsletter",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] dark:hover:text-[#F89B29] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social Media with Dark Mode Icons */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              সোশ্যাল মিডিয়া
            </h4>
            <div className="space-y-4">
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FaFacebook />
                </div>{" "}
                ফেসবুক
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                  <FaInstagram />
                </div>{" "}
                ইন্সটাগ্রাম
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                  <FaYoutube />
                </div>{" "}
                ইউটিউব
              </a>
              <a
                href="#"
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
            <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">
              অ্যাপ ডাউনলোড করো
            </h4>
            <div className="space-y-4">
              <button className="flex items-center gap-3 w-full max-w-[200px] bg-[#1a1a1a] dark:bg-black text-white p-3 rounded-xl hover:opacity-80 transition-all border border-gray-800">
                <FaApple size={28} />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-gray-400">
                    Download on the
                  </p>
                  <p className="text-base font-bold">App Store</p>
                </div>
              </button>

              <button className="flex items-center gap-3 w-full max-w-[200px] bg-[#1a1a1a] dark:bg-black text-white p-3 rounded-xl hover:opacity-80 transition-all border border-gray-800">
                <FaGooglePlay size={22} className="text-green-400" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-gray-400">
                    Get it on
                  </p>
                  <p className="text-base font-bold">Google Play</p>
                </div>
              </button>

              <button className="flex items-center gap-3 w-full max-w-[200px] bg-[#1a1a1a] dark:bg-black text-white p-3 rounded-xl hover:opacity-80 transition-all border border-gray-800">
                <FaWindows size={22} className="text-blue-400" />
                <div className="text-left">
                  <p className="text-[9px] uppercase font-semibold text-gray-400">
                    Download for
                  </p>
                  <p className="text-base font-bold">Microsoft</p>
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
