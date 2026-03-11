"use client";

import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Search, Grid, List, MapPin, Calendar, BookOpen,
  MessageCircle, Mail, Phone, Eye, RefreshCw, Users, TrendingUp,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
// Enrollment + populated User data মিলিয়ে একটা Student object
interface Student {
  enrollmentId: string;         // enrollment._id
  userId: string;               // user._id
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  location?: string;            // address.city + address.country
  enrolledDate: string;         // enrollment.enrolledAt
  courseName: string;           // enrollment.courseName (denormalized)
  courseId: string;
  progressPercentage: number;   // enrollment.progress.progressPercentage
  status: 'active' | 'completed' | 'dropped' | 'expired';
  totalEnrollments: number;     // user.stats.enrolledCourses
  lastAccessedAt?: string;
}

// ─── Toast styles ─────────────────────────────────────────────────────────────
const tErr = {
  position: 'top-right' as const,
  duration: 3500,
  style: { borderRadius: '10px', background: '#dc2626', color: '#fff', fontWeight: '600' },
};
const tOk = {
  position: 'top-right' as const,
  duration: 3000,
  style: { borderRadius: '10px', background: '#1e1e2e', color: '#fff', fontWeight: '600' },
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, theme }: { value: number; theme: string }) {
  const color = value >= 80 ? '#00C48C' : value >= 40 ? '#F89B29' : '#E3436B';
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: theme === 'dark' ? '#2a2a3a' : '#f1f1f1' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, theme }: { status: Student['status']; theme: string }) {
  const map = {
    active: { label: 'Active', color: '#00C48C', bgL: '#d1fae5', bgD: '#0f2520' },
    completed: { label: 'Completed', color: '#832388', bgL: '#f3e8ff', bgD: '#2a1f35' },
    dropped: { label: 'Dropped', color: '#FF0F7B', bgL: '#fce7f3', bgD: '#2a1520' },
    expired: { label: 'Expired', color: '#F89B29', bgL: '#fef3c7', bgD: '#2a1f15' },
  };
  const s = map[status] || map.active;
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
      style={{ backgroundColor: theme === 'dark' ? s.bgD : s.bgL, color: s.color }}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
      {s.label}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InstructorStudentsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterCourse, setFilterCourse] = useState('All Courses');
  const [theme, setTheme] = useState("light");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // unique courses list (filter dropdown এর জন্য)
  const courseList = Array.from(
    new Map(students.map(s => [s.courseId, s.courseName])).entries()
  );

  // ── Theme sync ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
    const iv = setInterval(() => {
      const t = localStorage.getItem("theme") || "light";
      if (t !== theme) { setTheme(t); document.documentElement.setAttribute('data-theme', t); }
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  // ── Fetch students ──────────────────────────────────────────────────────────
  // Strategy:
  //   1. /api/courses?mine=true → instructor এর courses (courseId list)
  //   2. /api/enrollments?instructorId=... → সব enrollment (studentId + progress)
  //   3. Response এ populated user data থাকলে সেটা ব্যবহার করো
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      // instructor এর userId localStorage থেকে
      let instructorId = '';
      try {
        const u = localStorage.getItem('user');
        if (u) { const p = JSON.parse(u); instructorId = p?._id || p?.id || ''; }
      } catch { /* ignore */ }

      // Enrollments এ instructor এর সব students আনো
      // API: GET /api/enrollments?instructorId=<id>&populate=student
      const url = instructorId
        ? `/api/enrollments?instructorId=${instructorId}&populate=student&limit=200`
        : `/api/enrollments?mine=true&populate=student&limit=200`;

      const res = await fetch(url, { credentials: 'include' });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch students');

      // API response থেকে Student[] তৈরি করো
      // enrollment.studentData বা enrollment.userId (populated) থেকে user info নাও
      const mapped: Student[] = (data.enrollments || []).map((e: any) => {
        const user = e.studentData || e.userId || {};   // populated user
        const addr = user.address || {};
        const location = [addr.city, addr.country].filter(Boolean).join(', ') || 'N/A';

        return {
          enrollmentId: e._id,
          userId: user._id || e.studentId,
          name: user.name || 'Unknown',
          email: user.email || '',
          phone: user.phone || undefined,
          photoURL: user.photoURL || undefined,
          location,
          enrolledDate: e.enrolledAt,
          courseName: e.courseName || 'Unknown Course',
          courseId: e.courseId,
          progressPercentage: e.progress?.progressPercentage || 0,
          status: e.status || 'active',
          totalEnrollments: user.stats?.enrolledCourses || 1,
          lastAccessedAt: e.progress?.lastAccessedAt,
        };
      });

      setStudents(mapped);
    } catch (err: any) {
      toast.error(`❌ ${err.message || 'Students load করতে সমস্যা হয়েছে।'}`, tErr);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All Status' || s.status === filterStatus.toLowerCase();
    const matchCourse = filterCourse === 'All Courses' || s.courseId === filterCourse;
    return matchSearch && matchStatus && matchCourse;
  });

  // ── Stats ───────────────────────────────────────────────────────────────────
  // unique students (একই user একাধিক course এ থাকতে পারে)
  const uniqueStudents = new Set(students.map(s => s.userId)).size;
  const activeCount = students.filter(s => s.status === 'active').length;
  const completedCount = students.filter(s => s.status === 'completed').length;
  const avgProgress = students.length
    ? Math.round(students.reduce((a, s) => a + s.progressPercentage, 0) / students.length)
    : 0;

  const formatDate = (d?: string) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">

      {/* Toaster — navbar নিচে */}
      <Toaster
        position="top-right"
        containerStyle={{ top: 72, right: 24 }}
        toastOptions={{ style: { maxWidth: 380 } }}
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Students', value: uniqueStudents, color: '#832388', bL: '#f3e8ff', bD: '#2a1f35', Icon: Users },
          { label: 'Active', value: activeCount, color: '#00C48C', bL: '#d1fae5', bD: '#0f2520', Icon: BookOpen },
          { label: 'Completed', value: completedCount, color: '#F89B29', bL: '#fef3c7', bD: '#2a1f15', Icon: TrendingUp },
          { label: 'Avg. Progress', value: `${avgProgress}%`, color: '#E3436B', bL: '#fce7f3', bD: '#2a1520', Icon: TrendingUp },
        ].map(card => (
          <div key={card.label} className="card bg-base-100 shadow-lg border"
            style={{ borderColor: theme === 'dark' ? card.bD : card.bL }}>
            <div className="card-body p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{card.label}</p>
                  <h2 className="text-3xl font-bold" style={{ color: card.color }}>
                    {loading ? <span className="loading loading-spinner loading-sm" /> : card.value}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: theme === 'dark' ? card.bD : card.bL }}>
                  <card.Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Card ── */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Students</h1>
              <button onClick={fetchStudents}
                className="btn btn-ghost btn-sm btn-circle cursor-pointer" title="Refresh">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            {/* View toggle */}
            <div className="flex bg-base-200 p-1 rounded-xl border border-base-300">
              {(['list', 'grid'] as const).map(mode => (
                <button key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === mode ? 'bg-base-100 shadow-md' : 'hover:bg-base-300'
                    }`}
                  style={{ color: viewMode === mode ? '#832388' : undefined }}>
                  {mode === 'list' ? <List size={18} /> : <Grid size={18} />}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input type="text" placeholder="Search by name, email, location or course..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-11 bg-base-100" />
            </div>
            {/* Course filter */}
            <select className="select select-bordered bg-base-100 cursor-pointer min-w-[220px]"
              value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
              <option value="All Courses">All Courses</option>
              {courseList.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
            {/* Status filter */}
            <select className="select select-bordered bg-base-100 cursor-pointer min-w-[160px]"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option>All Status</option>
              <option>Active</option>
              <option>Completed</option>
              <option>Dropped</option>
              <option>Expired</option>
            </select>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="loading loading-spinner loading-lg" style={{ color: '#832388' }} />
              <p className="opacity-50 text-sm">MongoDB থেকে students আনা হচ্ছে...</p>
            </div>

          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">
                {students.length === 0 ? 'কোনো Student নেই' : 'কিছু পাওয়া যায়নি'}
              </h3>
              <p className="opacity-60 mb-6">
                {students.length === 0
                  ? 'আপনার course এ এখনো কেউ enroll করেনি'
                  : 'Search বা filter পরিবর্তন করুন'}
              </p>
              {students.length > 0 && (
                <button className="btn gap-2 cursor-pointer"
                  style={{ backgroundColor: '#832388', color: 'white', border: 'none' }}
                  onClick={() => { setSearchQuery(''); setFilterStatus('All Status'); setFilterCourse('All Courses'); }}>
                  Clear Filters
                </button>
              )}
            </div>

          ) : viewMode === 'list' ? (
            /* ── List View ── */
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Student</th>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Contact</th>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Course</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Enrolled</th>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Progress</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.enrollmentId} className="hover">

                      {/* Student */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-base-200 flex items-center justify-center">
                              {s.photoURL
                                ? <img src={s.photoURL} alt={s.name} className="w-full h-full object-cover" />
                                : <span className="text-lg font-bold" style={{ color: '#832388' }}>
                                  {s.name.charAt(0).toUpperCase()}
                                </span>
                              }
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold hover:text-[#832388] transition-colors cursor-pointer">
                              {s.name}
                            </h4>
                            {s.location && s.location !== 'N/A' && (
                              <div className="flex items-center gap-1 text-xs opacity-50 mt-0.5">
                                <MapPin size={10} />
                                <span>{s.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs opacity-70">
                            <Mail size={11} />
                            <span className="truncate max-w-[160px]">{s.email}</span>
                          </div>
                          {s.phone && (
                            <div className="flex items-center gap-1.5 text-xs opacity-70">
                              <Phone size={11} />
                              <span>{s.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Course */}
                      <td>
                        <div className="flex items-start gap-1.5 text-xs">
                          <BookOpen size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#832388' }} />
                          <span className="font-semibold line-clamp-2 max-w-[180px]">{s.courseName}</span>
                        </div>
                      </td>

                      {/* Enrolled date */}
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs opacity-70">
                          <Calendar size={11} />
                          <span className="font-semibold whitespace-nowrap">{formatDate(s.enrolledDate)}</span>
                        </div>
                      </td>

                      {/* Progress */}
                      <td>
                        <ProgressBar value={s.progressPercentage} theme={theme} />
                      </td>

                      {/* Status */}
                      <td className="text-center">
                        <StatusBadge status={s.status} theme={theme} />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex justify-end gap-1.5">
                          <button className="btn btn-ghost btn-sm cursor-pointer" title="View Profile">
                            <Eye size={15} />
                          </button>
                          <button className="btn btn-ghost btn-sm cursor-pointer" title="Send Message">
                            <MessageCircle size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          ) : (
            /* ── Grid View ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(s => (
                <div key={s.enrollmentId}
                  className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
                  <div className="card-body p-5">

                    {/* Top row: avatar + status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-base-200 flex items-center justify-center flex-shrink-0"
                          style={{ border: '2px solid rgba(131,35,136,0.15)' }}>
                          {s.photoURL
                            ? <img src={s.photoURL} alt={s.name} className="w-full h-full object-cover" />
                            : <span className="text-xl font-bold" style={{ color: '#832388' }}>
                              {s.name.charAt(0).toUpperCase()}
                            </span>
                          }
                        </div>
                        <div>
                          <h3 className="text-sm font-bold hover:text-[#832388] transition-colors cursor-pointer leading-snug">
                            {s.name}
                          </h3>
                          {s.location && s.location !== 'N/A' && (
                            <div className="flex items-center gap-1 text-xs opacity-50 mt-0.5">
                              <MapPin size={10} /> {s.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={s.status} theme={theme} />
                    </div>

                    {/* Contact */}
                    <div className="space-y-1.5 mb-4 text-xs opacity-70">
                      <div className="flex items-center gap-1.5">
                        <Mail size={11} />
                        <span className="truncate">{s.email}</span>
                      </div>
                      {s.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={11} /> {s.phone}
                        </div>
                      )}
                    </div>

                    {/* Course name */}
                    <div className="flex items-start gap-1.5 text-xs mb-3 p-2.5 rounded-lg"
                      style={{ backgroundColor: theme === 'dark' ? '#2a1f35' : '#faf5ff' }}>
                      <BookOpen size={11} className="mt-0.5 flex-shrink-0" style={{ color: '#832388' }} />
                      <span className="font-semibold line-clamp-2" style={{ color: '#832388' }}>{s.courseName}</span>
                    </div>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs opacity-60 mb-1">
                        <span>Progress</span>
                        <span className="font-bold">{s.progressPercentage}%</span>
                      </div>
                      <ProgressBar value={s.progressPercentage} theme={theme} />
                    </div>

                    {/* Bottom stats */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-base-300 mb-4">
                      <div>
                        <p className="text-xs opacity-50 mb-0.5">Enrolled</p>
                        <p className="text-xs font-bold">{formatDate(s.enrolledDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-50 mb-0.5">Total Courses</p>
                        <p className="text-lg font-bold" style={{ color: '#F89B29' }}>
                          {s.totalEnrollments}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="btn btn-sm flex-1 cursor-pointer gap-1.5 text-white border-0"
                        style={{ background: 'linear-gradient(135deg, #832388, #E3436B)' }}>
                        <Eye size={13} /> View
                      </button>
                      <button className="btn btn-sm btn-ghost cursor-pointer">
                        <MessageCircle size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-base-300">
              <p className="text-sm opacity-60">
                Showing {filtered.length} of {students.length} enrollments
                {uniqueStudents !== students.length && (
                  <span className="ml-1 opacity-50">({uniqueStudents} unique students)</span>
                )}
              </p>
              <div className="join">
                <button className="join-item btn btn-sm cursor-pointer">«</button>
                <button className="join-item btn btn-sm btn-active cursor-pointer">1</button>
                <button className="join-item btn btn-sm cursor-pointer">2</button>
                <button className="join-item btn btn-sm cursor-pointer">»</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}