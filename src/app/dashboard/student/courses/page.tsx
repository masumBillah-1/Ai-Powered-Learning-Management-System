"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Enrollment {
  _id: string;
  courseId: string | { _id: string; title?: string; coverImage?: { url: string } | string; instructorId?: { name: string; photoURL?: string } };
  courseName: string;
  courseImage: string;
  instructorName: string;
  status: "active" | "completed" | "dropped";
  enrolledAt: string;
  progress: {
    progressPercentage: number;
    completedLessons: string[];
    totalTimeSpent: number;
    lastAccessedAt?: string;
  };
  certificate?: { issued: boolean; issuedAt?: string; certificateId?: string };
}

type TabType = "active" | "completed" | "dropped";
const ITEMS_PER_PAGE = 6;
const PLACEHOLDER = "https://placehold.co/400x200/1a1a2e/C81D77?text=Course";

const getProgressColor = (p: number) => {
  if (p >= 80) return "#00C48C";
  if (p >= 50) return "#F89B29";
  return "#FF0F7B";
};

// ✅ enrollment থেকে safe values বের করো
function getCourseId(e: Enrollment): string {
  if (typeof e.courseId === "string") return e.courseId;
  return e.courseId?._id || "";
}

function getCourseImage(e: Enrollment): string {
  // ১. enrollment এ directly save করা image
  if (e.courseImage) return e.courseImage;
  // ২. populate করা courseId object থেকে
  if (typeof e.courseId === "object" && e.courseId?.coverImage) {
    const img = e.courseId.coverImage as any;
    // { url: "..." } বা সরাসরি string
    return img?.url || img || PLACEHOLDER;
  }
  return PLACEHOLDER;
}

function getCourseName(e: Enrollment): string {
  if (e.courseName) return e.courseName;
  if (typeof e.courseId === "object" && e.courseId?.title) {
    return e.courseId.title;
  }
  return "Untitled Course";
}

function getInstructorName(e: Enrollment): string {
  if (e.instructorName) return e.instructorName;
  if (typeof e.courseId === "object" && e.courseId?.instructorId) {
    return (e.courseId.instructorId as any)?.name || "Instructor";
  }
  return "Instructor";
}

function SkeletonCard() {
  return (
    <div className="card bg-base-100 border border-base-300 overflow-hidden animate-pulse">
      <div className="h-48 bg-base-300 w-full" />
      <div className="card-body p-5 space-y-3">
        <div className="h-3 bg-base-300 rounded w-3/4" />
        <div className="h-3 bg-base-300 rounded w-1/2" />
        <div className="h-3 bg-base-300 rounded w-full" />
        <div className="h-8 bg-base-300 rounded w-full mt-4" />
      </div>
    </div>
  );
}

