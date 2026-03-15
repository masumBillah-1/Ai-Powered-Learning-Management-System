"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Star, Users, CheckCircle, XCircle, Trash2, RefreshCw,
  LayoutGrid, List, BookOpen, TrendingUp, AlertTriangle
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Status = "published" | "pending" | "rejected" | "draft";
type ActionType = "approve" | "reject" | "delete";

interface ICourse {
  _id: string;
  title: string;
  instructorId: { name: string; email: string; photoURL?: string } | string;
  enrolledCount: number;
  pricing: { type: string; price: number; discountPrice?: number };
  status: Status;
  rating?: number;
  category: string;
  coverImage?: { type?: string; url?: string } | string | null;
  thumbnail?: string;
}

const tOk  = { position: "top-right" as const, style: { borderRadius: "10px", background: "#1e1e2e", color: "#fff", fontWeight: "600" } };
const tErr = { position: "top-right" as const, style: { borderRadius: "10px", background: "#dc2626", color: "#fff", fontWeight: "600" } };

const STATUS_CFG: Record<Status, { bg: string; text: string; label: string }> = {
  published: { bg: "rgba(0,196,140,0.12)",  text: "#00C48C", label: "Published" },
  pending:   { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", label: "Pending"   },
  rejected:  { bg: "rgba(239,68,68,0.12)",  text: "#EF4444", label: "Rejected"  },
  draft:     { bg: "rgba(107,114,128,0.12)",text: "#6B7280", label: "Draft"     },
};

const FILTERS = ["all", "published", "pending", "rejected"] as const;

const DIALOG_CFG: Record<ActionType, {
  title: string;
  desc: (title: string) => string;
  confirmLabel: string;
  confirmColor: string;
  icon: React.ReactNode;
  iconBg: string;
}> = {
  approve: {
    title: "Approve Course?",
    desc: (t) => `"${t}" approve করলে এটি সাথে সাথে live হয়ে যাবে এবং students এনরোল করতে পারবে।`,
    confirmLabel: "✅ Yes, Approve",
    confirmColor: "#00C48C",
    icon: <CheckCircle size={28} color="#00C48C" />,
    iconBg: "rgba(0,196,140,0.12)",
  },
  reject: {
    title: "Reject Course?",
    desc: (t) => `"${t}" reject করলে instructor কে জানানো হবে এবং course টি live হবে না।`,
    confirmLabel: "⚠️ Yes, Reject",
    confirmColor: "#F59E0B",
    icon: <XCircle size={28} color="#F59E0B" />,
    iconBg: "rgba(245,158,11,0.12)",
  },
  delete: {
    title: "Delete Course?",
    desc: (t) => `"${t}" permanently delete হয়ে যাবে। এই action টি undo করা যাবে না।`,
    confirmLabel: "🗑️ Yes, Delete",
    confirmColor: "#FF0F7B",
    icon: <AlertTriangle size={28} color="#FF0F7B" />,
    iconBg: "rgba(255,15,123,0.12)",
  },
};

const getInstructorName  = (inst: ICourse["instructorId"]) =>
  typeof inst === "object" && inst !== null ? (inst as any).name || "Unknown" : "Unknown";
const getInstructorPhoto = (inst: ICourse["instructorId"]) =>
  typeof inst === "object" && inst !== null ? (inst as any).photoURL || "" : "";

const getCoverUrl = (course: ICourse): string => {
  if (course.coverImage && typeof course.coverImage === "object") {
    const url = (course.coverImage as any).url;
    if (url && typeof url === "string" && url.trim()) return url.trim();
  }
  if (typeof course.coverImage === "string" && course.coverImage.trim()) return course.coverImage.trim();
  if (course.thumbnail && course.thumbnail.trim()) return course.thumbnail.trim();
  return "";
};

const InstructorAvatar = ({ inst, size = "sm" }: { inst: ICourse["instructorId"]; size?: "sm" | "md" }) => {
  const [imgError, setImgError] = useState(false);
  const name  = getInstructorName(inst);
  const photo = getInstructorPhoto(inst);
  const dim   = size === "sm" ? "w-7 h-7 text-xs" : "w-8 h-8 text-sm";
  return (
    <div className={`${dim} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-black`}
      style={{ background: "linear-gradient(135deg,#C81D77,#832388)" }}>
      {photo && !imgError
        ? <img src={photo} alt={name} referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={() => setImgError(true)} />
        : <span>{name.charAt(0).toUpperCase()}</span>}
    </div>
  );
};

const CourseImage = ({ url, title }: { url: string; title: string }) => {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [url]);
  if (url && !imgError) {
    return (
      <img src={url} alt={title} className="w-full h-full object-cover"
        referrerPolicy="no-referrer" crossOrigin="anonymous" onError={() => setImgError(true)} />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center"
      style={{ background: "linear-gradient(135deg,rgba(131,35,136,0.15),rgba(200,29,119,0.15))" }}>
      <BookOpen className="w-10 h-10 opacity-20" style={{ color: "#832388" }} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminCoursesPage() {
  const [filter, setFilter]               = useState("all");
  const [viewMode, setViewMode]           = useState<"table" | "card">("table");
  const [courses, setCourses]             = useState<ICourse[]>([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [dialog, setDialog] = useState<{
    open: boolean; courseId: string; courseTitle: string; action: ActionType;
  }>({ open: false, courseId: "", courseTitle: "", action: "delete" });

  const openDialog  = (courseId: string, courseTitle: string, action: ActionType) =>
    setDialog({ open: true, courseId, courseTitle, action });
  const closeDialog = () => setDialog(prev => ({ ...prev, open: false }));

  const fetchCourses = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res  = await fetch("/api/courses");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setCourses(data.courses || []);
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, tErr);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // ── Approve → published (live on courses page) ──────────────────────────────
  const handleApprove = async (id: string) => {
    closeDialog();
    setActionLoading(id + "_approve");
    const tid = toast.loading("Approving...", { position: "top-right" });
    try {
      const res  = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published", _adminAction: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourses(prev => prev.map(c => c._id === id ? { ...c, status: "published" } : c));
      toast.success("✅ Course approved & live on courses page!", { id: tid, ...tOk });
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally { setActionLoading(null); }
  };

  // ── Reject ──────────────────────────────────────────────────────────────────
  const handleReject = async (id: string) => {
    closeDialog();
    setActionLoading(id + "_reject");
    const tid = toast.loading("Rejecting...", { position: "top-right" });
    try {
      const res  = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", _adminAction: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourses(prev => prev.map(c => c._id === id ? { ...c, status: "rejected" } : c));
      toast.success("Course rejected — instructor will be notified", { id: tid, ...tOk });
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally { setActionLoading(null); }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleRemove = async (id: string) => {
    closeDialog();
    setActionLoading(id + "_delete");
    const tid = toast.loading("Deleting...", { position: "top-right" });
    try {
      const res  = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCourses(prev => prev.filter(c => c._id !== id));
      toast.success("Course deleted 🗑️", { id: tid, ...tOk });
    } catch (err: any) {
      toast.error(`❌ ${err.message}`, { id: tid, ...tErr });
    } finally { setActionLoading(null); }
  };

  const handleConfirm = () => {
    const { courseId, action } = dialog;
    if (action === "approve") handleApprove(courseId);
    else if (action === "reject") handleReject(courseId);
    else handleRemove(courseId);
  };

  const filtered = filter === "all" ? courses : courses.filter(c => c.status === filter);
  const counts = {
    all:       courses.length,
    published: courses.filter(c => c.status === "published").length,
    pending:   courses.filter(c => c.status === "pending").length,
    rejected:  courses.filter(c => c.status === "rejected").length,
  };

  const formatPrice = (c: ICourse) => {
    if (c.pricing?.type === "free") return "Free";
    return `৳${(c.pricing?.discountPrice || c.pricing?.price || 0).toLocaleString()}`;
  };

  const TableActionButtons = ({ c }: { c: ICourse }) => {
    const isActing = actionLoading?.startsWith(c._id);
    return (
      <div className="flex gap-1.5">
        {c.status === "pending" && (
          <>
            <button onClick={() => openDialog(c._id, c.title, "approve")} disabled={!!isActing}
              className="btn btn-xs border-0 text-white cursor-pointer gap-1 disabled:opacity-50"
              style={{ backgroundColor: "#00C48C" }}>
              {actionLoading === c._id + "_approve"
                ? <span className="loading loading-spinner loading-xs" />
                : <><CheckCircle size={12} /> Approve</>}
            </button>
            <button onClick={() => openDialog(c._id, c.title, "reject")} disabled={!!isActing}
              className="btn btn-xs border-0 text-white cursor-pointer gap-1 disabled:opacity-50"
              style={{ backgroundColor: "#F59E0B" }}>
              {actionLoading === c._id + "_reject"
                ? <span className="loading loading-spinner loading-xs" />
                : <><XCircle size={12} /> Reject</>}
            </button>
          </>
        )}
        <button onClick={() => openDialog(c._id, c.title, "delete")} disabled={!!isActing}
          className="btn btn-xs btn-square border-0 text-white cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "#FF0F7B" }}>
          {actionLoading === c._id + "_delete"
            ? <span className="loading loading-spinner loading-xs" />
            : <Trash2 size={13} />}
        </button>
      </div>
    );
  };

  const CardActionButtons = ({ c }: { c: ICourse }) => {
    const isActing = actionLoading?.startsWith(c._id);
    return (
      <div className="flex gap-2 flex-wrap">
        {c.status === "pending" && (
          <>
            <button onClick={() => openDialog(c._id, c.title, "approve")} disabled={!!isActing}
              className="btn btn-xs border-0 text-white cursor-pointer gap-1.5 disabled:opacity-50"
              style={{ backgroundColor: "#00C48C" }}>
              {actionLoading === c._id + "_approve"
                ? <span className="loading loading-spinner loading-xs" />
                : <><CheckCircle size={12} /><span className="text-xs font-bold">Approve</span></>}
            </button>
            <button onClick={() => openDialog(c._id, c.title, "reject")} disabled={!!isActing}
              className="btn btn-xs border-0 text-white cursor-pointer gap-1.5 disabled:opacity-50"
              style={{ backgroundColor: "#F59E0B" }}>
              {actionLoading === c._id + "_reject"
                ? <span className="loading loading-spinner loading-xs" />
                : <><XCircle size={12} /><span className="text-xs font-bold">Reject</span></>}
            </button>
          </>
        )}
        <button onClick={() => openDialog(c._id, c.title, "delete")} disabled={!!isActing}
          className="btn btn-xs border-0 text-white cursor-pointer gap-1.5 disabled:opacity-50"
          style={{ backgroundColor: "#FF0F7B" }}>
          {actionLoading === c._id + "_delete"
            ? <span className="loading loading-spinner loading-xs" />
            : <><Trash2 size={12} /><span className="text-xs font-bold">Delete</span></>}
        </button>
      </div>
    );
  };

  const dlg = DIALOG_CFG[dialog.action];

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" containerStyle={{ top: 80, right: 24 }} />

      {/* ════ CONFIRM DIALOG ════ */}
      {dialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDialog} />
          <div className="relative z-10 w-full max-w-sm rounded-2xl bg-base-100 border border-base-300 shadow-2xl overflow-hidden"
            style={{ animation: "dialogIn 0.2s ease" }}>
            <div className="h-1 w-full" style={{ backgroundColor: dlg.confirmColor }} />
            <div className="p-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: dlg.iconBg }}>
                {dlg.icon}
              </div>
              <h3 className="text-lg font-black mb-2">{dlg.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed mb-4">{dlg.desc(dialog.courseTitle)}</p>
              <div className="flex items-center gap-2 bg-base-200 rounded-xl px-3 py-2 mb-6">
                <BookOpen size={14} className="opacity-40 flex-shrink-0" />
                <span className="text-xs font-bold line-clamp-1 opacity-70">{dialog.courseTitle}</span>
              </div>
              <div className="flex gap-3">
                <button onClick={closeDialog} className="btn btn-sm flex-1 btn-ghost border border-base-300 cursor-pointer">Cancel</button>
                <button onClick={handleConfirm} className="btn btn-sm flex-1 border-0 text-white cursor-pointer font-bold"
                  style={{ backgroundColor: dlg.confirmColor }}>{dlg.confirmLabel}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes dialogIn { from{opacity:0;transform:scale(.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }`}</style>

      {/* ── Header ── */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Admin Panel</p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">All Courses</h1>
            <p className="text-sm opacity-50 mt-1">{courses.length} total courses on the platform</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => fetchCourses(true)} disabled={loading}
              className="btn btn-sm btn-ghost btn-circle opacity-50 hover:opacity-100">
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="flex bg-base-100 border border-base-300 p-1 rounded-xl gap-1">
              <button onClick={() => setViewMode("table")}
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                style={viewMode === "table" ? { backgroundColor: "#832388", color: "#fff" } : { opacity: 0.5 }}>
                <List size={13} /> Table
              </button>
              <button onClick={() => setViewMode("card")}
                className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                style={viewMode === "card" ? { backgroundColor: "#832388", color: "#fff" } : { opacity: 0.5 }}>
                <LayoutGrid size={13} /> Cards
              </button>
            </div>
            <div className="flex gap-1 bg-base-100 border border-base-300 p-1 rounded-xl">
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer flex items-center gap-1.5"
                  style={filter === f ? { backgroundColor: "#832388", color: "#fff" } : { opacity: 0.5 }}>
                  {f}
                  <span className="text-xs font-black px-1.5 py-0.5 rounded-full"
                    style={filter === f
                      ? { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }
                      : { backgroundColor: "rgba(128,128,128,0.15)" }}>
                    {counts[f]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Published", count: counts.published, color: "#00C48C", glow: "rgba(0,196,140,0.12)",  icon: TrendingUp, key: "published" },
          { label: "Pending",   count: counts.pending,   color: "#F59E0B", glow: "rgba(245,158,11,0.12)", icon: RefreshCw,  key: "pending"   },
          { label: "Rejected",  count: counts.rejected,  color: "#EF4444", glow: "rgba(239,68,68,0.12)",  icon: XCircle,    key: "rejected"  },
          { label: "Total",     count: counts.all,       color: "#832388", glow: "rgba(131,35,136,0.12)", icon: BookOpen,   key: "all"       },
        ].map(s => (
          <div key={s.label} onClick={() => setFilter(s.key)}
            className="rounded-2xl bg-base-100 border border-base-300 p-4 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
            style={{ borderColor: filter === s.key ? s.color : undefined }}>
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full blur-xl opacity-60" style={{ backgroundColor: s.glow }} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-40">{s.label}</p>
                {loading ? <div className="skeleton h-7 w-10 mt-1 rounded" />
                  : <p className="text-2xl font-black mt-0.5" style={{ color: s.color }}>{s.count}</p>}
              </div>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.glow }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════ TABLE VIEW ════ */}
      {viewMode === "table" && (
        <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-md w-full">
              <thead>
                <tr className="border-b border-base-300">
                  {["#", "Course", "Instructor", "Category", "Students", "Price", "Rating", "Status", "Action"].map(h => (
                    <th key={h} className="text-xs font-bold uppercase tracking-wider opacity-40 bg-base-200/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading && Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 9 }).map((_, j) => <td key={j}><div className="skeleton h-5 rounded w-20" /></td>)}</tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-16">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="font-bold opacity-40 text-sm">No courses found</p>
                    </td>
                  </tr>
                )}
                {!loading && filtered.map((c, i) => {
                  const s = STATUS_CFG[c.status] || STATUS_CFG.draft;
                  return (
                    <tr key={c._id} className="hover border-b border-base-200 last:border-0">
                      <td className="text-xs font-black opacity-25 tabular-nums">{String(i + 1).padStart(2, "0")}</td>
                      <td style={{ maxWidth: 180 }}>
                        <p className="font-bold text-sm line-clamp-2 leading-snug">{c.title}</p>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <InstructorAvatar inst={c.instructorId} size="sm" />
                          <span className="text-xs font-semibold opacity-70 whitespace-nowrap">{getInstructorName(c.instructorId)}</span>
                        </div>
                      </td>
                      <td><span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-base-200 opacity-70">{c.category}</span></td>
                      <td>
                        <div className="flex items-center gap-1 text-sm font-bold opacity-60">
                          <Users size={12} />{c.enrolledCount || 0}
                        </div>
                      </td>
                      <td className="font-black text-sm" style={{ color: "#832388" }}>{formatPrice(c)}</td>
                      <td>
                        {(c.rating || 0) > 0
                          ? <div className="flex items-center gap-1">
                              <Star size={12} fill="#F59E0B" color="#F59E0B" />
                              <span className="text-sm font-bold" style={{ color: "#F59E0B" }}>{c.rating}</span>
                            </div>
                          : <span className="text-xs opacity-30 font-bold">—</span>}
                      </td>
                      <td>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: s.bg, color: s.text }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.text }} />
                          {s.label}
                        </span>
                      </td>
                      <td><TableActionButtons c={c} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center px-6 py-3 border-t border-base-300 bg-base-200/30">
            <p className="text-xs opacity-40 font-semibold">
              Showing <span className="font-black opacity-100">{filtered.length}</span> of{" "}
              <span className="font-black opacity-100">{courses.length}</span> courses
            </p>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span style={{ color: "#00C48C" }}>{counts.published} Published</span>
              <span style={{ color: "#F59E0B" }}>{counts.pending} Pending</span>
              <span style={{ color: "#EF4444" }}>{counts.rejected} Rejected</span>
            </div>
          </div>
        </div>
      )}

      {/* ════ CARD VIEW ════ */}
      {viewMode === "card" && (
        <>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
                  <div className="skeleton h-36 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                    <div className="skeleton h-8 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 bg-base-100 rounded-2xl border border-base-300">
              <div className="text-5xl mb-3">📭</div>
              <p className="font-bold opacity-40">No courses found</p>
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(c => {
                const s        = STATUS_CFG[c.status] || STATUS_CFG.draft;
                const coverUrl = getCoverUrl(c);
                return (
                  <div key={c._id}
                    className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                    <div className="relative h-36 bg-base-200 flex-shrink-0 overflow-hidden">
                      <CourseImage url={coverUrl} title={c.title} />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                        style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.text}30` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.text }} />{s.label}
                      </span>
                      <span className="absolute top-3 right-3 text-xs font-black px-2.5 py-1 rounded-full text-white"
                        style={{ background: "linear-gradient(135deg,#832388,#C81D77)" }}>
                        {formatPrice(c)}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1 gap-3">
                      <p className="font-black text-sm leading-snug line-clamp-2">{c.title}</p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <InstructorAvatar inst={c.instructorId} size="sm" />
                          <span className="opacity-60 font-semibold truncate max-w-[110px]">{getInstructorName(c.instructorId)}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-base-200 text-xs font-bold opacity-60">{c.category}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-1 border-t border-base-200 text-xs">
                        <div className="flex items-center gap-1 opacity-60"><Users size={11} /><span className="font-bold">{c.enrolledCount || 0}</span></div>
                        {(c.rating || 0) > 0 && (
                          <div className="flex items-center gap-1">
                            <Star size={11} fill="#F59E0B" color="#F59E0B" />
                            <span className="font-bold" style={{ color: "#F59E0B" }}>{c.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto pt-2 border-t border-base-200"><CardActionButtons c={c} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <div className="flex justify-between items-center mt-5 px-1 text-xs opacity-50 font-semibold">
              <span>Showing <strong>{filtered.length}</strong> of <strong>{courses.length}</strong> courses</span>
              <div className="flex gap-4">
                <span style={{ color: "#00C48C" }}>{counts.published} Published</span>
                <span style={{ color: "#F59E0B" }}>{counts.pending} Pending</span>
                <span style={{ color: "#EF4444" }}>{counts.rejected} Rejected</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}