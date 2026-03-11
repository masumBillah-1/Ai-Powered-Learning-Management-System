"use client";
import { useState, useEffect } from "react";
import { Star, Users, CheckCircle, XCircle, Trash2 } from "lucide-react";

type Status = "published" | "pending" | "rejected";

export default function AdminCoursesPage() {
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("light");

  // ── Dark/Light sync ──
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    const interval = setInterval(() => {
      const current = localStorage.getItem("theme") || "light";
      if (current !== theme) {
        setTheme(current);
        document.documentElement.setAttribute("data-theme", current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [theme]);

  const [courses, setCourses] = useState([
    { id: 1, title: "Complete Web Development Bootcamp", instructor: "Karim Hossain", students: 150, price: "৳1,500", status: "published" as Status, rating: 4.7, category: "Web Dev"     },
    { id: 2, title: "Python for Beginners",              instructor: "Karim Hossain", students: 98,  price: "৳1,200", status: "published" as Status, rating: 4.5, category: "Programming" },
    { id: 3, title: "React Advanced",                   instructor: "Sadia Islam",   students: 0,   price: "৳2,000", status: "pending"   as Status, rating: 0,   category: "Web Dev"     },
    { id: 4, title: "UI/UX Design Fundamentals",        instructor: "Tanvir Ahmed",  students: 72,  price: "৳1,800", status: "published" as Status, rating: 4.8, category: "Design"      },
    { id: 5, title: "Data Science with Python",         instructor: "Nusrat Jahan",  students: 0,   price: "৳2,500", status: "rejected"  as Status, rating: 0,   category: "Data"        },
  ]);

  const handleApprove = (id: number) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: "published" as Status } : c));

  const handleReject = (id: number) =>
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" as Status } : c));

  const handleRemove = (id: number) =>
    setCourses(prev => prev.filter(c => c.id !== id));

  const filtered = filter === "all" ? courses : courses.filter(c => c.status === filter);

  const statusCfg: Record<Status, { bg: string; text: string; label: string }> = {
    published: { bg: "bg-success/10", text: "text-success",  label: "Published" },
    pending:   { bg: "bg-warning/10", text: "text-warning",  label: "Pending"   },
    rejected:  { bg: "bg-error/10",   text: "text-error",    label: "Rejected"  },
  };

  const counts = {
    all:       courses.length,
    published: courses.filter(c => c.status === "published").length,
    pending:   courses.filter(c => c.status === "pending").length,
    rejected:  courses.filter(c => c.status === "rejected").length,
  };

  return (
    <div className="min-h-screen ">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black tracking-tight">All Courses</h1>
          <p className="text-sm opacity-50 mt-1">{courses.length} total courses on the platform</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-base-200 p-1 rounded-xl">
          {(["all", "published", "pending", "rejected"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer flex items-center gap-1.5"
              style={filter === f ? { backgroundColor: "#832388", color: "#fff" } : {}}
            >
              {f}
              <span
                className="text-xs font-black px-1.5 py-0.5 rounded-full"
                style={filter === f
                  ? { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }
                  : { backgroundColor: "rgba(0,0,0,0.08)" }
                }
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full">
            <thead>
              <tr>
                {["#", "Course", "Instructor", "Category", "Students", "Price", "Rating", "Status", "Action"].map(h => (
                  <th key={h} className="text-xs font-bold uppercase tracking-wider opacity-50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 opacity-40 text-sm font-semibold">
                    No courses found
                  </td>
                </tr>
              )}
              {filtered.map((c, i) => {
                const s = statusCfg[c.status];
                return (
                  <tr key={c.id} className="hover">

                    {/* Index */}
                    <td className="text-xs font-black opacity-25">{String(i + 1).padStart(2, "0")}</td>

                    {/* Title */}
                    <td style={{ maxWidth: "160px" }}>
                      <span className="font-bold text-sm block overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{c.title}</span>
                    </td>

                    {/* Instructor */}
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#FF0F7B,#F89B29)" }}
                        >
                          {c.instructor.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold opacity-80 whitespace-nowrap">{c.instructor}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-info/10 text-info">
                        {c.category}
                      </span>
                    </td>

                    {/* Students */}
                    <td>
                      <div className="flex items-center gap-1 text-sm font-bold opacity-70">
                        <Users size={12} />
                        {c.students}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="font-black text-sm" style={{ color: "#832388" }}>{c.price}</td>

                    {/* Rating */}
                    <td>
                      {c.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star size={12} fill="#F89B29" color="#F89B29" />
                          <span className="text-sm font-bold" style={{ color: "#F89B29" }}>{c.rating}</span>
                        </div>
                      ) : (
                        <span className="text-xs opacity-30 font-bold">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex gap-1.5">
                        {c.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(c.id)}
                              className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                              data-tip="Approve"
                              style={{ backgroundColor: "#00C48C" }}
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button
                              onClick={() => handleReject(c.id)}
                              className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                              data-tip="Reject"
                              style={{ backgroundColor: "#F89B29" }}
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleRemove(c.id)}
                          className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                          data-tip="Remove"
                          style={{ backgroundColor: "#FF0F7B" }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-base-300 bg-base-200/50">
          <p className="text-xs opacity-50 font-semibold">
            Showing <span className="font-black opacity-100">{filtered.length}</span> of{" "}
            <span className="font-black opacity-100">{courses.length}</span> courses
          </p>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-success">{counts.published} Published</span>
            <span className="text-warning">{counts.pending} Pending</span>
            <span className="text-error">{counts.rejected} Rejected</span>
          </div>
        </div>
      </div>
    </div>
  );
}