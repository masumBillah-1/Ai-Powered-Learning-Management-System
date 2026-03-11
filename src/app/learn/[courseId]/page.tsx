"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay, FaCheckCircle, FaChevronDown, FaChevronUp,
  FaBook, FaClock, FaArrowLeft, FaFileAlt,
  FaTrophy, FaBars, FaTimes
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Lesson {
  _id: string;
  title: string;
  type: "video" | "quiz" | "assignment" | "text";
  duration: string;
  url?: string;
  textContent?: string;
  assignmentDesc?: string;
  order: number;
}
interface Module { _id: string; title: string; order: number; lessons: Lesson[] }
interface Course {
  _id: string; title: string; description: string;
  coverImage: { url: string };
  modules: Module[];
  instructorId: { name: string; photoURL?: string };
  level: string; category: string;
}
interface Enrollment {
  _id: string;
  progress: {
    completedLessons: string[];
    progressPercentage: number;
    currentLesson?: string;     // ← API returns "currentLesson" not "currentLessonId"
    currentLessonId?: string;
    totalTimeSpent: number;
  };
  status: string;
  certificate?: { issued: boolean };
}

// ── YouTube embed — rel=0 stops related videos ────────────────────────────────
function getYouTubeEmbedUrl(url: string) {
  if (!url) return "";
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\s]+)/);
  if (match) {
    // rel=0 → no related videos after end
    // modestbranding=1 → minimal YouTube branding
    // NOTE: "More videos" mid-video popup cannot be fully blocked via URL params —
    // it is triggered by YouTube internally. Use rel=0 to minimize it.
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&playsinline=1`;
  }
  return url;
}

function getLessonIcon(type: string, size = 10) {
  switch (type) {
    case "video": return <FaPlay style={{ fontSize: size }} />;
    case "quiz": return <FaBook style={{ fontSize: size }} />;
    case "assignment": return <FaFileAlt style={{ fontSize: size }} />;
    default: return <FaFileAlt style={{ fontSize: size }} />;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [completingLesson, setCompletingLesson] = useState(false);
  // Local completed lessons — so UI updates instantly without waiting for API
  const [localCompleted, setLocalCompleted] = useState<string[]>([]);
  const startTime = useRef<number>(Date.now());
  const activeLessonRef = useRef<Lesson | null>(null);

  useEffect(() => { if (courseId) fetchData(); }, [courseId]);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setLoading(true);
      const [courseRes, enrollRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/enrollments?courseId=${courseId}`),
      ]);
      const courseData = await courseRes.json();
      const enrollData = await enrollRes.json();

      if (courseData.success) {
        setCourse(courseData.course);
        setExpandedModules(courseData.course.modules.map((m: Module) => m._id));

        // Set first lesson only on first load
        const firstLesson = courseData.course.modules?.[0]?.lessons?.[0];
        if (firstLesson && !activeLessonRef.current) {
          setActiveLesson(firstLesson);
          activeLessonRef.current = firstLesson;
        }
      }

      if (enrollData.success && enrollData.enrollments?.length > 0) {
        const enroll = enrollData.enrollments[0];
        setEnrollment(enroll);

        // Sync local completed with server state
        const serverCompleted: string[] = enroll.progress?.completedLessons ?? [];
        setLocalCompleted(serverCompleted);

        // Resume from last lesson — API uses "currentLesson" field
        const lastLessonId = enroll.progress?.currentLesson || enroll.progress?.currentLessonId;
        if (lastLessonId && courseData.success) {
          const allLessons = courseData.course.modules.flatMap((m: Module) => m.lessons);
          const lastLesson = allLessons.find((l: Lesson) => l._id === lastLessonId);
          if (lastLesson) {
            setActiveLesson(lastLesson);
            activeLessonRef.current = lastLesson;
          }
        }
      }
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Lesson select ─────────────────────────────────────────────────────────────
  const handleLessonSelect = async (lesson: Lesson) => {
    if (activeLessonRef.current && enrollment) {
      const timeSpent = Math.round((Date.now() - startTime.current) / 60000);
      if (timeSpent > 0) await updateProgress(activeLessonRef.current._id, timeSpent, false);
    }
    startTime.current = Date.now();
    setActiveLesson(lesson);
    activeLessonRef.current = lesson;
  };

  // ── Mark complete ─────────────────────────────────────────────────────────────
  const handleMarkComplete = async () => {
    if (!activeLesson || completingLesson) return;
    if (localCompleted.includes(activeLesson._id)) return;

    setCompletingLesson(true);

    // ── Optimistic update: immediately show progress ─────────────────────────
    const newCompleted = [...localCompleted, activeLesson._id];
    setLocalCompleted(newCompleted);

    const timeSpent = Math.round((Date.now() - startTime.current) / 60000);
    await updateProgress(activeLesson._id, timeSpent, true);

    // Refresh from server to get accurate progressPercentage
    await fetchData();
    startTime.current = Date.now();
    setCompletingLesson(false);
  };

  const updateProgress = async (lessonId: string, timeSpent: number, completed: boolean) => {
    try {
      const res = await fetch("/api/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, timeSpent, completed }),
      });
      if (!res.ok) console.error("Progress update failed:", await res.text());
    } catch (err) { console.error("Progress update error:", err); }
  };

  const toggleModule = (id: string) =>
    setExpandedModules(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // ── Use localCompleted for instant UI, fallback to server ────────────────────
  const isCompleted = (id: string) => localCompleted.includes(id);

  const totalLessons = course?.modules?.reduce((a, m) => a + m.lessons.length, 0) ?? 0;
  const completedCount = localCompleted.length;
  // Calculate progress locally so it updates instantly after Mark Complete
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const getNextLesson = (): Lesson | null => {
    if (!course || !activeLesson) return null;
    const all = course.modules.flatMap(m => m.lessons);
    const idx = all.findIndex(l => l._id === activeLesson._id);
    return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}>
            <FaPlay className="text-white text-xl animate-pulse" />
          </div>
          <p className="text-gray-400 font-medium">Loading your course...</p>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-4">Course not found</h2>
          <button onClick={() => router.push("/dashboard/student/courses")}
            className="px-6 py-3 rounded-xl text-white font-bold"
            style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}>
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const nextLesson = getNextLesson();

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Top Nav ─────────────────────────────────────────────────────────── */}
      <header className="h-14 bg-[#161b22] border-b border-white/10 flex items-center justify-between px-4 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/student/courses")}
            className="flex cursor-pointer items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
            <FaArrowLeft className="text-xs" />
            <span className="hidden sm:block">My Courses</span>
          </button>
          <span className="text-white/20">|</span>
          <span className="text-white font-semibold text-sm truncate max-w-[180px] sm:max-w-xs">{course.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
                style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
              />
            </div>
            <span className="text-xs text-gray-300 font-bold tabular-nums">{progressPct}%</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            {sidebarOpen ? <FaTimes size={12} /> : <FaBars size={12} />}
          </button>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col overflow-y-auto">

          {/* ════ VIDEO PLAYER ════ */}
          <div className="bg-black w-full relative" style={{ aspectRatio: "16/9", maxHeight: "65vh" }}>
            {activeLesson?.type === "video" && activeLesson.url ? (
              // NOTE: "More videos" mid-video popup is controlled by YouTube —
              // rel=0 ensures no related videos AFTER the video ends.
              // The mid-video popup cannot be removed via embed params (YouTube policy).
              // To fully remove it, host videos on Cloudflare Stream / Bunny.net / Vimeo.
              <iframe
                key={activeLesson._id}
                src={getYouTubeEmbedUrl(activeLesson.url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                style={{ border: "none" }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#161b22] to-[#0d1117]">
                <div className="text-center px-6">
                  <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}>
                    {activeLesson?.type === "quiz" ? <FaBook className="text-white text-2xl" />
                      : <FaFileAlt className="text-white text-2xl" />}
                  </div>
                  <h3 className="text-white text-lg font-bold mb-1">{activeLesson?.title || "Select a lesson"}</h3>
                  <p className="text-gray-500 text-sm">
                    {activeLesson?.type === "text" ? "📄 Scroll down to read"
                      : activeLesson?.type === "assignment" ? "📋 Scroll down for instructions"
                        : activeLesson?.type === "quiz" ? "📝 Quiz — coming soon"
                          : "Sidebar থেকে lesson select করুন"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ════ LESSON INFO ════ */}
          <div className="p-5 border-b border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400 font-medium uppercase tracking-wider">
                    {activeLesson?.type || "lesson"}
                  </span>
                  {activeLesson && isCompleted(activeLesson._id) && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                      <FaCheckCircle size={10} /> Completed
                    </span>
                  )}
                </div>
                <h2 className="text-white text-xl font-bold leading-tight">
                  {activeLesson?.title || "Choose a lesson to start"}
                </h2>
                {activeLesson?.duration && (
                  <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                    <FaClock size={10} /> {activeLesson.duration}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {nextLesson && (
                  <button onClick={() => handleLessonSelect(nextLesson)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all whitespace-nowrap cursor-pointer">
                    Next →
                  </button>
                )}
                {activeLesson && !isCompleted(activeLesson._id) && (
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={handleMarkComplete} disabled={completingLesson}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg disabled:opacity-60 whitespace-nowrap cursor-pointer"
                    style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}>
                    <FaCheckCircle size={13} />
                    {completingLesson ? "Saving..." : "Mark Complete"}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* ════ TEXT CONTENT ════ */}
          {activeLesson?.type === "text" && activeLesson.textContent && (
            <div className="mx-5 my-4 p-6 rounded-2xl bg-[#161b22] border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}>
                  <FaFileAlt className="text-white text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">Lesson Content</h3>
              </div>
              {activeLesson.textContent.includes("<") ? (
                <div className="text-gray-300 text-sm leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: activeLesson.textContent }} />
              ) : (
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{activeLesson.textContent}</p>
              )}
            </div>
          )}

          {/* ════ ASSIGNMENT ════ */}
          {activeLesson?.type === "assignment" && activeLesson.assignmentDesc && (
            <div className="mx-5 my-4 p-6 rounded-2xl bg-[#161b22] border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
                  <FaFileAlt className="text-white text-sm" />
                </div>
                <h3 className="text-white font-bold text-sm">Assignment Instructions</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{activeLesson.assignmentDesc}</p>
              <div className="mt-5 p-4 rounded-xl border border-dashed border-white/20 text-center">
                <p className="text-gray-500 text-xs">📎 Submission — coming soon</p>
              </div>
            </div>
          )}

          {/* ════ QUIZ ════ */}
          {activeLesson?.type === "quiz" && (
            <div className="mx-5 my-4 p-6 rounded-2xl bg-[#161b22] border border-white/10 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6710C2, #C81D77)" }}>
                <FaBook className="text-white text-xl" />
              </div>
              <h3 className="text-white font-bold mb-1">Quiz</h3>
              <p className="text-gray-500 text-sm">Quiz feature — coming soon</p>
            </div>
          )}

          {/* ════ STATS ════ */}
          <div className="px-5 py-4 grid grid-cols-3 gap-4 border-b border-white/5 border-t border-t-white/5 mt-2">
            {[
              { label: "Completed", value: `${completedCount}/${totalLessons}`, icon: <FaCheckCircle className="text-emerald-400" /> },
              { label: "Progress", value: `${progressPct}%`, icon: <HiSparkles className="text-yellow-400" /> },
              { label: "Time Spent", value: `${enrollment?.progress?.totalTimeSpent || 0}m`, icon: <FaClock className="text-blue-400" /> },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {stat.icon}
                  <span className="text-white font-black text-sm tabular-nums">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ════ CERTIFICATE ════ */}
          {enrollment?.certificate?.issued && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mx-5 my-4 p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 flex items-center gap-4">
              <FaTrophy className="text-yellow-400 text-3xl flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-300 font-black">🎉 Certificate Earned!</p>
                <p className="text-yellow-400/60 text-xs mt-0.5">You have completed this course.</p>
              </div>
              <Link href="/dashboard/student/certificates">
                <button className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-bold text-xs hover:bg-yellow-400 transition-colors">View</button>
              </Link>
            </motion.div>
          )}

          {/* ════ MOBILE LESSONS LIST ════ */}
          <div className="md:hidden px-5 py-4">
            <h3 className="text-white font-bold text-sm mb-3">Course Content</h3>
            <div className="space-y-2">
              {course.modules.map((module, mIdx) => (
                <div key={module._id} className="rounded-xl bg-[#161b22] border border-white/10 overflow-hidden">
                  <button onClick={() => toggleModule(module._id)} className="w-full flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black"
                        style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}>{mIdx + 1}</span>
                      <span className="text-gray-300 text-xs font-bold text-left">{module.title}</span>
                    </div>
                    {expandedModules.includes(module._id) ? <FaChevronUp size={10} className="text-gray-500" /> : <FaChevronDown size={10} className="text-gray-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedModules.includes(module._id) && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden divide-y divide-white/5">
                        {module.lessons.map((lesson, lIdx) => {
                          const done = isCompleted(lesson._id);
                          const current = activeLesson?._id === lesson._id;
                          return (
                            <button key={lesson._id} onClick={() => handleLessonSelect(lesson)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${current ? "bg-[#C81D77]/10" : "hover:bg-white/5"}`}>
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500/20 text-emerald-400" : current ? "bg-[#C81D77]/20 text-[#C81D77]" : "bg-white/5 text-gray-500"}`}>
                                {done ? <FaCheckCircle size={10} /> : getLessonIcon(lesson.type)}
                              </div>
                              <span className={`text-xs font-medium ${current ? "text-white" : done ? "text-gray-400" : "text-gray-300"}`}>
                                {lIdx + 1}. {lesson.title}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ════ DESKTOP SIDEBAR ════ */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="bg-[#161b22] border-l border-white/10 overflow-y-auto flex-shrink-0 hidden md:block"
              style={{ maxHeight: "calc(100vh - 56px)" }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 sticky top-0 bg-[#161b22] z-10">
                <h3 className="text-white font-black text-sm">Course Content</h3>
                <p className="text-gray-500 text-xs mt-0.5">{completedCount}/{totalLessons} lessons completed</p>
                <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.5 }}
                    style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
                  />
                </div>
              </div>

              {/* Modules */}
              <div className="p-2">
                {course.modules.map((module, mIdx) => (
                  <div key={module._id} className="mb-1">
                    <button onClick={() => toggleModule(module._id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}>{mIdx + 1}</span>
                        <span className="text-gray-300 text-xs font-bold truncate text-left">{module.title}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-gray-600 text-xs">
                          {module.lessons.filter(l => isCompleted(l._id)).length}/{module.lessons.length}
                        </span>
                        {expandedModules.includes(module._id)
                          ? <FaChevronUp size={10} className="text-gray-500" />
                          : <FaChevronDown size={10} className="text-gray-500" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedModules.includes(module._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="overflow-hidden"
                        >
                          {module.lessons.map((lesson, lIdx) => {
                            const done = isCompleted(lesson._id);
                            const current = activeLesson?._id === lesson._id;
                            return (
                              <button key={lesson._id} onClick={() => handleLessonSelect(lesson)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg transition-all text-left mb-0.5 cursor-pointer ${current ? "bg-[#C81D77]/15 border border-[#C81D77]/30" : "hover:bg-white/5"
                                  }`}>
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500/20 text-emerald-400"
                                    : current ? "bg-[#C81D77]/20 text-[#C81D77]"
                                      : "bg-white/5 text-gray-500"
                                  }`}>
                                  {done ? <FaCheckCircle size={12} /> : getLessonIcon(lesson.type, 11)}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-medium truncate ${current ? "text-white" : done ? "text-gray-400 line-through" : "text-gray-300"
                                    }`}>
                                    {lIdx + 1}. {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {lesson.duration && (
                                      <span className="text-gray-600 text-[10px] flex items-center gap-1">
                                        <FaClock size={8} /> {lesson.duration}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">{lesson.type}</span>
                                  </div>
                                </div>

                                {current && (
                                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
                                    style={{ background: "#C81D77" }} />
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}