export default function StudentCoursesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedCourses, setLikedCourses] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => { fetchEnrollments(); }, []);

  // ✅ Smart default tab — যে tab এ course আছে সেটা automatically select করো
  useEffect(() => {
    if (enrollments.length === 0) return;
    const hasActive = enrollments.some(e => e.status === "active");
    const hasCompleted = enrollments.some(e => e.status === "completed");
    const hasDropped = enrollments.some(e => e.status === "dropped");
    if (!hasActive && hasCompleted) setActiveTab("completed");
    else if (!hasActive && !hasCompleted && hasDropped) setActiveTab("dropped");
  }, [enrollments]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      // ✅ Authorization header — localStorage token
      const token = localStorage.getItem("token");
      const res = await fetch("/api/enrollments?limit=100", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments(data.enrollments || []);
      } else {
        console.error("Enrollments error:", data.error);
      }
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter((e) => e.status === activeTab);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const counts = {
    active: enrollments.filter((e) => e.status === "active").length,
    completed: enrollments.filter((e) => e.status === "completed").length,
    dropped: enrollments.filter((e) => e.status === "dropped").length,
  };

  const tabs: { key: TabType; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "dropped", label: "Dropped" },
  ];

  const toggleLike = (id: string) =>
    setLikedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const handleTabChange = (tab: TabType) => { setActiveTab(tab); setPage(1); };

  return (
    <div className="min-h-screen p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-sm opacity-60 mt-1">
            {enrollments.length} course{enrollments.length !== 1 ? "s" : ""} enrolled
          </p>
        </div>

        <div className="flex items-center gap-2 bg-base-200 p-1.5 rounded-full border border-base-300 self-start md:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${activeTab === tab.key ? "text-white shadow-lg" : "hover:bg-base-300"
                }`}
              style={{ backgroundColor: activeTab === tab.key ? "#FF0F7B" : "transparent" }}
            >
              {tab.label} ({counts[tab.key].toString().padStart(2, "0")})
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24"
        >
          <div className="text-6xl mb-4">
            {activeTab === "active" ? "📚" : activeTab === "completed" ? "🏆" : "📂"}
          </div>
          <h3 className="text-xl font-bold mb-2">No {activeTab} courses yet</h3>
          <p className="opacity-60 mb-6">
            {activeTab === "active"
              ? "Explore our courses and start learning today!"
              : activeTab === "completed"
                ? "Complete an enrolled course to see it here."
                : "You haven't dropped any courses."}
          </p>
          {activeTab === "active" && (
            <button
              onClick={() => router.push("/courses")}
              className="px-6 py-3 rounded-xl text-white font-bold shadow-lg"
              style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
            >
              Browse Courses
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginated.map((enrollment, idx) => {
                const courseId = getCourseId(enrollment);
                const courseImage = getCourseImage(enrollment);
                const courseName = getCourseName(enrollment);
                const instructorName = getInstructorName(enrollment);
                const progress = enrollment.progress?.progressPercentage || 0;

                return (
                  <motion.div
                    key={enrollment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <figure className="relative h-48 w-full overflow-hidden">
                      <img
                        src={courseImage}
                        alt={courseName}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER;
                        }}
                      />

                      {/* Heart */}
                      <button
                        onClick={() => toggleLike(enrollment._id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-base-100/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform border-0 cursor-pointer z-10"
                      >
                        <Heart
                          size={16}
                          className={likedCourses.includes(enrollment._id) ? "fill-[#FF0F7B] text-[#FF0F7B]" : ""}
                        />
                      </button>

                      {/* Completed overlay */}
                      {enrollment.status === "completed" && (
                        <div className="absolute bottom-3 left-3 right-3">
                          <div
                            className="text-white text-sm font-bold px-4 py-2 rounded-xl text-center shadow-lg backdrop-blur-md flex items-center justify-center gap-2"
                            style={{ backgroundColor: "#00C48C" }}
                          >
                            <CheckCircle size={16} />
                            <span>Completed</span>
                          </div>
                        </div>
                      )}

                      {/* Progress badge */}
                      {enrollment.status === "active" && (
                        <div className="absolute top-3 left-3">
                          <span
                            className="text-white text-xs font-black px-3 py-1 rounded-full shadow"
                            style={{ backgroundColor: getProgressColor(progress) }}
                          >
                            {progress}%
                          </span>
                        </div>
                      )}
                    </figure>

                    {/* Card Body */}
                    <div className="card-body p-5">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-[#C81D77] flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {instructorName?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <span className="text-xs font-semibold opacity-60 truncate max-w-[120px]">
                            {instructorName}
                          </span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#832388" }}>
                          {enrollment.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-base leading-snug mb-3 line-clamp-2 h-12 group-hover:text-[#FF0F7B] transition-colors">
                        {courseName}
                      </h3>

                      <div className="flex items-center gap-1 mb-3">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs opacity-60">
                          Enrolled:{" "}
                          {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {enrollment.status === "active" && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs font-bold opacity-60">Progress</span>
                            <span className="text-xs font-bold">{progress}%</span>
                          </div>
                          <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: getProgressColor(progress),
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Certificate */}
                      {enrollment.status === "completed" && enrollment.certificate?.issued && (
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle size={14} /> Certificate Issued
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-base-300 pt-4 mt-auto">
                        <span className="text-xs opacity-50">
                          {enrollment.progress?.completedLessons?.length || 0} lessons done
                        </span>
                        <button
                          onClick={() => router.push(`/learn/${courseId}`)}
                          className="btn btn-sm text-white border-0 gap-1 hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: "#171717" }}
                        >
                          {enrollment.status === "active" ? "Continue" : "Review"}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-base-300 pt-6">
              <p className="text-xs font-semibold opacity-60">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length} courses
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-sm btn-ghost border border-base-300 cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`btn btn-sm btn-circle font-bold border-0 cursor-pointer ${page === p ? "text-white shadow-md" : "btn-ghost"
                      }`}
                    style={page === p ? { backgroundColor: "#FF0F7B" } : {}}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-sm btn-ghost border border-base-300 cursor-pointer disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}