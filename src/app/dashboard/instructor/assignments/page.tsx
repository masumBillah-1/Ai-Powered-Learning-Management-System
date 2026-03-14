"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search, FileText, Users, Eye, CheckCircle, Clock,
  Award, X, Star, MessageSquare, ExternalLink, Download,
  Loader2, BookOpen, Edit2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Assignment {
  lessonId: string;
  title: string;
  courseId: string;
  courseName: string;
  marks: number | null;
  submits: number;
  pending: number;
  graded: number;
  status: "Published" | "Draft";
  dueDate?: string;
  description?: string;
}

interface Submission {
  enrollmentId: string;
  studentId: string;
  student: { name: string; email: string; photoURL?: string } | null;
  submission: {
    lessonId: string;
    submittedAt: string;
    fileUrl?: string;
    textAnswer?: string;
    linkUrl?: string;
    status: "submitted" | "graded" | "late";
    marks?: number;
    totalMarks?: number;
    feedback?: string;
    gradedAt?: string;
  };
}

const toastStyle = {
  ok: { style: { borderRadius: "12px", background: "#1e1e2e", color: "#fff", fontWeight: "600" }, duration: 3500 },
  err: { style: { borderRadius: "12px", background: "#dc2626", color: "#fff", fontWeight: "600" }, duration: 4000 },
};

