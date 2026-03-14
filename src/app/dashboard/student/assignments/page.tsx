"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText, Calendar, Clock, Upload, Download,
  CheckCircle, AlertCircle, Search, X, Link2,
  MessageSquare, Loader2, Star,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Assignment {
  lessonId: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate?: string;
  totalMarks: number;
  description: string;
  status: "Pending" | "Submitted" | "Graded";
  score?: number;
  feedback?: string;
  submittedDate?: string;
  fileUrl?: string;
  textAnswer?: string;
  linkUrl?: string;
}

const toastStyle = {
  ok: { style: { borderRadius: "12px", background: "#1e1e2e", color: "#fff", fontWeight: "600" }, duration: 3500 },
  err: { style: { borderRadius: "12px", background: "#dc2626", color: "#fff", fontWeight: "600" }, duration: 4000 },
};

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"Pending" | "Submitted" | "Graded">("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
  const [submitData, setSubmitData] = useState({ textAnswer: "", linkUrl: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitTab, setSubmitTab] = useState<"text" | "file" | "link">("text");
  const [showInstructions, setShowInstructions] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<Assignment | null>(null);

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
      const res = await fetch("/api/enrollments?view=my-assignments");
      const data = await res.json();
      if (data.success) setAssignments(data.assignments || []);
      else toast.error(data.error || "Failed to load", toastStyle.err);
    } catch { toast.error("Network error", toastStyle.err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAssignments(); }, [fetchAssignments]);

  const handleSubmit = async () => {
    if (!submitModal) return;
    if (submitTab === "text" && !submitData.textAnswer.trim()) {
      toast.error("Please write your answer first", toastStyle.err); return;
    }
    if (submitTab === "file" && !file) {
      toast.error("Please select a file", toastStyle.err); return;
    }
    if (submitTab === "link" && !submitData.linkUrl.trim()) {
      toast.error("Please enter a link", toastStyle.err); return;
    }

    setSubmitting(true);
    const tid = toast.loading("Submitting...", {
      style: { borderRadius: "12px", background: "#1e1e2e", color: "#fff", fontWeight: "600" },
    });

    try {
      let fileUrl = "";
      if (file) fileUrl = file.name; // TODO: replace with cloudinary upload

      const res = await fetch("/api/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          courseId: submitModal.courseId,
          lessonId: submitModal.lessonId,
          textAnswer: submitData.textAnswer,
          linkUrl: submitData.linkUrl,
          fileUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.isLate ? "⚠️ Submitted (late)" : "✅ Assignment submitted!", { id: tid, ...toastStyle.ok });
        setSubmitModal(null);
        setSubmitData({ textAnswer: "", linkUrl: "" });
        setFile(null);
        fetchAssignments();
      } else {
        toast.error(`❌ ${data.error || "Submission failed"}`, { id: tid, ...toastStyle.err });
      }
    } catch { toast.error("❌ Network error", { id: tid, ...toastStyle.err }); }
    finally { setSubmitting(false); }
  };

  const getDaysRemaining = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const filtered = assignments.filter(
    (a) => a.status === activeTab &&
      (a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.courseName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const counts = {
    Pending: assignments.filter((a) => a.status === "Pending").length,
    Submitted: assignments.filter((a) => a.status === "Submitted").length,
    Graded: assignments.filter((a) => a.status === "Graded").length,
  };

  const pur = "#832388";

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" containerStyle={{ top: 80, right: 24 }} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">My Assignments</h1>
        <p className="opacity-50 text-sm">Manage and track your course assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: "Pending", count: counts.Pending, color: "#FF0F7B", bg: theme === "dark" ? "#2a1520" : "#fce7f3", Icon: AlertCircle },
          { label: "Submitted", count: counts.Submitted, color: "#F89B29", bg: theme === "dark" ? "#2a1f15" : "#fef3c7", Icon: Clock },
          { label: "Graded", count: counts.Graded, color: "#00C48C", bg: theme === "dark" ? "#0f2520" : "#d1fae5", Icon: CheckCircle },
        ].map(({ label, count, color, bg, Icon }) => (
          <div key={label} className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body p-4 md:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide opacity-50 mb-1">{label}</p>
                  <h2 className="text-3xl font-bold">{count}</h2>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <input type="text" placeholder="Search assignments..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-9 h-10 text-sm bg-base-100" />
        </div>
        <div className="flex items-center gap-1.5 bg-base-200 p-1.5 rounded-full border border-base-300">
          {[
            { name: "Pending" as const, count: counts.Pending, color: "#FF0F7B" },
            { name: "Submitted" as const, count: counts.Submitted, color: "#F89B29" },
            { name: "Graded" as const, count: counts.Graded, color: "#00C48C" },
          ].map((tab) => (
            <button key={tab.name} onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === tab.name ? "text-white shadow" : "hover:bg-base-300"}`}
              style={{ backgroundColor: activeTab === tab.name ? tab.color : "transparent" }}>
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: pur }} />
          <span className="opacity-50">Loading assignments...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-bold mb-2">No {activeTab} Assignments</h3>
          <p className="opacity-50 text-sm">
            {assignments.length === 0 ? "Enroll in courses to see your assignments here."
              : `You don't have any ${activeTab.toLowerCase()} assignments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => {
            const days = a.dueDate ? getDaysRemaining(a.dueDate) : null;
            const isOverdue = days !== null && days < 0 && a.status === "Pending";
            const scorePercent = a.score !== null && a.score !== undefined && a.totalMarks
              ? Math.round((a.score / a.totalMarks) * 100) : null;

            return (
              <div key={a.lessonId} className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all">
                <div className="card-body p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: theme === "dark" ? "#2a1f35" : "#f3e8ff" }}>
                      <FileText className="w-6 h-6" style={{ color: pur }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-base font-bold">{a.title}</h3>
                          <p className="text-sm opacity-50 font-medium">{a.courseName}</p>
                        </div>
                        {a.status === "Graded" && scorePercent !== null && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
                            style={{ backgroundColor: theme === "dark" ? "#0f2520" : "#d1fae5" }}>
                            <Star size={13} style={{ color: "#00C48C" }} />
                            <span className="text-sm font-bold" style={{ color: "#00C48C" }}>
                              {a.score}/{a.totalMarks} ({scorePercent}%)
                            </span>
                          </div>
                        )}
                      </div>

                      {a.description && (
                        <p className="text-sm opacity-60 mb-3 line-clamp-2">{a.description}</p>
                      )}

                      <div className="flex flex-wrap gap-4 mb-3">
                        {a.dueDate && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 opacity-50" />
                            <span className="text-xs font-semibold opacity-60">
                              Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 opacity-50" />
                          <span className="text-xs font-semibold opacity-60">
                            {a.totalMarks > 0 ? `${a.totalMarks} marks` : "No marks set"}
                          </span>
                        </div>
                        {a.submittedDate && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 opacity-50" />
                            <span className="text-xs opacity-50">
                              Submitted {new Date(a.submittedDate).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {a.status === "Pending" && days !== null && (
                        <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{
                            backgroundColor: isOverdue || days <= 2
                              ? theme === "dark" ? "#2a1520" : "#fce7f3"
                              : theme === "dark" ? "#2a1f15" : "#fef3c7",
                            color: isOverdue || days <= 2 ? "#FF0F7B" : "#F89B29",
                          }}>
                          {isOverdue ? <><AlertCircle size={12} /> Overdue by {Math.abs(days)} days</>
                            : days === 0 ? <><Clock size={12} /> Due today</>
                              : <><Clock size={12} /> {days} days remaining</>}
                        </div>
                      )}

                      {a.status === "Graded" && a.feedback && (
                        <div className="mb-3 flex items-start gap-2 bg-base-200 rounded-lg px-3 py-2">
                          <MessageSquare size={13} className="opacity-40 mt-0.5 flex-shrink-0" />
                          <p className="text-xs opacity-60 line-clamp-2">{a.feedback}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {a.status === "Pending" && (
                          <button
                            onClick={() => {
                              setSubmitModal(a);
                              setSubmitData({ textAnswer: "", linkUrl: "" });
                              setFile(null);
                              setSubmitTab("text");
                              setShowInstructions(false);
                            }}
                            className="btn btn-sm gap-2 text-white border-0 cursor-pointer hover:opacity-90"
                            style={{ backgroundColor: pur }}>
                            <Upload className="w-3.5 h-3.5" /> Submit Assignment
                          </button>
                        )}
                        {a.status === "Submitted" && (
                          <button className="btn btn-sm btn-ghost gap-2 cursor-pointer border border-base-300">
                            <FileText className="w-3.5 h-3.5" /> View Submission
                          </button>
                        )}
                        {a.status === "Graded" && (
                          <>
                            <button onClick={() => setFeedbackModal(a)}
                              className="btn btn-sm gap-2 text-white border-0 cursor-pointer hover:opacity-90"
                              style={{ backgroundColor: "#00C48C" }}>
                              <CheckCircle className="w-3.5 h-3.5" /> View Feedback
                            </button>
                            <button className="btn btn-sm btn-ghost gap-2 cursor-pointer">
                              <Download className="w-3.5 h-3.5" /> Download Result
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Submit Modal — COMPACT, fits screen ── */}
      {submitModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg p-0 overflow-hidden"
            style={{ maxHeight: "92vh", display: "flex", flexDirection: "column" }}>

            {/* Header — fixed */}
            <div className="p-4 border-b border-base-300 flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${pur}12, #FF0F7B08)` }}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-bold text-sm">Submit Assignment</h3>
                  <p className="text-xs opacity-60 truncate">{submitModal.title}</p>
                  <div className="flex items-center flex-wrap gap-2 mt-1.5">
                    <span className="text-xs opacity-40 truncate max-w-[140px]">{submitModal.courseName}</span>
                    {submitModal.totalMarks > 0 && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: theme === "dark" ? "#2a1f35" : "#f3e8ff", color: pur }}>
                        {submitModal.totalMarks} marks
                      </span>
                    )}
                    {submitModal.dueDate && (
                      <span className="text-xs opacity-40">
                        Due {new Date(submitModal.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => !submitting && setSubmitModal(null)}
                  className="btn btn-ghost btn-xs btn-circle cursor-pointer flex-shrink-0">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-4 space-y-3">

              {/* Instructions — collapsible */}
              {submitModal.description && (
                <div className="bg-base-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="w-full flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-base-300 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-50">Instructions</span>
                    <span className="text-xs opacity-40">{showInstructions ? "▲ hide" : "▼ show"}</span>
                  </button>
                  {showInstructions && (
                    <div className="px-3 pb-3">
                      <p className="text-xs opacity-70 leading-relaxed">{submitModal.description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Submission type */}
              <div>
                <p className="text-xs font-bold mb-2 opacity-60 uppercase tracking-wider">Submission Type</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["text", "file", "link"] as const).map((t) => (
                    <button key={t} onClick={() => setSubmitTab(t)}
                      className="py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border"
                      style={{
                        backgroundColor: submitTab === t ? pur : "transparent",
                        color: submitTab === t ? "white" : undefined,
                        borderColor: submitTab === t ? pur : undefined,
                      }}>
                      {t === "text" ? "✍️ Text" : t === "file" ? "📎 File" : "🔗 Link"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text */}
              {submitTab === "text" && (
                <div>
                  <textarea rows={4} placeholder="Write your answer here..."
                    value={submitData.textAnswer}
                    onChange={(e) => setSubmitData((p) => ({ ...p, textAnswer: e.target.value }))}
                    className="textarea textarea-bordered bg-base-200 w-full resize-none focus:outline-none text-sm"
                    style={{ borderColor: submitData.textAnswer ? pur : "" }} />
                  <p className="text-xs opacity-30 mt-1 text-right">{submitData.textAnswer.length} characters</p>
                </div>
              )}

              {/* File */}
              {submitTab === "file" && (
                <div>
                  {file ? (
                    <div className="flex items-center gap-3 bg-base-200 rounded-xl p-3 border border-base-300">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: pur }}>📄</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{file.name}</p>
                        <p className="text-xs opacity-40">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button onClick={() => setFile(null)}
                        className="btn btn-ghost btn-xs btn-circle cursor-pointer hover:text-error">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="border-2 border-dashed border-base-300 rounded-xl p-6 text-center
                        hover:border-purple-400 hover:bg-base-200 transition-all">
                        <div className="text-2xl mb-1.5">📎</div>
                        <p className="text-sm font-semibold opacity-60">Click to upload file</p>
                        <p className="text-xs opacity-40 mt-1">PDF, DOC, ZIP up to 10MB</p>
                      </div>
                      <input type="file" className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    </label>
                  )}
                </div>
              )}

              {/* Link */}
              {submitTab === "link" && (
                <div>
                  <div className="flex items-center gap-2 input input-bordered bg-base-200 focus-within:border-purple-500">
                    <Link2 size={14} className="opacity-40 flex-shrink-0" />
                    <input type="url" placeholder="https://github.com/... or Google Drive link"
                      value={submitData.linkUrl}
                      onChange={(e) => setSubmitData((p) => ({ ...p, linkUrl: e.target.value }))}
                      className="grow bg-transparent focus:outline-none text-sm py-1" />
                  </div>
                  <p className="text-xs opacity-40 mt-1.5">GitHub, Google Drive, Figma, or any public link</p>
                </div>
              )}
            </div>

            {/* Footer — fixed at bottom */}
            <div className="p-4 border-t border-base-300 flex-shrink-0 flex gap-3">
              <button onClick={() => !submitting && setSubmitModal(null)}
                className="btn flex-1 btn-ghost border border-base-300 cursor-pointer btn-sm">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="btn flex-1 text-white border-0 cursor-pointer disabled:opacity-40 btn-sm"
                style={{ background: `linear-gradient(135deg, ${pur}, #FF0F7B)` }}>
                {submitting
                  ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...</>
                  : <><Upload size={13} /> Submit Assignment</>}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !submitting && setSubmitModal(null)} />
        </div>
      )}

      {/* ── Feedback Modal ── */}
      {feedbackModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md p-0 overflow-hidden">
            <div className="p-5 border-b border-base-300"
              style={{ background: `linear-gradient(135deg, #00C48C12, #0EA5E908)` }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">Assignment Feedback</h3>
                  <p className="text-sm opacity-60 mt-0.5">{feedbackModal.title}</p>
                </div>
                <button onClick={() => setFeedbackModal(null)}
                  className="btn btn-ghost btn-sm btn-circle cursor-pointer"><X size={16} /></button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {feedbackModal.score !== null && feedbackModal.score !== undefined && (
                <div className="flex items-center gap-4 bg-base-200 rounded-xl p-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #00C48C, #0EA5E9)" }}>
                    {feedbackModal.totalMarks > 0
                      ? `${Math.round((feedbackModal.score / feedbackModal.totalMarks) * 100)}%`
                      : "✓"}
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: "#00C48C" }}>
                      {feedbackModal.score}
                      {feedbackModal.totalMarks > 0 && (
                        <span className="text-base opacity-50">/{feedbackModal.totalMarks}</span>
                      )}
                    </p>
                    <p className="text-sm opacity-60">Your Score</p>
                  </div>
                </div>
              )}
              {feedbackModal.feedback ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-40 mb-2">Instructor Feedback</p>
                  <div className="bg-base-200 rounded-xl p-4 text-sm opacity-70">{feedbackModal.feedback}</div>
                </div>
              ) : (
                <p className="text-sm opacity-40 text-center py-4">No feedback provided yet.</p>
              )}
              <button onClick={() => setFeedbackModal(null)} className="btn w-full cursor-pointer"
                style={{ backgroundColor: "#00C48C", color: "white", border: "none" }}>
                Close
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setFeedbackModal(null)} />
        </div>
      )}
    </div>
  );
}