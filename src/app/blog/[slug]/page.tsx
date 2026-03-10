"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaClock, FaShare, FaBookmark, FaArrowLeft, FaHeart, FaComment, FaEye, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
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

  useEffect(() => {
    fetch('/data/blogs.json')
      .then(res => res.json())
      .then(data => {
        // Find blog from all sections
        let foundBlog = null;
        const allBlogs = [...data.popular, ...data.allBlogs, ...data.career, ...data.techUpdates];
        
        foundBlog = allBlogs.find((b: any) => b.slug === slug);
        
        if (!foundBlog) {
          foundBlog = data.featured;
        }
        
        setBlogData(foundBlog);
        setLikes(foundBlog?.likes || 0);
        
        // Get related blogs from same category
        const related = allBlogs
          .filter((b: any) => b.category === foundBlog?.category && b.slug !== slug)
          .slice(0, 3);
        setRelatedBlogs(related);
      })
      .catch(err => console.error('Error loading blog data:', err));
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/blog/${slug}`;
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments(prev => [...prev, {
        id: Date.now(),
        text: comment,
        author: "You",
        date: new Date().toLocaleDateString()
      }]);
      setComment("");
    }
  };

  if (!blogData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#C81D77] to-[#6710C2] transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <button
          onClick={handleLike}
          className={`p-4 rounded-full shadow-xl transition-all ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <FaHeart className={isLiked ? 'animate-pulse' : ''} />
        </button>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-4 rounded-full shadow-xl transition-all ${
            isBookmarked 
              ? 'bg-purple-500 text-white' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          }`}
        >
          <FaBookmark className={isBookmarked ? 'animate-bounce' : ''} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-4 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 shadow-xl transition-all"
          >
            <FaShare />
          </button>
          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-full mr-3 top-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-2 border border-gray-200 dark:border-gray-700"
              >
                {[
                  { platform: 'facebook', icon: FaFacebook, color: 'text-blue-600' },
                  { platform: 'twitter', icon: FaTwitter, color: 'text-sky-500' },
                  { platform: 'linkedin', icon: FaLinkedin, color: 'text-blue-700' },
                  { platform: 'whatsapp', icon: FaWhatsapp, color: 'text-green-600' }
                ].map(({ platform, icon: Icon, color }) => (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${color}`}
                  >
                    <Icon size={20} />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-4 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-xl transition-all"
        >
          ↑
        </button>
      </div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120]">
        <div className="max-w-[1000px] mx-auto px-4">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#C81D77] dark:hover:text-[#C81D77] font-bold mb-8 transition-colors"
            >
              <FaArrowLeft /> Back to Blog
            </Link>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-6">
              <HiSparkles className="text-[#C81D77] animate-pulse" />
              <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">
                {blogData.category}
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight"
          >
            {blogData.title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8"
          >
            <div className="flex items-center gap-2 group cursor-pointer relative">
              <img src={blogData.authorImage} alt={blogData.author} className="w-10 h-10 rounded-full" />
              <span className="font-bold">{blogData.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#6710C2]" />
              <span className="font-bold">{new Date(blogData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-orange-500" />
              <span className="font-bold">{blogData.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEye className="text-blue-500" />
              <span className="font-bold">{blogData.views.toLocaleString()} views</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold">
              <FaHeart className="text-red-500" /> {likes} Likes
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold">
              <FaComment className="text-blue-500" /> {blogData.comments + comments.length} Comments
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-[40px] overflow-hidden shadow-2xl"
        >
          <img 
            src={blogData.image} 
            alt={blogData.title}
            className="w-full h-[400px] md:h-[600px] object-cover"
          />
        </motion.div>
      </section>

      {/* Article Content */}
      <section className="max-w-[800px] mx-auto px-4 py-16">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-black prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
            prose-ul:my-6 prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-ol:my-6
            prose-strong:text-[#C81D77] dark:prose-strong:text-[#C81D77]
            prose-a:text-[#6710C2] hover:prose-a:text-[#C81D77]"
        >
          <p className="text-xl leading-relaxed">{blogData.excerpt}</p>
          
          <h2>প্রোগ্রামিং ছাড়া জীবন কেমন হতো?</h2>
          <p>আপনি কি কখনো ভেবেছেন প্রতিদিনের জীবনটা প্রোগ্রামিং ছাড়া কেমন হতো? সকালে ঘুম থেকে উঠে YouTube-এ গান শুনতে চান, কিন্তু অ্যাপই নেই! দুপুরে Daraz থেকে হেডফোন কিনতে গিয়েও দেখলেন সাইট লোড হয় না। রাতে Netflix-এ সিনেমা দেখার প্ল্যান? সেটাও বাতিল!</p>

          <p>এই সবকিছুর পেছনে আছে প্রোগ্রামিং। আর এই প্রোগ্রামিং শেখার সবচেয়ে কার্যকর উপায় হলো একটি ভালো Learning Management System (LMS)।</p>

          <h2>Learning Management System কী?</h2>
          <p>Learning Management System বা LMS হলো একটি ডিজিটাল প্ল্যাটফর্ম যেখানে শিক্ষার্থীরা অনলাইনে কোর্স করতে পারে, শিক্ষকরা কন্টেন্ট আপলোড করতে পারেন এবং প্রগ্রেস ট্র্যাক করা যায়।</p>

          <h3>LMS এর মূল বৈশিষ্ট্য:</h3>
          <ul>
            <li><strong>কোর্স ম্যানেজমেন্ট:</strong> শিক্ষকরা সহজেই কোর্স তৈরি এবং পরিচালনা করতে পারেন</li>
            <li><strong>প্রগ্রেস ট্র্যাকিং:</strong> শিক্ষার্থীরা তাদের শেখার অগ্রগতি দেখতে পারেন</li>
            <li><strong>ইন্টারেক্টিভ লার্নিং:</strong> ভিডিও, কুইজ, অ্যাসাইনমেন্ট সহ বিভিন্ন মাধ্যম</li>
            <li><strong>সার্টিফিকেট:</strong> কোর্স সম্পন্ন করার পর সার্টিফিকেট প্রদান</li>
          </ul>

          <h2>কেন LMS দিয়ে শিখবেন?</h2>
          <p>ট্র্যাডিশনাল শিক্ষা পদ্ধতির তুলনায় LMS এর অনেক সুবিধা রয়েছে:</p>

          <ul>
            <li><strong>নিজের গতিতে শিখুন:</strong> যখন খুশি, যেখানে খুশি পড়তে পারবেন</li>
            <li><strong>কম খরচ:</strong> ফিজিক্যাল ক্লাসের তুলনায় অনেক সাশ্রয়ী</li>
            <li><strong>আপডেটেড কন্টেন্ট:</strong> সবসময় লেটেস্ট টেকনোলজি শিখতে পারবেন</li>
            <li><strong>কমিউনিটি সাপোর্ট:</strong> অন্যান্য শিক্ষার্থীদের সাথে যোগাযোগ</li>
          </ul>
        </motion.article>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          {blogData.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Info */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center gap-6">
          <img src={blogData.authorImage} alt={blogData.author} className="w-20 h-20 rounded-full" />
          <div>
            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">{blogData.author}</h4>
            <p className="text-gray-600 dark:text-gray-400">{blogData.authorBio}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
            Comments ({blogData.comments + comments.length})
          </h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#C81D77] outline-none transition-colors resize-none"
            />
            <button
              type="submit"
              className="mt-3 px-6 py-3 bg-gradient-to-r from-[#C81D77] to-[#6710C2] text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C81D77] to-[#6710C2] flex items-center justify-center text-white font-bold">
                    {c.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{c.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{c.date}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{c.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map(related => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                >
                  <img src={related.image} alt={related.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#C81D77] transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {related.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 rounded-3xl text-center"
          style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
        >
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
            Ready to Start Your Learning Journey?
          </h3>
          <p className="text-white/90 text-lg mb-6">
            Join thousands of students already learning with us
          </p>
          <Link href="/enrollment">
            <button className="px-8 py-4 rounded-2xl bg-white text-[#C81D77] font-black text-lg hover:scale-105 transition-transform shadow-xl">
              Enroll Now
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
