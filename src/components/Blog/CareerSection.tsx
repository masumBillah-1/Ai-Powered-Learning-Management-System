"use client";
import React from "react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

const CareerSection = () => {
  const careerBlogs = [
    {
      id: 1,
      category: "ক্যারিয়ার",
      title: "Digital Marketing Career Path in 2026",
      description: "Digital Marketing এ ক্যারিয়ার শুরু করতে চান? SEO, Social Media Marketing, Content Strategy শিখে লাখ টাকা আয় করুন...",
      image: "https://i.ibb.co.com/FkxynQ3K/carlos-muza-hpj-Sk-U2-UYSU-unsplash.jpg",
      slug: "digital-marketing-career-2026",
      bgColor: "bg-gradient-to-br from-cyan-100 to-blue-100",
    },
    {
      id: 2,
      category: "ক্যারিয়ার",
      title: "How to Become a Graphics Designer in Bangladesh",
      description: "Graphics Design শিখে Freelancing করতে চান? Adobe Photoshop, Illustrator, Figma দিয়ে শুরু করুন আপনার ক্যারিয়ার...",
      image: "https://i.ibb.co.com/fzkDftYT/theme-photos-CGpif-H3-Fj-OA-unsplash.jpg",
      slug: "graphics-designer-career-bangladesh",
      bgColor: "bg-gradient-to-br from-purple-100 to-pink-100",
    },
    {
      id: 3,
      category: "ক্যারিয়ার",
      title: "10 Portfolio Mistakes That Kill Your Web Developer Job Chance",
      description: "Portfolio Mistakes! আপনার portfolio প্রায়ই আপনার first impression এবং এটি আপনার job chance নষ্ট করতে পারে...",
      image: "https://i.ibb.co.com/Zp6LgsPy/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg",
      slug: "portfolio-mistakes-web-developer",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-100",
    },
    {
      id: 4,
      category: "ক্যারিয়ার",
      title: "Complete Web Development Roadmap 2026",
      description: "Web Development শিখতে চান? HTML, CSS, JavaScript থেকে React, Next.js পর্যন্ত সম্পূর্ণ roadmap এখানে...",
      image: "https://i.ibb.co.com/LXDMbD4X/farzad-p-x-Sl33-Wxyc-unsplash.jpg",
      bgColor: "bg-gradient-to-br from-pink-100 to-rose-100",
    },
    {
      id: 5,
      category: "ক্যারিয়ার",
      title: "Freelancing Roadmap 2026 | How to Start Freelancing Career",
      description: "Freelancing Roadmap 2026! Upwork, Fiverr এ কাজ পেতে কি কি দক্ষতা লাগবে? সম্পূর্ণ গাইডলাইন এখানে...",
      image: "https://i.ibb.co.com/spjv99Yy/campaign-creators-g-Msn-Xq-ILjp4-unsplash.jpg",
      bgColor: "bg-gradient-to-br from-indigo-100 to-purple-100",
    },
    {
      id: 6,
      category: "ক্যারিয়ার",
      title: "UI/UX Design Career Challenge 2026 | Best Design Practices",
      description: "UI/UX Design Career Challenge 2026 আপনাকে দেয় একটি সুন্দর সুযোগ professional designer হওয়ার...",
      image: "https://i.ibb.co.com/mYSqCRw/anita-chong-wrib-B9uv3-g-unsplash.jpg",
      bgColor: "bg-gradient-to-br from-amber-100 to-orange-100",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            Career <span className="text-orange-500">🔥🔥</span>
          </h2>
          <Link 
            href="/career" 
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-[#6710C2] transition-colors group"
          >
            <span className="text-lg">See More Blog</span>
            <span className="bg-[#6710C2] text-white p-2 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
              <FiExternalLink size={18} />
            </span>
          </Link>
        </div>

        {/* Career Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerBlogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={`/blog/${blog.slug}`}
              className="group bg-white dark:bg-[#161d2f] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
            >
              {/* Image Container with Gradient Background */}
              <div className={`relative h-56 w-full overflow-hidden ${blog.bgColor}`}>
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-110"
                />
                {/* Top Left Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 px-3 py-1.5 rounded-full">
                  <span className="text-purple-600 text-sm">▶</span>
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">BrainBoost</span>
                </div>
                {/* Bottom Right Arrow */}
                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 p-2 rounded-lg group-hover:bg-[#6710C2] transition-colors">
                  <svg 
                    className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold mb-4 w-fit">
                  {blog.category}
                </span>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-[#6710C2] transition-colors line-clamp-2">
                  {blog.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                  {blog.description}
                </p>

                {/* Read More Link */}
                <div className="mt-auto">
                  <span className="text-[#8B2FF1] font-black text-sm uppercase border-b-2 border-transparent group-hover:border-[#8B2FF1] transition-all">
                    Read More
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
