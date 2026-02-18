"use client";
import React from "react";

const FeaturedBlog = () => {
  return (
    <section className="py-12 bg-[#fdf2ff] min-h-[400px]">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Main Card */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm flex flex-col md:flex-row items-center border border-gray-50">
          
          {/* Left: Image with Purple Wave */}
          <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px]">
            <img 
              src="https://heroblog.netlify.app/static/media/best-web-dev.887b2866.png" 
              alt="Featured Blog" 
              className="w-full h-full object-cover"
            />
            {/* Purple Overlay Wave effect (SVG approach) */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="h-[80px] w-full fill-[#6710C2]">
                    <path d="M0.00,49.98 C149.99,150.00 349.89,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                </svg>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              Best Web Development Course in Bangladesh
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 font-bold mb-6">
              <span>Arif Almas</span>
              <span>•</span>
              <span>May 5, 2025</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-4">
              Web Development, আপনি কি ভেবেছেন প্রতিদিনের জীবনটা ওয়েব ডেভেলপমেন্ট ছাড়া কেমন হতো? 
              সকালে ঘুম থেকে উঠে YouTube-এ গান শুনতে চান, কিন্তু অ্যাপই নেই! দুপুরে Daraz থেকে হেডফোন কিনতে গিয়েও দেখলেন সাইট লোড হয় না...
            </p>

            <button 
              className="px-8 py-3 rounded-xl text-white font-black text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
            >
              Read More
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedBlog;