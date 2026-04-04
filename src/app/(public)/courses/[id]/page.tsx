"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PlayCircle, Clock, Users, Star, 
  CheckCircle2, BookOpen, ArrowRight, 
  Quote, Sparkles, ChevronDown, Info,
  Play, GraduationCap, Layout
} from "lucide-react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ILesson {
  _id: string;
  title: string;
  type: string;
  duration?: string | number;
  videoUrl?: string;
  order: number;
}

interface IModule {
  _id: string;
  title: string;
  order: number;
  lessons: ILesson[];
}

interface IFAQ {
  question: string;
  answer: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
  coverImage?: { type?: string; url?: string } | string;
  salesVideoUrl?: string;
  salesVideo?: { type?: string; url?: string } | string;
  price?: number;
  originalPrice?: number;
  pricing?: {
    type?: string;
    price?: number;
    discountPrice?: number;
    accessDuration?: string;
    enrollmentLimit?: number;
  };
  modules: IModule[];
  faq?: IFAQ[];
  faqs?: IFAQ[];
  enrollmentCount?: number;
  enrolledCount?: number;
  instructorId: {
    _id: string;
    name: string;
    email: string;
    photoURL?: string;
  };
  status: string;
  visibility?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Data helpers ──────────────────────────────────────────────────────────────
function getCoverUrl(course: Course): string {
  if (course.thumbnail && course.thumbnail.trim()) return course.thumbnail.trim();
  if (course.coverImage) {
    if (typeof course.coverImage === "string") return course.coverImage.trim();
    if (typeof course.coverImage === "object" && course.coverImage.url) return course.coverImage.url.trim();
  }
  return "";
}

function getSalesVideoUrl(course: Course): string {
  if (course.salesVideoUrl && course.salesVideoUrl.trim()) return course.salesVideoUrl.trim();
  if (course.salesVideo) {
    if (typeof course.salesVideo === "string") return course.salesVideo.trim();
    if (typeof course.salesVideo === "object" && course.salesVideo.url) return course.salesVideo.url.trim();
  }
  return "";
}

function getPricing(course: Course) {
  const isFree   = course.pricing?.type === "free" || (!course.price && course.price !== 0);
  const price    = course.pricing?.price    ?? course.price    ?? 0;
  const discount = course.pricing?.discountPrice ?? course.originalPrice ?? null;
  const access   = course.pricing?.accessDuration ?? "lifetime";
  return { isFree, price, discount, access };
}

function getEnrolledCount(course: Course): number {
  return course.enrollmentCount ?? course.enrolledCount ?? 0;
}

function getFaqs(course: Course): IFAQ[] {
  return course.faq || course.faqs || [];
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function CourseDetailsPage() {
  const params   = useParams();
  const router   = useRouter();
  const courseId = params.id as string;

  const [course, setCourse]     = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (courseId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [courseRes, enrollmentRes] = await Promise.all([
            fetch(`/api/courses/${courseId}`),
            fetch(`/api/enrollments?courseId=${courseId}`).then(res => res.json()).catch(() => ({ success: false, enrollments: [] }))
          ]);

          const courseData = await courseRes.json();
          if (courseData.success) {
            setCourse(courseData.course);
          } else {
            setError(courseData.error || "Failed to load course");
          }

          if (enrollmentRes.success && enrollmentRes.enrollments?.length > 0) {
            setIsEnrolled(true);
          }
        } catch (err) {
          setError("Something went wrong");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [courseId]);

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const getTotalStats = () => {
    if (!course) return { totalLessons: 0, totalDuration: "0h 0m" };
    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    const totalMinutes = course.modules.reduce((acc, mod) =>
      acc + mod.lessons.reduce((sum, lesson) => {
        const dur   = String(lesson.duration || "0:00");
        const parts = dur.split(":").map(Number);
        return sum + (parts[0] || 0) + ((parts[1] || 0) / 60);
      }, 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const mins  = Math.round(totalMinutes % 60);
    return { totalLessons, totalDuration: `${hours}h ${mins}m` };
  };

  const calculateDiscountPercent = () => {
    if (!course) return 0;
    const { price, discount } = getPricing(course);
    if (!discount || !price || price <= 0 || discount >= price) return 0;
    return Math.round(((price - discount) / price) * 100);
  };

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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error || "Course not found"}</h2>
          <button onClick={() => router.push("/courses")} className="mt-4 px-6 py-3 bg-[#C81D77] text-white rounded-lg hover:bg-[#a0155e] transition-colors">
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const stats           = getTotalStats();
  const discountPercent = calculateDiscountPercent();
  const coverUrl        = getCoverUrl(course);
  const videoUrl        = getSalesVideoUrl(course);
  const pricing         = getPricing(course);
  const enrolledCount   = getEnrolledCount(course);
  const faqs            = getFaqs(course);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120]">
        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-6">
                <Sparkles className="w-4 h-4 text-[#C81D77]" />
                <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">{course.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{course.title}</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-bold border border-yellow-200 dark:border-yellow-800/50 capitalize">{course.level}</span>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold"><Users className="w-5 h-5 text-[#832388]" /> {enrolledCount.toLocaleString()} students</div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-bold"><Star className="w-5 h-5 text-amber-400 fill-amber-400" /> 4.8 (250+ reviews)</div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                {pricing.isFree ? <span className="text-5xl font-black text-emerald-500">Free</span> : (
                  <>
                    <span className="text-5xl font-black text-gray-900 dark:text-white">৳{(pricing.discount ?? pricing.price).toLocaleString()}</span>
                    {pricing.discount && pricing.discount < pricing.price && (
                      <>
                        <span className="text-2xl text-gray-400 dark:text-gray-600 line-through">৳{pricing.price.toLocaleString()}</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold text-xs border border-emerald-500/20">{discountPercent}% OFF</span>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={isEnrolled ? `/learn/${courseId}` : `/enrollment/${courseId}`}>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                    className="px-8 py-4 rounded-2xl text-white font-black text-lg shadow-xl flex items-center gap-3 cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #832388, #FF0F7B)" }}>
                    {isEnrolled ? "Continue Learning" : "Enroll Now"} <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                {videoUrl && (
                  <button onClick={() => setShowVideo(true)} 
                    className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-black text-lg hover:border-[#C81D77] transition-all flex items-center gap-3 cursor-pointer group">
                    <PlayCircle className="w-5 h-5 text-[#C81D77]" /> Watch Preview
                  </button>
                )}
              </div>
            </motion.div>

            {/* Right Column: Media Preview */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900 aspect-video flex items-center justify-center">
                {!showVideo ? (
                  <>
                    {coverUrl ? <img src={coverUrl} alt="Course Preview" className="w-full h-full object-cover" /> : <BookOpen className="w-20 h-20 text-gray-300" />}
                    {videoUrl && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group">
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowVideo(true)}
                          className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
                          style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}>
                          <Play className="text-white w-8 h-8 fill-white ml-1" />
                        </motion.button>
                      </div>
                    )}
                  </>
                ) : (
                  <iframe className="w-full h-full" src={`${getYouTubeEmbedUrl(videoUrl)}?autoplay=1`} title="Course Preview" frameBorder="0" allowFullScreen />
                )}
              </div>
              {/* Floating Badges */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <Clock className="w-8 h-8 text-[#832388]" />
                <div><p className="text-[10px] uppercase font-black text-gray-400">Duration</p><p className="font-black text-gray-900 dark:text-white uppercase">{stats.totalDuration}</p></div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3">
                <PlayCircle className="w-8 h-8 text-[#FF0F7B]" />
                <div><p className="text-[10px] uppercase font-black text-gray-400">Lessons</p><p className="font-black text-gray-900 dark:text-white uppercase">{stats.totalLessons} Videos</p></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-[#0b1120]">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { t: `${stats.totalLessons}+ Videos`, d: "Comprehensive video lessons from basics to advanced", i: PlayCircle },
              { t: "Lifetime Access", d: "Learn at your own pace with lifetime course access", i: Clock },
              { t: "Certificate", d: "Get a verified certificate of completion", i: GraduationCap },
              { t: "Expert Support", d: "Get help from industry experts whenever you need", i: Users },
              { t: "Projects", d: "Build real-world projects for your portfolio", i: Layout },
              { t: "Resources", d: "Downloadable resources and practice materials", i: BookOpen },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-[#C81D77] transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-[#C81D77] mb-6 group-hover:scale-110 transition-transform">
                   <f.i className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2">{f.t}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-12 bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700 w-fit">
            {["overview", "curriculum", "instructor", "faqs"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} 
                className={`px-8 py-3 rounded-xl font-black text-sm capitalize transition-all ${activeTab === t ? "bg-[#C81D77] text-white shadow-lg" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Course Description</h3>
                <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">{course.description}</div>
              </motion.div>
            )}

            {activeTab === "curriculum" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-4xl">
                {course.modules.map((m, i) => (
                  <div key={m._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center font-black text-[#C81D77]">{i + 1}</span>
                        <div><h4 className="font-black text-gray-900 dark:text-white">{m.title}</h4><p className="text-xs text-gray-500 font-bold uppercase">{m.lessons.length} Lessons</p></div>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      {m.lessons.map((l, li) => (
                        <div key={l._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-5 h-5 text-gray-300 group-hover:text-[#C81D77]" />
                            <span className="font-bold text-gray-700 dark:text-gray-300">{l.title}</span>
                          </div>
                          {l.duration && <span className="text-xs font-black text-gray-400 uppercase">{l.duration}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "instructor" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl bg-white dark:bg-gray-800 rounded-[40px] p-10 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-10 items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-gray-50 dark:border-gray-700 shadow-xl flex-shrink-0">
                  {course.instructorId.photoURL ? <img src={course.instructorId.photoURL} alt={course.instructorId.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#C81D77] flex items-center justify-center text-4xl font-black text-white">{course.instructorId.name[0]}</div>}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{course.instructorId.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">{course.instructorId.email}</p>
                  <div className="grid grid-cols-3 gap-8">
                    <div><p className="text-2xl font-black text-gray-900 dark:text-white">{(enrolledCount/1000).toFixed(1)}k+</p><p className="text-[10px] uppercase font-black text-gray-400">Students</p></div>
                    <div><p className="text-2xl font-black text-gray-900 dark:text-white">{course.modules.length}</p><p className="text-[10px] uppercase font-black text-gray-400">Courses</p></div>
                    <div><p className="text-2xl font-black text-gray-900 dark:text-white">4.8</p><p className="text-[10px] uppercase font-black text-gray-400">Rating</p></div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "faqs" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-3xl">
                {faqs.length > 0 ? faqs.map((f, i) => (
                  <details key={i} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer">
                    <summary className="list-none flex items-center justify-between font-black text-gray-900 dark:text-white">
                      {f.question} <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">{f.answer}</p>
                  </details>
                )) : <div className="p-10 text-center font-bold text-gray-400">No FAQs found.</div>}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="rounded-[50px] p-16 text-center relative overflow-hidden bg-gray-900 dark:bg-gray-800 text-white shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6">Start Learning Today</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Join thousands of students and transform your career with our expert-led courses.</p>
              <Link href={isEnrolled ? `/learn/${courseId}` : `/enrollment/${courseId}`}>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                  className="px-12 py-5 rounded-2xl bg-white text-gray-900 font-black text-xl shadow-xl hover:shadow-2xl transition-all">
                  {isEnrolled ? "Access Course Content" : "Get Started Now"}
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}