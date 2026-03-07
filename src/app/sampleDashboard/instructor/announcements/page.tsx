"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Filter,
  Eye,
  Send,
  AlertCircle
} from 'lucide-react';

interface Announcement {
  id: number;
  date: string;
  title: string;
  course: string;
  status: 'Published' | 'Draft';
  views?: number;
  description?: string;
}

export default function AnnouncementsPage() {
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

  const announcementData: Announcement[] = [
    {
      id: 1,
      date: "2025-08-22T17:40:00",
      title: "Welcome to Introduction to Programming",
      course: "Introduction to Programming - Python & Java",
      status: "Published",
      views: 245,
      description: "Welcome to the new semester! We're excited to have you in this course."
    },
    {
      id: 2,
      date: "2025-08-10T10:15:00",
      title: "Essay Assignment Due Date Approaching",
      course: "Sketch from A to Z (2024): Become an app designer",
      status: "Draft",
      views: 0,
      description: "Reminder: Your essay assignment is due next week."
    },
    {
      id: 3,
      date: "2025-07-26T13:30:00",
      title: "Final Exam Schedule and Preparation Tips",
      course: "Learn Angular Fundamentals Beginners Guide",
      status: "Published",
      views: 567,
      description: "Important information about final exams and how to prepare."
    },
    {
      id: 4,
      date: "2025-05-15T16:00:00",
      title: "New Video Lectures Added",
      course: "Learn JavaScript and Express to become a Expert",
      status: "Published",
      views: 432,
      description: "New comprehensive video lectures have been added to the course."
    },
    {
      id: 5,
      date: "2025-09-01T09:00:00",
      title: "Course Materials Update",
      course: "UI/UX Design Degree",
      status: "Draft",
      views: 0,
      description: "Updated course materials are now available."
    },
  ];

  // Filter announcements
  const filteredAnnouncements = announcementData.filter(announcement => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'All Status' || 
      announcement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Count by status
  const counts = {
    total: announcementData.length,
    published: announcementData.filter(a => a.status === 'Published').length,
    draft: announcementData.filter(a => a.status === 'Draft').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      console.log('Deleting announcement:', id);
      // Add delete logic here
    }
  };

  return (
    <div className="min-h-screen">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div 
          className="card bg-base-100 shadow-lg border"
          style={{ borderColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
        >
          <div className="card-body p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                  Total Announcements
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#832388' }}>
                  {counts.total}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
              >
                <AlertCircle className="w-6 h-6" style={{ color: '#832388' }} />
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
                  {counts.published}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5' }}
              >
                <Send className="w-6 h-6" style={{ color: '#00C48C' }} />
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
                  {counts.draft}
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
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold">Announcements</h1>
            <button 
              className="btn gap-2 text-white border-0 cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #832388, #E3436B, #F89B29)' }}
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Add Announcement
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input 
                type="text" 
                placeholder="Search announcements or courses..." 
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
          {filteredAnnouncements.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-bold mb-2">No Announcements Found</h3>
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
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Date</th>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Announcement</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Views</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnnouncements.map((announcement) => (
                    <tr key={announcement.id} className="hover">
                      <td>
                        <div className="flex items-center gap-2 text-sm opacity-70">
                          <Calendar size={14} />
                          <span className="font-semibold whitespace-nowrap">
                            {formatDate(announcement.date)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <h4 className="text-sm font-bold mb-1 hover:text-[#832388] transition-colors cursor-pointer">
                            {announcement.title}
                          </h4>
                          <p className="text-xs opacity-60 italic">
                            Course: {announcement.course}
                          </p>
                        </div>
                      </td>
                      <td className="text-center">
                        {announcement.status === 'Published' ? (
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
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-sm">
                          <Eye size={14} className="opacity-60" />
                          <span className="font-bold">{announcement.views}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button 
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="View"
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
                            onClick={() => handleDelete(announcement.id)}
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
          {filteredAnnouncements.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-base-300">
              <p className="text-sm opacity-60">
                Showing {filteredAnnouncements.length} of {announcementData.length} announcements
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

      {/* Create Modal (Placeholder) */}
      {showCreateModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Announcement</h3>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input type="text" placeholder="Enter title" className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Course</span>
                </label>
                <select className="select select-bordered">
                  <option>Select Course</option>
                  <option>UI/UX Design Degree</option>
                  <option>Web Development</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea className="textarea textarea-bordered h-24" placeholder="Enter description"></textarea>
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
                  alert('Announcement created!');
                }}
              >
                Create
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}></div>
        </div>
      )}
    </div>
  );
}