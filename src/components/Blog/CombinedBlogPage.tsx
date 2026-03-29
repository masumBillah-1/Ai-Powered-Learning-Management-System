// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { 
//   FaEye, FaHeart, FaComment, FaClock, FaFire 
// } from "react-icons/fa";
// import { HiOutlineArrowNarrowRight } from "react-icons/hi";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface Blog {
//   _id: string;
//   title: string;
//   slug: string;
//   excerpt?: string;
//   category?: string;
//   coverImage?: string;
//   published: boolean;
//   status: "pending" | "approved" | "rejected";
//   author?: string;
//   views?: number;
//   likes?: number;
//   comments?: number;
//   readTime?: number;
//   createdAt?: string;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function getToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem("token");
// }

// async function fetchBlogs(): Promise<Blog[]> {
//   const token = getToken();
//   const headers: HeadersInit = { "Content-Type": "application/json" };
//   if (token) headers["Authorization"] = `Bearer ${token}`;

//   const res = await fetch("/api/blogs", { headers });
//   const data = await res.json();
//   if (!data.success) throw new Error(data.message || "Failed to fetch blogs");
//   return data.blogs as Blog[];
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// const CardSkeleton = () => (
//   <div className="bg-white dark:bg-[#161d2f] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
//     <div className="h-56 bg-gray-200 dark:bg-gray-700" />
//     <div className="p-6 space-y-4">
//       <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
//       <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
//       <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
//       <div className="flex gap-6 pt-2">
//         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
//         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
//       </div>
//     </div>
//   </div>
// );

// // ─── Error Banner ─────────────────────────────────────────────────────────────
// const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
//   <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
//     <p className="text-gray-500 dark:text-gray-400 text-xl max-w-md">{message}</p>
//     <button
//       onClick={onRetry}
//       className="px-8 py-4 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white rounded-2xl font-bold hover:scale-105 transition-all"
//     >
//       Try Again
//     </button>
//   </div>
// );

// // ─── Clean & Professional Blog Homepage ───────────────────────────────────────
// const CombinedBlogPage = () => {
//   const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [sortBy, setSortBy] = useState<"views" | "likes" | "comments">("views");
//   const [email, setEmail] = useState("");
//   const [subscribed, setSubscribed] = useState(false);

//   // ── Fetch ──────────────────────────────────────────────────────────────────
//   const loadBlogs = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const blogs = await fetchBlogs();
//       setAllBlogs(blogs);
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadBlogs();
//   }, [loadBlogs]);

//   // ── Derived Data ───────────────────────────────────────────────────────────
//   const publishedBlogs = allBlogs.filter((b) => b.published && b.status === "approved");

//   const featuredBlog = publishedBlogs.reduce<Blog | null>((best, b) =>
//     !best || (b.views ?? 0) > (best.views ?? 0) ? b : best, null
//   );

//   const popularBlogs = [...publishedBlogs]
//     .sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0))
//     .slice(0, 3);

//   const recentBlogs = publishedBlogs
//     .filter((b) => b._id !== featuredBlog?._id)
//     .slice(0, 6);

//   const handleSubscribe = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email.trim()) setSubscribed(true);
//   };

//   // ── Render ─────────────────────────────────────────────────────────────────
//   return (
//     <main className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">

//       {/* 1. FEATURED HERO - Clean & Impactful */}
//       <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto">
//         {loading ? (
//           <div className="h-[580px] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
//         ) : error ? (
//           <ErrorBanner message={error} onRetry={loadBlogs} />
//         ) : featuredBlog ? (
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="relative h-[580px] rounded-3xl overflow-hidden shadow-2xl group"
//           >
//             {featuredBlog.coverImage ? (
//               <img
//                 src={featuredBlog.coverImage}
//                 alt={featuredBlog.title}
//                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//               />
//             ) : (
//               <div className="absolute inset-0 bg-gradient-to-br from-[#6710C2] to-[#C81D77]" />
//             )}

//             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

//             <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 text-white">
//               <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-3xl text-xs font-bold uppercase tracking-widest mb-6">
//                 FEATURED
//               </div>

//               <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">
//                 {featuredBlog.title}
//               </h1>

//               {featuredBlog.excerpt && (
//                 <p className="text-lg text-gray-200 max-w-2xl mb-8 line-clamp-2">
//                   {featuredBlog.excerpt}
//                 </p>
//               )}

