"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineArrowNarrowRight } from "react-icons/hi"; // React Icon
import { FiExternalLink } from "react-icons/fi"; // React Icon

const blogs = [
  {
    id: 1,
    category: "Web Development",
    title: "Why JavaScript is Still the Smartest Decision in 2025",
    description: "JavaScript remains the king of the web. Explore why it's still the best choice for developers and how to master it.",
    image: "https://i.ibb.co.com/Zp6LgsPy/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg", 
    slug: "javascript-guide-2025",
  },
  {
    id: 2,
    category: "Digital Marketing",
    title: "AI in Digital Marketing: The Future of SEO and Ads",
    description: "How artificial intelligence is changing the way we rank on Google and run Facebook ads effectively in 2025.",
    image: "https://i.ibb.co.com/FkxynQ3K/carlos-muza-hpj-Sk-U2-UYSU-unsplash.jpg",
    slug: "ai-digital-marketing",
  },
  {
    id: 3,
    category: "Graphics Design",
    title: "Mastering UI/UX: Visual Design Principles for 2025",
    description: "Learn the core principles of user experience and visual design that convert random visitors into loyal users.",
    image: "https://i.ibb.co.com/fzkDftYT/theme-photos-CGpif-H3-Fj-OA-unsplash.jpg",
    slug: "ui-ux-design-mastery",
  },
];

const PopularBlogs = () => {
  return (
    <section className="py-16 bg-[#fdf2ff]/30 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-gray-800 flex items-center gap-2">
            Most Popular Blog <span className="text-orange-500">🔥</span>
          </h2>
          <Link 
            href="/all-blogs" 
            className="flex items-center gap-2 text-[#6710C2] font-bold hover:opacity-80 transition-all group"
          >
            <span className="text-lg">See More Blog</span>
            <span className="bg-[#6710C2] text-white p-2 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center">
              <FiExternalLink size={18} />
            </span>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group cursor-pointer"
            >
              {/* Blog Image Container */}
              <div className="relative h-[240px] overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Image Overlay on Hover */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              {/* Blog Content */}
              <div className="p-7 flex flex-col flex-grow">
                {/* Category Badge */}
                <span className="inline-block px-4 py-1.5 bg-gray-50 text-gray-500 text-[12px] font-extrabold rounded-lg mb-4 w-fit uppercase tracking-wider group-hover:bg-[#6710C2] group-hover:text-white transition-colors duration-300">
                  {blog.category}
                </span>
                
                <h3 className="text-xl font-extrabold text-gray-900 mb-4 leading-tight group-hover:text-[#6710C2] transition-colors duration-300 line-clamp-2">
                  {blog.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                  {blog.description}
                </p>

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