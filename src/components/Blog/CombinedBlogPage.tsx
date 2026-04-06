"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye, FaHeart, FaComment, FaClock, FaFire, FaBookmark, FaArrowRight
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  coverImage?: string;
  published: boolean;
  status: "pending" | "approved" | "rejected";
  author?: string;
  views?: number;
  likes?: number;
  comments?: number;
  readTime?: number;
  createdAt?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function fetchBlogs(): Promise<Blog[]> {
  const token = getToken();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch("/api/blogs", { headers });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch blogs");
  return data.blogs as Blog[];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <div className="bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
    <div className="h-52 bg-gray-100 dark:bg-gray-800" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-20" />
      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
      <div className="flex gap-4 pt-2">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-16" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-16" />
      </div>
    </div>
  </div>
);

const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-3xl">😕</div>
    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm">{message}</p>
    <button
      onClick={onRetry}
      className="px-7 py-3 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white rounded-xl font-bold hover:opacity-90 transition-all text-sm"
    >
      Try Again
    </button>
  </div>
);

// ─── Category pill colors ──────────────────────────────────────────────────────
const catColor = (cat?: string) => {
  const map: Record<string, string> = {
    tech: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    design: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
    career: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    ai: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  };
  return map[(cat || "").toLowerCase()] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
};