//               <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-300">
//                 {featuredBlog.author && <span className="font-medium">By {featuredBlog.author}</span>}
//                 {featuredBlog.readTime && (
//                   <span className="flex items-center gap-2">
//                     <FaClock /> {featuredBlog.readTime} min read
//                   </span>
//                 )}
//                 <span className="flex items-center gap-2">
//                   <FaEye /> {featuredBlog.views?.toLocaleString() || 0} views
//                 </span>
//               </div>

//               <Link
//                 href={`/blog/${featuredBlog.slug}`}
//                 className="mt-10 inline-flex items-center gap-3 text-white font-bold text-lg hover:underline"
//               >
//                 Read Full Story
//                 <HiOutlineArrowNarrowRight className="text-2xl transition-transform group-hover:translate-x-2" />
//               </Link>
//             </div>
//           </motion.div>
//         ) : null}
//       </section>

//       {/* 2. POPULAR / TRENDING - Minimal & Elegant */}
//       <section className="py-20 bg-[#fdf2ff]/30 dark:bg-[#161d2f]/30">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex justify-between items-end mb-12">
//             <div>
//               <h2 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
//                 Trending <FaFire className="text-orange-500" />
//               </h2>
//               <p className="text-gray-500 dark:text-gray-400">Most popular this week</p>
//             </div>

//             <div className="flex bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-inner border border-gray-100 dark:border-gray-700">
//               {(["views", "likes", "comments"] as const).map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => setSortBy(type)}
//                   className={`px-7 py-3 rounded-3xl text-sm font-semibold transition-all capitalize ${
//                     sortBy === type
//                       ? "bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white shadow-md"
//                       : "text-gray-500 hover:text-gray-700 dark:hover:text-white"
//                   }`}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {loading
//               ? Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)
//               : popularBlogs.map((blog) => (
//                   <motion.div
//                     key={blog._id}
//                     whileHover={{ y: -8 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     className="group bg-white dark:bg-[#161d2f] rounded-3xl overflow-hidden shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800"
//                   >
//                     <Link href={`/blog/${blog.slug}`} className="block">
//                       <div className="relative h-56">
//                         {blog.coverImage ? (
//                           <img
//                             src={blog.coverImage}
//                             alt={blog.title}
//                             className="w-full h-full object-cover transition-transform group-hover:scale-105"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gradient-to-br from-[#C81D77] to-[#6710C2] flex items-center justify-center">
//                             <span className="text-white text-6xl font-black opacity-20">
//                               {blog.title[0]}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-7">
//                         {blog.category && (
//                           <span className="text-xs font-black uppercase tracking-widest text-[#C81D77]">
//                             {blog.category}
//                           </span>
//                         )}
//                         <h3 className="mt-3 text-xl font-bold leading-tight line-clamp-2 group-hover:text-[#6710C2] transition-colors">
//                           {blog.title}
//                         </h3>

//                         <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
//                           <span className="flex items-center gap-1.5">
//                             <FaHeart className="text-red-500" /> {blog.likes ?? 0}
//                           </span>
//                           <span className="flex items-center gap-1.5">
//                             <FaComment /> {blog.comments ?? 0}
//                           </span>
//                           <span className="flex items-center gap-1.5">
//                             <FaEye /> {blog.views ?? 0}
//                           </span>
//                         </div>
//                       </div>
//                     </Link>
//                   </motion.div>
//                 ))}
//           </div>
//         </div>
//       </section>

//       {/* 3. LATEST STORIES - Clean Grid */}
//       <section className="py-20 max-w-7xl mx-auto px-6">
//         <div className="flex justify-between items-baseline mb-12">
//           <h2 className="text-4xl font-black dark:text-white">Latest Stories</h2>
//           {/* <Link href="/blog" className="text-[#C81D77] font-bold flex items-center gap-2 hover:underline">
//             View All <FaFire />
//           </Link> */}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {loading
//             ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
//             : recentBlogs.map((blog) => (
//                 <Link
//                   key={blog._id}
//                   href={`/blog/${blog.slug}`}
//                   className="group block"
//                 >
//                   <div className="relative rounded-3xl overflow-hidden h-64 mb-6">
//                     {blog.coverImage ? (
//                       <img
//                         src={blog.coverImage}
//                         alt={blog.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-br from-[#6710C2] to-[#C81D77]" />
//                     )}
//                   </div>

