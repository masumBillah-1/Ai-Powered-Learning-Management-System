"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

// Type definitions
interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  coverImage: {
    type: string;
    url: string;
  };
  salesVideo: {
    type: string;
    url: string;
  };
  pricing: {
    type: string;
    price: number;
    discountPrice?: number;
    accessDuration: string;
    enrollmentLimit?: number;
  };
  modules: Array<{
    _id: string;
    title: string;
    order: number;
    lessons: Array<{
      _id: string;
      title: string;
      type: string;
      duration: string;
      url?: string;
      order: number;
    }>;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  enrolledCount: number;
  instructorId: {
    _id: string;
    name: string;
    email: string;
    photoURL?: string;
  };
  status: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();

      if (data.success) {
        setCourse(data.course);
      } else {
        setError(data.error || "Failed to load course");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  // Calculate total lessons and duration
  const getTotalStats = () => {
    if (!course) return { totalLessons: 0, totalDuration: '0h 0m' };

    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

    const totalMinutes = course.modules.reduce((acc, mod) => {
      return acc + mod.lessons.reduce((sum, lesson) => {
        const duration = lesson.duration || '0:00';
        const parts = duration.split(':').map(Number);
        const minutes = parts.length === 2 ? parts[0] : 0;
        const seconds = parts.length === 2 ? parts[1] : 0;
        return sum + minutes + (seconds / 60);
      }, 0);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    const totalDuration = `${hours}h ${mins}m`;

    return { totalLessons, totalDuration };
  };

  const calculateDiscountPercent = () => {
    if (!course || !course.pricing.discountPrice) return 0;
    return Math.round(((course.pricing.price - course.pricing.discountPrice) / course.pricing.price) * 100);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C81D77] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error || "Course not found"}
          </h2>
          <button
            onClick={() => router.push('/courses')}
            className="mt-4 px-6 py-3 bg-[#C81D77] text-white rounded-lg hover:bg-[#a0155e] transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const stats = getTotalStats();
  const discountPercent = calculateDiscountPercent();

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
                  {course.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-bold">
                    {course.level}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-[#6710C2]" />
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {course.enrolledCount || 0} students
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                {course.pricing.type === "free" ? (
                  <span className="text-5xl font-black text-green-600">Free</span>
                ) : (
                  <>
                    <span className="text-5xl font-black text-gray-900 dark:text-white">
                      ৳{course.pricing.discountPrice || course.pricing.price}
                    </span>
                    {course.pricing.discountPrice && (
                      <>
                        <span className="text-2xl text-gray-400 line-through">
                          ৳{course.pricing.price}
                        </span>
                        <span className="px-4 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-black text-sm">
                          {discountPercent}% OFF
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href={`/enrollment/${courseId}`}>

                  <motion.button

                    whileHover={{ scale: 1.05 }}

                    whileTap={{ scale: 0.95 }}

                    className="px-8 py-4 rounded-2xl text-white font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"

                    style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}

                  >

                    Enroll Now <FaArrowRight />

                  </motion.button>

                </Link>
                {course.salesVideo.url && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black text-lg hover:border-[#C81D77] transition-all flex items-center gap-2"
                  >
                    <FaPlay className="text-[#C81D77]" /> Watch Preview
                  </button>
                )}
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
                      src={course.coverImage.url}
                      alt="Course Preview"
                      className="w-full h-[400px] object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Course+Image';
                      }}
                    />
                    {course.salesVideo.url && (
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
                    )}
                  </>
                ) : (
                  <div className="relative w-full h-[400px]">
                    <iframe
                      className="w-full h-full"
                      src={`${getYouTubeEmbedUrl(course.salesVideo.url)}?autoplay=1`}
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
                    <p className="text-lg font-black text-gray-900 dark:text-white">{stats.totalDuration}</p>
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
                    <p className="text-lg font-black text-gray-900 dark:text-white">{stats.totalLessons}</p>
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
            {[
              `${stats.totalLessons}+ Video Lessons`,
              `${course.pricing.accessDuration === 'lifetime' ? 'Lifetime' : course.pricing.accessDuration} Access`,
              "Certificate of Completion",
              "24/7 Support",
              "Real-world Projects",
              "Mobile & Desktop Access"
            ].map((feature, index) => (
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
            {["overview", "curriculum", "instructor", "faqs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-black text-lg capitalize transition-all ${activeTab === tab
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
                {course.description}
              </p>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-black text-gray-900 dark:text-white mb-4">Course Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C81D77]" />
                    <span className="text-gray-700 dark:text-gray-300 font-bold">
                      Level: {course.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C81D77]" />
                    <span className="text-gray-700 dark:text-gray-300 font-bold">
                      Category: {course.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C81D77]" />
                    <span className="text-gray-700 dark:text-gray-300 font-bold">
                      {stats.totalLessons} Total Lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-[#C81D77]" />
                    <span className="text-gray-700 dark:text-gray-300 font-bold">
                      {stats.totalDuration} Duration
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "curriculum" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {course.modules.map((module, index) => (
                <div
                  key={module._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#C81D77] text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white">
                          {module.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ml-13">
                        <span className="flex items-center gap-1">
                          <FaBook /> {module.lessons.length} lessons
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {module.lessons.map((lesson, idx) => (
                      <div
                        key={lesson._id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500 dark:text-gray-400 font-bold w-6">
                            {idx + 1}.
                          </span>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {lesson.type === 'video' && '📹 Video'}
                              {lesson.type === 'quiz' && '📝 Quiz'}
                              {lesson.type === 'assignment' && '📋 Assignment'}
                              {lesson.type === 'text' && '📄 Reading'}
                            </p>
                          </div>
                        </div>
                        {lesson.duration && (
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <FaClock className="text-xs" /> {lesson.duration}
                          </span>
                        )}
                      </div>
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
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-800 bg-gray-300">
                  {course.instructorId.photoURL ? (
                    <img
                      src={course.instructorId.photoURL}
                      alt={course.instructorId.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#C81D77] text-white text-4xl font-bold">
                      {course.instructorId.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    {course.instructorId.name}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {course.instructorId.email}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {course.enrolledCount || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {course.modules.length}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Modules</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "faqs" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {course.faqs.length > 0 ? (
                course.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 cursor-pointer"
                  >
                    <summary className="font-black text-lg text-gray-900 dark:text-white list-none flex items-center justify-between">
                      {faq.question}
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed pl-4 border-l-4 border-[#C81D77]">
                      {faq.answer}
                    </p>
                  </details>
                ))
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <div className="text-6xl mb-4">❓</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    No FAQs available for this course yet.
                  </p>
                </div>
              )}
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
                Join {course.enrolledCount || 0}+ students already learning and building their dream career
              </p>
              <Link href="/enrollment">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 rounded-2xl bg-white text-[#C81D77] font-black text-xl shadow-2xl hover:shadow-3xl transition-all"
                >
                  Enroll Now - ৳{course.pricing.discountPrice || course.pricing.price}
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