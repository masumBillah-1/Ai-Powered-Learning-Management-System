"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlay, FaCheckCircle, FaChevronDown, FaChevronUp,
  FaBook, FaClock, FaArrowLeft, FaLock, FaFileAlt,
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
  order: number;
}

interface Module {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  coverImage: { url: string };
  modules: Module[];
  instructorId: { name: string; photoURL?: string };
  level: string;
  category: string;
}

interface Enrollment {
  _id: string;
  progress: {
    completedLessons: string[];
    progressPercentage: number;
    currentLessonId?: string;
    totalTimeSpent: number;
  };
  status: string;
  certificate?: { issued: boolean; certificateId?: string };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getYouTubeEmbedUrl(url: string) {
  if (!url) return "";
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  if (url.includes("youtube.com/embed")) return url;
  return url;
}

function getLessonIcon(type: string) {
  switch (type) {
    case "video":      return <FaPlay className="text-[10px]" />;
    case "quiz":       return <FaBook className="text-[10px]" />;
    case "assignment": return <FaFileAlt className="text-[10px]" />;
    default:           return <FaFileAlt className="text-[10px]" />;
  }
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function DetailsPage() {
  const params    = useParams();
  const router    = useRouter();
  const courseId  = params.courseId as string;

  const [course, setCourse]           = useState<Course | null>(null);
  const [enrollment, setEnrollment]   = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [completingLesson, setCompletingLesson] = useState(false);
  const startTime = useRef<number>(Date.now());

  // ── Fetch data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (courseId) fetchData();
  }, [courseId]);

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

  
        const firstLesson = courseData.course.modules?.[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      }

