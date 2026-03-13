"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaTh, FaList, FaEye, FaHeart, FaComment } from "react-icons/fa";

const BlogSection = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAuthor, setSelectedAuthor] = useState("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(6);
  const [authors, setAuthors] = useState<string[]>([]);

  const categories = ["All", "Web Development", "Digital Marketing", "Graphics Design"];

  useEffect(() => {
    fetch('/data/blogs.json')
      .then(res => res.json())
      .then(data => {
        setBlogs(data.allBlogs);
        setFilteredBlogs(data.allBlogs);
        // Extract unique authors
        const uniqueAuthors = ["All", ...Array.from(new Set(data.allBlogs.map((b: any) => b.author as string)))];
        setAuthors(uniqueAuthors as string[]);
      })
      .catch(err => console.error('Error loading blog data:', err));
  }, []);

  useEffect(() => {
    let filtered = blogs;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    if (selectedAuthor !== "All") {
      filtered = filtered.filter(blog => blog.author === selectedAuthor);
    }

    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, selectedCategory, selectedAuthor, blogs]);

  return (
    <section className="py-20 bg-[#fcfcfc] dark:bg-[#0b1120] transition-colors duration-300">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            Full Blog Section <span className="text-[#C81D77]">📚</span>
          </h2>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <FaList />
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#C81D77] outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700 hover:border-[#C81D77]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Author Filter */}
        <div className="mb-8">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Filter by Author:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {authors.map(author => (
              <button
                key={author}
                onClick={() => setSelectedAuthor(author)}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all text-sm ${
                  selectedAuthor === author
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }`}
              >
                {author}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Showing {Math.min(visibleCount, filteredBlogs.length)} of {filteredBlogs.length} blogs
        </p>

        {/* Blog Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          : "flex flex-col gap-6"
        }>
          {filteredBlogs.slice(0, visibleCount).map((blog) => (
            <div 
              key={blog.id} 
              className={`group bg-white dark:bg-[#161d2f] rounded-[24px] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${
                viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
              }`}
            >
              {/* Image Container */}
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-64 h-48' : 'h-56 w-full'
              }`}>
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content Container */}
              <div className="p-6 flex-1 flex flex-col">
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold mb-4 w-fit">
                  {blog.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-[#C81D77] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {blog.excerpt}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
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

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link 
                  href={`/blog/${blog.slug}`} 
                  className="text-[#C81D77] font-black text-sm uppercase border-b-2 border-transparent hover:border-[#C81D77] transition-all mt-auto w-fit"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredBlogs.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-8 py-4 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Load More Blogs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