export default function InstructorAssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [theme, setTheme] = useState("light");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewModal, setViewModal] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [gradeModal, setGradeModal] = useState<Submission | null>(null);
  const [gradeData, setGradeData] = useState({ marks: "", feedback: "" });
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    const iv = setInterval(() => {
      const cur = localStorage.getItem("theme") || "light";
      if (cur !== theme) { setTheme(cur); document.documentElement.setAttribute("data-theme", cur); }
    }, 100);
    return () => clearInterval(iv);
  }, [theme]);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrollments?view=assignments");
      const data = await res.json();
      if (data.success) setAssignments(data.assignments || []);
      else toast.error(data.error || "Failed to load", toastStyle.err);
    } catch { toast.error("Network error", toastStyle.err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const fetchSubmissions = async (assignment: Assignment) => {
    setViewModal(assignment);
    setSubLoading(true);
    try {
      const res = await fetch(
        `/api/enrollments?view=submissions&lessonId=${assignment.lessonId}&courseId=${assignment.courseId}`
      );
      const data = await res.json();
      if (data.success) setSubmissions(data.submissions || []);
    } catch { toast.error("Failed to load submissions", toastStyle.err); }
    finally { setSubLoading(false); }
  };

  const handleGrade = async () => {
    if (!gradeModal || !viewModal) return;
    if (!gradeData.marks || isNaN(Number(gradeData.marks))) {
      toast.error("Please enter valid marks", toastStyle.err); return;
    }
    const maxMarks = viewModal.marks;
    if (maxMarks && Number(gradeData.marks) > maxMarks) {
      toast.error(`Marks cannot exceed ${maxMarks}`, toastStyle.err); return;
    }

    setGrading(true);
    const tid = toast.loading("Saving grade...", {
      style: { borderRadius: "12px", background: "#1e1e2e", color: "#fff", fontWeight: "600" },
    });

    try {
      const res = await fetch("/api/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grade",
          courseId: viewModal.courseId,
          lessonId: viewModal.lessonId,
          studentId: gradeModal.studentId,
          marks: Number(gradeData.marks),
          totalMarks: viewModal.marks,
          feedback: gradeData.feedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Grade submitted!", { id: tid, ...toastStyle.ok });
        setGradeModal(null);
        setGradeData({ marks: "", feedback: "" });
        await fetchSubmissions(viewModal);
        fetchAssignments();
      } else {
        toast.error(`❌ ${data.error || "Grading failed"}`, { id: tid, ...toastStyle.err });
      }
    } catch {
      toast.error("❌ Network error", { id: tid, ...toastStyle.err });
    } finally {
      setGrading(false);
    }
  };

  const filtered = assignments.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "All Status" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: assignments.length,
    published: assignments.filter((a) => a.status === "Published").length,
    totalSubmits: assignments.reduce((s, a) => s + a.submits, 0),
    pending: assignments.reduce((s, a) => s + a.pending, 0),
  };

  const pur = "#832388";

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" containerStyle={{ top: 80, right: 24 }} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Assignments", value: stats.total, color: pur, bg: theme === "dark" ? "#2a1f35" : "#f3e8ff", Icon: FileText },
          { label: "Published", value: stats.published, color: "#00C48C", bg: theme === "dark" ? "#0f2520" : "#d1fae5", Icon: CheckCircle },
          { label: "Total Submissions", value: stats.totalSubmits, color: "#FF0F7B", bg: theme === "dark" ? "#2a1520" : "#fce7f3", Icon: Users },
          { label: "Pending Review", value: stats.pending, color: "#F89B29", bg: theme === "dark" ? "#2a1f15" : "#fef3c7", Icon: Clock },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} className="card bg-base-100 shadow-lg border" style={{ borderColor: bg }}>
            <div className="card-body p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{label}</p>
                  <h2 className="text-3xl font-bold" style={{ color }}>{value}</h2>
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Assignment Management</h1>
            <div className="flex items-center gap-2 text-sm opacity-50">
              <BookOpen size={14} />
              Assignments are created inside course lessons
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={16} />
              <input type="text" placeholder="Search assignments or courses..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-10 bg-base-100 h-10 text-sm" />
            </div>
            <select className="select select-bordered bg-base-100 cursor-pointer h-10 text-sm min-w-[160px]"
              value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: pur }} />
              <span className="opacity-50">Loading assignments...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold mb-2">No Assignments Found</h3>
              <p className="opacity-60 mb-4 text-sm">
                {assignments.length === 0
                  ? "Add lessons with type 'Assignment' inside your courses."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-50">Assignment</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-50">Marks</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-50">Submitted</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-50">Pending</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-50">Graded</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-50">Status</th>
                    <th className="text-right text-xs font-bold uppercase tracking-wider opacity-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.lessonId} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: theme === "dark" ? "#2a1f35" : "#f3e8ff" }}>
                            <FileText className="w-5 h-5" style={{ color: pur }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{a.title}</p>
                            <p className="text-xs opacity-50">{a.courseName}</p>
                            {a.dueDate && (
                              <p className="text-xs opacity-40 mt-0.5">
                                Due: {new Date(a.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award size={13} className="opacity-50" />
                          <span className="text-sm font-bold">
                            {a.marks ? a.marks : <span className="opacity-40 text-xs">Not set</span>}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="text-sm font-bold" style={{ color: "#FF0F7B" }}>{a.submits}</span>
                      </td>
                      <td className="text-center">
                        <span className="text-sm font-bold" style={{ color: "#F89B29" }}>{a.pending}</span>
                      </td>
                      <td className="text-center">
                        <span className="text-sm font-bold" style={{ color: "#00C48C" }}>{a.graded}</span>
                      </td>
                      <td className="text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
                          style={{
                            backgroundColor: a.status === "Published"
                              ? theme === "dark" ? "#0f2520" : "#d1fae5"
                              : theme === "dark" ? "#2a1f15" : "#fef3c7",
                            color: a.status === "Published" ? "#00C48C" : "#F89B29",
                          }}>
                          <span className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: a.status === "Published" ? "#00C48C" : "#F89B29" }} />
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-1">
                          <button onClick={() => fetchSubmissions(a)}
                            className="btn btn-ghost btn-sm cursor-pointer" title="View Submissions">
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-base-300">
              <p className="text-xs opacity-50">
                Showing {filtered.length} of {assignments.length} assignments
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Submissions Modal ── */}
      {viewModal && (
        <div className="modal modal-open" style={{ zIndex: 50 }}>
          <div className="modal-box max-w-3xl p-0 overflow-hidden" style={{ zIndex: 51 }}>
            <div className="p-6 border-b border-base-300"
              style={{ background: `linear-gradient(135deg, ${pur}15, #FF0F7B10)` }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{viewModal.title}</h3>
                  <p className="text-sm opacity-60 mt-0.5">{viewModal.courseName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs font-semibold opacity-50">
                      Total Marks: <strong className="opacity-100">{viewModal.marks ? viewModal.marks : "Not set"}</strong>
                    </span>
                    {viewModal.dueDate && (
                      <span className="text-xs font-semibold opacity-50">
                        Due: <strong className="opacity-100">{new Date(viewModal.dueDate).toLocaleDateString()}</strong>
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => { setViewModal(null); setSubmissions([]); setGradeModal(null); }}
                  className="btn btn-ghost btn-sm btn-circle cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                {[
                  { label: "Submitted", val: viewModal.submits, color: "#FF0F7B" },
                  { label: "Pending", val: viewModal.pending, color: "#F89B29" },
                  { label: "Graded", val: viewModal.graded, color: "#00C48C" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-base-100 rounded-xl px-4 py-2 text-center border border-base-300">
                    <p className="text-lg font-bold" style={{ color }}>{val}</p>
                    <p className="text-xs opacity-50">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 max-h-[55vh] overflow-y-auto">
              {subLoading ? (
                <div className="flex items-center justify-center py-12 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: pur }} />
                  <span className="text-sm opacity-50">Loading submissions...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="font-semibold opacity-60">No submissions yet</p>
                  <p className="text-sm opacity-40 mt-1">Students haven't submitted this assignment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((s) => (
                    <div key={s.enrollmentId}
                      className="border border-base-300 rounded-xl p-4 hover:border-purple-400/50 transition-all">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${pur}, #FF0F7B)` }}>
                            {s.student?.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{s.student?.name || "Unknown"}</p>
                            <p className="text-xs opacity-50 truncate">{s.student?.email || ""}</p>
                            <p className="text-xs opacity-40 mt-0.5">
                              Submitted: {new Date(s.submission.submittedAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                              })}
                              {s.submission.status === "late" && (
                                <span className="ml-2 font-semibold" style={{ color: "#FF0F7B" }}>(Late)</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                            style={{
                              backgroundColor: s.submission.status === "graded"
                                ? theme === "dark" ? "#0f2520" : "#d1fae5"
                                : s.submission.status === "late"
                                  ? theme === "dark" ? "#2a1520" : "#fce7f3"
                                  : theme === "dark" ? "#2a1f15" : "#fef3c7",
                              color: s.submission.status === "graded" ? "#00C48C"
                                : s.submission.status === "late" ? "#FF0F7B" : "#F89B29",
                            }}>
                            {s.submission.status === "graded"
                              ? `${s.submission.marks}${viewModal.marks ? `/${viewModal.marks}` : ""}`
                              : s.submission.status}
                          </span>

                          {s.submission.fileUrl && (
                            <a href={s.submission.fileUrl} target="_blank" rel="noreferrer"
                              className="btn btn-xs btn-ghost gap-1 cursor-pointer">
                              <Download size={12} /> File
                            </a>
                          )}
                          {s.submission.linkUrl && (
                            <a href={s.submission.linkUrl} target="_blank" rel="noreferrer"
                              className="btn btn-xs btn-ghost gap-1 cursor-pointer">
                              <ExternalLink size={12} /> Link
                            </a>
                          )}

                          {s.submission.status !== "graded" ? (
                            <button
                              onClick={() => {
                                setGradeModal(s);
                                setGradeData({ marks: "", feedback: "" });
                              }}
                              className="btn btn-xs text-white border-0 cursor-pointer gap-1"
                              style={{ backgroundColor: pur }}>
                              <Star size={11} /> Grade
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setGradeModal(s);
                                setGradeData({
                                  marks: String(s.submission.marks ?? ""),
                                  feedback: s.submission.feedback || "",
                                });
                              }}
                              className="btn btn-xs btn-ghost cursor-pointer gap-1">
                              <Edit2 size={11} /> Edit
                            </button>
                          )}
                        </div>
                      </div>

                      {s.submission.textAnswer && (
                        <div className="mt-3 bg-base-200 rounded-lg p-3 text-sm opacity-70 line-clamp-2">
                          {s.submission.textAnswer}
                        </div>
                      )}
                      {s.submission.feedback && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs opacity-50">
                          <MessageSquare size={11} className="mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{s.submission.feedback}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Backdrop — grade modal খোলা থাকলে block করো না */}
          {!gradeModal && (
            <div className="modal-backdrop" onClick={() => { setViewModal(null); setSubmissions([]); }} />
          )}
        </div>
      )}

      {/* ── Grade Modal — সবার উপরে ── */}
      {gradeModal && viewModal && (
        <div className="modal modal-open" style={{ zIndex: 100 }}>
          <div className="modal-box max-w-md p-0 overflow-hidden" style={{ zIndex: 101 }}>
            <div className="p-5 border-b border-base-300"
              style={{ background: `linear-gradient(135deg, ${pur}15, #FF0F7B08)` }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Grade Assignment</h3>
                  <p className="text-sm opacity-60 mt-0.5">{gradeModal.student?.name || "Student"}</p>
                </div>
                <button onClick={() => setGradeModal(null)}
                  className="btn btn-ghost btn-sm btn-circle cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {(gradeModal.submission.fileUrl || gradeModal.submission.linkUrl || gradeModal.submission.textAnswer) && (
                <div className="bg-base-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-50">Submission</p>
                  {gradeModal.submission.textAnswer && (
                    <p className="text-sm opacity-70 line-clamp-3">{gradeModal.submission.textAnswer}</p>
                  )}
                  <div className="flex gap-2">
                    {gradeModal.submission.fileUrl && (
                      <a href={gradeModal.submission.fileUrl} target="_blank" rel="noreferrer"
                        className="btn btn-xs btn-ghost gap-1">
                        <Download size={11} /> Download File
                      </a>
                    )}
                    {gradeModal.submission.linkUrl && (
                      <a href={gradeModal.submission.linkUrl} target="_blank" rel="noreferrer"
                        className="btn btn-xs btn-ghost gap-1">
                        <ExternalLink size={11} /> Open Link
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-bold mb-2 block">
                  Marks{" "}
                  {viewModal.marks
                    ? <span className="opacity-50 font-normal">/ {viewModal.marks}</span>
                    : <span className="opacity-40 font-normal text-xs">(no limit set)</span>}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={viewModal.marks || undefined}
                    value={gradeData.marks}
                    onChange={(e) => setGradeData((p) => ({ ...p, marks: e.target.value }))}
                    placeholder={viewModal.marks ? `0 – ${viewModal.marks}` : "Enter marks"}
                    className="input input-bordered bg-base-200 flex-1 focus:outline-none"
                    style={{ borderColor: gradeData.marks ? pur : "" }}
                  />
                  {gradeData.marks && viewModal.marks && Number(gradeData.marks) >= 0 && (
                    <div className="text-right min-w-[60px]">
                      <p className="text-xl font-bold" style={{ color: pur }}>
                        {Math.round((Number(gradeData.marks) / viewModal.marks) * 100)}%
                      </p>
                      <p className="text-xs opacity-40">score</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-2 block">
                  Feedback <span className="opacity-40 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={gradeData.feedback}
                  onChange={(e) => setGradeData((p) => ({ ...p, feedback: e.target.value }))}
                  placeholder="Write feedback for the student..."
                  className="textarea textarea-bordered bg-base-200 w-full resize-none focus:outline-none text-sm"
                  style={{ borderColor: gradeData.feedback ? pur : "" }}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => setGradeModal(null)}
                  className="btn flex-1 btn-ghost border border-base-300 cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleGrade} disabled={!gradeData.marks || grading}
                  className="btn flex-1 text-white border-0 cursor-pointer disabled:opacity-50"
                  style={{ background: `linear-gradient(135deg, ${pur}, #FF0F7B)` }}>
                  {grading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    : <><Star size={15} /> Submit Grade</>}
                </button>
              </div>
            </div>
          </div>
          {/* Grade modal এর backdrop */}
          <div className="modal-backdrop" style={{ zIndex: 99 }} onClick={() => setGradeModal(null)} />
        </div>
      )}
    </div>
  );
}