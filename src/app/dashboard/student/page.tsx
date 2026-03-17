"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen, PlayCircle, CheckCircle, Heart, ChevronRight, Clock, TrendingUp, Calendar, Loader2
} from 'lucide-react';

// ✅ theme state নেই — DashboardLayout data-theme set করে
// CSS variables (bg-base-100, text-base-content ইত্যাদি) auto কাজ করে

interface DashboardData {
  user: {
    _id: string;
    name: string;
    email: string;
    photoURL?: string;
    role: string;
  };
  stats: {
    enrolledCourses?: number;
    completedCourses?: number;
    certificatesEarned?: number;
    totalLearningTime?: number;
  };
  recentEnrollments: Array<{
    _id: string;
    courseId: string | { _id: string; title?: string; thumbnail?: string; coverImage?: string };
    courseName: string;
    courseImage?: string;
    progress: {
      progressPercentage: number;
      completedLessons: string[];
    };
    status: string;
    enrolledAt: string;
  }>;
  recentTransactions: Array<{
    _id: string;
    courseName: string;
    amount: number;
    status: string;
    paymentMethod?: string;
    createdAt: string;
    type: string;
  }>;
  unreadNotifications: number;
}

const StudentDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [likedCourses, setLikedCourses] = useState<string[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      console.log("🔍 Fetching dashboard data...", { hasToken: !!token });

      const res = await fetch("/api/dashboard", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      console.log("📡 Dashboard API response status:", res.status);

      const data = await res.json();
      console.log("📦 Dashboard API data:", data);

      if (res.ok && data.user) {
        setDashboardData(data);
        console.log("✅ Dashboard data loaded successfully");
      } else {
        // ✅ Safe error message extraction
        let errorMsg = "Failed to load dashboard";
        if (data.error) {
          errorMsg = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        } else if (!res.ok) {
          errorMsg = `HTTP ${res.status}: ${res.statusText || 'Request failed'}`;
        }
        console.error("❌ Dashboard error:", errorMsg, data);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error occurred";
      console.error("❌ Failed to fetch dashboard:", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (id: string) =>
    setLikedCourses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const getProgressColor = (p: number) => p >= 80 ? '#00C48C' : p >= 50 ? '#F89B29' : '#FF0F7B';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#832388' }} />
          <p className="text-sm opacity-60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">Failed to load dashboard</p>
          <button onClick={fetchDashboardData} className="btn btn-sm" style={{ backgroundColor: '#832388', color: 'white' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats, recentEnrollments, recentTransactions } = dashboardData;

  // Calculate active courses (enrolled but not completed)
  const activeCourses = (stats.enrolledCourses || 0) - (stats.completedCourses || 0);

  const statsData = [
    { label: 'Enrolled Courses', value: stats.enrolledCourses || 0, icon: BookOpen, color: '#832388', bg: 'bg-purple-100 dark:bg-purple-950/40' },
    { label: 'Active Courses', value: activeCourses, icon: PlayCircle, color: '#FF0F7B', bg: 'bg-pink-100 dark:bg-pink-950/40' },
    { label: 'Completed Courses', value: stats.completedCourses || 0, icon: CheckCircle, color: '#00C48C', bg: 'bg-green-100 dark:bg-green-950/40' },
  ];

  return (
    <div className="min-h-screen space-y-6">

      {/* Welcome Banner */}
      <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
        <div className="card-body p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center">
                  {dashboardData.user.photoURL ? (
                    <img src={dashboardData.user.photoURL} alt={dashboardData.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold" style={{ color: '#832388' }}>
                      {dashboardData.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold">Welcome back, {dashboardData.user.name}!</h3>
                  <p className="text-sm opacity-60">Continue your learning journey</p>
                </div>
              </div>
              {stats.totalLearningTime && stats.totalLearningTime > 0 && (
                <div className="flex items-center gap-2 text-sm opacity-60 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>Total learning time: {Math.floor(stats.totalLearningTime / 60)}h {stats.totalLearningTime % 60}m</span>
                </div>
              )}
            </div>
            <button
              onClick={() => router.push('/courses')}
              className="btn btn-md px-6 border-0 text-white whitespace-nowrap hover:opacity-90 transition-opacity"
              style={{ background: '#832388' }}>
              Browse Courses
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statsData.map((s, i) => (
          <div key={i} className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">{s.label}</p>
                  <h2 className="text-4xl font-bold mb-2">{s.value}</h2>
                  <div className="flex items-center gap-1.5 text-xs opacity-60">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-semibold">Keep learning!</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <s.icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses */}
      {recentEnrollments.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recently Enrolled Courses</h2>
            <button
              onClick={() => router.push('/dashboard/student/courses')}
              className="btn btn-ghost btn-sm gap-1.5 hover:bg-transparent font-semibold" style={{ color: '#832388' }}>
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEnrollments.slice(0, 3).map((enrollment) => {
              // ✅ Extract courseId properly
              const courseId = typeof enrollment.courseId === 'string'
                ? enrollment.courseId
                : enrollment.courseId?._id || '';

              const progress = enrollment.progress?.progressPercentage || 0;

              // ✅ Image priority: courseImage (saved) > populated courseId.thumbnail/coverImage > placeholder
              let courseImage = 'https://placehold.co/400x250/1a1a2e/C81D77?text=Course';
              if (enrollment.courseImage) {
                courseImage = enrollment.courseImage;
              } else if (typeof enrollment.courseId === 'object' && enrollment.courseId) {
                courseImage = (enrollment.courseId as any).thumbnail || (enrollment.courseId as any).coverImage || courseImage;
              }

              return (
                <div key={enrollment._id} className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  <figure className="relative overflow-hidden h-48">
                    <img src={courseImage} alt={enrollment.courseName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button onClick={() => toggleLike(enrollment._id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border-0 bg-white/95 hover:scale-110 transition-transform">
                      <Heart className={`w-4 h-4 transition-all ${likedCourses.includes(enrollment._id) ? 'fill-[#FF0F7B] text-[#FF0F7B]' : 'text-gray-400'}`} />
                    </button>
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95" style={{ color: '#832388' }}>
                      {enrollment.status}
                    </div>
                  </figure>
                  <div className="card-body p-5">
                    <h3 className="text-base font-bold leading-snug mb-3 line-clamp-2 group-hover:text-[#832388] transition-colors">{enrollment.courseName}</h3>
                    <p className="text-sm opacity-60 mb-4 font-medium">
                      Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold opacity-60">Progress</span>
                        <span className="text-xs font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%`, backgroundColor: getProgressColor(progress) }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-base-300">
                      <span className="text-sm font-semibold opacity-60">{enrollment.progress?.completedLessons?.length || 0} lessons done</span>
                      <button
                        onClick={() => router.push(`/learn/${courseId}`)}
                        className="btn btn-sm px-4 text-white border-0 gap-1.5 hover:opacity-90" style={{ backgroundColor: '#1a1a1a' }}>
                        Continue <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Invoices & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        {recentTransactions.length > 0 && (
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: '#FF0F7B' }} />
                <h2 className="text-xl font-bold">Recent Transactions</h2>
              </div>
              <div className="space-y-3">
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 rounded-xl hover:bg-base-200 transition-all duration-200 border border-transparent hover:border-base-300 cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate mb-1.5">{transaction.courseName}</h4>
                      <div className="flex items-center gap-3 text-xs opacity-70">
                        <span className="font-semibold">{transaction.paymentMethod || 'Payment'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Calendar className="w-3 h-3" />
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <span className="text-base font-bold">${transaction.amount}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${transaction.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-950/40 text-[#00C48C]'
                          : 'bg-yellow-100 dark:bg-yellow-950/40 text-[#F89B29]'
                          }`}>
                          {transaction.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certificates Card */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: '#F89B29' }} />
              <h2 className="text-xl font-bold">Achievements</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-base-300 hover:border-base-content/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #832388, #FF0F7B)' }}>
                    {stats.certificatesEarned || 0}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Certificates Earned</h4>
                    <p className="text-xs opacity-60">Your achievements</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard/student/certificates')}
                  className="btn btn-sm btn-ghost gap-1.5" style={{ color: '#832388' }}>
                  View <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-base-300 hover:border-base-content/30 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ background: 'linear-gradient(135deg, #00C48C, #0EA5E9)' }}>
                    {stats.completedCourses || 0}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold mb-1">Completed Courses</h4>
                    <p className="text-xs opacity-60">Keep up the great work!</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard/student/courses')}
                  className="btn btn-sm btn-ghost gap-1.5" style={{ color: '#00C48C' }}>
                  View <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {recentEnrollments.length === 0 && (
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Start Your Learning Journey</h3>
            <p className="opacity-60 mb-6">You haven't enrolled in any courses yet. Browse our catalog to get started!</p>
            <button
              onClick={() => router.push('/courses')}
              className="btn px-6 text-white border-0" style={{ background: 'linear-gradient(90deg, #832388, #FF0F7B)' }}>
              Browse Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
