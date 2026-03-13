"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaHeart, FaComment, FaClock } from "react-icons/fa";

const CareerSection = () => {
  const [careerBlogs, setCareerBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/data/blogs.json')
      .then(res => res.json())
      .then(data => {
        setCareerBlogs(data.career);
      })
      .catch(err => console.error('Error loading career data:', err));
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            Career <span className="text-orange-500">🔥🔥</span>
          </h2>
      
        </div>

        {/* Career Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerBlogs.map((blog) => {
            const bgColors = [
              "bg-gradient-to-br from-cyan-100 to-blue-100",
              "bg-gradient-to-br from-purple-100 to-pink-100",
              "bg-gradient-to-br from-green-100 to-emerald-100",
              "bg-gradient-to-br from-pink-100 to-rose-100",
              "bg-gradient-to-br from-indigo-100 to-purple-100",
              "bg-gradient-to-br from-amber-100 to-orange-100"
            ];
            const bgColor = bgColors[careerBlogs.indexOf(blog) % bgColors.length];

            return (
              <Link 
                key={blog.id} 
                href={`/blog/${blog.slug}`}
                className="group bg-white dark:bg-[#161d2f] rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
              >
                {/* Image Container with Gradient Background */}
                <div className={`relative h-56 w-full overflow-hidden ${bgColor}`}>
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
                  {/* Reading Time */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1">
                    <FaClock /> {blog.readTime} min
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                    {blog.excerpt}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-1">
                      <FaEye /> {blog.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHeart /> {blog.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaComment /> {blog.comments}
                    </div>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-auto">
                    <span className="text-[#8B2FF1] font-black text-sm uppercase border-b-2 border-transparent group-hover:border-[#8B2FF1] transition-all">
                      Read More
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareerSection;
