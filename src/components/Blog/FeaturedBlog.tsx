"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaUser, FaArrowRight, FaClock, FaEye, FaHeart, FaComment, FaBookmark, FaShare } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const FeaturedBlog = () => {
  const [allFeaturedBlogs, setAllFeaturedBlogs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blogData, setBlogData] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    fetch('/data/blogs.json')
      .then(res => res.json())
      .then(data => {
        // Get featured blog and top 2 popular blogs for rotation
        const featuredBlogs = [data.featured, ...data.popular.slice(0, 2)];
        setAllFeaturedBlogs(featuredBlogs);
        setBlogData(featuredBlogs[0]);
        setLikes(featuredBlogs[0].likes);
      })
      .catch(err => console.error('Error loading blog data:', err));
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || allFeaturedBlogs.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % allFeaturedBlogs.length;
        setBlogData(allFeaturedBlogs[nextIndex]);
        setLikes(allFeaturedBlogs[nextIndex].likes);
        setIsLiked(false);
        setIsBookmarked(false);
        return nextIndex;
      });
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [autoRotate, allFeaturedBlogs]);

  const handleManualChange = (index: number) => {
    setCurrentIndex(index);
    setBlogData(allFeaturedBlogs[index]);
    setLikes(allFeaturedBlogs[index].likes);
    setIsLiked(false);
    setIsBookmarked(false);
    setAutoRotate(false); // Stop auto-rotation when manually changed
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/blog/${blogData?.slug}`;
    const text = blogData?.title;
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  if (!blogData) return <div className="py-16 min-h-[500px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
  </div>;

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120] min-h-[500px] transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4">
            <HiSparkles className="text-[#C81D77] animate-pulse" />
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">
              Featured Article
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
            Editor&apos;s Pick 🔥
          </h2>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-[#161d2f] rounded-[40px] overflow-hidden shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/10 transition-all duration-500 border border-gray-100 dark:border-gray-800 group"
        >
          <div className="flex flex-col md:flex-row items-stretch">
            {/* Left: Image with Purple Wave */}
            <motion.div 
              className="w-full md:w-1/2 relative h-[350px] md:h-[500px] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img 
                src="https://i.ibb.co.com/zH75B27y/Gemini-Generated-Image-4de9wp4de9wp4de9.png" 
                alt="Featured Blog" 
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2 }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

              {/* Featured Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-6 left-6 px-4 py-2 rounded-full backdrop-blur-md bg-white/20 border border-white/30 flex items-center gap-2"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-bold">Trending Now</span>
              </motion.div>

              {/* Reading Time Badge */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-md bg-black/30 border border-white/20 flex items-center gap-2"
              >
                <FaClock className="text-white text-sm" />
                <span className="text-white text-sm font-bold">5 min read</span>
              </motion.div>

              {/* Purple Overlay Wave effect */}
              <motion.div 
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]"
              >
                <svg 
                  viewBox="0 0 500 150" 
                  preserveAspectRatio="none" 
                  className="h-[100px] w-full fill-[#6710C2] dark:fill-[#8B2FF1] transition-colors duration-300"
                >
                  <path d="M0.00,49.98 C149.99,150.00 349.89,-50.00 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"></path>
                </svg>
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Category Badge */}
                <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-6 border border-purple-200 dark:border-purple-800">
                  Learning Management
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#C81D77] group-hover:to-[#6710C2] transition-all duration-300">
                  {blogData.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 font-bold mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 group/author cursor-pointer relative">
                    <img src={blogData.authorImage} alt={blogData.author} className="w-8 h-8 rounded-full" />
                    <span className="group-hover/author:text-[#C81D77] transition-colors">{blogData.author}</span>
                    {/* Author Bio Tooltip */}
                    <div className="absolute top-full left-0 mt-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl opacity-0 invisible group-hover/author:opacity-100 group-hover/author:visible transition-all z-50 border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400">{blogData.authorBio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#6710C2]" />
                    <span>{new Date(blogData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaEye className="text-blue-500" />
                    <span>{blogData.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isLiked 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <FaHeart className={isLiked ? 'animate-pulse' : ''} />
                    <span className="font-bold">{likes}</span>
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <FaComment />
                    <span className="font-bold">{blogData.comments}</span>
                  </div>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isBookmarked 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    <FaBookmark className={isBookmarked ? 'animate-bounce' : ''} />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <FaShare />
                    </button>
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-2 z-50 border border-gray-200 dark:border-gray-700"
                        >
                          {['facebook', 'twitter', 'linkedin', 'whatsapp'].map(platform => (
                            <button
                              key={platform}
                              onClick={() => handleShare(platform)}
                              className="w-full px-4 py-2 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors capitalize"
                            >
                              {platform}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8 line-clamp-4">
                  {blogData.excerpt}
                </p>

                {/* CTA Button */}
                <Link href={`/blog/${blogData.slug}`}>
                  <motion.button 
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-lg transition-all shadow-xl hover:shadow-2xl relative overflow-hidden"
                    style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
                  >
                    <span className="relative z-10">Read Full Article</span>
                    <FaArrowRight className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </motion.button>
                </Link>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8">
                  {blogData.tags.map((tag: string, index: number) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all cursor-pointer"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>

                {/* Rotation Indicators */}
                {allFeaturedBlogs.length > 1 && (
                  <div className="flex items-center gap-3 mt-8">
                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#C81D77] transition-colors"
                    >
                      {autoRotate ? '⏸ Pause' : '▶ Play'}
                    </button>
                    <div className="flex gap-2">
                      {allFeaturedBlogs.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleManualChange(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentIndex 
                              ? 'w-8 bg-gradient-to-r from-[#C81D77] to-[#6710C2]' 
                              : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBlog;
