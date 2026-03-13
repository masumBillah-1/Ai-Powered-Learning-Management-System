"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

const StudentFeedbackPage = () => {
  const phGradient =
    "bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";
  const phTextGradient =
    "text-transparent bg-clip-text bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]";

  // Stats data
  const stats = [
    {
      icon: "🎓",
      count: "৫,০০০+",
      label: "সফল শিক্ষার্থী",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: "⭐",
      count: "৪.৮/৫",
      label: "গড় রেটিং",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      icon: "💼",
      count: "৮৫%",
      label: "চাকরি প্রাপ্তি",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: "🏆",
      count: "৯৫%",
      label: "সন্তুষ্টির হার",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "রাফি আহমেদ",
      role: "সফটওয়্যার ইঞ্জিনিয়ার",
      company: "Brain Station 23",
      image: "/public/image.png",
      rating: 5,
      feedback:
        "CareerCanvas এর AI-পাওয়ারড লার্নিং সিস্টেম আমার ক্যারিয়ারে বিপ্লব এনেছে। প্রতিটি কোর্স ছিল অত্যন্ত ইন্টারঅ্যাক্টিভ এবং প্র্যাক্টিক্যাল। ইন্সট্রাক্টররা সবসময় সাপোর্ট দিয়েছেন।",
      badge: "টপ পারফরমার",
      badgeColor: "bg-orange-500",
    },
    {
      id: 2,
      name: "তাসনিম জাহান",
      role: "ফ্রন্টএন্ড ডেভেলপার",
      company: "Truck Lagbe",
      image: "/public/image copy.png",
      rating: 5,
      feedback:
        "এই প্ল্যাটফর্মের মাধ্যমে আমি শূন্য থেকে শুরু করে একজন প্রফেশনাল ডেভেলপার হতে পেরেছি। প্রজেক্ট-বেসড লার্নিং এবং রিয়েল-টাইম ফিডব্যাক সিস্টেম অসাধারণ।",
      badge: "বেস্ট লার্নার",
      badgeColor: "bg-blue-500",
    },
    {
      id: 3,
      name: "সাকিব হাসান",
      role: "ব্যাকএন্ড ডেভেলপার",
      company: "রকমারি",
      image: "/public/image copy 2.png",
      rating: 5,
      feedback:
        "কোর্সের কন্টেন্ট কোয়ালিটি এবং ইন্সট্রাক্টরদের এক্সপার্টিজ সত্যিই প্রশংসনীয়। গ্যামিফিকেশন ফিচার শেখাকে আরও মজাদার করেছে। এখন আমি একটি ভালো কোম্পানিতে কাজ করছি।",
      badge: "কুইক লার্নার",
      badgeColor: "bg-green-500",
    },
    {
      id: 4,
      name: "নুসরাত জাহান",
      role: "ফুলস্ট্যাক ডেভেলপার",
      company: "WellDev",
      image: "/public/image copy 3.png",
      rating: 5,
      feedback:
        "CareerCanvas শুধু একটি লার্নিং প্ল্যাটফর্ম নয়, এটি একটি সম্পূর্ণ ক্যারিয়ার ট্রান্সফরমেশন জার্নি। মেন্টরশিপ এবং ক্যারিয়ার গাইডেন্স অসাধারণ ছিল।",
      badge: "স্টার স্টুডেন্ট",
      badgeColor: "bg-purple-500",
    },
    {
      id: 5,
      name: "ফারহান ইসলাম",
      role: "ডেটা সায়েন্টিস্ট",
      company: "vivesoft",
      image: "/public/image copy 4.png",
      rating: 5,
      feedback:
        "AI-ড্রিভেন পার্সোনালাইজড লার্নিং পাথ আমাকে দ্রুত স্কিল ডেভেলপ করতে সাহায্য করেছে। প্রতিটি মডিউল ছিল ইন্ডাস্ট্রি-রেলেভেন্ট এবং আপ-টু-ডেট।",
      badge: "এক্সিলেন্স অ্যাওয়ার্ড",
      badgeColor: "bg-red-500",
    },
    {
      id: 6,
      name: "মাহিয়া আক্তার",
      role: "UI/UX ডিজাইনার",
      company: "SELISSE",
      image: "/public/image copy 5.png",
      rating: 5,
      feedback:
        "ডিজাইন কোর্সগুলো ছিল অত্যন্ত প্র্যাক্টিক্যাল এবং ইন্ডাস্ট্রি-ফোকাসড। লাইভ প্রজেক্ট এবং পোর্টফোলিও বিল্ডিং সাপোর্ট আমার ক্যারিয়ারকে নতুন উচ্চতায় নিয়ে গেছে।",
      badge: "ক্রিয়েটিভ মাস্টার",
      badgeColor: "bg-pink-500",
    },
  ];

  // Company logos
  const companies = [
    { name: "Brain Station 23", logo: "🏢" },
    { name: "Truck Lagbe", logo: "🚚" },
    { name: "রকমারি", logo: "📚" },
    { name: "WellDev", logo: "💻" },
    { name: "vivesoft", logo: "🔧" },
    { name: "SELISSE", logo: "✨" },
  ];

  return (
    <div className="w-full bg-[#fcfaff] dark:bg-slate-950 transition-colors overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <HiSparkles className="text-[#E3436B] animate-pulse" />
            <span className="text-xs font-black text-[#832388] dark:text-purple-300 uppercase tracking-widest">
              শিক্ষার্থীদের সাফল্যের গল্প
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#1e1e2f] dark:text-white leading-tight">
            আমাদের শিক্ষার্থীরা{" "}
            <span className={phTextGradient}>সীমাহীন</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            হাজারো শিক্ষার্থী CareerCanvas এর মাধ্যমে তাদের ক্যারিয়ার গড়েছে এবং
            স্বপ্নের চাকরি পেয়েছে। তাদের সাফল্যের গল্প শুনুন।
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 text-center hover:scale-105 transition-transform"
            >
              <div
                className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}
              >
                {stat.icon}
              </div>
              <h3 className="text-3xl font-black text-[#1e1e2f] dark:text-white mb-2">
                {stat.count}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Our Learners Testimonials Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-[#1e1e2f] dark:text-white mb-4">
            আমাদের <span className={phTextGradient}>লার্নারদের</span> মতামত
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            বাস্তব শিক্ষার্থীদের বাস্তব অভিজ্ঞতা - তারা কীভাবে সফল হয়েছে তা
            জানুন
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 hover:shadow-2xl transition-all relative overflow-hidden group"
            >
              {/* Background Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-500" />

              {/* Quote Icon */}
              <FaQuoteLeft className="text-4xl text-purple-200 dark:text-purple-900/50 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg" />
                ))}
              </div>

              {/* Feedback Text */}
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                {testimonial.feedback}
              </p>

              {/* Student Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-[#1e1e2f] dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 font-bold">
                    {testimonial.company}
                  </p>
                </div>
                <div
                  className={`${testimonial.badgeColor} text-white text-xs font-black px-3 py-1.5 rounded-full`}
                >
                  {testimonial.badge}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    

      {/* Companies Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-black text-[#1e1e2f] dark:text-white mb-4">
            আমাদের শিক্ষার্থীরা <span className={phTextGradient}>কাজ করছে</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            দেশের শীর্ষস্থানীয় টেক কোম্পানিগুলোতে আমাদের শিক্ষার্থীরা সফলভাবে
            কর্মরত
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-3">{company.logo}</div>
              <p className="text-xs font-black text-gray-700 dark:text-gray-300 text-center uppercase">
                {company.name}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={`${phGradient} rounded-[40px] p-12 md:p-16 text-center shadow-2xl`}
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            তুমিও হতে পারো পরবর্তী সাফল্যের গল্প
          </h2>
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            আজই যুক্ত হও CareerCanvas এর সাথে এবং তোমার ক্যারিয়ারকে নিয়ে যাও
            নতুন উচ্চতায়
          </p>
          <button className="bg-white text-[#832388] px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl">
            ফ্রি ট্রায়াল শুরু করো
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentFeedbackPage;
