"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import toast from "react-hot-toast";

// Icons
const I = {
  Plus: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Grid: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  List: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
  Search: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Edit: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
  Trash: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  Clock: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  Book: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>),
  Users: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Star: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
  ChevronDown: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>),
};

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  lessons: number;
  quizzes: number;
  duration: string;
  students: number;
  price: number;
  rating: number;
  reviews: number;
  status: "Published" | "Pending" | "Draft";
}

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");

  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: "Information About UI/UX Design Degree",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:15:00",
      students: 600,
      price: 160,
      rating: 4.5,
      reviews: 300,
      status: "Published",
    },
    {
      id: 2,
      title: "Wordpress for Beginners - Master Wordpress Quickly",
      thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:10:00",
      students: 500,
      price: 180,
      rating: 4.2,
      reviews: 430,
      status: "Pending",
    },
    {
      id: 3,
      title: "Sketch from A to Z (2024): Become an app designer",
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:15:00",
      students: 300,
      price: 200,
      rating: 4.7,
      reviews: 140,
      status: "Draft",
    },
    {
      id: 4,
      title: "Build Responsive Real World Websites with Crash Course",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:10:00",
      students: 400,
      price: 220,
      rating: 4.4,
      reviews: 260,
      status: "Published",
    },
    {
      id: 5,
      title: "Learn JavaScript and Express to become a Expert",
      thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:15:00",
      students: 700,
      price: 170,
      rating: 4.8,
      reviews: 180,
      status: "Published",
    },
    {
      id: 6,
      title: "Introduction to Python Programming",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:15:00",
      students: 450,
      price: 150,
      rating: 4.6,
      reviews: 380,
      status: "Published",
    },
    {
      id: 7,
      title: "Build Responsive Websites with HTML5 and CSS3",
      thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:15:00",
      students: 620,
      price: 130,
      rating: 4.9,
      reviews: 510,
      status: "Published",
    },
    {
      id: 8,
      title: "Information About Photoshop Design Degree",
      thumbnail: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:15:00",
      students: 550,
      price: 190,
      rating: 4.6,
      reviews: 400,
      status: "Published",
    },
    {
      id: 9,
      title: "C# Developers Double Your Coding with Visual Studio",
      thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:09:00",
      students: 240,
      price: 140,
      rating: 4.1,
      reviews: 180,
      status: "Published",
    },
    {
      id: 10,
      title: "Complete HTML, CSS and Javascript Course",
      thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400",
      lessons: 11,
      quizzes: 2,
      duration: "03:15:00",
      students: 380,
      price: 110,
      rating: 4.3,
      reviews: 200,
      status: "Published",
    },
  ]);

  const stats = {
    active: courses.filter(c => c.status === "Published").length,
    pending: courses.filter(c => c.status === "Pending").length,
    draft: courses.filter(c => c.status === "Draft").length,
    free: courses.filter(c => c.price === 0).length,
    paid: courses.filter(c => c.price > 0).length,
  };

  const handleEdit = (id: number) => {
    toast.success(`Editing course #${id}`);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      toast.success("Course deleted successfully!");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
            <p className="text-3xl font-bold mb-1">{stats.active}</p>
            <p className="text-sm opacity-90">Active Courses</p>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-5 text-white">
            <p className="text-3xl font-bold mb-1">{stats.pending}</p>
            <p className="text-sm opacity-90">Pending Courses</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white">
            <p className="text-3xl font-bold mb-1">{stats.draft}</p>
            <p className="text-sm opacity-90">Draft Courses</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-5 text-white">
            <p className="text-3xl font-bold mb-1">{stats.free}</p>
            <p className="text-sm opacity-90">Free Courses</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-5 text-white">
            <p className="text-3xl font-bold mb-1">{stats.paid}</p>
            <p className="text-sm opacity-90">Paid Courses</p>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Courses</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-200"}`}
                >
                  <I.Grid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-pink-500 text-white" : "text-gray-600 hover:bg-gray-200"}`}
                >
                  <I.List />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition bg-gray-50"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <I.Search />
              </div>
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 pl-4 pr-10 rounded-xl border border-gray-200 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition bg-gray-50 appearance-none cursor-pointer"
              >
                <option>Status</option>
                <option>Published</option>
                <option>Pending</option>
                <option>Draft</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <I.ChevronDown />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Course Name</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Ratings</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-1">{course.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <I.Book /> {course.lessons} Lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <I.Book /> {course.quizzes} Quizzes
                            </span>
                            <span className="flex items-center gap-1">
                              <I.Clock /> {course.duration} Hours
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.students}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${course.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400"><I.Star /></span>
                        <span className="text-sm font-semibold text-gray-900">{course.rating}</span>
                        <span className="text-xs text-gray-500">({course.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                        course.status === "Published" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : course.status === "Pending"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-purple-100 text-purple-700"
                      }`}>
                        {course.status === "Published" && "✓"} {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <I.Edit />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <I.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Page 1 of 2</p>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">
                  ‹
                </button>
                <button className="w-8 h-8 rounded-lg bg-pink-500 text-white font-medium">1</button>
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">2</button>
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">3</button>
                <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
