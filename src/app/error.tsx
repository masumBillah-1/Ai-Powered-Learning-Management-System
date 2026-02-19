'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FaHome, FaRedo, FaExclamationTriangle } from 'react-icons/fa';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            <FaExclamationTriangle className="text-[120px] text-red-500 dark:text-red-400 animate-bounce" />
            <div className="absolute inset-0 blur-3xl opacity-30 bg-red-500"></div>
          </div>
        </div>

        {/* Bangla Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          ওহো! কিছু একটা ভুল হয়ে গেছে
        </h2>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-4">
          আমরা দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </p>

        {/* English Message */}
        <p className="text-base text-gray-500 dark:text-gray-400 mb-8">
          We're sorry, an unexpected error occurred. Please try again.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 dark:text-red-300 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            <FaRedo size={20} />
            আবার চেষ্টা করুন
          </button>

          <Link 
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-gray-200 dark:border-gray-700"
          >
            <FaHome size={20} />
            হোম পেজে যান
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-16 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            সাহায্য প্রয়োজন?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            যদি সমস্যাটি বারবার হতে থাকে, তাহলে আমাদের সাথে যোগাযোগ করুন।
          </p>
          <Link 
            href="/contact"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            যোগাযোগ করুন
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 text-gray-400 dark:text-gray-600 text-sm">
          Error | Something Went Wrong
        </div>
      </div>
    </div>
  );
}
