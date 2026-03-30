"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, FaClock, FaShare, FaBookmark, FaArrowLeft, 
  FaHeart, FaComment, FaEye, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp 
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blogData, setBlogData] = useState<any>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch All Blogs + Find by Slug + Views Increment ─────────────────────
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch all blogs
        const res = await fetch("/api/blogs");
        const data = await res.json();

        if (!data.success) throw new Error("Failed to load blogs");

        // 2. Find blog by slug
        const found = data.blogs.find((b: any) => b.slug === slug);
        if (!found) throw new Error("Blog not found");

        setBlogData(found);
        setLikes(found.likes || 0);

        // 3. Increment views
        if (found._id) {
          await fetch(`/api/blogs?action=single&id=${found._id}`, { method: "GET" });
        }

        // 4. Related blogs (same category)
        const related = data.blogs
          .filter((b: any) => 
            b.category === found.category && 
            b.slug !== slug && 
            b.published && 
            b.status === "approved"
          )
          .slice(0, 3);

        setRelatedBlogs(related);
      } catch (err: any) {
        setError(err.message || "Blog not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // Reading Progress
  useEffect(() => {
    const handleScroll = () => {
      const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setReadingProgress(Math.min(Math.max(progress, 0), 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/blog/${slug}`;
    const text = blogData?.title || "";
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`
    };
    window.open(shareUrls[platform], "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments(prev => [...prev, {
        id: Date.now(),
        text: comment,
        author: "You",
        date: new Date().toLocaleDateString("en-US")
      }]);
      setComment("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b1120]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C81D77]"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b1120]">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-6">{error || "Blog not found"}</p>
          <Link href="/blog" className="px-8 py-4 bg-[#C81D77] text-white rounded-3xl font-bold hover:scale-105">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200 dark:bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-[#C81D77] to-[#6710C2]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleLike}
          className={`p-4 rounded-3xl shadow-2xl ${isLiked ? "bg-red-500 text-white shadow-red-500/30" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20"}`}>
          <FaHeart size={22} className={isLiked ? "animate-pulse" : ""} />
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-4 rounded-3xl shadow-2xl ${isBookmarked ? "bg-[#6710C2] text-white shadow-purple-500/30" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50"}`}>
          <FaBookmark size={22} className={isBookmarked ? "animate-bounce" : ""} />
        </motion.button>

        <div className="relative">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-4 rounded-3xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 shadow-2xl">
            <FaShare size={22} />
          </motion.button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                className="absolute right-full mr-4 top-0 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-3 border border-gray-200 dark:border-gray-700 flex flex-col gap-1"
              >
                {[
                  { platform: "facebook", icon: FaFacebook, color: "text-blue-600" },
                  { platform: "twitter", icon: FaTwitter, color: "text-sky-500" },
                  { platform: "linkedin", icon: FaLinkedin, color: "text-blue-700" },
                  { platform: "whatsapp", icon: FaWhatsapp, color: "text-green-600" }
                ].map(({ platform, icon: Icon, color }) => (
                  <motion.button
                    key={platform}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleShare(platform)}
                    className={`p-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-3xl transition-all ${color}`}
                  >
                    <Icon size={24} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-4 rounded-3xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 shadow-2xl">
          ↑
        </motion.button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Link href="/blog" className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-[#C81D77] font-semibold text-lg mb-8 group">
            <FaArrowLeft className="group-active:rotate-12 transition-transform" /> Back to Blogs
          </Link>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-200 dark:border-purple-800 mb-6">
            <HiSparkles className="text-[#C81D77] animate-pulse" size={24} />
            <span className="text-sm font-black uppercase tracking-[2px] text-purple-700 dark:text-purple-300">
              {blogData.category || "General"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-none text-gray-900 dark:text-white max-w-4xl">
            {blogData.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <img src={blogData.authorImage} alt={blogData.author} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-purple-200 dark:ring-purple-800" />
              <div>
                <p className="font-bold text-lg">{blogData.author}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#6710C2]" />
              <span className="font-semibold">
                {new Date(blogData.createdAt || blogData.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-orange-500" />
              <span className="font-semibold">{blogData.readTime || 5} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-blue-500" />
              <span className="font-semibold">{blogData.views?.toLocaleString() || 0} views</span>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <div className="px-7 py-4 bg-white dark:bg-gray-800 rounded-3xl flex items-center gap-3 border border-gray-200 dark:border-gray-700 shadow-inner">
              <FaHeart className="text-red-500" size={24} />
              <span className="font-black text-2xl">{likes}</span>
              <span className="text-gray-500">Likes</span>
            </div>
            <div className="px-7 py-4 bg-white dark:bg-gray-800 rounded-3xl flex items-center gap-3 border border-gray-200 dark:border-gray-700 shadow-inner">
              <FaComment className="text-blue-500" size={24} />
              <span className="font-black text-2xl">{(blogData.comments || 0) + comments.length}</span>
              <span className="text-gray-500">Comments</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Image */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          <img 
            src={blogData.coverImage || blogData.image} 
            alt={blogData.title} 
            className="w-full h-[520px] md:h-[620px] object-cover" 
          />
        </motion.div>
      </section>

      {/* Article Content */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-lg dark:prose-invert max-w-none mx-auto
            prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-8
            prose-ul:my-8 prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-strong:text-[#C81D77] dark:prose-strong:text-[#C81D77]
            prose-a:text-[#6710C2] hover:prose-a:text-[#C81D77]"
        >
          <p className="text-2xl leading-relaxed text-gray-600 dark:text-gray-300">{blogData.excerpt}</p>

          <h2>What would life be like without programming?</h2>
          <p>Have you ever wondered what daily life would be like without programming? You wake up in the morning and want to listen to music on YouTube, but the app doesn't exist! You try to buy headphones from Daraz, but the site doesn't load. Planning to watch a movie on Netflix at night? That's cancelled too!</p>
          <p>Behind all of this is programming. And the most effective way to learn this programming is through a good Learning Management System (LMS).</p>

          <h2>What is a Learning Management System?</h2>
          <p>A Learning Management System or LMS is a digital platform where students can take online courses, teachers can upload content, and progress can be tracked.</p>

          <h3>Key Features of an LMS:</h3>
          <ul>
            <li><strong>Course Management:</strong> Teachers can easily create and manage courses.</li>
            <li><strong>Progress Tracking:</strong> Students can see their learning progress.</li>
            <li><strong>Interactive Learning:</strong> Various media including videos, quizzes, and assignments.</li>
            <li><strong>Certification:</strong> Providing certificates after course completion.</li>
          </ul>

          <h2>Why learn with an LMS?</h2>
          <p>There are many advantages to an LMS compared to traditional education systems:</p>
          <ul>
            <li><strong>Learn at your own pace:</strong> You can study whenever and wherever you want.</li>
            <li><strong>Lower Cost:</strong> Much more affordable than physical classes.</li>
            <li><strong>Updated Content:</strong> You can always learn the latest technology.</li>
            <li><strong>Community Support:</strong> Connect with other students.</li>
          </ul>
        </motion.article>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-16 pt-10 border-t border-gray-200 dark:border-gray-700">
          {blogData.tags?.map((tag: string) => (
            <span key={tag} className="px-5 py-2.5 rounded-3xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gradient-to-r hover:from-[#C81D77] hover:to-[#6710C2] hover:text-white transition-all cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center gap-8 shadow-inner">
          <img src={blogData.authorImage} alt={blogData.author} className="w-24 h-24 rounded-3xl object-cover" />
          <div>
            <h4 className="text-2xl font-black text-gray-900 dark:text-white">{blogData.author}</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{blogData.authorBio || "Experienced tech writer and educator."}</p>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Comments ({(blogData.comments || 0) + comments.length})</h3>
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={5}
              className="w-full px-6 py-5 rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#C81D77] outline-none text-lg resize-none"
            />
            <button type="submit" className="mt-4 px-10 py-4 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-bold rounded-3xl hover:scale-105 transition-all">
              Post Comment
            </button>
          </form>

          <div className="space-y-8">
            {comments.map(c => (
              <div key={c.id} className="flex gap-5 bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C81D77] to-[#6710C2] flex items-center justify-center text-white font-bold text-xl">
                  {c.author[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-bold">{c.author}</p>
                    <p className="text-xs text-gray-500">{c.date}</p>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-10 text-center">Read More</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map(related => (
                <Link key={related._id} href={`/blog/${related.slug}`} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-transparent hover:border-purple-200 transition-all hover:shadow-2xl">
                  <img src={related.coverImage || related.image} alt={related.title} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h4 className="font-black text-xl line-clamp-2 group-hover:text-[#C81D77]">{related.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-3">{related.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl p-14 text-center"
          style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
        >
          <h3 className="text-4xl font-black text-white mb-6">Ready to Start Your Learning Journey?</h3>
          <p className="text-white/90 text-xl mb-10">Join thousands of students already learning with us</p>
          <Link href="/enrollment">
            <button className="px-12 py-5 bg-white text-[#C81D77] font-black text-xl rounded-3xl hover:scale-110 transition-all shadow-2xl">
              Enroll Now
            </button>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}