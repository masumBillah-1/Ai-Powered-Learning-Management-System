"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Grid, List, Edit2, Star, PlayCircle,
  FileText, Clock, Users, Plus, Trash2, Eye,
  BarChart3, RefreshCw, BookOpen, Send
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type CourseStatus = 'draft' | 'pending' | 'published' | 'rejected';

interface ICourse {
  _id: string;
  title: string;
  category: string;
  level: string;
  status: CourseStatus;
  // ✅ DB schema অনুযায়ী thumbnail field
  thumbnail?: string;
  // legacy support
  coverImage?: { type?: string; url?: string } | string;
  // ✅ DB schema অনুযায়ী flat price field
  price?: number;
  originalPrice?: number;
  // legacy pricing object support
  pricing?: { type: 'paid' | 'free'; price: number; discountPrice?: number };
  modules: { lessons: any[] }[];
  // ✅ DB schema: enrollmentCount (not enrolledCount)
  enrollmentCount?: number;
  enrolledCount?: number;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}

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

const getLessons = (modules: { lessons: any[] }[]) =>
  modules?.reduce((a, m) => a + (m.lessons?.length || 0), 0) || 0;

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'published': return { bg: 'rgba(0,196,140,0.12)',  text: '#00C48C', label: 'Published'   };
    case 'pending':   return { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', label: 'Under Review' };
    case 'rejected':  return { bg: 'rgba(239,68,68,0.12)',  text: '#EF4444', label: 'Rejected'     };
    default:          return { bg: 'rgba(107,114,128,0.12)',text: '#6B7280', label: 'Draft'        };
  }
};

// ✅ Cover image URL — DB তে thumbnail field আছে
const getCoverUrl = (course: ICourse): string => {
  if (course.thumbnail && course.thumbnail.trim()) return course.thumbnail.trim();
  if (course.coverImage) {
    if (typeof course.coverImage === 'string') return course.coverImage.trim();
    if (typeof course.coverImage === 'object' && course.coverImage.url) return course.coverImage.url.trim();
  }
  return '';
};

// ✅ Price — DB তে flat price field আছে
const formatPrice = (course: ICourse): string => {
  if (course.pricing?.type === 'free') return 'Free';
  if (course.pricing?.discountPrice) return `৳${course.pricing.discountPrice.toLocaleString()}`;
  if (course.pricing?.price) return `৳${course.pricing.price.toLocaleString()}`;
  if (course.originalPrice && course.originalPrice > 0) return `৳${course.originalPrice.toLocaleString()}`;
  if (course.price && course.price > 0) return `৳${course.price.toLocaleString()}`;
  return 'Free';
};

// ✅ Enrolled count — DB তে enrollmentCount field
const getEnrolledCount = (course: ICourse): number =>
  course.enrollmentCount ?? course.enrolledCount ?? 0;

