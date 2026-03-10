"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FileText,
  Users,
  Eye,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  course: string;
  marks: number;
  submits: number;
  status: 'Published' | 'Draft';
  dueDate?: string;
  pending?: number;
}

export default function InstructorAssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [theme, setTheme] = useState("light");
  const [showCreateModal, setShowCreateModal] = useState(false);

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

  const assignmentData: Assignment[] = [
    {
      id: 1,
      title: "Building Your First Landing Page",
      course: "Sketch from A to Z (2024): Become an app designer",
      marks: 80,
      submits: 2,
      pending: 15,
      status: "Published",
      dueDate: "2024-03-20"
    },
    {
      id: 2,
      title: "Building a Basic Angular Application",
      course: "Learn Angular Fundamentals Beginners Guide",
      marks: 60,
      submits: 4,
      pending: 8,
      status: "Draft",
      dueDate: "2024-03-25"
    },
    {
      id: 3,
      title: "Basic Arithmetic Operations",
      course: "Learn JavaScript and Express to become a Expert",
      marks: 30,
      submits: 3,
      pending: 12,
      status: "Published",
      dueDate: "2024-03-18"
    },
    {
      id: 4,
      title: "Basic Calculations",
      course: "Introduction to Programming - Python & Java",
      marks: 50,
      submits: 5,
      pending: 10,
      status: "Published",
      dueDate: "2024-03-22"
    },
    {
      id: 5,
      title: "Advanced React Components",
      course: "React Development Bootcamp",
      marks: 100,
      submits: 8,
      pending: 20,
      status: "Published",
      dueDate: "2024-03-30"
    },
    {
      id: 6,
      title: "UI/UX Design Principles",
      course: "UI/UX Design Degree",
      marks: 75,
      submits: 0,
      pending: 0,
      status: "Draft",
      dueDate: "2024-04-05"
    },
  ];

  // Filter assignments
  const filteredAssignments = assignmentData.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'All Status' || 
      assignment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Count stats
  const stats = {
    total: assignmentData.length,
    published: assignmentData.filter(a => a.status === 'Published').length,
    draft: assignmentData.filter(a => a.status === 'Draft').length,
    totalSubmissions: assignmentData.reduce((sum, a) => sum + a.submits, 0),
    pendingReview: assignmentData.reduce((sum, a) => sum + (a.pending || 0), 0),
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      console.log('Deleting assignment:', id);
      // Add delete logic here
    }
  };

  return (
    <div className="min-h-screen ">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Total Assignments
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#832388' }}>
                  {stats.total}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
              >
                <FileText className="w-6 h-6" style={{ color: '#832388' }} />
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#0f2520' : '#d1fae5' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Published
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#00C48C' }}>
                  {stats.published}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5' }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: '#00C48C' }} />
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#2a1520' : '#fce7f3' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Total Submissions
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#FF0F7B' }}>
                  {stats.totalSubmissions}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1520' : '#fce7f3' }}
              >
                <Users className="w-6 h-6" style={{ color: '#FF0F7B' }} />
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#2a1f15' : '#fef3c7' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Pending Review
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#F89B29' }}>
                  {stats.pendingReview}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f15' : '#fef3c7' }}
              >
                <Clock className="w-6 h-6" style={{ color: '#F89B29' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold">Assignment Management</h1>
            <button 
              className="btn gap-2 text-white border-0 cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #832388, #E3436B, #F89B29)' }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Add Assignment
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input 
                type="text" 
                placeholder="Search assignments or courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-11 bg-base-100"
              />
            </div>
            
            {/* Status Filter */}
            <select 
              className="select select-bordered bg-base-100 cursor-pointer min-w-[180px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>

          {/* Table */}
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">No Assignments Found</h3>
              <p className="opacity-60 mb-6">Try adjusting your search or filters</p>
              <button 
                className="btn gap-2 cursor-pointer"
                style={{ backgroundColor: '#832388', color: 'white', border: 'none' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('All Status');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Assignment</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Total Marks</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Submissions</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Pending</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff'
                            }}
                          >
                            <FileText className="w-6 h-6" style={{ color: '#832388' }} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold mb-1 hover:text-[#832388] transition-colors cursor-pointer">
                              {assignment.title}
                            </h4>
                            <p className="text-xs opacity-60">
                              {assignment.course}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award size={14} className="opacity-60" />
                          <span className="text-sm font-bold">{assignment.marks}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle size={14} className="opacity-60" />
                          <span className="text-sm font-bold" style={{ color: '#00C48C' }}>
                            {assignment.submits}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock size={14} className="opacity-60" />
                          <span className="text-sm font-bold" style={{ color: '#F89B29' }}>
                            {assignment.pending || 0}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        {assignment.status === 'Published' ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ 
                              backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5',
                              color: '#00C48C'
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00C48C' }}></span>
                            Published
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ 
                              backgroundColor: theme === 'dark' ? '#2a1f15' : '#fef3c7',
                              color: '#F89B29'
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F89B29' }}></span>
                            Draft
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button 
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="View Submissions"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm text-error cursor-pointer"
                            title="Delete"
                            onClick={() => handleDelete(assignment.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredAssignments.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-base-300">
              <p className="text-sm opacity-60">
                Showing {filteredAssignments.length} of {assignmentData.length} assignments
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Create New Assignment</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Assignment Title</span>
                </label>
                <input type="text" placeholder="Enter assignment title" className="input input-bordered" />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Select Course</span>
                </label>
                <select className="select select-bordered">
                  <option>Choose a course</option>
                  <option>UI/UX Design Degree</option>
                  <option>Web Development Bootcamp</option>
                  <option>JavaScript Fundamentals</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Total Marks</span>
                  </label>
                  <input type="number" placeholder="100" className="input input-bordered" />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Due Date</span>
                  </label>
                  <input type="date" className="input input-bordered" />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" placeholder="Enter assignment description"></textarea>
              </div>
            </div>
            <div className="modal-action">
              <button 
                className="btn btn-ghost cursor-pointer"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn text-white border-0 cursor-pointer"
                style={{ backgroundColor: '#832388' }}
                onClick={() => {
                  setShowCreateModal(false);
                  alert('Assignment created!');
                }}
              >
                Create Assignment
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}></div>
        </div>
      )}
    </div>
  );
}