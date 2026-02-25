"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaPlay, 
  FaClock, 
  FaUsers, 
  FaStar, 
  FaCheckCircle, 
  FaBook,
  FaArrowRight,
  FaQuoteLeft
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";
import { coursesDatabase } from "./coursesData";

// Type definitions
type CourseModule = {
  module: string;
  lessons: number;
  duration: string;
  topics: string[];
};

type Testimonial = {
  name: string;
  role: string;
  image: string;
  text: string;
};

export default function CourseDetailsPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [showVideo, setShowVideo] = useState(false);

  // Get current course data
  const courseData = coursesDatabase[courseId] || coursesDatabase["1"];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120] overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Course Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-6">
                <HiSparkles className="text-[#C81D77] animate-pulse" />
                <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">
                  Bestseller Course
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {courseData.title}
              </h1>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {courseData.subtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500 text-xl" />
                  <span className="font-black text-gray-900 dark:text-white text-lg">{courseData.rating}</span>
                  <span className="text-gray-600 dark:text-gray-400">(2,450 reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-[#6710C2]" />
                  <span className="font-bold text-gray-700 dark:text-gray-300">{courseData.students} students</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-5xl font-black text-gray-900 dark:text-white">{courseData.price}</span>
                <span className="text-2xl text-gray-400 line-through">{courseData.originalPrice}</span>
                <span className="px-4 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-black text-sm">
                  40% OFF
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/enrollment">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-2xl text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                    style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
                  >
                    Enroll Now <FaArrowRight />
                  </motion.button>
                </Link>
                <button 
                  onClick={() => setShowVideo(true)}
                  className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-lg hover:border-[#C81D77] transition-all flex items-center gap-2"
                >
                  <FaPlay className="text-[#C81D77]" /> Watch Preview
                </button>
              </div>
            </motion.div>

            {/* Right: Video Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800">
                {!showVideo ? (
                  <>
                    <img 
                      src={courseData.thumbnail}
                      alt="Course Preview"
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setShowVideo(true)}
                        className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
                        style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                      >
                        <FaPlay className="text-white text-2xl ml-1" />
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-[400px]">
                    <iframe 
                      className="w-full h-full"
                      src={`${courseData.videoUrl}?autoplay=1`}
                      title="Course Preview Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <FaClock className="text-[#6710C2] text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Duration</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{courseData.duration}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <FaBook className="text-orange-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Lessons</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{courseData.lessons}+</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-[#0b1120]">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              What You&apos;ll Get
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Everything you need to become a professional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-[#C81D77] transition-all group"
              >
                <FaCheckCircle className="text-[#C81D77] text-2xl group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-700 dark:text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 bg-gray-50 dark:bg-[#161d2f]">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-200 dark:border-gray-700">
            {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-black text-lg capitalize transition-all ${
                  activeTab === tab
                    ? "text-[#C81D77] border-b-4 border-[#C81D77]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Course Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {courseData.overview.description}
              </p>
              
              <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4">Who is this course for?</h4>
              <ul className="space-y-2 mb-6">
                {courseData.overview.whoIsFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheckCircle className="text-[#C81D77] mt-1" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4">What you&apos;ll learn</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseData.overview.whatYouLearn.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#6710C2]" />
                    <span className="text-gray-700 dark:text-gray-300 font-bold">{skill}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "curriculum" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {courseData.curriculum.map((module, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                        {module.module}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaBook /> {module.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock /> {module.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-sm font-bold"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "instructor" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img 
                  src={courseData.instructor.image}
                  alt={courseData.instructor.name}
                  className="w-32 h-32 rounded-full border-4 border-purple-200 dark:border-purple-800"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    {courseData.instructor.name}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {courseData.instructor.title}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {courseData.instructor.students.toLocaleString()}+
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {courseData.instructor.courses}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">4.9</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {courseData.testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="text-lg font-black text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <FaQuoteLeft className="text-4xl text-purple-200 dark:text-purple-900/30 absolute -top-2 -left-2" />
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-8">
                      {testimonial.text}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="max-w-[1000px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[40px] overflow-hidden p-12 text-center"
            style={{ background: "linear-gradient(90deg, #832388, #E3436B, #F0772F)" }}
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join {courseData.students.toLocaleString()}+ students already learning and building their dream career
              </p>
              <Link href="/enrollment">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 rounded-2xl bg-white text-[#C81D77] font-black text-xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  Enroll Now - {courseData.price}
                </motion.button>
              </Link>
              <p className="text-white/80 mt-4 text-sm">30-day money-back guarantee</p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