async function safeFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json'))
    throw new Error(`API route not found: ${url} (${res.status})`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const SkeletonRow = () => (
  <tr>
    {[200, 80, 60, 80, 70, 110].map((w, i) => (
      <td key={i}><div className="skeleton h-5 rounded" style={{ width: w }} /></td>
    ))}
  </tr>
);

const SkeletonCard = () => (
  <div className="card bg-base-100 border border-base-300">
    <div className="skeleton w-full h-32 rounded-t-2xl rounded-b-none" />
    <div className="card-body p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="grid grid-cols-2 gap-2">
        <div className="skeleton h-8 rounded" />
        <div className="skeleton h-8 rounded" />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
const InstructorCoursesPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode]             = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery]       = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus]     = useState('All Status');
  const [theme, setTheme]                   = useState('light');
  const [courses, setCourses]               = useState<ICourse[]>([]);
  const [loading, setLoading]               = useState(true);
  const [deleting, setDeleting]             = useState<string | null>(null);
  const [submitting, setSubmitting]         = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<ICourse | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    const iv = setInterval(() => {
      const cur = localStorage.getItem('theme') || 'light';
      if (cur !== theme) setTheme(cur);
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  const fetchCourses = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      let instructorId = '';
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          instructorId = user?._id || user?.id || '';
        }
      } catch (err) { console.error('Failed to get user:', err); }

      if (!instructorId) {
        toast.error('❌ Please login to view your courses', tErr);
        setLoading(false);
        return;
      }
      const data = await safeFetch(`/api/courses?instructorId=${instructorId}`);
      setCourses(data.courses || []);
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, tErr);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSubmitForReview = async (id: string, currentStatus: CourseStatus) => {
    if (currentStatus === 'pending') {
      toast('⏳ Already under admin review.', {
        position: 'top-right',
        style: { borderRadius: '10px', background: '#F59E0B', color: '#fff', fontWeight: '600' },
        duration: 3000,
      });
      return;
    }
    if (currentStatus === 'published') {
      toast('✅ Course is already published.', {
        position: 'top-right',
        style: { borderRadius: '10px', background: '#00C48C', color: '#fff', fontWeight: '600' },
        duration: 3000,
      });
      return;
    }
    setSubmitting(id);
    const tid = toast.loading('📤 Submitting for review...', {
      position: 'top-right',
      style: { borderRadius: '10px', background: '#1e1e2e', color: '#fff' },
    });
    try {
      await safeFetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' }),
      });
      setCourses(prev => prev.map(c => c._id === id ? { ...c, status: 'pending' } : c));
      toast.success('✅ Submitted! Admin will review soon.', { id: tid, ...tOk });
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally {
      setSubmitting(null);
    }
  };

  const openDeleteDialog = (course: ICourse) => {
    setCourseToDelete(course);
    (document.getElementById('delete_course_modal') as HTMLDialogElement)?.showModal();
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    const { _id: id } = courseToDelete;
    setDeleting(id);
    (document.getElementById('delete_course_modal') as HTMLDialogElement)?.close();
    const tid = toast.loading('Deleting...', {
      position: 'top-right',
      style: { borderRadius: '10px', background: '#1e1e2e', color: '#fff' },
    });
    try {
      await safeFetch(`/api/courses/${id}`, { method: 'DELETE' });
      setCourses(prev => prev.filter(c => c._id !== id));
      toast.success('Course deleted! 🗑️', { id: tid, ...tOk });
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally {
      setDeleting(null);
      setCourseToDelete(null);
    }
  };

  const published     = courses.filter(c => c.status === 'published').length;
  const drafts        = courses.filter(c => c.status === 'draft').length;
  const pending       = courses.filter(c => c.status === 'pending').length;
  const rejected      = courses.filter(c => c.status === 'rejected').length;
  const totalStudents = courses.reduce((a, c) => a + getEnrolledCount(c), 0);
  const totalRevenue  = courses.reduce((a, c) => {
    const p = c.price || c.pricing?.price || 0;
    return a + p * getEnrolledCount(c);
  }, 0);

  const stats = [
    { label: 'Published',      count: published,                           color: '#00C48C' },
    { label: 'Under Review',   count: pending,                             color: '#F59E0B' },
    { label: 'Rejected',       count: rejected,                            color: '#EF4444' },
    { label: 'Drafts',         count: drafts,                              color: '#6B7280' },
    { label: 'Total Students', count: totalStudents,                       color: '#832388' },
    { label: 'Est. Revenue',   count: `৳${totalRevenue.toLocaleString()}`, color: '#C81D77' },
  ];

  const filtered = courses.filter(c => {
    const s   = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const cat = filterCategory === 'All Categories' || c.category === filterCategory;
    const st  = filterStatus === 'All Status' || c.status === filterStatus.toLowerCase();
    return s && cat && st;
  });

  const categories = ['All Categories', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  return (
    <div className="min-h-screen" data-theme={theme}>
      <Toaster position="top-right" containerStyle={{ top: 80, right: 24 }} toastOptions={{ style: { maxWidth: 380 } }} />

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="card bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-all">
            <div className="card-body p-4">
              <p className="text-xs font-bold uppercase tracking-wider opacity-50">{s.label}</p>
              {loading
                ? <div className="skeleton h-8 w-16 mt-1 rounded" />
                : <h2 className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.count}</h2>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Rejected banner ── */}
      {!loading && rejected > 0 && (
        <div className="alert mb-6 border border-error/30 bg-error/5 text-error">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-bold text-sm">{rejected} course{rejected > 1 ? 's were' : ' was'} rejected by admin</p>
            <p className="text-xs opacity-70">Please edit and resubmit after making the necessary changes.</p>
          </div>
        </div>
      )}

      {/* ── Main Card ── */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">

          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">My Courses</h1>
              {!loading && <div className="badge badge-ghost text-xs">{courses.length} courses</div>}
              <button onClick={() => fetchCourses(true)} disabled={loading}
                className="btn btn-xs btn-ghost btn-circle opacity-40 hover:opacity-100 cursor-pointer">
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-base-200 p-1 rounded-xl border border-base-300">
                {(['list', 'grid'] as const).map(v => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === v ? 'bg-base-100 shadow-md' : 'hover:bg-base-300'}`}
                    style={{ color: viewMode === v ? '#832388' : '' }}>
                    {v === 'list' ? <List size={17} /> : <Grid size={17} />}
                  </button>
                ))}
              </div>
              <button onClick={() => router.push('/dashboard/instructor/courses/create')}
                className="btn gap-2 text-white border-0 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #832388, #FF0F7B)' }}>
                <Plus size={17} /> Create Course
              </button>
            </div>
          </div>

          {/* ── Filters ── */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <label className="input input-bordered flex items-center gap-2 flex-1 bg-base-200 focus-within:border-purple-400">
              <Search size={15} className="opacity-40" />
              <input type="text" placeholder="Search courses..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="grow bg-transparent focus:outline-none text-sm" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="opacity-40 hover:opacity-100 text-xs cursor-pointer">✕</button>
              )}
            </label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="select select-bordered bg-base-200 focus:outline-none cursor-pointer md:w-48 text-sm">
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="select select-bordered bg-base-200 focus:outline-none cursor-pointer md:w-40 text-sm">
              <option>All Status</option>
              <option value="published">Published</option>
              <option value="pending">Under Review</option>
              <option value="rejected">Rejected</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* ════ LIST VIEW ════ */}
          {viewMode === 'list' ? (
            <div className="overflow-x-auto rounded-xl border border-base-300">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="bg-base-200 text-xs uppercase tracking-wider opacity-70">
                    <th>Course</th>
                    <th className="text-center">Students</th>
                    <th className="text-center">Price</th>
                    <th className="text-center">Rating</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                    : filtered.map(course => {
                      const st      = getStatusStyle(course.status);
                      const lessons = getLessons(course.modules);
                      // ✅ thumbnail field use
                      const cover   = getCoverUrl(course);
                      return (
                        <tr key={course._id} className="hover">
                          <td className="min-w-[260px]">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-base-300">
                                {cover
                                  ? <img src={cover} alt={course.title} className="w-full h-full object-cover"
                                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                  : <div className="w-full h-full flex items-center justify-center"
                                      style={{ backgroundColor: 'rgba(131,35,136,0.1)' }}>
                                      <PlayCircle className="w-5 h-5" style={{ color: '#832388' }} />
                                    </div>}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold line-clamp-1 leading-snug">{course.title}</p>
                                <div className="flex flex-wrap gap-2 mt-1 text-xs opacity-50">
                                  <span className="flex items-center gap-1"><FileText size={10} />{lessons} Lessons</span>
                                  <span className="flex items-center gap-1"><BookOpen size={10} />{course.modules?.length || 0} Modules</span>
                                  <span className="capitalize">{course.category}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users size={13} className="opacity-40" />
                              <span className="text-sm font-bold">{getEnrolledCount(course)}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="text-sm font-bold" style={{ color: '#832388' }}>{formatPrice(course)}</span>
                          </td>
                          <td className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star size={12} className="fill-[#FDE047] text-[#FDE047]" />
                              <span className="text-sm font-semibold">{course.rating ? course.rating.toFixed(1) : '—'}</span>
                              {course.reviewCount ? <span className="text-xs opacity-40">({course.reviewCount})</span> : null}
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: st.bg, color: st.text }}>
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: st.text, animation: course.status === 'pending' ? 'pulse 2s infinite' : 'none' }} />
                              {st.label}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => router.push(`/courses/${course._id}`)}
                                className="btn btn-ghost btn-xs btn-circle cursor-pointer" title="View">
                                <Eye size={14} />
                              </button>
                              <button onClick={() => router.push(`/dashboard/instructor/courses/create?id=${course._id}`)}
                                className="btn btn-ghost btn-xs btn-circle cursor-pointer" title="Edit">
                                <Edit2 size={14} />
                              </button>
                              {(course.status === 'draft' || course.status === 'rejected') && (
                                <button onClick={() => handleSubmitForReview(course._id, course.status)}
                                  disabled={submitting === course._id}
                                  className="btn btn-xs gap-1 border-0 text-white cursor-pointer disabled:opacity-50"
                                  style={{ background: 'linear-gradient(135deg,#832388,#C81D77)' }}>
                                  {submitting === course._id
                                    ? <span className="loading loading-spinner loading-xs" />
                                    : <><Send size={10} /> Submit</>}
                                </button>
                              )}
                              <button onClick={() => openDeleteDialog(course)}
                                disabled={deleting === course._id}
                                className="btn btn-ghost btn-xs btn-circle cursor-pointer text-error">
                                {deleting === course._id
                                  ? <span className="loading loading-spinner loading-xs" />
                                  : <Trash2 size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            /* ════ GRID VIEW ════ */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : filtered.map(course => {
                  const st      = getStatusStyle(course.status);
                  const lessons = getLessons(course.modules);
                  // ✅ thumbnail field use
                  const cover   = getCoverUrl(course);
                  return (
                    <div key={course._id}
                      className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {/* ✅ Cover image from thumbnail */}
                      <div className="relative w-full h-36 bg-base-200 overflow-hidden">
                        {cover ? (
                          <img src={cover} alt={course.title} className="w-full h-full object-cover"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(131,35,136,0.08)' }}>
                            <PlayCircle className="w-10 h-10 opacity-30" style={{ color: '#832388' }} />
                          </div>
                        )}
                      </div>

                      <div className="card-body p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: st.bg, color: st.text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.text }} />
                            {st.label}
                          </span>
                          <span className="text-xs opacity-40 capitalize">{course.category}</span>
                        </div>
                        <h3 className="text-sm font-bold leading-snug line-clamp-2">{course.title}</h3>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs opacity-60">
                          <span className="flex items-center gap-1"><Users size={11} />{getEnrolledCount(course)} Students</span>
                          <span className="flex items-center gap-1"><FileText size={11} />{lessons} Lessons</span>
                          <span className="flex items-center gap-1">
                            <Star size={11} className="fill-[#FDE047] text-[#FDE047]" />
                            {course.rating?.toFixed(1) || '—'}
                          </span>
                          <span className="flex items-center gap-1 capitalize"><Clock size={11} />{course.level}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-base-300">
                          <span className="text-base font-bold" style={{ color: '#832388' }}>{formatPrice(course)}</span>
                          <div className="flex gap-1 items-center">
                            <button className="btn btn-ghost btn-sm btn-circle cursor-pointer" title="Analytics">
                              <BarChart3 size={14} />
                            </button>
                            <button onClick={() => router.push(`/dashboard/instructor/courses/create?id=${course._id}`)}
                              className="btn btn-ghost btn-sm btn-circle cursor-pointer" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            {(course.status === 'draft' || course.status === 'rejected') && (
                              <button onClick={() => handleSubmitForReview(course._id, course.status)}
                                disabled={submitting === course._id}
                                className="btn btn-sm btn-circle border-0 text-white cursor-pointer disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg,#832388,#C81D77)' }}
                                title="Submit for review">
                                {submitting === course._id
                                  ? <span className="loading loading-spinner loading-xs" />
                                  : <Send size={13} />}
                              </button>
                            )}
                            <button onClick={() => openDeleteDialog(course)}
                              disabled={deleting === course._id}
                              className="btn btn-ghost btn-sm btn-circle cursor-pointer text-error">
                              {deleting === course._id
                                ? <span className="loading loading-spinner loading-xs" />
                                : <Trash2 size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              {courses.length === 0 ? (
                <>
                  <h3 className="text-xl font-bold mb-2">No Courses Yet</h3>
                  <p className="opacity-50 mb-6">Create your first course to get started!</p>
                  <button onClick={() => router.push('/dashboard/instructor/courses/create')}
                    className="btn gap-2 text-white border-0 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #832388, #FF0F7B)' }}>
                    <Plus size={17} /> Create First Course
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">No Results Found</h3>
                  <p className="opacity-50 mb-6">Try different search or filter</p>
                  <button onClick={() => { setSearchQuery(''); setFilterCategory('All Categories'); setFilterStatus('All Status'); }}
                    className="btn border-0 text-white cursor-pointer" style={{ backgroundColor: '#832388' }}>
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="mt-4 pt-4 border-t border-base-300 flex items-center justify-between text-xs opacity-50">
              <span>Showing <strong>{filtered.length}</strong> of <strong>{courses.length}</strong> courses</span>
              <span>Last updated just now</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Dialog ── */}
      <dialog id="delete_course_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            Do you want to delete "<strong>{courseToDelete?.title}</strong>"? This action cannot be undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-3">Cancel</button>
              <button type="button" className="btn btn-error text-white"
                onClick={handleDelete} disabled={deleting === courseToDelete?._id}>
                {deleting === courseToDelete?._id
                  ? <><span className="loading loading-spinner loading-sm" /> Deleting...</>
                  : <><Trash2 size={16} /> Delete</>}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default InstructorCoursesPage;