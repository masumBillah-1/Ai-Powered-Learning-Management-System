"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit2,
  Trash2,
  MessageSquare,
  Clock,
  Eye,
  Award,
  CheckCircle,
  Search
} from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  course: string;
  questions: number;
  duration: string;
  totalMarks: number;
  passMarks: number;
  status: 'Published' | 'Draft';
  attempts?: number;
}

export default function InstructorQuizPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [theme, setTheme] = useState("light");

  // Form states
  const [formData, setFormData] = useState({
    course: '',
    title: '',
    questions: '',
    totalMarks: '',
    passMarks: '',
    duration: '00:30'
  });

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

  const quizData: Quiz[] = [
    {
      id: 1,
      title: "Information About UI/UX Design Degree",
      course: "UI/UX Design Fundamentals",
      questions: 25,
      duration: "30 Minutes",
      totalMarks: 100,
      passMarks: 60,
      status: "Published",
      attempts: 45
    },
    {
      id: 2,
      title: "Learn JavaScript and Express to become a Expert",
      course: "JavaScript Development",
      questions: 15,
      duration: "25 Minutes",
      totalMarks: 75,
      passMarks: 45,
      status: "Published",
      attempts: 32
    },
    {
      id: 3,
      title: "Introduction to Python Programming",
      course: "Python Basics",
      questions: 22,
      duration: "15 Minutes",
      totalMarks: 50,
      passMarks: 30,
      status: "Draft",
      attempts: 0
    },
    {
      id: 4,
      title: "Build Responsive Websites with HTML5 and CSS3",
      course: "Web Development",
      questions: 30,
      duration: "50 Minutes",
      totalMarks: 150,
      passMarks: 90,
      status: "Published",
      attempts: 68
    },
    {
      id: 5,
      title: "Information About Photoshop Design Degree",
      course: "Graphic Design",
      questions: 20,
      duration: "20 Minutes",
      totalMarks: 80,
      passMarks: 48,
      status: "Published",
      attempts: 28
    },
  ];

  // Filter quizzes
  const filteredQuizzes = quizData.filter(quiz => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'All Status' ||
      quiz.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Count stats
  const stats = {
    total: quizData.length,
    published: quizData.filter(q => q.status === 'Published').length,
    draft: quizData.filter(q => q.status === 'Draft').length,
    totalAttempts: quizData.reduce((sum, q) => sum + (q.attempts || 0), 0),
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      console.log('Deleting quiz:', id);
      // Add delete logic here
    }
  };

  const handleSubmit = () => {
    console.log('Creating quiz:', formData);
    setShowCreateModal(false);
    alert('Quiz created successfully!');
    // Reset form
    setFormData({
      course: '',
      title: '',
      questions: '',
      totalMarks: '',
      passMarks: '',
      duration: '00:30'
    });
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
                  Total Quizzes
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#832388' }}>
                  {stats.total}
                </h2>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
              >
                <MessageSquare className="w-6 h-6" style={{ color: '#832388' }} />
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
          style={{ borderColor: theme === 'dark' ? '#2a1f15' : '#fef3c7' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Drafts
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#F89B29' }}>
                  {stats.draft}
                </h2>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f15' : '#fef3c7' }}
              >
                <Edit2 className="w-6 h-6" style={{ color: '#F89B29' }} />
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
                  Total Attempts
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#FF0F7B' }}>
                  {stats.totalAttempts}
                </h2>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1520' : '#fce7f3' }}
              >
                <Award className="w-6 h-6" style={{ color: '#FF0F7B' }} />
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
            <h1 className="text-2xl font-bold">Quiz Management</h1>
            <button
              className="btn gap-2 text-white border-0 cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #832388, #E3436B, #F89B29)' }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Add Quiz
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input
                type="text"
                placeholder="Search quizzes or courses..."
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
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">No Quizzes Found</h3>
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
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Quiz Details</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Questions</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Duration</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Marks</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Attempts</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff'
                            }}
                          >
                            <MessageSquare className="w-6 h-6" style={{ color: '#832388' }} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold mb-1 hover:text-[#832388] transition-colors cursor-pointer">
                              {quiz.title}
                            </h4>
                            <p className="text-xs opacity-60">
                              {quiz.course}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <MessageSquare size={14} className="opacity-60" />
                          <span className="text-sm font-bold">{quiz.questions}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Clock size={14} className="opacity-60" />
                          <span className="text-sm font-semibold">{quiz.duration}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="text-sm">
                          <span className="font-bold">{quiz.totalMarks}</span>
                          <span className="opacity-60"> / </span>
                          <span className="text-xs opacity-60">Pass: {quiz.passMarks}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="text-sm font-bold" style={{ color: '#FF0F7B' }}>
                          {quiz.attempts || 0}
                        </span>
                      </td>
                      <td className="text-center">
                        {quiz.status === 'Published' ? (
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
                          <Link
                            href="/dashboard/instructor/quiz-results"
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="View Results"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-ghost btn-sm text-error cursor-pointer"
                            title="Delete"
                            onClick={() => handleDelete(quiz.id)}
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
          {filteredQuizzes.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-base-300">
              <p className="text-sm opacity-60">
                Showing {filteredQuizzes.length} of {quizData.length} quizzes
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

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-6">Add New Quiz</h3>

            <div className="space-y-4">
              {/* Course Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Course <span className="text-error">*</span>
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">Select Course</option>
                  <option>UI/UX Design Fundamentals</option>
                  <option>JavaScript Development</option>
                  <option>Python Basics</option>
                  <option>Web Development</option>
                </select>
              </div>

              {/* Quiz Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Quiz Title <span className="text-error">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter quiz title"
                  className="input input-bordered"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Questions & Total Marks */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      No of Questions <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    className="input input-bordered"
                    value={formData.questions}
                    onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Total Marks <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    className="input input-bordered"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  />
                </div>
              </div>

              {/* Pass Marks & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Pass Mark <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="number"
                    placeholder="60"
                    className="input input-bordered"
                    value={formData.passMarks}
                    onChange={(e) => setFormData({ ...formData, passMarks: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Duration <span className="text-error">*</span>
                    </span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
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
                onClick={handleSubmit}
              >
                Add Quiz
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}></div>
        </div>
      )}
    </div>
  );
}