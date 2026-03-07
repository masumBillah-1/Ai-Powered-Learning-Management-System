"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  Edit2, 
  Star, 
  PlayCircle, 
  FileText, 
  Clock,
  Users,
  Plus,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react';

interface Course {
  id: number;
  name: string;
  students: number;
  price: number;
  rating: number;
  reviews: number;
  status: 'Published' | 'Pending' | 'Draft';
  lessons: number;
  quizzes: number;
  hours: string;
  category: string;
}

const InstructorCoursesPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme !== theme) {
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme]);

  // Stats Data with brand colors
  const stats = [
    { label: 'Active Courses', count: 45, color: '#832388', bgLight: '#f3e8ff', bgDark: '#2a1f35' },
    { label: 'Pending Courses', count: 21, color: '#F89B29', bgLight: '#fef3c7', bgDark: '#2a1f15' },
    { label: 'Draft Courses', count: 15, color: '#FF0F7B', bgLight: '#fce7f3', bgDark: '#2a1520' },
    { label: 'Total Students', count: 1600, color: '#00C48C', bgLight: '#d1fae5', bgDark: '#0f2520' },
    { label: 'Total Revenue', count: '$12,450', color: '#E3436B', bgLight: '#fce7f3', bgDark: '#2a1520' },
  ];

  const courseList: Course[] = [
    { 
      id: 1, 
      name: "Information About UI/UX Design Degree", 
      students: 600, 
      price: 160, 
      rating: 4.5, 
      reviews: 300, 
      status: "Published", 
      lessons: 11, 
      quizzes: 2, 
      hours: "03:15:00",
      category: "Design"
    },
    { 
      id: 2, 
      name: "Wordpress for Beginners - Master Wordpress Quickly", 
      students: 500, 
      price: 180, 
      rating: 4.2, 
      reviews: 430, 
      status: "Pending", 
      lessons: 11, 
      quizzes: 2, 
      hours: "03:15:00",
      category: "Development"
    },
    { 
      id: 3, 
      name: "Sketch from A to Z (2024): Become an app designer", 
      students: 300, 
      price: 200, 
      rating: 4.7, 
      reviews: 140, 
      status: "Draft", 
      lessons: 11, 
      quizzes: 2, 
      hours: "03:15:00",
      category: "Design"
    },
    { 
      id: 4, 
      name: "Build Responsive Real World Websites", 
      students: 450, 
      price: 150, 
      rating: 4.6, 
      reviews: 220, 
      status: "Published", 
      lessons: 15, 
      quizzes: 3, 
      hours: "04:30:00",
      category: "Development"
    },
    { 
      id: 5, 
      name: "Advanced JavaScript Programming", 
      students: 380, 
      price: 190, 
      rating: 4.8, 
      reviews: 310, 
      status: "Published", 
      lessons: 18, 
      quizzes: 4, 
      hours: "05:00:00",
      category: "Programming"
    },
  ];

  // Filter courses
  const filteredCourses = courseList.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories' || course.category === filterCategory;
    const matchesStatus = filterStatus === 'All Status' || course.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Published': return { bg: theme === 'dark' ? '#0f2520' : '#d1fae5', text: '#00C48C' };
      case 'Pending': return { bg: theme === 'dark' ? '#2a1f15' : '#fef3c7', text: '#F89B29' };
      case 'Draft': return { bg: theme === 'dark' ? '#2a1520' : '#fce7f3', text: '#FF0F7B' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };

  return (
    <div className="min-h-screen">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="card bg-base-100 shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer"
            style={{ 
              borderColor: theme === 'dark' ? stat.bgDark : stat.bgLight
            }}
          >
            <div className="card-body p-5">
              <p className="text-xs font-bold uppercase tracking-wider opacity-60">
                {stat.label}
              </p>
              <h2 className="text-3xl font-bold mt-1" style={{ color: stat.color }}>
                {stat.count}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h1 className="text-2xl font-bold">Course Management</h1>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-base-200 p-1 rounded-xl border border-base-300">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'list' 
                      ? 'bg-base-100 shadow-md' 
                      : 'hover:bg-base-300'
                  }`}
                  style={{ color: viewMode === 'list' ? '#832388' : '' }}
                >
                  <List size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-base-100 shadow-md' 
                      : 'hover:bg-base-300'
                  }`}
                  style={{ color: viewMode === 'grid' ? '#832388' : '' }}
                >
                  <Grid size={18} />
                </button>
              </div>
              
              {/* Create Course Button */}
              <button 
                className="btn btn-md gap-2 text-white border-0 cursor-pointer hover:opacity-90"
                style={{ backgroundColor: '#832388' }}
              >
                <Plus size={18} />
                Create Course
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input 
                type="text" 
                placeholder="Search by course name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-11 bg-base-100"
              />
            </div>
            
            {/* Category Filter */}
            <select 
              className="select select-bordered bg-base-100 cursor-pointer"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Design</option>
              <option>Development</option>
              <option>Programming</option>
            </select>

            {/* Status Filter */}
            <select 
              className="select select-bordered bg-base-100 cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Pending</option>
              <option>Draft</option>
            </select>
          </div>

          {/* Course List/Grid */}
          {viewMode === 'list' ? (
            /* List View */
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Course Name</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Students</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Price</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Rating</th>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => {
                    const statusColor = getStatusColor(course.status);
                    return (
                      <tr key={course.id} className="hover">
                        <td>
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ 
                                backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff'
                              }}
                            >
                              <PlayCircle className="w-6 h-6" style={{ color: '#832388' }} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold">{course.name}</h4>
                              <div className="flex gap-3 mt-1 text-xs opacity-60">
                                <span className="flex items-center gap-1">
                                  <Clock size={12}/> {course.hours}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText size={12}/> {course.lessons} Lessons
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users size={14} className="opacity-60" />
                            <span className="text-sm font-bold">{course.students}</span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="text-sm font-bold" style={{ color: '#832388' }}>
                            ${course.price}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star size={14} className="fill-[#FDE047] text-[#FDE047]" />
                            <span className="text-sm font-bold">{course.rating}</span>
                            <span className="text-xs opacity-60">({course.reviews})</span>
                          </div>
                        </td>
                        <td>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ 
                              backgroundColor: statusColor.bg,
                              color: statusColor.text
                            }}
                          >
                            {course.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              className="btn btn-ghost btn-xs cursor-pointer"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="btn btn-ghost btn-xs cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="btn btn-ghost btn-xs cursor-pointer text-error"
                              title="Delete"
                            >
                              <Trash2 size={16} />
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
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const statusColor = getStatusColor(course.status);
                return (
                  <div 
                    key={course.id}
                    className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="card-body p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ 
                            backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff'
                          }}
                        >
                          <PlayCircle className="w-6 h-6" style={{ color: '#832388' }} />
                        </div>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ 
                            backgroundColor: statusColor.bg,
                            color: statusColor.text
                          }}
                        >
                          {course.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold leading-snug mb-3 line-clamp-2 h-12">
                        {course.name}
                      </h3>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <p className="text-xs opacity-60 font-semibold">Students</p>
                          <p className="text-sm font-bold flex items-center gap-1">
                            <Users size={14} />
                            {course.students}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-60 font-semibold">Rating</p>
                          <p className="text-sm font-bold flex items-center gap-1">
                            <Star size={14} className="fill-[#FDE047] text-[#FDE047]" />
                            {course.rating}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-60 font-semibold">Lessons</p>
                          <p className="text-sm font-bold flex items-center gap-1">
                            <FileText size={14} />
                            {course.lessons}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-60 font-semibold">Duration</p>
                          <p className="text-sm font-bold flex items-center gap-1">
                            <Clock size={14} />
                            {course.hours}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-base-300">
                        <span className="text-xl font-bold" style={{ color: '#832388' }}>
                          ${course.price}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            className="btn btn-ghost btn-sm btn-circle cursor-pointer"
                            title="View Analytics"
                          >
                            <BarChart3 size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm btn-circle cursor-pointer"
                            title="Edit Course"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">No Courses Found</h3>
              <p className="opacity-60 mb-6">Try adjusting your search or filters</p>
              <button 
                className="btn gap-2 text-white border-0 cursor-pointer"
                style={{ backgroundColor: '#832388' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterCategory('All Categories');
                  setFilterStatus('All Status');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCoursesPage;