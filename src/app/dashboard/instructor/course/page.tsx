"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Grid, List, Edit2, Star, 
  PlayCircle, HelpCircle, Clock, Plus, X, Loader2
} from 'lucide-react';
import {
  fetchInstructorCourses,
  createNewCourse,
  updateCourseData,
  deleteCourseById,
  Course,
  CourseStats,
  CreateCourseData
} from '@/instructorDashboard/course';

const CoursePage = () => {
  // ==================== STATE MANAGEMENT ====================
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats>({
    active: 0,
    pending: 0,
    draft: 0,
    free: 0,
    paid: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState<'draft' | 'pending' | 'published' | ''>('');
  
  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    price: 0,
    discount: 0,
    thumbnail: '',
    videoURL: '',
    totalLessons: 0,
    totalQuizzes: 0,
    totalHours: '00:00:00'
  });

  // ==================== FETCH COURSES ====================
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: any = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory !== 'All Categories') filters.category = selectedCategory;
      if (selectedStatus) filters.status = selectedStatus;
      
      const result = await fetchInstructorCourses(filters);
      
      setCourses(result.courses || []);
      setStats(result.stats || stats);
    } catch (err: any) {
      setError(err.message || 'Failed to load courses');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // ==================== USE EFFECT ====================
  useEffect(() => {
    loadCourses();
  }, [searchTerm, selectedCategory, selectedStatus]);

  // ==================== HANDLE CREATE COURSE ====================
  const handleCreateCourse = async () => {
    try {
      setLoading(true);
      await createNewCourse(formData);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        category: 'Web Development',
        level: 'Beginner',
        price: 0,
        discount: 0,
        thumbnail: '',
        videoURL: '',
        totalLessons: 0,
        totalQuizzes: 0,
        totalHours: '00:00:00'
      });
      setIsModalOpen(false);
      
      // Reload courses
      await loadCourses();
      
      alert('Course created successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLE UPDATE COURSE ====================
  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      setLoading(true);
      await updateCourseData(selectedCourse._id, formData);
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedCourse(null);
      
      await loadCourses();
      
      alert('Course updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLE DELETE COURSE ====================
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      setLoading(true);
      await deleteCourseById(courseId);
      await loadCourses();
      alert('Course deleted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLE EDIT CLICK ====================
  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditMode(true);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      discount: course.discount || 0,
      thumbnail: course.thumbnail,
      videoURL: course.videoURL || '',
      totalLessons: course.totalLessons,
      totalQuizzes: course.totalQuizzes,
      totalHours: course.totalHours
    });
    setIsModalOpen(true);
  };

  // ==================== RENDER ====================
  return (
    <div className="p-6 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen font-sans">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {[
          { label: 'Active Courses', count: stats.active, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
          { label: 'Pending Courses', count: stats.pending, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
          { label: 'Draft Courses', count: stats.draft, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
          { label: 'Free Courses', count: stats.free, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
          { label: 'Paid Courses', count: stats.paid, bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100' },
        ].map((stat, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -4 }}
            className={`${stat.bg} ${stat.border} border p-5 rounded-2xl transition-all shadow-sm`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider opacity-80 ${stat.text}`}>{stat.label}</p>
            <h2 className={`text-3xl font-black mt-1 ${stat.text}`}>{stat.count}</h2>
          </motion.div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Course Overview</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button className="p-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-indigo-600"><List size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600"><Grid size={18} /></button>
            </div>
            <button 
              onClick={() => {
                setIsEditMode(false);
                setSelectedCourse(null);
                setFormData({
                  title: '',
                  description: '',
                  category: 'Web Development',
                  level: 'Beginner',
                  price: 0,
                  discount: 0,
                  thumbnail: '',
                  videoURL: '',
                  totalLessons: 0,
                  totalQuizzes: 0,
                  totalHours: '00:00:00'
                });
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Plus size={18} /> Create Course
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by course name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all border border-gray-100 dark:border-slate-700"
            />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option>All Categories</option>
            <option>Web Development</option>
            <option>Digital Marketing</option>
            <option>Graphics Design</option>
            <option>UI/UX Design</option>
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Courses Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] border-b border-slate-50 dark:border-slate-800">
                  <th className="pb-5 px-2">Course Name</th>
                  <th className="pb-5 text-center">Students</th>
                  <th className="pb-5 text-center">Price</th>
                  <th className="pb-5">Status</th>
                  <th className="pb-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400">
                      No courses found. Create your first course!
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                      <td className="py-6 px-2">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <PlayCircle size={24} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{course.title}</h4>
                            <div className="flex gap-3 mt-1 text-[11px] font-bold text-slate-400 uppercase">
                              <span className="flex items-center gap-1"><Clock size={12}/> {course.totalHours}</span>
                              <span className="flex items-center gap-1"><HelpCircle size={12}/> {course.totalQuizzes} Quiz</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 text-center text-sm font-bold text-slate-600 dark:text-slate-400">{course.enrolledCount}</td>
                      <td className="py-6 text-center text-sm font-black text-slate-800 dark:text-white">৳{course.price}</td>
                      <td className="py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          course.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 
                          course.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(course)}
                            className="p-2 hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCourse(course._id)}
                            className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">
                  {isEditMode ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Course Title *</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description *</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your course..."
                    className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category *</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Web Development</option>
                      <option>Digital Marketing</option>
                      <option>Graphics Design</option>
                      <option>UI/UX Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Level *</label>
                    <select 
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                      className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Price (৳) *</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      placeholder="0"
                      className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Discount (%)</label>
                    <input 
                      type="number" 
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})}
                      placeholder="0"
                      className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Thumbnail URL *</label>
                  <input 
                    type="text" 
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border dark:border-slate-700 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 sticky bottom-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={isEditMode ? handleUpdateCourse : handleCreateCourse}
                  disabled={loading}
                  className="px-8 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  {isEditMode ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursePage;
