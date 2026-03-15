"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, UserCheck, UserX, Trash2, Shield, GraduationCap, BookOpen, RefreshCw, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

type Role = "student" | "instructor" | "admin";
type Status = "active" | "suspended" | "banned";

interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  createdAt: string;
  photoURL?: string;
  stats?: {
    enrolledCourses?: number;
    totalCourses?: number;
  };
}

const openModal = (id: string) => (document.getElementById(id) as HTMLDialogElement | null)?.showModal();
const closeModal = (id: string) => (document.getElementById(id) as HTMLDialogElement | null)?.close();

export default function AdminUsersPage() {
  const [theme, setTheme] = useState("light");
  const [filter, setFilter] = useState<"all" | Role>("all");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [banTarget, setBanTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [banning, setBanning] = useState(false);

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

  // ── Fetch users ──
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Delete confirm ──
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
      closeModal("delete_user_modal");
      toast.success(`"${deleteTarget.name}" successfully deleted!`, {
        icon: "🗑️",
        style: { fontWeight: "600", fontSize: "13px" },
      });
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ── Ban / Unban confirm ──
  const handleBanConfirm = async () => {
    if (!banTarget) return;
    const isBanned = banTarget.status === "suspended" || banTarget.status === "banned";
    const newStatus = isBanned ? "active" : "suspended";
    setBanning(true);
    try {
      const res = await fetch(`/api/admin/users/${banTarget._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setUsers(prev => prev.map(u => u._id === banTarget._id ? { ...u, status: newStatus } : u));
      closeModal("ban_user_modal");
      if (isBanned) {
        toast.success(`"${banTarget.name}" has been unbanned!`, {
          icon: "✅",
          style: { fontWeight: "600", fontSize: "13px" },
        });
      } else {
        toast.error(`"${banTarget.name}" has been banned!`, {
          icon: "🚫",
          style: { fontWeight: "600", fontSize: "13px" },
        });
      }
      setBanTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setBanning(false);
    }
  };

  // ── Helpers ──
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return "—"; }
  };

  const getCourseCount = (u: User) =>
    u.role === "instructor" ? (u.stats?.totalCourses ?? 0) : (u.stats?.enrolledCourses ?? 0);

  const filtered = users
    .filter(u => filter === "all" || u.role === filter)
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    all: users.length,
    student: users.filter(u => u.role === "student").length,
    instructor: users.filter(u => u.role === "instructor").length,
    admin: users.filter(u => u.role === "admin").length,
  };

  const roleCfg: Record<Role, { bg: string; text: string; icon: React.ReactNode }> = {
    student: { bg: "bg-info/10", text: "text-info", icon: <GraduationCap size={11} /> },
    instructor: { bg: "bg-warning/10", text: "text-warning", icon: <BookOpen size={11} /> },
    admin: { bg: "bg-error/10", text: "text-error", icon: <Shield size={11} /> },
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">

      {/* ── react-hot-toast (top-right, navbar নিচে) ── */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            marginTop: "64px",
            borderRadius: "12px",
            padding: "12px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            fontSize: "13px",
          },
        }}
      />

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black tracking-tight">Users</h1>
          <p className="text-sm opacity-50 mt-1">Manage all platform users</p>
        </div>
        <button onClick={fetchUsers} disabled={loading} className="btn btn-sm btn-ghost gap-1.5 mt-2">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span className="text-xs">Refresh</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-error mb-6 flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button className="ml-auto btn btn-xs" onClick={fetchUsers}>Retry</button>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex gap-1 bg-base-200 p-1 rounded-xl">
          {(["all", "student", "instructor", "admin"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer flex items-center gap-1"
              style={filter === f ? { backgroundColor: "#832388", color: "#fff" } : {}}
            >
              {f}
              <span
                className="text-xs font-black px-1 py-0.5 rounded-full"
                style={filter === f
                  ? { backgroundColor: "rgba(255,255,255,0.2)", color: "#fff" }
                  : { backgroundColor: "rgba(0,0,0,0.08)" }}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input input-sm bg-base-200 border-base-300 pl-8 w-52 text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-md w-full">
            <thead>
              <tr>
                {["#", "User", "Role", "Courses", "Joined", "Status", "Action"].map(h => (
                  <th key={h} className="text-xs font-bold uppercase tracking-wider opacity-50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Skeleton */}
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton h-3 w-4 rounded" /></td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="skeleton w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <div className="skeleton h-3 w-24 rounded" />
                        <div className="skeleton h-2 w-32 rounded" />
                      </div>
                    </div>
                  </td>
                  <td><div className="skeleton h-5 w-16 rounded-full" /></td>
                  <td><div className="skeleton h-3 w-6 rounded" /></td>
                  <td><div className="skeleton h-3 w-20 rounded" /></td>
                  <td><div className="skeleton h-5 w-14 rounded-full" /></td>
                  <td><div className="flex gap-1"><div className="skeleton h-6 w-6 rounded" /><div className="skeleton h-6 w-6 rounded" /></div></td>
                </tr>
              ))}

              {/* Empty */}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 opacity-40 text-sm font-semibold">
                    {error ? "Failed to load users" : "No users found"}
                  </td>
                </tr>
              )}

              {/* Rows */}
              {!loading && filtered.map((u, i) => {
                const r = roleCfg[u.role] ?? roleCfg.student;
                const isBanned = u.status === "suspended" || u.status === "banned";
                return (
                  <tr key={u._id} className="hover">
                    <td className="text-xs font-black opacity-25">{String(i + 1).padStart(2, "0")}</td>

                    {/* User */}
                    <td>
                      <div className="flex items-center gap-2.5">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            onError={e => {
                              (e.target as HTMLImageElement).style.display = "none";
                              (e.target as HTMLImageElement).nextElementSibling?.removeAttribute("style");
                            }}
                          />
                        ) : null}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#FF0F7B,#F89B29)", display: u.photoURL ? "none" : "flex" }}
                        >
                          {u.name?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{u.name}</p>
                          <p className="text-xs opacity-40">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${r.bg} ${r.text}`}>
                        {r.icon} {u.role}
                      </span>
                    </td>

                    <td className="text-sm font-bold opacity-60">{getCourseCount(u)}</td>
                    <td className="text-xs opacity-50 whitespace-nowrap">{formatDate(u.createdAt)}</td>

                    {/* Status */}
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isBanned ? "bg-error/10 text-error" : "bg-success/10 text-success"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                        {isBanned ? "Banned" : "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => { setBanTarget(u); openModal("ban_user_modal"); }}
                          className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                          data-tip={isBanned ? "Unban User" : "Ban User"}
                          style={{ backgroundColor: isBanned ? "#00C48C" : "#F89B29" }}
                        >
                          {isBanned ? <UserCheck size={13} /> : <UserX size={13} />}
                        </button>
                        <button
                          onClick={() => { setDeleteTarget(u); openModal("delete_user_modal"); }}
                          className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                          data-tip="Delete User"
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
            <span className="font-black opacity-100">{users.length}</span> users
          </p>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="text-success">{users.filter(u => u.status === "active").length} Active</span>
            <span className="text-error">{users.filter(u => u.status === "suspended" || u.status === "banned").length} Banned</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════ */}
      <dialog id="delete_user_modal" className="modal">
        <div className="modal-box p-0 overflow-hidden rounded-2xl"
          style={{ border: "1px solid rgba(220,38,38,0.2)" }}>
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#dc2626,#E3436B)" }} />
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: "#fee2e2" }}>🗑️</div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Delete User?</h3>
                <p className="text-sm opacity-50 mt-0.5">এই কাজটি undo করা যাবে না।</p>
              </div>
            </div>

            {deleteTarget && (
              <div className="rounded-xl p-4 mb-4 border flex items-center gap-3"
                style={{
                  backgroundColor: theme === "dark" ? "#2a1515" : "#fef2f2",
                  borderColor: "#fca5a5",
                }}>
                {deleteTarget.photoURL
                  ? <img src={deleteTarget.photoURL} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="" />
                  : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                      style={{ background: "linear-gradient(135deg,#FF0F7B,#F89B29)" }}>
                      {deleteTarget.name?.charAt(0)}
                    </div>
                  )
                }
                <div>
                  <p className="text-sm font-bold text-error">{deleteTarget.name}</p>
                  <p className="text-xs opacity-60">{deleteTarget.email}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <form method="dialog">
                <button className="btn btn-ghost cursor-pointer" onClick={() => setDeleteTarget(null)}>
                  বাতিল
                </button>
              </form>
              <button
                className="btn text-white border-0 cursor-pointer gap-2"
                style={{ background: "linear-gradient(135deg,#dc2626,#E3436B)" }}
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting
                  ? <><span className="loading loading-spinner loading-sm" /> Deleting...</>
                  : <><Trash2 size={16} /> Delete করুন</>
                }
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setDeleteTarget(null)}>close</button>
        </form>
      </dialog>

      {/* ══════════════════════════════════
          BAN / UNBAN MODAL
      ══════════════════════════════════ */}
      <dialog id="ban_user_modal" className="modal">
        {banTarget && (() => {
          const isBanned = banTarget.status === "suspended" || banTarget.status === "banned";
          return (
            <div className="modal-box p-0 overflow-hidden rounded-2xl"
              style={{ border: `1px solid ${isBanned ? "rgba(0,196,140,0.25)" : "rgba(248,155,41,0.25)"}` }}>
              <div className="h-1.5 w-full"
                style={{
                  background: isBanned
                    ? "linear-gradient(90deg,#00C48C,#00e6a7)"
                    : "linear-gradient(90deg,#F89B29,#ff6b35)"
                }} />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: isBanned ? "#d1fae5" : "#fff7ed" }}>
                    {isBanned ? "✅" : "🚫"}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      {isBanned ? "Unban User?" : "Ban User?"}
                    </h3>
                    <p className="text-sm opacity-50 mt-0.5">
                      {isBanned
                        ? "User আবার platform access পাবে।"
                        : "User এর platform access বন্ধ হবে।"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl p-4 mb-4 border flex items-center gap-3"
                  style={{
                    backgroundColor: theme === "dark"
                      ? (isBanned ? "#0d2b1f" : "#2b1a06")
                      : (isBanned ? "#f0fdf4" : "#fffbeb"),
                    borderColor: isBanned ? "#6ee7b7" : "#fcd34d",
                  }}>
                  {banTarget.photoURL
                    ? <img src={banTarget.photoURL} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="" />
                    : (
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#FF0F7B,#F89B29)" }}>
                        {banTarget.name?.charAt(0)}
                      </div>
                    )
                  }
                  <div>
                    <p className="text-sm font-bold" style={{ color: isBanned ? "#059669" : "#d97706" }}>
                      {banTarget.name}
                    </p>
                    <p className="text-xs opacity-60">{banTarget.email}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <form method="dialog">
                    <button className="btn btn-ghost cursor-pointer" onClick={() => setBanTarget(null)}>
                      বাতিল
                    </button>
                  </form>
                  <button
                    className="btn text-white border-0 cursor-pointer gap-2"
                    style={{
                      background: isBanned
                        ? "linear-gradient(135deg,#00C48C,#00e6a7)"
                        : "linear-gradient(135deg,#F89B29,#ff6b35)",
                    }}
                    onClick={handleBanConfirm}
                    disabled={banning}
                  >
                    {banning
                      ? <><span className="loading loading-spinner loading-sm" /> Processing...</>
                      : isBanned
                        ? <><UserCheck size={16} /> Unban করুন</>
                        : <><UserX size={16} /> Ban করুন</>
                    }
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setBanTarget(null)}>close</button>
        </form>
      </dialog>

    </div>
  );
}