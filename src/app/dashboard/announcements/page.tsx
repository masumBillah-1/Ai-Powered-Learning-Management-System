"use client";

import React, { useState, useEffect, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus, Search, Edit2, Trash2, Calendar, Eye, Send, AlertCircle,
  X, FileText, BookOpen, AlignLeft, Sparkles, CheckCircle,
  AlertTriangle, Zap, Info, RefreshCw, Lock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "student" | "instructor" | "admin";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  courseId?: string;
  priority: string;
  status?: "Published" | "Draft";
  isRead: boolean;
  createdAt: string;
  instructorId?: string;
}

interface ICourse {
  _id: string;
  title: string;
  status: "draft" | "published";
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", Icon: Info, color: "#6B7280", bg: "#F3F4F6", darkBg: "#1f2937" },
  { value: "medium", label: "Medium", Icon: AlertTriangle, color: "#F89B29", bg: "#FEF3C7", darkBg: "#2a1f15" },
  { value: "high", label: "High", Icon: Zap, color: "#E3436B", bg: "#FEE2E2", darkBg: "#2a1515" },
  { value: "urgent", label: "Urgent", Icon: Sparkles, color: "#832388", bg: "#F3E8FF", darkBg: "#2a1f35" },
];

const tErr = { position: "top-right" as const, duration: 3500, style: { borderRadius: "10px", background: "#dc2626", color: "#fff", fontWeight: "600" } };
const tOk = { position: "top-right" as const, duration: 3000, style: { borderRadius: "10px", background: "#1e1e2e", color: "#fff", fontWeight: "600" } };
const tLoading = { position: "top-right" as const, style: { borderRadius: "10px", background: "#1e1e2e", color: "#fff" } };

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatus = (a: Announcement): "Published" | "Draft" => (a.status || "Draft") as "Published" | "Draft";
const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

function getPriorityStyle(priority: string, isDark: boolean) {
  const opt = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];
  return { color: opt.color, bg: isDark ? opt.darkBg : opt.bg, label: opt.label, Icon: opt.Icon };
}

