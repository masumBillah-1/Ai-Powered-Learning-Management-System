"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { FaEye, FaHeart, FaComment, FaClock, FaFire } from "react-icons/fa";

const PopularBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'comments'>('views');
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | 'all'>('all');
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/blogs.json')
      .then(res => res.json())
      .then(data => {
        setBlogs(data.popular);
      })
      .catch(err => console.error('Error loading blog data:', err));
  }, []);

  const sortedBlogs = [...blogs].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <section className="py-16 bg-[#fdf2ff]/30 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-gray-800 dark:text-white flex items-center gap-2">
            Most Popular Blog <span className="text-orange-500">🔥</span>
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
              {(['views', 'likes', 'comments'] as const).map(sort => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                    sortBy === sort 
                      ? 'bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
              {(['7days', '30days', 'all'] as const).map(time => (
                <button
                  key={time}
                  onClick={() => setTimeFilter(time)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    timeFilter === time 
                      ? 'bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {time === '7days' ? '7 Days' : time === '30days' ? '30 Days' : 'All Time'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredBlog(blog.id)}
              onMouseLeave={() => setHoveredBlog(null)}
              className="bg-white dark:bg-[#161d2f] rounded-[30px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group cursor-pointer relative"
            >
              {/* Quick Preview Popup */}
              <AnimatePresence>
                {hoveredBlog === blog.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-4">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <img src={blog.authorImage} alt={blog.author} className="w-6 h-6 rounded-full" />
                      <span>{blog.author}</span>
                      <span>•</span>
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Blog Image Container */}
              <div className="relative h-[240px] overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Image Overlay on Hover */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                
                {/* Trending Badge */}
                {blog.isTrending && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1 animate-pulse">
                    <FaFire /> Trending
                  </div>
                )}
                
                {/* Reading Time */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-lg flex items-center gap-1">
                  <FaClock /> {blog.readTime} min
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-7 flex flex-col flex-grow">
                {/* Category Badge */}
                <span className="inline-block px-4 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[12px] font-extrabold rounded-lg mb-4 w-fit uppercase tracking-wider group-hover:bg-[#6710C2] group-hover:text-white transition-colors duration-300">
                  {blog.category}
                </span>

                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-[#6710C2] transition-colors duration-300 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                  {blog.excerpt}
                </p>

                {/* Engagement Stats */}
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
                  <Link 
                    href={`/blog/${blog.slug}`}
                    className="flex items-center gap-2 text-[#C81D77] font-black text-sm uppercase tracking-widest group/link"
                  >
                    <span className="border-b-2 border-transparent group-hover/link:border-[#C81D77] transition-all">
                      Read More
                    </span>
                    <HiOutlineArrowNarrowRight className="text-xl group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularBlogs;
