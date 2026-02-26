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

  const handleContinueCourse = (course: typeof coursesData[0]) => {
    setSelectedVideo({
      url: course.videoUrl,
      title: course.title,
    });
  };

  return (
    <div className="min-h-screen bg-[#05010D] text-white p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#832388] to-[#F0772F]">Ready For Your Next Lesson?</span>
        </h1>
        <p className="text-white/60">Continue your learning journey with Programming Hero</p>
      </div>

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {coursesData.map((course) => (
          <div
            key={course.id}
            className="group relative bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                className="absolute inset-0 opacity-60"
                style={{ background: course.color }}
              />
              <div className="absolute top-4 right-4">
                <ProgressRing progress={course.progress} />
              </div>
              {course.progress === 100 && (
                <div className="absolute top-4 left-4 bg-green-500/90 text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                  <I.Check />
                  Completed
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-white/60">{course.instructor}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-white/60 mb-2">
                  <span>
                    {course.completedLessons}/{course.totalLessons} lessons
                  </span>
                  <span className="font-bold text-white">{course.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${course.progress}%`,
                      background: course.color,
                    }}
                  />
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                <span className="flex items-center gap-1">
                  <I.Clock />
                  {course.duration}
                </span>
                <span>{course.category}</span>
                <span>Enrolled: {course.enrolled}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleContinueCourse(course)}
                className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: course.progress === 100 
                    ? "linear-gradient(90deg, #10b981, #059669)" 
                    : course.color,
                }}
              >
                {course.progress === 100 ? (
                  <>
                    <I.Check />
                    Review Course
                  </>
                ) : (
                  <>
                    <I.Play />
                    Continue Course
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
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
