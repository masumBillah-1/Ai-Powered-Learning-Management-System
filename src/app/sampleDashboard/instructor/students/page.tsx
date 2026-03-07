"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  MapPin, 
  Calendar, 
  BookOpen, 
  MessageCircle,
  Mail,
  Phone,
  Eye,
  MoreVertical,
  Filter
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  location: string;
  enrolledDate: string;
  courses: number;
  status: 'Active' | 'Inactive';
  avatar: string;
  phone?: string;
}

export default function InstructorStudentsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
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

  const studentData: Student[] = [
    { 
      id: 1, 
      name: "Ronald Richard", 
      email: "ronald.richard@email.com",
      location: "New York", 
      enrolledDate: "2025-08-22", 
      courses: 10, 
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=1",
      phone: "+1 234 567 8901"
    },
    { 
      id: 2, 
      name: "Mona Nancy", 
      email: "mona.nancy@email.com",
      location: "Los Angeles", 
      enrolledDate: "2025-07-15", 
      courses: 8, 
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=2",
      phone: "+1 234 567 8902"
    },
    { 
      id: 3, 
      name: "Patrick Alleman", 
      email: "patrick.a@email.com",
      location: "Alabama", 
      enrolledDate: "2025-06-18", 
      courses: 12, 
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=3",
      phone: "+1 234 567 8903"
    },
    { 
      id: 4, 
      name: "Olive Paxson", 
      email: "olive.paxson@email.com",
      location: "Brisbane", 
      enrolledDate: "2025-05-03", 
      courses: 7, 
      status: "Inactive",
      avatar: "https://i.pravatar.cc/150?u=4",
      phone: "+1 234 567 8904"
    },
    { 
      id: 5, 
      name: "Chris Thomas", 
      email: "chris.thomas@email.com",
      location: "New York", 
      enrolledDate: "2025-04-14", 
      courses: 4, 
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=5",
      phone: "+1 234 567 8905"
    },
    { 
      id: 6, 
      name: "Joyce Perron", 
      email: "joyce.perron@email.com",
      location: "Ontario", 
      enrolledDate: "2025-03-17", 
      courses: 6, 
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=6",
      phone: "+1 234 567 8906"
    },
    { 
      id: 7, 
      name: "Sarah Johnson", 
      email: "sarah.j@email.com",
      location: "Chicago", 
      enrolledDate: "2025-02-20", 
      courses: 9, 
      status: "Active",
      avatar: "https://i.pravatar.cc/150?u=7",
      phone: "+1 234 567 8907"
    },
    { 
      id: 8, 
      name: "Michael Brown", 
      email: "michael.b@email.com",
      location: "Miami", 
      enrolledDate: "2025-01-10", 
      courses: 5, 
      status: "Inactive",
      avatar: "https://i.pravatar.cc/150?u=8",
      phone: "+1 234 567 8908"
    },
  ];

  // Filter students
  const filteredStudents = studentData.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      filterStatus === 'All Status' || 
      student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Count stats
  const stats = {
    total: studentData.length,
    active: studentData.filter(s => s.status === 'Active').length,
    inactive: studentData.filter(s => s.status === 'Inactive').length,
    totalCourses: studentData.reduce((sum, s) => sum + s.courses, 0),
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
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
                  Total Students
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#832388' }}>
                  {stats.total}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f35' : '#f3e8ff' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#832388' }} />
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
                  Active Students
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#00C48C' }}>
                  {stats.active}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#00C48C' }} />
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
                  Inactive
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#FF0F7B' }}>
                  {stats.inactive}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1520' : '#fce7f3' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#FF0F7B' }} />
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
                  Total Enrollments
                </p>
                <h2 className="text-3xl font-bold" style={{ color: '#F89B29' }}>
                  {stats.totalCourses}
                </h2>
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme === 'dark' ? '#2a1f15' : '#fef3c7' }}
              >
                <BookOpen className="w-6 h-6" style={{ color: '#F89B29' }} />
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
            <h1 className="text-2xl font-bold">Students Management</h1>
            
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
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, or location..." 
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
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* Table/Grid View */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">No Students Found</h3>
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
          ) : viewMode === 'list' ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Student</th>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Contact</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Location</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Enrolled</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Courses</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Status</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-xl">
                              <img src={student.avatar} alt={student.name} />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold hover:text-[#832388] transition-colors cursor-pointer">
                              {student.name}
                            </h4>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs opacity-70">
                            <Mail size={12} />
                            <span>{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center gap-2 text-xs opacity-70">
                              <Phone size={12} />
                              <span>{student.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-sm">
                          <MapPin size={14} style={{ color: '#832388' }} />
                          <span className="font-semibold">{student.location}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs opacity-70">
                          <Calendar size={12} />
                          <span className="font-semibold">{formatDate(student.enrolledDate)}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <BookOpen size={14} style={{ color: '#F89B29' }} />
                          <span className="text-sm font-bold" style={{ color: '#F89B29' }}>
                            {student.courses}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        {student.status === 'Active' ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ 
                              backgroundColor: theme === 'dark' ? '#0f2520' : '#d1fae5',
                              color: '#00C48C'
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#00C48C' }}></span>
                            Active
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ 
                              backgroundColor: theme === 'dark' ? '#2a1520' : '#fce7f3',
                              color: '#FF0F7B'
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#FF0F7B' }}></span>
                            Inactive
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button 
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="View Profile"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="Send Message"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button 
                            className="btn btn-ghost btn-sm cursor-pointer"
                            title="More Options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id}
                  className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="card-body p-5">
                    {/* Avatar & Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-xl">
                          <img src={student.avatar} alt={student.name} />
                        </div>
                      </div>
                      {student.status === 'Active' ? (
                        <div className="badge badge-sm gap-1.5" style={{ backgroundColor: '#d1fae5', color: '#00C48C', border: 'none' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C]"></span>
                          Active
                        </div>
                      ) : (
                        <div className="badge badge-sm gap-1.5" style={{ backgroundColor: '#fce7f3', color: '#FF0F7B', border: 'none' }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF0F7B]"></span>
                          Inactive
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold mb-2 hover:text-[#832388] transition-colors cursor-pointer">
                      {student.name}
                    </h3>

                    {/* Contact */}
                    <div className="space-y-2 mb-4 text-xs opacity-70">
                      <div className="flex items-center gap-2">
                        <Mail size={12} />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} />
                        {student.location}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-base-300">
                      <div>
                        <p className="text-xs opacity-60 mb-1">Enrolled</p>
                        <p className="text-xs font-bold">{formatDate(student.enrolledDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-60 mb-1">Courses</p>
                        <p className="text-lg font-bold" style={{ color: '#F89B29' }}>{student.courses}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="btn btn-sm flex-1 cursor-pointer" style={{ backgroundColor: '#832388', color: 'white', border: 'none' }}>
                        <Eye size={14} /> View
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
          {filteredStudents.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-base-300">
              <p className="text-sm opacity-60">
                Showing {filteredStudents.length} of {studentData.length} students
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