//                   <span className="text-xs uppercase font-bold text-purple-600 tracking-widest">
//                     {blog.category || "General"}
//                   </span>
//                   <h3 className="text-2xl font-bold mt-3 line-clamp-2 group-hover:text-[#C81D77] transition-colors">
//                     {blog.title}
//                   </h3>

//                   <div className="mt-6 flex items-center gap-6 text-xs text-gray-400">
//                     {blog.author && <span>By {blog.author}</span>}
//                     {blog.readTime && <span className="flex items-center gap-1"><FaClock /> {blog.readTime} min</span>}
//                   </div>
//                 </Link>
//               ))}
//         </div>
//       </section>

//       {/* 4. NEWSLETTER - Final Clean CTA */}
//       <section className="py-24 max-w-7xl mx-auto px-6">
//         <div className="bg-[#161d2f] rounded-3xl p-14 text-center">
//           <div className="max-w-2xl mx-auto">
//             <h2 className="text-5xl font-black text-white mb-6">Stay Updated</h2>
//             <p className="text-gray-300 text-xl mb-10">
//               Weekly tech insights, tutorials &amp; career tips delivered to your inbox.
//             </p>

//             {subscribed ? (
//               <div className="bg-green-400/10 border border-green-400 text-green-400 rounded-3xl py-8 text-2xl font-bold">
//                 ✅ Thank you! You’re subscribed.
//               </div>
//             ) : (
//               <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your@email.com"
//                   className="flex-1 bg-white/10 border border-white/20 rounded-3xl px-8 py-6 text-white placeholder:text-white/60 focus:outline-none focus:border-[#C81D77]"
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className="px-12 py-6 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-black rounded-3xl hover:scale-105 transition-all"
//                 >
//                   Subscribe Free
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// };

// export default CombinedBlogPage;
"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEye, FaHeart, FaComment, FaClock, FaFire 
} from "react-icons/fa";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

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
  <div className="bg-white dark:bg-[#161d2f] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 animate-pulse">
    <div className="h-56 bg-gray-200 dark:bg-gray-700" />
    <div className="p-6 space-y-4">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="flex gap-6 pt-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      </div>
    </div>
  </div>
);

const ErrorBanner = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
    <p className="text-gray-500 dark:text-gray-400 text-xl max-w-md">{message}</p>
    <button
      onClick={onRetry}
      className="px-8 py-4 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white rounded-2xl font-bold hover:scale-105 transition-all"
    >
      Try Again
    </button>
  </div>
);

