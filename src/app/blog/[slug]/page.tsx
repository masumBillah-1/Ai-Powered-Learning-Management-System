"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUser, FaClock, FaShare, FaBookmark, FaArrowLeft } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Blog data - real application e database theke ashbe
  const blogData: Record<string, {
    title: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
    tags: string[];
    content: string;
  }> = {
    "best-learning-management-course-bangladesh": {
      title: "Best Learning Management Course in Bangladesh",
      author: "Arif Almas",
      date: "May 5, 2025",
      readTime: "5 min read",
      category: "Learning Management",
      image: "https://i.ibb.co.com/zH75B27y/Gemini-Generated-Image-4de9wp4de9wp4de9.png",
      tags: ["Web Development", "Digital Marketing", "Graphics Design"],
      content: `
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

        <h2>বাংলাদেশে সেরা LMS কোর্স</h2>
        <p>বাংলাদেশে বর্তমানে অনেক LMS প্ল্যাটফর্ম রয়েছে, কিন্তু সবচেয়ে ভালো কোর্সগুলো হলো:</p>

        <h3>1. Web Development Bootcamp</h3>
        <p>এই কোর্সে আপনি শিখবেন HTML, CSS, JavaScript, React, Next.js এবং আরও অনেক কিছু। সম্পূর্ণ বাংলায় এবং প্র্যাক্টিক্যাল প্রজেক্ট সহ।</p>

        <h3>2. Digital Marketing Masterclass</h3>
        <p>Facebook Ads, Google Ads, SEO, Content Marketing - সব কিছু শিখুন একটি কোর্সে। বাংলাদেশের মার্কেটের জন্য বিশেষভাবে ডিজাইন করা।</p>

        <h3>3. Graphics Design Professional</h3>
        <p>Adobe Photoshop, Illustrator, Figma দিয়ে প্রফেশনাল ডিজাইন শিখুন। Freelancing এর জন্য পারফেক্ট কোর্স।</p>

        <h2>কেন LMS দিয়ে শিখবেন?</h2>
        <p>ট্র্যাডিশনাল শিক্ষা পদ্ধতির তুলনায় LMS এর অনেক সুবিধা রয়েছে:</p>

        <ul>
          <li><strong>নিজের গতিতে শিখুন:</strong> যখন খুশি, যেখানে খুশি পড়তে পারবেন</li>
          <li><strong>কম খরচ:</strong> ফিজিক্যাল ক্লাসের তুলনায় অনেক সাশ্রয়ী</li>
          <li><strong>আপডেটেড কন্টেন্ট:</strong> সবসময় লেটেস্ট টেকনোলজি শিখতে পারবেন</li>
          <li><strong>কমিউনিটি সাপোর্ট:</strong> অন্যান্য শিক্ষার্থীদের সাথে যোগাযোগ</li>
        </ul>

        <h2>AI-Powered Learning এর ভবিষ্যৎ</h2>
        <p>আধুনিক LMS প্ল্যাটফর্মগুলো এখন AI ব্যবহার করছে যা:</p>

        <ul>
          <li>আপনার শেখার ধরন বুঝে পার্সোনালাইজড কন্টেন্ট দেয়</li>
          <li>অটোমেটিক গ্রেডিং করে সময় বাঁচায়</li>
          <li>স্মার্ট সামারি তৈরি করে দ্রুত শিখতে সাহায্য করে</li>
          <li>আপনার দুর্বল জায়গা চিহ্নিত করে বিশেষ সাহায্য দেয়</li>
        </ul>

        <h2>কীভাবে শুরু করবেন?</h2>
        <p>LMS দিয়ে শেখা শুরু করা খুবই সহজ:</p>

        <ol>
          <li>একটি ভালো প্ল্যাটফর্ম বেছে নিন</li>
          <li>আপনার পছন্দের কোর্সে এনরোল করুন</li>
          <li>নিয়মিত প্র্যাক্টিস করুন</li>
          <li>কমিউনিটিতে সক্রিয় থাকুন</li>
          <li>প্রজেক্ট তৈরি করে পোর্টফোলিও বানান</li>
        </ol>

        <h2>সফলতার গল্প</h2>
        <p>আমাদের প্ল্যাটফর্মে হাজারো শিক্ষার্থী সফলভাবে কোর্স সম্পন্ন করে এখন বিভিন্ন কোম্পানিতে কাজ করছেন। অনেকে ফ্রিল্যান্সিং করে মাসে লাখ টাকা আয় করছেন।</p>

        <h2>উপসংহার</h2>
        <p>Learning Management System হলো আধুনিক যুগের শিক্ষার ভবিষ্যৎ। বাংলাদেশে এখন অনেক ভালো মানের LMS কোর্স পাওয়া যাচ্ছে যা আপনার ক্যারিয়ারকে নতুন উচ্চতায় নিয়ে যেতে পারে।</p>

        <p>আর দেরি না করে আজই শুরু করুন আপনার লার্নিং জার্নি! 🚀</p>
      `
    }
  };

  const blog = blogData[slug] || blogData["best-learning-management-course-bangladesh"];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">
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
                {blog.category}
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
            {blog.title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8"
          >
            <div className="flex items-center gap-2">
              <FaUser className="text-[#C81D77]" />
              <span className="font-bold">{blog.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-[#6710C2]" />
              <span className="font-bold">{blog.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-orange-500" />
              <span className="font-bold">{blog.readTime}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:border-[#C81D77] transition-all">
              <FaShare /> Share
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:border-[#6710C2] transition-all">
              <FaBookmark /> Save
            </button>
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
            src={blog.image} 
            alt={blog.title}
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
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          {blog.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

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