// ─── Blog Card ────────────────────────────────────────────────────────────────
const BlogCard = ({ blog, index }: { blog: Blog; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.35, delay: index * 0.05 }}
    className="group bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-xl hover:shadow-purple-100/40 dark:hover:shadow-purple-900/20 transition-all duration-300"
  >
    <Link href={`/blog/${blog.slug}`} className="block">
      {/* Image */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#6710C2] to-[#C81D77]" />
        )}
        {/* Category badge */}
        {blog.category && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${catColor(blog.category)}`}>
            {blog.category}
          </span>
        )}
        {/* Bookmark icon */}
        <button
          onClick={e => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-[#C81D77] transition-colors opacity-0 group-hover:opacity-100"
        >
          <FaBookmark size={11} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2 group-hover:text-[#C81D77] dark:group-hover:text-purple-400 transition-colors mb-3">
          {blog.title}
        </h3>
        {blog.excerpt && (
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4">
            {blog.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {blog.readTime && (
              <span className="flex items-center gap-1">
                <FaClock size={10} /> {blog.readTime}m
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaEye size={10} /> {(blog.views ?? 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <FaHeart size={10} className="text-red-400" /> {blog.likes ?? 0}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#C81D77] dark:text-purple-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Read <FaArrowRight size={8} />
          </span>
        </div>
      </div>
    </Link>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CombinedBlogPage = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"views" | "likes" | "comments">("views");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const blogs = await fetchBlogs();
      setAllBlogs(blogs);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBlogs(); }, [loadBlogs]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const publishedBlogs = allBlogs.filter(b => b.published && b.status === "approved");

  const featuredBlog = publishedBlogs.reduce<Blog | null>(
    (best, b) => !best || (b.views ?? 0) > (best.views ?? 0) ? b : best, null
  );

  const popularBlogs = [...publishedBlogs]
    .sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0))
    .slice(0, 3);

  const categories = ["All", ...Array.from(new Set(publishedBlogs.map(b => b.category).filter(Boolean))) as string[]];

  const otherBlogs = publishedBlogs.filter(b => b._id !== featuredBlog?._id);
  const filteredBlogs = activeFilter === "All" ? otherBlogs : otherBlogs.filter(b => b.category === activeFilter);
  const displayBlogs = showAll ? filteredBlogs : filteredBlogs.slice(0, 6);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] dark:bg-[#0b1120] transition-colors duration-300">

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 sm:pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">

        {/* Section label */}
        <div className="flex items-center gap-2 mb-6">
          <HiSparkles className="text-[#C81D77]" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-[#C81D77]">Featured Story</span>
        </div>

        {loading ? (
          <div className="h-[480px] sm:h-[560px] rounded-2xl sm:rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ) : error ? (
          <ErrorBanner message={error} onRetry={loadBlogs} />
        ) : featuredBlog ? (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative h-[480px] sm:h-[560px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
          >
            {featuredBlog.coverImage ? (
              <img
                src={featuredBlog.coverImage}
                alt={featuredBlog.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#6710C2] to-[#C81D77]" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            {/* Top badge */}
            <div className="absolute top-5 left-5 sm:top-8 sm:left-8 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
                ⭐ Featured
              </span>
              {featuredBlog.category && (
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${catColor(featuredBlog.category)}`}>
                  {featuredBlog.category}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 md:p-14 text-white">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight max-w-3xl mb-3 sm:mb-5">
                {featuredBlog.title}
              </h1>
              {featuredBlog.excerpt && (
                <p className="text-sm sm:text-base text-gray-300 max-w-2xl mb-5 line-clamp-2 hidden sm:block">
                  {featuredBlog.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-300 mb-5 sm:mb-8">
                {featuredBlog.author && (
                  <span className="font-semibold">By {featuredBlog.author}</span>
                )}
                <span className="flex items-center gap-1.5"><FaEye size={12} /> {(featuredBlog.views ?? 0).toLocaleString()}</span>
                {featuredBlog.readTime && <span className="flex items-center gap-1.5"><FaClock size={12} /> {featuredBlog.readTime} min read</span>}
              </div>
              <Link
                href={`/blog/${featuredBlog.slug}`}
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-black text-sm px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl hover:bg-[#C81D77] hover:text-white transition-all duration-300 group/btn"
              >
                Read Full Story
                <FaArrowRight size={11} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </section>

      {/* ── 2. TRENDING ─────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white dark:bg-[#0f1729]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FaFire className="text-orange-500" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">This Week</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Trending Now</h2>
            </div>

            {/* Sort pills */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1 self-start sm:self-auto">
              {(["views", "likes", "comments"] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSortBy(type)}
                  className={`px-3 sm:px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                    sortBy === type
                      ? "bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white shadow"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {loading
              ? Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : popularBlogs.map((blog, i) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-[#f9fafb] dark:bg-[#111827] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/blog/${blog.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      {blog.coverImage
                        ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full bg-gradient-to-br from-[#C81D77] to-[#6710C2]" />
                      }
                      {/* Rank badge */}
                      <div className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-black">
                        #{i + 1}
                      </div>
                    </div>
                    <div className="p-5">
                      {blog.category && (
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${catColor(blog.category)}`}>
                          {blog.category}
                        </span>
                      )}
                      <h3 className="mt-2.5 text-base font-bold leading-snug line-clamp-2 text-gray-900 dark:text-white group-hover:text-[#C81D77] dark:group-hover:text-purple-400 transition-colors">
                        {blog.title}
                      </h3>
                      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><FaHeart className="text-red-400" size={10} /> {blog.likes ?? 0}</span>
                        <span className="flex items-center gap-1"><FaEye size={10} /> {(blog.views ?? 0).toLocaleString()}</span>
                        <span className="flex items-center gap-1"><FaComment size={10} /> {blog.comments ?? 0}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ── 3. LATEST STORIES ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-7 sm:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-[#C81D77] to-[#6710C2]" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Explore</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {showAll ? "All Stories" : "Latest Stories"}
            </h2>
          </div>
          {!loading && filteredBlogs.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-bold text-[#C81D77] flex items-center gap-1.5 hover:gap-2.5 transition-all self-start sm:self-auto"
            >
              {showAll ? "Show Less" : "View All"} <FaArrowRight size={11} />
            </button>
          )}
        </div>

        {/* Category filters */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveFilter(cat); setShowAll(false); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30"
                    : "bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {loading
              ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : displayBlogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} index={i} />)
            }
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {!loading && displayBlogs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400 font-medium">No stories in this category yet.</p>
          </div>
        )}
      </section>

      {/* ── 4. NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0533] via-[#2d0a4e] to-[#1a0533] rounded-2xl sm:rounded-3xl p-8 sm:p-14 text-center">

          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#C81D77]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#6710C2]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />

          <div className="relative max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 px-3.5 py-1.5 rounded-full mb-5">
              <HiSparkles className="text-yellow-400 text-sm" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Weekly Newsletter</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4">Stay in the Loop</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-8 leading-relaxed">
              Weekly tech insights, tutorials & career tips — delivered straight to your inbox. No spam, ever.
            </p>

            {subscribed ? (
              <div className="bg-green-400/10 border border-green-400/30 text-green-400 rounded-xl py-5 text-base font-bold">
                ✅ You're subscribed! Welcome aboard.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#C81D77] focus:bg-white/15 transition-all"
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-black rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all text-sm whitespace-nowrap shadow-lg shadow-purple-900/40"
                >
                  Subscribe Free
                </button>
              </form>
            )}
            <p className="text-gray-600 text-xs mt-4">Join 5,000+ readers. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

    </main>
  );
};

export default CombinedBlogPage;