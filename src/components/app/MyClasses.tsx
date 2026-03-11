"use client";

import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const I = {
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Fire: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fb923c">
      <path d="M12 2c0 0-5 4-5 10a5 5 0 0 0 10 0C17 6 12 2 12 2zm0 14a3 3 0 0 1-3-3c0-3 3-6 3-6s3 3 3 6a3 3 0 0 1-3 3z" />
    </svg>
  ),
  Trophy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
};

// ── Course Data with Video Links ───────────────────────────────────────────
const coursesData = [
  {
    id: 1,
    title: "Complete Web Development Course With Programming Hero",
    instructor: "Jhankar Mahbub",
    progress: 100,
    totalLessons: 48,
    completedLessons: 48,
    duration: "24h 30m",
    category: "Web Development",
    color: "linear-gradient(90deg, #C81D77, #6710C2)",
    thumbnail: "https://img.youtube.com/vi/pJQXGmMofro/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/pJQXGmMofro",
    enrolled: "Jan 10, 2025",
  },
  {
    id: 2,
    title: "HTML Tutorial Bangla",
    instructor: "Jhankar Mahbub",
    progress: 68,
    totalLessons: 30,
    completedLessons: 20,
    duration: "15h 45m",
    category: "HTML",
    color: "linear-gradient(90deg, #FF0F7B, #F89B29)",
    thumbnail: "https://img.youtube.com/vi/WTmXc2xGwY4/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/WTmXc2xGwY4",
    enrolled: "Dec 15, 2024",
  },
  {
    id: 3,
    title: "React JS Bangla Tutorial - Stack Learner",
    instructor: "Stack Learner",
    progress: 45,
    totalLessons: 40,
    completedLessons: 18,
    duration: "20h 30m",
    category: "React",
    color: "linear-gradient(90deg, #832388, #E3436B, #F0772F)",
    thumbnail: "https://img.youtube.com/vi/Z-EkslDJTJI/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/Z-EkslDJTJI",
    enrolled: "Jan 5, 2025",
  },
  {
    id: 4,
    title: "JavaScript Bangla Tutorial",
    instructor: "Jhankar Mahbub",
    progress: 82,
    totalLessons: 35,
    completedLessons: 29,
    duration: "18h 20m",
    category: "JavaScript",
    color: "linear-gradient(90deg, #FF0F7B, #F89B29)",
    thumbnail: "https://img.youtube.com/vi/iWuEpnTTD3k/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/iWuEpnTTD3k",
    enrolled: "Nov 20, 2024",
  },
];

// ── Recommended Courses Data ───────────────────────────────────────────────
const recommendedCourses = [
  {
    id: 101,
    title: "Complete Web Development Course With Creative Coders",
    instructor: "Creative Coders",
    progress: 27,
    totalLessons: 50,
    completedLessons: 14,
    duration: "30h 00m",
    category: "Web Development",
    color: "linear-gradient(90deg, #C81D77, #6710C2)",
    thumbnail: "https://img.youtube.com/vi/1GKYXMIuBSQ/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/1GKYXMIuBSQ",
    badge: "Recommended BootCamp",
  },
  {
    id: 102,
    title: "Computer Science Engineering Fundamentals",
    instructor: "Tech Academy",
    progress: 0,
    totalLessons: 45,
    completedLessons: 0,
    duration: "25h 30m",
    category: "Computer Science",
    color: "linear-gradient(90deg, #FF0F7B, #F89B29)",
    thumbnail: "https://img.youtube.com/vi/XUAvMIu7fFY/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/XUAvMIu7fFY",
    badge: "New Course",
  },
  {
    id: 103,
    title: "4 Main Parts of a Computer",
    instructor: "Computer Basics",
    progress: 0,
    totalLessons: 12,
    completedLessons: 0,
    duration: "8h 15m",
    category: "Hardware",
    color: "linear-gradient(90deg, #832388, #E3436B, #F0772F)",
    thumbnail: "https://img.youtube.com/vi/CdUDYkliNSs/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/CdUDYkliNSs",
    badge: "Beginner Friendly",
  },
];

// ── Progress Ring Component ────────────────────────────────────────────────
const ProgressRing = ({ progress, size = 60 }: { progress: number; size?: number }) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#832388" />
            <stop offset="50%" stopColor="#E3436B" />
            <stop offset="100%" stopColor="#F0772F" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">{progress}%</span>
      </div>
    </div>
  );
};