const CombinedBlogPage = () => {
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"views" | "likes" | "comments">("views");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  
  // New state for View All functionality
  const [showAll, setShowAll] = useState(false);

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

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // ── Derived Data ───────────────────────────────────────────────────────────
  const publishedBlogs = allBlogs.filter((b) => b.published && b.status === "approved");

  const featuredBlog = publishedBlogs.reduce<Blog | null>((best, b) =>
    !best || (b.views ?? 0) > (best.views ?? 0) ? b : best, null
  );

  const popularBlogs = [...publishedBlogs]
    .sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0))
    .slice(0, 3);

  // Filter out featured blog and then slice based on showAll state
  const otherBlogs = publishedBlogs.filter((b) => b._id !== featuredBlog?._id);
  const displayBlogs = showAll ? otherBlogs : otherBlogs.slice(0, 6);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">

      {/* 1. FEATURED HERO */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="h-[580px] rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ) : error ? (
          <ErrorBanner message={error} onRetry={loadBlogs} />
        ) : featuredBlog ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-[580px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            {featuredBlog.coverImage ? (
              <img
                src={featuredBlog.coverImage}
                alt={featuredBlog.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#6710C2] to-[#C81D77]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-3xl text-xs font-bold uppercase tracking-widest mb-6">
                FEATURED
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">{featuredBlog.title}</h1>
              {featuredBlog.excerpt && <p className="text-lg text-gray-200 max-w-2xl mb-8 line-clamp-2">{featuredBlog.excerpt}</p>}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-300">
                {featuredBlog.author && <span className="font-medium">By {featuredBlog.author}</span>}
                <span className="flex items-center gap-2"><FaEye /> {featuredBlog.views?.toLocaleString() || 0} views</span>
              </div>
              <Link href={`/blog/${featuredBlog.slug}`} className="mt-10 inline-flex items-center gap-3 text-white font-bold text-lg hover:underline">
                Read Full Story <HiOutlineArrowNarrowRight className="text-2xl transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </motion.div>
        ) : null}
      </section>

      {/* 2. POPULAR / TRENDING */}
      <section className="py-20 bg-[#fdf2ff]/30 dark:bg-[#161d2f]/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">Trending <FaFire className="text-orange-500" /></h2>
              <p className="text-gray-500 dark:text-gray-400">Most popular this week</p>
            </div>
            <div className="flex bg-white dark:bg-gray-800 rounded-3xl p-1 shadow-inner border border-gray-100 dark:border-gray-700">
              {(["views", "likes", "comments"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSortBy(type)}
                  className={`px-7 py-3 rounded-3xl text-sm font-semibold transition-all capitalize ${sortBy === type ? "bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white shadow-md" : "text-gray-500 hover:text-gray-700 dark:hover:text-white"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />) : popularBlogs.map((blog) => (
              <motion.div key={blog._id} whileHover={{ y: -8 }} className="group bg-white dark:bg-[#161d2f] rounded-3xl overflow-hidden shadow-sm border border-transparent hover:border-purple-200 dark:hover:border-purple-800">
                <Link href={`/blog/${blog.slug}`} className="block">
                  <div className="relative h-56">
                    {blog.coverImage ? <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" /> : <div className="w-full h-full bg-gradient-to-br from-[#C81D77] to-[#6710C2]" />}
                  </div>
                  <div className="p-7">
                    <span className="text-xs font-black uppercase tracking-widest text-[#C81D77]">{blog.category}</span>
                    <h3 className="mt-3 text-xl font-bold leading-tight line-clamp-2 group-hover:text-[#6710C2] transition-colors">{blog.title}</h3>
                    <div className="mt-6 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5"><FaHeart className="text-red-500" /> {blog.likes ?? 0}</span>
                      <span className="flex items-center gap-1.5"><FaEye /> {blog.views ?? 0}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LATEST STORIES - Updated with View All Functionality */}
      <section className="py-20 max-w-7xl mx-auto px-6" id="all-blogs">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="text-4xl font-black dark:text-white">
            {showAll ? "All Stories" : "Latest Stories"}
          </h2>
          {!loading && otherBlogs.length > 6 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-[#C81D77] font-bold flex items-center gap-2 hover:underline transition-all"
            >
              {showAll ? "Show Less" : "View All"} <FaFire />
            </button>
          )}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {loading
              ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : displayBlogs.map((blog) => (
                  <motion.div
                    key={blog._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/blog/${blog.slug}`} className="group block">
                      <div className="relative rounded-3xl overflow-hidden h-64 mb-6">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#6710C2] to-[#C81D77]" />
                        )}
                      </div>
                      <span className="text-xs uppercase font-bold text-purple-600 tracking-widest">{blog.category || "General"}</span>
                      <h3 className="text-2xl font-bold mt-3 line-clamp-2 group-hover:text-[#C81D77] transition-colors">{blog.title}</h3>
                      <div className="mt-6 flex items-center gap-6 text-xs text-gray-400">
                        {blog.author && <span>By {blog.author}</span>}
                        {blog.readTime && <span className="flex items-center gap-1"><FaClock /> {blog.readTime} min</span>}
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 4. NEWSLETTER */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-[#161d2f] rounded-3xl p-14 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-5xl font-black text-white mb-6">Stay Updated</h2>
            <p className="text-gray-300 text-xl mb-10">Weekly tech insights, tutorials & career tips delivered to your inbox.</p>
            {subscribed ? (
              <div className="bg-green-400/10 border border-green-400 text-green-400 rounded-3xl py-8 text-2xl font-bold">✅ Thank you! You’re subscribed.</div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 bg-white/10 border border-white/20 rounded-3xl px-8 py-6 text-white focus:outline-none focus:border-[#C81D77]" required />
                <button type="submit" className="px-12 py-6 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-black rounded-3xl hover:scale-105 transition-all">Subscribe Free</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CombinedBlogPage;