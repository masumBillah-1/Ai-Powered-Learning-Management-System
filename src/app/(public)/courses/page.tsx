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
  rating?: number;
  reviewCount?: number;
  modules?: any[];
  sampleStudents?: { _id: string; name: string; photoURL: string }[];
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

import { FaStar, FaStarHalfAlt, FaRegStar, FaPlayCircle, FaUsers, FaArrowRight, FaClock } from 'react-icons/fa';

// ✅ Rating Stars Component
const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-amber-400 w-3.5 h-3.5" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="text-amber-400 w-3.5 h-3.5" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-amber-400 w-3.5 h-3.5" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

// ── CourseCard ────────────────────────────────────────────────────────────────
const CourseCard = ({ course, index, isEnrolled }: { course: Course; index: number; isEnrolled: boolean }) => {
  const router   = useRouter();
  const coverUrl = getCoverUrl(course);
  const { isFree, regularPrice, salePrice, discountPercent } = getCoursePrice(course);

  const levelKey      = course.level?.toLowerCase() || '';
  const gradientClass = levelColors[course.level] || levelColors[levelKey] || "from-violet-500 to-purple-600";
  const levelClass    = levelBg[course.level]     || levelBg[levelKey]     || "bg-violet-500/10 text-violet-400 border-violet-500/30";

  // Calculate total lessons and duration
  const totalLessons = course.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0;
  
  const totalMinutes = course.modules?.reduce((acc: number, mod: any) => 
    acc + (mod.lessons?.reduce((sum: number, lesson: any) => sum + (Number(lesson.duration) || 0), 0) || 0)
  , 0) || 0;

  const hours = Math.floor(totalMinutes / 60);
  const mins  = Math.round(totalMinutes % 60);
  const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const rating = course.rating || 4.5;
  const reviewCount = course.reviewCount || Math.floor(Math.random() * 1000) + 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <div className="relative h-full flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 hover:border-[#C81D77]/40 shadow-sm hover:shadow-xl transition-all duration-500 group">

        {/* ─── Thumbnail ─── */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <img
            src={coverUrl || 'https://placehold.co/600x400/1a1a2e/C81D77?text=Course'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a2e/C81D77?text=Course'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <FaPlayCircle className="w-6 h-6" />
             </div>
          </div>

          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-[#C81D77] text-white text-xs font-bold uppercase tracking-tight shadow-lg shadow-pink-500/20">
              {discountPercent}% OFF
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex gap-2">
             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-md capitalize ${levelClass}`}>
              {course.level}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-white text-xs font-bold shadow-xl">
             <FaClock className="w-3 h-3 text-gray-300" />
             <span>{durationStr}</span>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          <Link href={`/courses/${course._id}`} className="block">
            <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight hover:text-[#C81D77] transition-colors duration-300 line-clamp-2 min-h-[40px]">
              {course.title}
            </h3>
          </Link>

          <div className="flex items-center justify-between min-h-[20px]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                {course.instructorId?.photoURL ? (
                  <img
                    src={course.instructorId.photoURL}
                    alt={course.instructorId?.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {course.instructorId?.name?.charAt(0) || "I"}
                  </div>
                )}
              </div>
              <p className="text-[12px] text-gray-600 dark:text-gray-500 truncate">
                {course.instructorId?.name || "Premium Instructor"}
              </p>
            </div>

            {/* Student Avatars Group — shown only if students exist */}
            {getEnrolledCount(course) > 0 && (
              <div className="flex flex-col items-end">
                <div className="avatar-group -space-x-3 rtl:space-x-reverse shrink-0">
                  {course.sampleStudents && course.sampleStudents.length > 0 && 
                    course.sampleStudents.slice(0, 3).map((student: any, i: number) => (
                      <div key={student._id || i} className="avatar border-[1.5px] border-[#C81D77]/50 rounded-full overflow-hidden bg-white">
                        <div className="w-6 h-6">
                          <img 
                            src={student.photoURL || `https://i.pravatar.cc/100?img=${i + 15}`} 
                            alt={student.name} 
                            referrerPolicy="no-referrer" 
                            onError={e => { (e.target as HTMLImageElement).src = `https://i.pravatar.cc/100?img=${i + 15}`; }}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    ))
                  }
                  <div className="avatar avatar-placeholder border-[1.5px] border-[#C81D77]/50 rounded-full overflow-hidden">
                      <div className="w-6 h-6 bg-gray-100 dark:bg-[#111827] text-[8px] font-bold text-gray-900 dark:text-white flex items-center justify-center shadow-inner">
                        <span>{getEnrolledCount(course).toLocaleString()}+</span>
                      </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-0.5">
             <span className="text-amber-400 text-sm font-bold">{rating.toFixed(1)}</span>
             <RatingStars rating={rating} />
             <span className="text-gray-500 text-xs">({reviewCount.toLocaleString()})</span>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-500 text-[11px] font-medium mt-1">
             <div className="flex items-center gap-1">
                <FaPlayCircle className="w-3 h-3 text-gray-400 dark:text-gray-600" />
                <span>{totalLessons} lessons</span>
             </div>
          </div>

          {/* ─── Price & CTA ─── */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-white/5">
            <div className="flex flex-col">
              {isFree ? (
                <span className="text-lg font-bold text-emerald-500">Free</span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ৳{salePrice ?? regularPrice}
                  </span>
                  {salePrice && (
                    <span className="text-xs text-gray-400 dark:text-gray-600 line-through">
                      ৳{regularPrice}
                    </span>
                  )}
                </div>
              )}
            </div>

            {isEnrolled ? (
              <button
                onClick={e => {
                  e.preventDefault();
                  router.push(`/learn/${course._id}`);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#6710C2] to-[#8b5cf6] text-white text-[11px] font-bold hover:gap-2 transition-all duration-300 shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                Continue <FaArrowRight className="w-2.5 h-2.5" />
              </button>
            ) : (
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#C81D77] to-[#a0155e] text-white text-[11px] font-bold hover:gap-2 transition-all duration-300 shadow-lg shadow-pink-500/20 cursor-pointer"
              >
                Enroll Now <FaArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── CoursesPage ───────────────────────────────────────────────────────────────
const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // ✅ New Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Fetch courses and enrollments in parallel
      const [coursesRes, enrollmentsRes] = await Promise.all([
        fetch('/api/courses?status=published'),
        fetch('/api/enrollments').then(res => res.json()).catch(() => ({ enrollments: [] }))
      ]);
      
      const coursesData = await coursesRes.json();

      if (coursesData.courses) {
        const publishedCourses = (coursesData.courses as Course[]).filter(
          course => course.status === "published"
        );
        setCourses(publishedCourses);

        // Populate categories
        const cats = Array.from(new Set(publishedCourses.map(c => c.category))).filter(Boolean) as string[];
        setCategories(["All", ...cats.sort()]);
      } else {
        setError("Failed to load courses");
      }

      if (enrollmentsRes.success && Array.isArray(enrollmentsRes.enrollments)) {
        const ids = enrollmentsRes.enrollments.map((e: any) => 
          typeof e.courseId === 'object' ? e.courseId._id : e.courseId
        );
        setEnrolledIds(ids.map(String));
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
      <div className="min-h-screen bg-white dark:bg-[#0b1120] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="h-12 w-64 mx-auto bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse mb-4" />
            <div className="h-5 w-80 mx-auto bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 animate-pulse">
                <div className="h-52 bg-gray-200 dark:bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-5/6" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-24" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
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
      <div className="min-h-screen bg-white dark:bg-[#0b1120] py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error}</h2>
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
      <div className="min-h-screen bg-white dark:bg-[#0b1120] py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-4">All Courses</h1>
          <div className="py-24">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No courses available yet</h2>
            <p className="text-gray-600 dark:text-gray-400">Check back soon for new courses!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] py-20 transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#C81D77]/5 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-700/5 blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 24 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
           className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#C81D77] font-bold mb-3">Learn & Grow</p>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight">
            All{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C81D77] to-[#ff6b9d]">
              Courses
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">Choose your path and start learning today</p>

          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C81D77]/30 bg-[#C81D77]/5 text-[#C81D77] text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#C81D77] animate-pulse" />
            {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
          </div>
        </motion.div>

        {/* ─── Search & Filtering ─── */}
        <div className="mb-14 flex flex-col md:flex-row items-center justify-center gap-4 max-w-5xl mx-auto px-4 md:px-0">
          <div className="relative w-full lg:flex-1 group">
             <label className="flex items-center gap-3 h-14 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl px-5 focus-within:ring-2 focus-within:ring-[#C81D77]/20 focus-within:border-[#C81D77]/50 transition-all cursor-text">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#C81D77] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text"
                  placeholder="Search by title or description..."
                  className="w-full bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </label>
          </div>

          <div className="w-full lg:w-72">
            <div className="relative">
              <select
                className="appearance-none w-full h-14 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-white/10 rounded-2xl px-5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C81D77]/20 focus:border-[#C81D77]/50 transition-all cursor-pointer text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.filter(c => c !== "All").map(cat => (
                  <option key={cat} value={cat} className="bg-white dark:bg-[#111827]">
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                 <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                 </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {courses
            .filter(c => {
              const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    c.description.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCat    = selectedCategory === "All" || c.category === selectedCategory;
              return matchesSearch && matchesCat;
            })
            .map((course, index) => (
              <CourseCard 
                key={course._id} 
                course={course} 
                index={index} 
                isEnrolled={enrolledIds.includes(course._id)} 
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;