// ── Video Modal Component ──────────────────────────────────────────────────
const VideoModal = ({
  isOpen,
  onClose,
  videoUrl,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl bg-[#0D0818] rounded-2xl overflow-hidden border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <I.Close />
          </button>
        </div>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function MyClasses() {
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const handleStartCourse = (course: { videoUrl: string; title: string }) => {
    console.log("🎥 Opening video:", course.title, course.videoUrl);
    setSelectedVideo({
      url: course.videoUrl,
      title: course.title,
    });
  };

  const totalProgress = Math.round(
    coursesData.reduce((acc, course) => acc + course.progress, 0) / coursesData.length
  );

  const completedCourses = coursesData.filter((c) => c.progress === 100).length;
  const inProgressCourses = coursesData.filter((c) => c.progress > 0 && c.progress < 100).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0118] via-[#1a0b2e] to-[#0a0118] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-10">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#832388] via-[#E3436B] to-[#F0772F] rounded-full" />
            <h1 className="text-4xl lg:text-5xl font-bold">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]">Learning</span> Journey
            </h1>
          </div>
          <p className="text-white/60 text-lg ml-3">Continue where you left off and achieve your goals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <I.BookOpen />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">{coursesData.length}</p>
                <p className="text-xs text-white/50">Total Courses</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <I.Trophy />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{completedCourses}</p>
                <p className="text-xs text-white/50">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <I.Fire />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">{inProgressCourses}</p>
                <p className="text-xs text-white/50">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <I.Star />
              </div>
              <div>
                <p className="text-2xl font-bold text-pink-400">{totalProgress}%</p>
                <p className="text-xs text-white/50">Avg Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="group relative bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm"
            >
              {/* Thumbnail with Overlay */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity"
                  style={{ background: course.color }}
                />
                
                {/* Progress Ring - Top Right */}
                <div className="absolute top-4 right-4">
                  <ProgressRing progress={course.progress} size={70} />
                </div>

                {/* Completion Badge */}
                {course.progress === 100 && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg animate-bounce">
                    <I.Trophy />
                    Completed
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleStartCourse(course)}
                    className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                  >
                    <I.Play />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title & Instructor */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#832388] group-hover:to-[#F0772F] transition-all">
                    {course.title}
                  </h3>
                  <p className="text-sm text-white/60 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                      {course.instructor[0]}
                    </span>
                    {course.instructor}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                    <span className="flex items-center gap-1">
                      <I.BookOpen />
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className="font-bold text-white text-sm">{course.progress}%</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full rounded-full transition-all duration-700 shadow-lg"
                      style={{
                        width: `${course.progress}%`,
                        background: course.color,
                        boxShadow: `0 0 20px ${course.progress === 100 ? '#10b981' : 'rgba(131, 35, 136, 0.5)'}`,
                      }}
                    />
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-white/50 mb-5 pb-5 border-b border-white/5">
                  <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                    <I.Clock />
                    {course.duration}
                  </span>
                  <span className="bg-white/5 px-3 py-1.5 rounded-lg">{course.category}</span>
                  <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg">
                    <I.Star />
                    Enrolled
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStartCourse(course)}
                    className="flex-1 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
                    style={{
                      background: course.progress === 100 
                        ? "linear-gradient(90deg, #10b981, #059669)" 
                        : course.color,
                    }}
                  >
                    {course.progress === 100 ? (
                      <>
                        <I.Trophy />
                        Review Course
                      </>
                    ) : course.progress > 0 ? (
                      <>
                        <I.Play />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <I.Play />
                        Start Course
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Footer */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl px-8 py-6 backdrop-blur-sm">
            <p className="text-white/80 text-lg mb-2">
              🎯 Keep learning, keep growing!
            </p>
            <p className="text-white/50 text-sm">
              You're doing great. Complete {coursesData.length - completedCourses} more courses to become a master!
            </p>
          </div>
        </div>

        {/* Recommended Courses Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#832388] to-[#F0772F]">Recommended</span> For You
              </h2>
              <p className="text-white/60">Expand your skills with these curated courses</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {recommendedCourses.map((course) => (
              <div
                key={course.id}
                className="group relative bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm"
              >
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg">
                  {course.badge}
                </div>

                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className="absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity"
                    style={{ background: course.color }}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleStartCourse(course)}
                      className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-2xl"
                    >
                      <I.Play />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#832388] group-hover:to-[#F0772F] transition-all">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/60 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                        {course.instructor[0]}
                      </span>
                      {course.instructor} • {course.category}
                    </p>
                  </div>

                  {/* Progress Bar (if started) */}
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                        <span className="flex items-center gap-1">
                          <I.BookOpen />
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                        <span className="font-bold text-white text-sm">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${course.progress}%`,
                            background: course.color,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-white/50 mb-5 pb-5 border-b border-white/5">
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg">
                      <I.Clock />
                      {course.duration}
                    </span>
                    <span className="bg-white/5 px-3 py-1.5 rounded-lg">{course.totalLessons} lessons</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartCourse(course)}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
                    style={{
                      background: course.progress > 0 ? course.color : "linear-gradient(90deg, #10b981, #059669)",
                    }}
                  >
                    {course.progress > 0 ? (
                      <>
                        <I.Play />
                        Continue Course
                      </>
                    ) : (
                      <>
                        <I.Play />
                        Start Course
                      </>
                    )}
                  </button>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoUrl={selectedVideo?.url || ""}
        title={selectedVideo?.title || ""}
      />
    </div>
  );
}
