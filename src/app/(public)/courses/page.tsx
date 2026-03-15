"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  // ✅ DB schema: thumbnail field (not coverImage.url)
  thumbnail?: string;
  coverImage?: { type?: string; url?: string };
  // ✅ DB schema: flat price & originalPrice
  price?: number;
  originalPrice?: number;
  // legacy
  pricing?: { type?: string; price?: number; discountPrice?: number };
  // ✅ DB schema: enrollmentCount
  enrollmentCount?: number;
  enrolledCount?: number;
  instructorId: { _id: string; name: string; photoURL?: string };
  status: string;
  visibility?: string;
}

const levelColors: Record<string, string> = {
  beginner:     "from-emerald-400 to-teal-500",
  intermediate: "from-amber-400 to-orange-500",
  advanced:     "from-rose-500 to-pink-600",
  Beginner:     "from-emerald-400 to-teal-500",
  Intermediate: "from-amber-400 to-orange-500",
  Advanced:     "from-rose-500 to-pink-600",
};

const levelBg: Record<string, string> = {
  beginner:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  advanced:     "bg-rose-500/10 text-rose-400 border-rose-500/30",
  Beginner:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  Advanced:     "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

// ✅ Cover image — DB তে thumbnail field
function getCoverUrl(course: Course): string {
  if (course.thumbnail && course.thumbnail.trim()) return course.thumbnail.trim();
  if (course.coverImage?.url && course.coverImage.url.trim()) return course.coverImage.url.trim();
  return '';
}

// ✅ Price info — DB তে flat price & originalPrice fields
// price = regular price (1000)
// originalPrice = sale/discount price (900) — form এ discountPrice → API route এ originalPrice save হয়
function getCoursePrice(course: Course): {
  isFree: boolean;
  regularPrice: number;
  salePrice: number | null;  // originalPrice (discounted price)
  discountPercent: number;
} {
  // legacy pricing object support
  if (course.pricing) {
    const reg  = course.pricing.price    ?? 0;
    const sale = course.pricing.discountPrice ?? null;
    const isFree = course.pricing.type === "free" || reg === 0;
    const pct  = (sale && reg && sale < reg) ? Math.round(((reg - sale) / reg) * 100) : 0;
    return { isFree, regularPrice: reg, salePrice: sale && sale < reg ? sale : null, discountPercent: pct };
  }

  // ✅ DB schema: flat fields
  const reg  = course.price    ?? 0;
  // DB: originalPrice = sale/discounted price (900), price = regular price (1000)
  const sale = (course.originalPrice && course.originalPrice < reg) ? course.originalPrice : null;
  const isFree = reg === 0;
  const pct  = (sale && reg) ? Math.round(((reg - sale) / reg) * 100) : 0;

  return { isFree, regularPrice: reg, salePrice: sale, discountPercent: pct };
}

function getEnrolledCount(course: Course): number {
  return course.enrollmentCount ?? course.enrolledCount ?? 0;
}

// ── CourseCard ────────────────────────────────────────────────────────────────
const CourseCard = ({ course, index }: { course: Course; index: number }) => {
  const router   = useRouter();
  const coverUrl = getCoverUrl(course);
  const { isFree, regularPrice, salePrice, discountPercent } = getCoursePrice(course);

  const levelKey      = course.level?.toLowerCase() || '';
  const gradientClass = levelColors[course.level] || levelColors[levelKey] || "from-violet-500 to-purple-600";
  const levelClass    = levelBg[course.level]     || levelBg[levelKey]     || "bg-violet-500/10 text-violet-400 border-violet-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/courses/${course._id}`} className="block h-full group">
        <div className="relative h-full flex flex-col rounded-3xl overflow-hidden bg-[#111827] border border-white/5 hover:border-[#C81D77]/40 shadow-xl hover:shadow-[0_0_50px_rgba(200,29,119,0.15)] transition-all duration-500">

          {/* ─── Thumbnail ─── */}
          <div className="relative h-52 overflow-hidden flex-shrink-0">
            <img
              src={coverUrl || 'https://placehold.co/600x400/1a1a2e/C81D77?text=Course'}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a2e/C81D77?text=Course'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/20 to-transparent" />

            {/* ✅ discountPercent — DB originalPrice থেকে calculate */}
            {discountPercent > 0 && (
              <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C81D77] text-white text-xs font-bold shadow-lg shadow-[#C81D77]/40">
                🔥 {discountPercent}% OFF
              </div>
            )}

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold border border-white/10 tracking-wide">
                {course.category}
              </span>
            </div>

            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md capitalize ${levelClass}`}>
                {course.level}
              </span>
            </div>
          </div>

          {/* ─── Body ─── */}
          <div className="flex flex-col flex-1 p-5 gap-3">
            <h3 className="text-base font-extrabold text-white leading-snug group-hover:text-[#C81D77] transition-colors duration-300 line-clamp-2">
              {course.title}
            </h3>

            <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 flex-1">
              {course.description}
            </p>

            <div className="h-px bg-white/5" />

            {/* Instructor row */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#C81D77]/30 flex-shrink-0">
                {course.instructorId?.photoURL ? (
                  <img
                    src={course.instructorId.photoURL}
                    alt={course.instructorId.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass} text-white text-xs font-black`}>
                    {course.instructorId?.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 leading-none mb-0.5">Instructor</p>
                <p className="text-xs font-semibold text-gray-300 truncate">{course.instructorId?.name}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <span>👥</span>
                <span className="font-semibold text-gray-400">{getEnrolledCount(course)}</span>
              </div>
            </div>

            {/* ─── Price bar ─── */}
            <div className="flex items-end justify-between mt-1 pt-3 border-t border-white/5">
              {isFree ? (
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-black text-emerald-400 leading-none">Free</span>
                  <span className="text-xs text-emerald-500/60 mb-0.5">Enroll now</span>
                </div>
              ) : (
                <div className="flex items-end gap-2">
                  {/* ✅ salePrice (originalPrice) থাকলে সেটা show, নইলে regularPrice */}
                  <span className="text-2xl font-black text-[#C81D77] leading-none">
                    ৳{salePrice ?? regularPrice}
                  </span>
                  {/* ✅ salePrice থাকলে regularPrice strikethrough দেখাও */}
                  {salePrice && (
                    <span className="text-sm text-gray-600 line-through mb-0.5">
                      ৳{regularPrice}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={e => {
                  e.preventDefault();
                  const token = localStorage.getItem("token");
                  if (!token) {
                    router.push(`/login?redirect=/courses/${course._id}`);
                  } else {
                    router.push(`/enrollment/${course._id}`);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#C81D77] to-[#a0155e] text-white text-xs font-bold shadow-md shadow-[#C81D77]/30 group-hover:shadow-[#C81D77]/60 transition-all duration-300 group-hover:gap-2.5 cursor-pointer border-0"
              >
                Enroll
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#C81D77] to-[#ff6b9d] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl" />
        </div>
      </Link>
    </motion.div>
  );
};

// ── CoursesPage ───────────────────────────────────────────────────────────────
const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res  = await fetch('/api/courses?status=published');
      const data = await res.json();

      if (data.courses) {
        const publishedCourses = (data.courses as Course[]).filter(
          course => course.status === "published"
        );
        setCourses(publishedCourses);
      } else {
        setError("Failed to load courses");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="h-12 w-64 mx-auto bg-gray-800 rounded-2xl animate-pulse mb-4" />
            <div className="h-5 w-80 mx-auto bg-gray-800 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-3xl overflow-hidden bg-[#111827] border border-white/5 animate-pulse">
                <div className="h-52 bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-700 rounded-xl w-3/4" />
                  <div className="h-4 bg-gray-700 rounded-xl w-full" />
                  <div className="h-4 bg-gray-700 rounded-xl w-5/6" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-8 bg-gray-700 rounded-xl w-24" />
                    <div className="h-8 bg-gray-700 rounded-full w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b1120] py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">{error}</h2>
          <button onClick={fetchCourses}
            className="mt-4 px-6 py-3 bg-[#C81D77] text-white rounded-full hover:bg-[#a0155e] transition-colors font-semibold">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b1120] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-black text-white mb-4">All Courses</h1>
          <div className="py-24">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white mb-2">No courses available yet</h2>
            <p className="text-gray-500">Check back soon for new courses!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] py-20">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#C81D77]/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-700/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#C81D77] font-bold mb-3">Learn & Grow</p>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
            All{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C81D77] to-[#ff6b9d]">
              Courses
            </span>
          </h1>
          <p className="text-gray-400 mt-4 text-lg">Choose your path and start learning today</p>

          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C81D77]/30 bg-[#C81D77]/5 text-[#C81D77] text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#C81D77] animate-pulse" />
            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {courses.map((course, index) => (
            <CourseCard key={course._id} course={course} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;