      if (enrollData.success && enrollData.enrollments?.length > 0) {
        const enroll = enrollData.enrollments[0];
        setEnrollment(enroll);

        if (enroll.progress?.currentLessonId && courseData.success) {
          const allLessons = courseData.course.modules.flatMap((m: Module) => m.lessons);
          const lastLesson = allLessons.find(
            (l: Lesson) => l._id === enroll.progress.currentLessonId
          );
          if (lastLesson) setActiveLesson(lastLesson);
        }
      }
    } catch (err) {
      console.error("Failed to load course:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Lesson select ───────────────────────────────────────────────────────────
  const handleLessonSelect = async (lesson: Lesson) => {
  
    if (activeLesson && enrollment) {
      const timeSpent = Math.round((Date.now() - startTime.current) / 60000); // minutes
      if (timeSpent > 0) {
        await updateProgress(activeLesson._id, timeSpent, false);
      }
    }
    startTime.current = Date.now();
    setActiveLesson(lesson);
  };

  // ── Mark lesson complete ────────────────────────────────────────────────────
  const handleMarkComplete = async () => {
    if (!activeLesson || !enrollment || completingLesson) return;
    setCompletingLesson(true);

    const timeSpent = Math.round((Date.now() - startTime.current) / 60000);
    await updateProgress(activeLesson._id, timeSpent, true);

    // Enrollment refresh
    await fetchData();
    startTime.current = Date.now();
    setCompletingLesson(false);
  };

  const updateProgress = async (lessonId: string, timeSpent: number, completed: boolean) => {
    try {
      await fetch("/api/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, timeSpent, completed }),
      });
    } catch (err) {
      console.error("Progress update failed:", err);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const isCompleted = (lessonId: string) =>
    enrollment?.progress?.completedLessons?.includes(lessonId) ?? false;

  const totalLessons = course?.modules?.reduce(
    (acc, m) => acc + m.lessons.length, 0
  ) ?? 0;

  const completedCount = enrollment?.progress?.completedLessons?.length ?? 0;
  const progressPct = enrollment?.progress?.progressPercentage ?? 0;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}
          >
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
          <button
            onClick={() => router.push("/sampleDashboard/student/courses")}
            className="px-6 py-3 rounded-xl text-white font-bold"
            style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Top Nav ────────────────────────────────────────────────────────── */}
      <header className="h-14 bg-[#161b22] border-b border-white/10 flex items-center justify-between px-4 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/sampleDashboard/student/courses")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            <FaArrowLeft className="text-xs" />
            <span className="hidden sm:block">My Courses</span>
          </button>
          <span className="text-white/20">|</span>
          <span className="text-white font-semibold text-sm truncate max-w-[200px] sm:max-w-xs">
            {course.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress pill */}
          <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #C81D77, #6710C2)",
                }}
              />
            </div>
            <span className="text-xs text-gray-300 font-bold">{progressPct}%</span>
          </div>

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {sidebarOpen ? <FaTimes size={12} /> : <FaBars size={12} />}
          </button>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-y-auto">

          {/* Video / Content Area */}
          <div className="bg-black w-full" style={{ aspectRatio: "16/9", maxHeight: "65vh" }}>
            {activeLesson?.type === "video" && activeLesson.url ? (
              <iframe
                key={activeLesson._id}
                src={getYouTubeEmbedUrl(activeLesson.url)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#161b22] to-[#0d1117]">
                <div className="text-center px-6">
                  <div
                    className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}
                  >
                    {activeLesson?.type === "quiz" ? (
                      <FaBook className="text-white text-2xl" />
                    ) : (
                      <FaFileAlt className="text-white text-2xl" />
                    )}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    {activeLesson?.title || "Select a lesson"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {activeLesson?.type === "quiz"
                      ? "Quiz content — coming soon"
                      : activeLesson?.type === "assignment"
                      ? "Assignment — check details below"
                      : "Select a lesson from the sidebar to begin"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Info + Actions */}
          <div className="p-6 border-b border-white/5">
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

              {/* Mark Complete button */}
              {activeLesson && !isCompleted(activeLesson._id) && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleMarkComplete}
                  disabled={completingLesson}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg disabled:opacity-60 whitespace-nowrap"
                  style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
                >
                  <FaCheckCircle size={14} />
                  {completingLesson ? "Marking..." : "Mark Complete"}
                </motion.button>
              )}
            </div>
          </div>

          {/* Progress bar (mobile) */}
          <div className="sm:hidden px-6 py-3 border-b border-white/5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Course Progress</span>
              <span className="text-xs text-white font-bold">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPct}%`,
                  background: "linear-gradient(90deg, #C81D77, #6710C2)",
                }}
              />
            </div>
          </div>

          {/* Course stats */}
          <div className="px-6 py-4 grid grid-cols-3 gap-4 border-b border-white/5">
            {[
              { label: "Completed", value: `${completedCount}/${totalLessons}`, icon: <FaCheckCircle className="text-emerald-400" /> },
              { label: "Progress",  value: `${progressPct}%`,                  icon: <HiSparkles className="text-yellow-400" /> },
              { label: "Time Spent",value: `${enrollment?.progress?.totalTimeSpent || 0}m`, icon: <FaClock className="text-blue-400" /> },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  {stat.icon}
                  <span className="text-white font-black text-sm">{stat.value}</span>
                </div>
                <p className="text-gray-600 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Certificate banner */}
          {enrollment?.certificate?.issued && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-6 my-4 p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 flex items-center gap-4"
            >
              <FaTrophy className="text-yellow-400 text-3xl flex-shrink-0" />
              <div className="flex-1">
                <p className="text-yellow-300 font-black">🎉 Certificate Earned!</p>
                <p className="text-yellow-400/60 text-xs mt-0.5">
                  You have successfully completed this course.
                </p>
              </div>
              <Link href="/sampleDashboard/student/certificates">
                <button className="px-4 py-2 rounded-lg bg-yellow-500 text-black font-bold text-xs hover:bg-yellow-400 transition-colors">
                  View
                </button>
              </Link>
            </motion.div>
          )}
        </main>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#161b22] border-l border-white/10 overflow-y-auto flex-shrink-0 hidden md:block"
              style={{ maxHeight: "calc(100vh - 56px)" }}
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-white/10 sticky top-0 bg-[#161b22] z-10">
                <h3 className="text-white font-black text-sm">Course Content</h3>
                <p className="text-gray-500 text-xs mt-0.5">
                  {completedCount}/{totalLessons} lessons completed
                </p>
                {/* Progress bar */}
                <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: "linear-gradient(90deg, #C81D77, #6710C2)",
                    }}
                  />
                </div>
              </div>

              {/* Modules */}
              <div className="p-2">
                {course.modules.map((module, mIdx) => (
                  <div key={module._id} className="mb-1">
                    {/* Module header */}
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}
                        >
                          {mIdx + 1}
                        </span>
                        <span className="text-gray-300 text-xs font-bold truncate text-left">
                          {module.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-gray-600 text-xs">
                          {module.lessons.filter((l) => isCompleted(l._id)).length}/
                          {module.lessons.length}
                        </span>
                        {expandedModules.includes(module._id) ? (
                          <FaChevronUp size={10} className="text-gray-500" />
                        ) : (
                          <FaChevronDown size={10} className="text-gray-500" />
                        )}
                      </div>
                    </button>

                    {/* Lessons */}
                    <AnimatePresence>
                      {expandedModules.includes(module._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {module.lessons.map((lesson, lIdx) => {
                            const done    = isCompleted(lesson._id);
                            const current = activeLesson?._id === lesson._id;

                            return (
                              <button
                                key={lesson._id}
                                onClick={() => handleLessonSelect(lesson)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg transition-all text-left mb-0.5 ${
                                  current
                                    ? "bg-[#C81D77]/15 border border-[#C81D77]/30"
                                    : "hover:bg-white/5"
                                }`}
                              >
                                {/* Icon */}
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    done
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : current
                                      ? "bg-[#C81D77]/20 text-[#C81D77]"
                                      : "bg-white/5 text-gray-500"
                                  }`}
                                >
                                  {done ? (
                                    <FaCheckCircle size={12} />
                                  ) : (
                                    getLessonIcon(lesson.type)
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs font-medium truncate ${
                                      current ? "text-white" : done ? "text-gray-400" : "text-gray-300"
                                    }`}
                                  >
                                    {lIdx + 1}. {lesson.title}
                                  </p>
                                  {lesson.duration && (
                                    <p className="text-gray-600 text-[10px] mt-0.5 flex items-center gap-1">
                                      <FaClock size={8} /> {lesson.duration}
                                    </p>
                                  )}
                                </div>
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