// ─── StatusBadge (toggle) ─────────────────────────────────────────────────────
function StatusBadge({ announcementId, currentStatus, theme, onToggled, readonly = false }: {
  announcementId: string; currentStatus: "Published" | "Draft";
  theme: string; onToggled: (id: string, s: "Published" | "Draft") => void;
  readonly?: boolean;
}) {
  const [toggling, setToggling] = useState(false);
  const isPublished = currentStatus === "Published";

  const handleToggle = async (e: React.MouseEvent) => {
    if (readonly) return;
    e.stopPropagation();
    const newStatus: "Published" | "Draft" = isPublished ? "Draft" : "Published";
    setToggling(true);
    const tid = toast.loading(newStatus === "Published" ? "🚀 Publishing..." : "📝 Draft এ নিচ্ছে...", tLoading);
    try {
      const res = await fetch(`/api/notifications?id=${announcementId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Toggle failed");
      onToggled(announcementId, newStatus);
      toast.success(newStatus === "Published" ? "✅ Published হয়েছে!" : "📝 Draft এ সরানো হয়েছে", { id: tid, ...tOk });
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally { setToggling(false); }
  };

  return (
    <button onClick={handleToggle} disabled={toggling || readonly}
      title={readonly ? undefined : `Click to ${isPublished ? "move to Draft" : "Publish"}`}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-0"
      style={{
        cursor: readonly ? "default" : "pointer",
        backgroundColor: isPublished ? (theme === "dark" ? "#0f2520" : "#d1fae5") : (theme === "dark" ? "#2a1f15" : "#fef3c7"),
        color: isPublished ? "#00C48C" : "#F89B29",
        opacity: toggling ? 0.5 : 1,
      }}>
      {toggling
        ? <span className="loading loading-spinner loading-xs" />
        : <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: isPublished ? "#00C48C" : "#F89B29" }} />
      }
      {toggling ? "..." : isPublished ? "Published" : "Draft"}
    </button>
  );
}

// ─── Form Fields ──────────────────────────────────────────────────────────────
function AnnouncementFormFields({ form, theme, courses, coursesLoading, onChange }: {
  form: { title: string; courseId: string; description: string; priority: string };
  theme: string; courses: ICourse[]; coursesLoading: boolean;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-1.5"><FileText size={11} /> Title</span>
        </label>
        <input type="text" placeholder="e.g. Assignment Due Date Reminder..."
          value={form.title} onChange={e => onChange("title", e.target.value)} maxLength={200}
          className="input input-bordered w-full"
          style={{ borderColor: form.title ? "#832388" : undefined, boxShadow: form.title ? "0 0 0 3px rgba(131,35,136,0.1)" : undefined }} />
      </div>

      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-1.5"><BookOpen size={11} /> Course</span>
          {coursesLoading && <span className="label-text-alt flex items-center gap-1 text-xs opacity-40"><span className="loading loading-spinner loading-xs" /> Loading...</span>}
        </label>
        <select value={form.courseId} onChange={e => onChange("courseId", e.target.value)}
          className="select select-bordered w-full" disabled={coursesLoading}
          style={{ borderColor: form.courseId ? "#832388" : undefined, boxShadow: form.courseId ? "0 0 0 3px rgba(131,35,136,0.1)" : undefined }}>
          <option value="">{coursesLoading ? "Courses load হচ্ছে..." : "Select a course..."}</option>
          {courses.map(c => <option key={c._id} value={c._id}>{c.title}{c.status === "draft" ? " (Draft)" : ""}</option>)}
          {!coursesLoading && courses.length === 0 && <option disabled>কোনো course পাওয়া যায়নি</option>}
        </select>
      </div>

      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-1.5"><AlignLeft size={11} /> Description</span>
          <span className="label-text-alt opacity-30 text-xs">{form.description.length}/1000</span>
        </label>
        <textarea placeholder="Announcement এর বিস্তারিত লিখুন..."
          value={form.description} onChange={e => onChange("description", e.target.value)}
          maxLength={1000} rows={4} className="textarea textarea-bordered w-full resize-none"
          style={{ borderColor: form.description ? "#832388" : undefined, boxShadow: form.description ? "0 0 0 3px rgba(131,35,136,0.1)" : undefined }} />
      </div>

      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-1.5"><Sparkles size={11} /> Priority</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PRIORITY_OPTIONS.map(opt => {
            const isSelected = form.priority === opt.value;
            return (
              <button key={opt.value} type="button" onClick={() => onChange("priority", opt.value)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all cursor-pointer"
                style={{
                  borderColor: isSelected ? opt.color : "rgba(0,0,0,0.1)",
                  backgroundColor: isSelected ? (theme === "dark" ? opt.darkBg : opt.bg) : "transparent",
                  color: isSelected ? opt.color : undefined,
                  transform: isSelected ? "scale(1.04)" : "scale(1)",
                }}>
                <opt.Icon size={15} />
                <span className="text-xs font-bold">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────
function CreateModal({ isOpen, onClose, theme, onSuccess, courses, coursesLoading }: {
  isOpen: boolean; onClose: () => void; theme: string;
  onSuccess?: (data: Announcement) => void; courses: ICourse[]; coursesLoading: boolean;
}) {
  const [form, setForm] = useState({ title: "", courseId: "", description: "", priority: "medium" });
  const [loading, setLoading] = useState(false);
  const handleChange = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
  const handleClose = () => { if (loading) return; setForm({ title: "", courseId: "", description: "", priority: "medium" }); onClose(); };

  const handleSubmit = async (publishNow: boolean) => {
    if (!form.title.trim()) { toast.error("Title লিখুন।", tErr); return; }
    if (!form.courseId) { toast.error("Course সিলেক্ট করুন।", tErr); return; }
    if (!form.description.trim()) { toast.error("Description লিখুন।", tErr); return; }
    setLoading(true);
    const tid = toast.loading(publishNow ? "🚀 Publishing..." : "💾 Draft সেভ হচ্ছে...", tLoading);
    try {
      const res = await fetch("/api/notifications", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ type: "announcement", title: form.title.trim(), message: form.description.trim(), priority: form.priority, status: publishNow ? "Published" : "Draft", courseId: form.courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      toast.success(publishNow ? "✅ Announcement Published!" : "📝 Draft সেভ হয়েছে", { id: tid, ...tOk });
      onSuccess?.(data.notification);
      handleClose();
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally { setLoading(false); }
  };

  const sel = PRIORITY_OPTIONS.find(p => p.value === form.priority)!;
  if (!isOpen) return null;

  return (
    <div className="modal modal-open" style={{ zIndex: 9999 }}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="modal-box relative w-full max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl" style={{ border: "1px solid rgba(131,35,136,0.25)", zIndex: 10000 }}>
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#832388,#E3436B,#F89B29)" }} />
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg" style={{ background: "linear-gradient(135deg,#832388,#E3436B)" }}>📢</div>
            <div><h3 className="text-lg font-bold leading-tight">New Announcement</h3><p className="text-xs opacity-40 mt-0.5">notifications collection এ save হবে</p></div>
          </div>
          <button onClick={handleClose} disabled={loading} className="btn btn-ghost btn-sm btn-circle opacity-50 hover:opacity-100 cursor-pointer"><X size={18} /></button>
        </div>
        <AnnouncementFormFields form={form} theme={theme} courses={courses} coursesLoading={coursesLoading} onChange={handleChange} />
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-base-300" style={{ backgroundColor: theme === "dark" ? "rgba(131,35,136,0.05)" : "#fdf8ff" }}>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: theme === "dark" ? sel.darkBg : sel.bg, color: sel.color }}><sel.Icon size={12} /> {sel.label}</div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="btn btn-ghost btn-sm cursor-pointer" onClick={handleClose} disabled={loading}>বাতিল</button>
            <button className="btn btn-sm gap-1.5 cursor-pointer border-0" style={{ backgroundColor: "rgba(131,35,136,0.12)", color: "#832388" }} onClick={() => handleSubmit(false)} disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-xs" /> : <FileText size={13} />} Draft
            </button>
            <button className="btn btn-sm gap-1.5 text-white border-0 cursor-pointer" style={{ background: loading ? "#ccc" : "linear-gradient(135deg,#832388,#E3436B,#F89B29)", boxShadow: loading ? "none" : "0 4px 12px rgba(131,35,136,0.35)" }} onClick={() => handleSubmit(true)} disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-xs" /> : <Send size={13} />} {loading ? "হচ্ছে..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ item, theme, onClose, onSuccess, courses, coursesLoading }: {
  item: Announcement | null; theme: string; onClose: () => void;
  onSuccess?: (u: Announcement) => void; courses: ICourse[]; coursesLoading: boolean;
}) {
  const [form, setForm] = useState({ title: "", courseId: "", description: "", priority: "medium" });
  const [loading, setLoading] = useState(false);
  const handleChange = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
  const handleClose = () => { if (loading) return; onClose(); };

  useEffect(() => {
    if (!item) return;
    setForm({ title: item.title || "", courseId: item.courseId || "", description: item.message || "", priority: item.priority || "medium" });
  }, [item]);

  if (!item) return null;

  const handleSubmit = async (publishNow: boolean) => {
    if (!form.title.trim()) { toast.error("Title লিখুন।", tErr); return; }
    if (!form.courseId) { toast.error("Course সিলেক্ট করুন।", tErr); return; }
    if (!form.description.trim()) { toast.error("Description লিখুন।", tErr); return; }
    setLoading(true);
    const tid = toast.loading(publishNow ? "🚀 Publishing..." : "💾 Draft সেভ হচ্ছে...", tLoading);
    try {
      const res = await fetch(`/api/notifications?id=${item._id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ title: form.title.trim(), message: form.description.trim(), priority: form.priority, status: publishNow ? "Published" : "Draft", courseId: form.courseId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      toast.success(publishNow ? "✅ Published হয়েছে!" : "📝 Draft হিসেবে সেভ হয়েছে", { id: tid, ...tOk });
      onSuccess?.(data.notification);
      handleClose();
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally { setLoading(false); }
  };

  const sel = PRIORITY_OPTIONS.find(p => p.value === form.priority)!;
  const currentStatus = getStatus(item);

  return (
    <div className="modal modal-open" style={{ zIndex: 9999 }}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="modal-box relative w-full max-w-lg p-0 overflow-hidden rounded-2xl shadow-2xl" style={{ border: "1px solid rgba(227,67,107,0.25)", zIndex: 10000 }}>
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#E3436B,#F89B29,#832388)" }} />
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg" style={{ background: "linear-gradient(135deg,#E3436B,#F89B29)" }}>✏️</div>
            <div>
              <h3 className="text-lg font-bold leading-tight">Edit Announcement</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs opacity-40">পরিবর্তন করুন</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: currentStatus === "Published" ? (theme === "dark" ? "#0f2520" : "#d1fae5") : (theme === "dark" ? "#2a1f15" : "#fef3c7"), color: currentStatus === "Published" ? "#00C48C" : "#F89B29" }}>{currentStatus}</span>
              </div>
            </div>
          </div>
          <button onClick={handleClose} disabled={loading} className="btn btn-ghost btn-sm btn-circle opacity-50 hover:opacity-100 cursor-pointer"><X size={18} /></button>
        </div>
        <AnnouncementFormFields form={form} theme={theme} courses={courses} coursesLoading={coursesLoading} onChange={handleChange} />
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-base-300" style={{ backgroundColor: theme === "dark" ? "rgba(227,67,107,0.05)" : "#fff9f9" }}>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: theme === "dark" ? sel.darkBg : sel.bg, color: sel.color }}><sel.Icon size={12} /> {sel.label}</div>
          <div className="flex items-center gap-2 ml-auto">
            <button className="btn btn-ghost btn-sm cursor-pointer" onClick={handleClose} disabled={loading}>বাতিল</button>
            <button className="btn btn-sm gap-1.5 cursor-pointer border-0" style={{ backgroundColor: "rgba(227,67,107,0.12)", color: "#E3436B" }} onClick={() => handleSubmit(false)} disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-xs" /> : <FileText size={13} />} Draft সেভ
            </button>
            <button className="btn btn-sm gap-1.5 text-white border-0 cursor-pointer" style={{ background: loading ? "#ccc" : "linear-gradient(135deg,#E3436B,#F89B29,#832388)", boxShadow: loading ? "none" : "0 4px 12px rgba(227,67,107,0.35)" }} onClick={() => handleSubmit(true)} disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-xs" /> : <Send size={13} />} {loading ? "হচ্ছে..." : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnnouncementsPage() {
  const [theme, setTheme] = useState("light");
  const [role, setRole] = useState<Role>("student");
  const [userId, setUserId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterCourse, setFilterCourse] = useState("All Courses"); // admin only
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<Announcement | null>(null);
  const [deleteItem, setDeleteItem] = useState<Announcement | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // ── theme + role sync from localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    const iv = setInterval(() => {
      const t = localStorage.getItem("theme") || "light";
      if (t !== theme) { setTheme(t); document.documentElement.setAttribute("data-theme", t); }
    }, 100);

    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const r = (["student", "instructor", "admin"].includes(u?.role) ? u.role : "student") as Role;
      setRole(r);
      setUserId(u?._id || u?.id || "");
    } catch { setRole("student"); }

    return () => clearInterval(iv);
  }, [theme]);

  // ── fetch courses (admin → all, instructor → own) ──
  const fetchCourses = useCallback(async (r: Role, uid: string) => {
    if (r === "student") return; // student er courses আলাদা endpoint থেকে আসে
    setCoursesLoading(true);
    try {
      const url = r === "admin"
        ? "/api/courses?limit=200"
        : uid
          ? `/api/courses?instructorId=${uid}&limit=100`
          : "/api/courses?mine=true&limit=100";
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourses((data.courses || []).map((c: any) => ({ _id: c._id, title: c.title, status: c.status })));
    } catch (err: any) {
      console.error("Courses fetch:", err.message);
      setCourses([]);
    } finally { setCoursesLoading(false); }
  }, []);

  // ── fetch announcements by role ──
  const fetchAnnouncements = useCallback(async (r: Role, uid: string) => {
    setFetchLoading(true); setFetchError("");
    try {
      let url = "";
      if (r === "admin") {
        // Admin → সব announcements
        url = "/api/notifications?type=announcement&limit=200&all=true";
      } else if (r === "instructor") {
        // Instructor → শুধু নিজের (instructorId দিয়ে filter)
        url = uid
          ? `/api/notifications?type=announcement&limit=100&all=true&instructorId=${uid}`
          : "/api/notifications?type=announcement&limit=100&all=true&mine=true";
      } else {
        // Student → enrolled courses এর Published announcements only
        url = "/api/notifications?type=announcement&limit=100&enrolled=true&status=Published";
      }
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setAnnouncements(data.notifications || []);
    } catch (err: any) {
      setFetchError(err.message || "Data load করতে সমস্যা হয়েছে।");
    } finally { setFetchLoading(false); }
  }, []);

  useEffect(() => {
    if (!role) return;
    fetchCourses(role, userId);
    fetchAnnouncements(role, userId);
  }, [role, userId, fetchCourses, fetchAnnouncements]);

  // ── handlers ──
  const handleCreated = (n: Announcement) => { if (n?._id) setAnnouncements(p => [n, ...p]); else fetchAnnouncements(role, userId); };
  const handleEdited = (u: Announcement) => setAnnouncements(p => p.map(a => a._id === u._id ? u : a));
  const handleStatusToggled = (id: string, s: "Published" | "Draft") => setAnnouncements(p => p.map(a => a._id === id ? { ...a, status: s } : a));

  const openDeleteModal = (item: Announcement) => {
    setDeleteItem(item);
    (document.getElementById("delete_announcement_modal") as HTMLDialogElement)?.showModal();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    setDeleting(true);
    const tid = toast.loading("🗑️ Deleting...", tLoading);
    try {
      const res = await fetch(`/api/notifications?id=${deleteItem._id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnnouncements(p => p.filter(a => a._id !== deleteItem._id));
      setDeleteItem(null);
      (document.getElementById("delete_announcement_modal") as HTMLDialogElement)?.close();
      toast.success("🗑️ Delete হয়েছে!", { id: tid, ...tOk });
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally { setDeleting(false); }
  };

  const getCourseTitle = (courseId?: string) => courses.find(c => c._id === courseId)?.title || "";

  // ── canEdit: admin সব পারে, instructor শুধু নিজেরটা ──
  const canEdit = (a: Announcement) => role === "admin" || (role === "instructor" && (!a.instructorId || a.instructorId === userId));
  const canDelete = (a: Announcement) => canEdit(a);
  const canCreate = role === "admin" || role === "instructor";

  // ── filter ──
  const filtered = announcements.filter(a => {
    const status = getStatus(a);
    const courseTitle = getCourseTitle(a.courseId);
    const matchSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "All Status" || status === filterStatus;
    const matchCourse = filterCourse === "All Courses" || a.courseId === filterCourse;
    return matchSearch && matchStatus && (role !== "admin" || matchCourse);
  });

  const counts = {
    total: announcements.length,
    published: announcements.filter(a => getStatus(a) === "Published").length,
    draft: announcements.filter(a => getStatus(a) === "Draft").length,
  };

  const isAdmin = role === "admin";
  const isInstructor = role === "instructor";
  const isStudent = role === "student";

  // ── Role badge ──
  const roleBadge = {
    admin: { label: "Admin View — সব announcements", color: "#FF0F7B", bg: "#fff0f7" },
    instructor: { label: "Instructor View — শুধু আপনার announcements", color: "#F89B29", bg: "#fffbeb" },
    student: { label: "Student View — Read Only", color: "#00C48C", bg: "#f0fdf4" },
  }[role];

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" containerStyle={{ top: 72, right: 24 }} toastOptions={{ style: { maxWidth: 380 } }} />

      {/* Role indicator */}
      <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl text-xs font-bold w-fit"
        style={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : roleBadge.bg, color: roleBadge.color, border: `1px solid ${roleBadge.color}33` }}>
        {isStudent ? <Lock size={12} /> : <CheckCircle size={12} />}
        {roleBadge.label}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Announcements", value: counts.total, color: "#832388", bLight: "#f3e8ff", bDark: "#2a1f35", Icon: AlertCircle },
          { label: "Published", value: counts.published, color: "#00C48C", bLight: "#d1fae5", bDark: "#0f2520", Icon: Send },
          { label: isStudent ? "Unread" : "Drafts", value: isStudent ? announcements.filter(a => !a.isRead).length : counts.draft, color: "#F89B29", bLight: "#fef3c7", bDark: "#2a1f15", Icon: Edit2 },
        ].map(card => (
          <div key={card.label} className="card bg-base-100 shadow-lg border" style={{ borderColor: theme === "dark" ? card.bDark : card.bLight }}>
            <div className="card-body p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">{card.label}</p>
                  <h2 className="text-3xl font-bold" style={{ color: card.color }}>
                    {fetchLoading ? <span className="loading loading-spinner loading-sm" /> : card.value}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme === "dark" ? card.bDark : card.bLight }}>
                  <card.Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-6 md:p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Announcements</h1>
              <button onClick={() => fetchAnnouncements(role, userId)}
                className="btn btn-ghost btn-sm btn-circle cursor-pointer" title="Refresh">
                <RefreshCw size={16} className={fetchLoading ? "animate-spin" : ""} />
              </button>
            </div>
            {/* Create button — শুধু admin & instructor দেখবে */}
            {canCreate && (
              <button className="btn gap-2 text-white border-0 cursor-pointer hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#832388,#E3436B,#F89B29)" }}
                onClick={() => setShowCreate(true)}>
                <Plus size={20} /> Add Announcement
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input type="text" placeholder="Search announcements..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-11 bg-base-100" />
            </div>

            {/* Status filter — student দেখে না (সবসময় Published) */}
            {!isStudent && (
              <select className="select select-bordered bg-base-100 cursor-pointer min-w-[160px]"
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option>All Status</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            )}

            {/* Course filter — শুধু admin দেখবে */}
            {isAdmin && (
              <select className="select select-bordered bg-base-100 cursor-pointer min-w-[180px]"
                value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                <option value="All Courses">All Courses</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select>
            )}
          </div>

          {/* Table content */}
          {fetchLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <span className="loading loading-spinner loading-lg" style={{ color: "#832388" }} />
              <p className="opacity-50 text-sm">MongoDB থেকে data আনা হচ্ছে...</p>
            </div>
          ) : fetchError ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-error font-semibold mb-4">{fetchError}</p>
              <button className="btn btn-sm cursor-pointer" style={{ backgroundColor: "#832388", color: "white", border: "none" }} onClick={() => fetchAnnouncements(role, userId)}>আবার চেষ্টা করুন</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📢</div>
              <h3 className="text-xl font-bold mb-2">{announcements.length === 0 ? "কোনো Announcement নেই" : "কিছু পাওয়া যায়নি"}</h3>
              <p className="opacity-60 mb-6">{announcements.length === 0 && canCreate ? "প্রথম announcement তৈরি করুন" : "Search বা filter পরিবর্তন করুন"}</p>
              {announcements.length === 0 && canCreate
                ? <button className="btn gap-2 cursor-pointer" style={{ backgroundColor: "#832388", color: "white", border: "none" }} onClick={() => setShowCreate(true)}><Plus size={16} /> প্রথম Announcement তৈরি করুন</button>
                : <button className="btn gap-2 cursor-pointer" style={{ backgroundColor: "#832388", color: "white", border: "none" }} onClick={() => { setSearchQuery(""); setFilterStatus("All Status"); setFilterCourse("All Courses"); }}>Clear Filters</button>
              }
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Date</th>
                    <th className="text-xs font-bold uppercase tracking-wider opacity-60">Announcement</th>
                    {/* Course column — admin & instructor দেখবে */}
                    {!isStudent && <th className="text-xs font-bold uppercase tracking-wider opacity-60">Course</th>}
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">Priority</th>
                    <th className="text-center text-xs font-bold uppercase tracking-wider opacity-60">
                      Status {!isStudent && <span className="ml-1 opacity-40 normal-case font-normal text-[10px]">(click to toggle)</span>}
                    </th>
                    {/* Actions — student দেখে না */}
                    {!isStudent && <th className="text-right text-xs font-bold uppercase tracking-wider opacity-60">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => {
                    const status = getStatus(item);
                    const pStyle = getPriorityStyle(item.priority, theme === "dark");
                    const courseTitle = getCourseTitle(item.courseId);
                    const editable = canEdit(item);
                    const deletable = canDelete(item);
                    return (
                      <tr key={item._id} className="hover">
                        <td>
                          <div className="flex items-center gap-2 text-sm opacity-70">
                            <Calendar size={14} />
                            <span className="font-semibold whitespace-nowrap">{formatDate(item.createdAt)}</span>
                          </div>
                        </td>
                        <td>
                          <h4 className="text-sm font-bold mb-1">{item.title}</h4>
                          <p className="text-xs opacity-40 mt-0.5 line-clamp-1">{item.message}</p>
                          {/* mobile এ course দেখাও */}
                          {isStudent && courseTitle && <p className="text-xs opacity-60 italic mt-0.5">📚 {courseTitle}</p>}
                        </td>

                        {/* Course column */}
                        {!isStudent && (
                          <td>
                            {courseTitle
                              ? <span className="text-xs font-semibold opacity-70">📚 {courseTitle}</span>
                              : <span className="text-xs opacity-30">—</span>}
                          </td>
                        )}

                        <td className="text-center">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: pStyle.bg, color: pStyle.color }}>
                            <pStyle.Icon size={11} /> {pStyle.label}
                          </div>
                        </td>

                        <td className="text-center">
                          <StatusBadge
                            announcementId={item._id}
                            currentStatus={status}
                            theme={theme}
                            onToggled={handleStatusToggled}
                            readonly={isStudent || !editable}
                          />
                        </td>

                        {/* Actions — student দেখে না */}
                        {!isStudent && (
                          <td>
                            <div className="flex justify-end gap-2">
                              <button className="btn btn-ghost btn-sm cursor-pointer" title="View"><Eye size={16} /></button>
                              {editable && (
                                <button className="btn btn-ghost btn-sm cursor-pointer" title="Edit" onClick={() => setEditItem(item)}><Edit2 size={16} /></button>
                              )}
                              {deletable && (
                                <button className="btn btn-ghost btn-sm text-error cursor-pointer" title="Delete" onClick={() => openDeleteModal(item)}><Trash2 size={16} /></button>
                              )}
                              {/* নিজের না হলে lock icon */}
                              {!editable && isInstructor && (
                                <span className="btn btn-ghost btn-sm btn-disabled opacity-30" title="অন্য instructor এর announcement"><Lock size={14} /></span>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!fetchLoading && filtered.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-base-300">
              <p className="text-sm opacity-60">Showing {filtered.length} of {announcements.length} announcements</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Modal ── */}
      <dialog id="delete_announcement_modal" className="modal">
        <div className="modal-box p-0 overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(220,38,38,0.2)" }}>
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#dc2626,#E3436B)" }} />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: "#fee2e2" }}>🗑️</div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Delete Announcement?</h3>
                <p className="text-sm opacity-50 mt-0.5">এই কাজটি undo করা যাবে না।</p>
              </div>
            </div>
            {deleteItem && (
              <div className="rounded-xl p-4 mb-4 border" style={{ backgroundColor: theme === "dark" ? "#2a1515" : "#fef2f2", borderColor: "#fca5a5" }}>
                <p className="text-sm font-bold text-error line-clamp-2">{deleteItem.title}</p>
                {getCourseTitle(deleteItem.courseId) && <p className="text-xs opacity-60 mt-1">📚 {getCourseTitle(deleteItem.courseId)}</p>}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <form method="dialog">
                <button className="btn btn-ghost cursor-pointer" onClick={() => setDeleteItem(null)}>বাতিল</button>
              </form>
              <button className="btn text-white border-0 cursor-pointer gap-2" style={{ background: "linear-gradient(135deg,#dc2626,#E3436B)" }} onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? <><span className="loading loading-spinner loading-sm" /> Deleting...</> : <><Trash2 size={16} /> Delete করুন</>}
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button onClick={() => setDeleteItem(null)}>close</button></form>
      </dialog>

      {/* ── Create Modal ── */}
      <CreateModal isOpen={showCreate} onClose={() => setShowCreate(false)} theme={theme} onSuccess={handleCreated} courses={courses} coursesLoading={coursesLoading} />

      {/* ── Edit Modal ── */}
      <EditModal item={editItem} theme={theme} onClose={() => setEditItem(null)} onSuccess={handleEdited} courses={courses} coursesLoading={coursesLoading} />
    </div>
  );
} 