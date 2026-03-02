"use client";
import React from "react";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

const BlogSection = () => {
  const blogs = [
    {
      id: 1,
      category: "Graphics Design",
      title: "The Future of UI/UX in 2026: Minimalist vs 3D Design",
      desc: "Explore how AI is reshaping the way we think about user interfaces and branding strategies...",
      img: "https://i.ibb.co.com/mYSqCRw/anita-chong-wrib-B9uv3-g-unsplash.jpg",
    },
    {
      id: 2,
      category: "Digital Marketing",
      title: "How to Build a High-Converting Meta Ads Strategy",
      desc: "Stop wasting your budget! Learn the science behind audience targeting and creative testing...",
      img: "https://i.ibb.co.com/spjv99Yy/campaign-creators-g-Msn-Xq-ILjp4-unsplash.jpg",
    },
    {
      id: 3,
      category: "Web Development",
      title: "Why Next.js is the Smartest Decision for Frontend in 2026",
      desc: "JavaScript continues to evolve. Discover why server-side rendering is a must-have for SEO...",
      img: "https://i.ibb.co.com/Zp6LgsPy/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg",
    },
    {
      id: 4,
      category: "Web Development",
      title: "Mastering the DOM: The Engine Behind Interactive Pages",
      desc: "Have you ever clicked a button and wondered how it works? Let's dive deep into the DOM...",
      img: "https://i.ibb.co.com/LXDMbD4X/farzad-p-x-Sl33-Wxyc-unsplash.jpg",
    },
    {
      id: 5,
      category: "Digital Marketing",
      title: "The Impact of AI Agents on Modern Digital Marketing",
      desc: "Discover the A2A Protocol and how AI agents are automating customer engagement...",
      img: "https://i.ibb.co.com/JjkWxRd5/sarah-b-0j-Acm-Cfk-JAQ-unsplash.jpg",
    },
    {
      id: 6,
      category: "Graphics Design",
      title: "Branding Secrets: How Colors Influence Consumer Behavior",
      desc: "Design is more than just looking good. It's about psychology. Learn how to pick the right palette...",
      img: "https://i.ibb.co.com/8DW7BL1D/emily-bernal-v9v-II5g-V8-Lw-unsplash.jpg",
    },
  ];

  return (
    <section className="py-20 bg-[#fcfcfc] dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            Full Blog Section <span className="text-[#C81D77]">📚</span>
          </h2>
       
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group bg-white dark:bg-[#161d2f] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden">
                <img 
                  src={blog.img} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content Container */}
              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold mb-4">
                  {blog.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-[#C81D77] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                  {blog.desc}
                </p>
                <Link 
                  href={`/blog/${blog.id}`} 
                  className="text-[#C81D77] font-black text-sm uppercase border-b-2 border-transparent hover:border-[#C81D77] transition-all"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
