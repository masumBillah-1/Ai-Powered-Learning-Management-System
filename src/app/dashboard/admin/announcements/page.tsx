"use client";

import { useState } from "react";
import Link from "next/link";

// ── Icons ──────────────────────────────────────────────────────────────────
const I = {
  Search:   () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Eye:      () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  Edit:     () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash:    () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Plus:     () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  ArrowLeft: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
};

export default function AnnouncementsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock announcements data
  const announcements = [
    {
      id: 1,
      date: "22 Aug 2025, 05:40 PM",
      title: "Welcome to Introduction to Programming",
      course: "Introduction to Programming – Python & Java",
      status: "Published",
      views: 245,
    },
    {
      id: 2,
      date: "20 Aug 2025, 03:20 PM",
      title: "New Assignment Posted",
      course: "Web Development Bootcamp",
      status: "Published",
      views: 189,
    },
    {
      id: 3,
      date: "18 Aug 2025, 11:15 AM",
      title: "Quiz Schedule Update",
      course: "Data Science Fundamentals",
      status: "Draft",
      views: 0,
    },
    {
      id: 4,
      date: "15 Aug 2025, 09:30 AM",
      title: "Course Material Updated",
      course: "React & Next.js Masterclass",
      status: "Published",
      views: 312,
    },
    {
      id: 5,
      date: "12 Aug 2025, 02:15 PM",
      title: "Important: Exam Schedule",
      course: "Full Stack Development",
      status: "Published",
      views: 428,
    },
  ];

  const filtered = announcements.filter(a => {
    const matchesStatus = statusFilter === "all" || a.status.toLowerCase() === statusFilter;
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         a.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-100 to-blue-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">Announcements</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Link href="/dashboard/admin" className="hover:text-pink-600 transition">Home</Link>
            <span>→</span>
            <span className="text-pink-600 font-medium">Announcements</span>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-white/10 rounded-full -mb-24" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://i.pravatar.cc/150?u=instructor" 
                  alt="Eugene Andre"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">Eugene Andre</h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <p className="text-purple-200 text-sm">Instructor</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition border border-white/20">
                Add New Course
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white rounded-xl font-medium transition shadow-lg">
                Student Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Main Menu</h3>
              <nav className="space-y-1">
                {[
                  { label: "Dashboard", href: "/dashboard/admin", icon: "📊" },
                  { label: "My Profile", href: "/dashboard/admin/profile", icon: "👤" },
                  { label: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
                  { label: "Announcements", href: "/dashboard/admin/announcements", icon: "📢", active: true },
                  { label: "Assignments", href: "/dashboard/admin/assignments", icon: "📝" },
                  { label: "Students", href: "/dashboard/admin/students", icon: "👥" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      item.active 
                        ? "bg-pink-50 text-pink-600 border border-pink-200" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
              </div>
              <button className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 transition shadow-lg">
                <I.Plus />
                Add Announcement
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wider">Status</label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition bg-gray-50"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition bg-gray-50"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <I.Search />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcements Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Announcements</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="text-right px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((announcement) => (
                      <tr key={announcement.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {announcement.date}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{announcement.title}</p>
                            <p className="text-xs text-gray-500 mt-1">Course: {announcement.course}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                            announcement.status === "Published" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {announcement.status === "Published" && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                            {announcement.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900" title="View">
                              <I.Eye />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900" title="Edit">
                              <I.Edit />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500 hover:text-red-700" title="Delete">
                              <I.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-3">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No announcements found</p>
                  <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
