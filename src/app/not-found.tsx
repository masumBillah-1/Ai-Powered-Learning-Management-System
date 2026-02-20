'use client';

import Link from 'next/link';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 leading-none animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
        </div>

        {/* Bangla Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          দুঃখিত! পেজটি খুঁজে পাওয়া যায়নি
        </h2>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          আপনি যে পেজটি খুঁজছেন সেটি মুছে ফেলা হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।
        </p>

        {/* English Message */}
        <p className="text-base text-gray-500 dark:text-gray-400 mb-12">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            <FaHome size={20} />
            হোম পেজে ফিরে যান
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-gray-200 dark:border-gray-700"
          >
            <FaArrowLeft size={20} />
            পূর্ববর্তী পেজ
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-16 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
            <FaSearch />
            দ্রুত লিংক
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link 
              href="/courses" 
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors font-semibold"
            >
              কোর্স সমূহ
            </Link>
            <Link 
              href="/about" 
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors font-semibold"
            >
              আমাদের সম্পর্কে
            </Link>
            <Link 
              href="/contact" 
              className="px-4 py-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors font-semibold"
            >
              যোগাযোগ
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-semibold"
            >
              লগইন
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-gray-400 dark:text-gray-600 text-sm">
          Error Code: 404 | Page Not Found
        </div>
      </div>
    </div>
  );
}
