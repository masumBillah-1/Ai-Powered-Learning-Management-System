"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, UserCheck, UserX, Trash2, Shield, GraduationCap, BookOpen, RefreshCw, AlertCircle, Eye, EyeOff, User as UserIcon } from "lucide-react";
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
    approvedCourses?: number;
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
  const [adminPassword, setAdminPassword] = useState(""); // ✅ Admin password for verification
  const [showPassword, setShowPassword] = useState(false); // ✅ Password visibility toggle
  const [historyUser, setHistoryUser] = useState<User | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  // ✅ Profile View Modal States
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

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

      // ✅ Add authorization header
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

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

    // ✅ Password validation
    if (!adminPassword.trim()) {
      toast.error("Please enter your password to confirm", {
        icon: "🔒",
        style: { fontWeight: "600", fontSize: "13px" },
      });
      return;
    }

    setDeleting(true);
    try {
      // ✅ Add authorization header + admin password
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${deleteTarget._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ adminPassword }), // ✅ Send password for verification
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete user");
      }

      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
      closeModal("delete_user_modal");
      toast.success(`"${deleteTarget.name}" successfully deleted!`, {
        icon: "🗑️",
        style: { fontWeight: "600", fontSize: "13px" },
      });
      setDeleteTarget(null);
      setAdminPassword(""); // ✅ Clear password
      setShowPassword(false); // ✅ Reset visibility
    } catch (err: any) {
      toast.error(err.message || "Delete failed", {
        icon: "❌",
        style: { fontWeight: "600", fontSize: "13px" },
      });
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
      // ✅ Add authorization header
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${banTarget._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update status");
      }

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

  // ✅ View user profile (all roles)
  const handleViewProfile = async (user: User) => {
    setProfileUser(user);
    setProfileLoading(true);
    setProfileData(null);
    openModal("profile_modal");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/users/${user._id}?view=profile`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // ✅ Fetch admin history from AdminLog
  const handleViewHistory = async (user: User) => {
    if (user.role !== "admin") return;
    setHistoryUser(user);
    setHistoryLoading(true);
    setHistoryData([]);
    openModal("history_modal");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/history/${user._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await res.json();
      setHistoryData(data.history || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      toast.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  // ── Helpers ──
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return "—"; }
  };

  const getCourseCount = (u: User) => {
    if (u.role === "admin") return u.stats?.approvedCourses ?? 0; // Admin approved courses
    return u.role === "instructor" ? (u.stats?.totalCourses ?? 0) : (u.stats?.enrolledCourses ?? 0);
  };

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
    <div className="min-h-screen">

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
                        {/* Profile View - All users */}
                        <button
                          onClick={() => handleViewProfile(u)}
                          className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                          data-tip="View Profile"
                          style={{ backgroundColor: "#832388" }}
                        >
                          <UserIcon size={13} />
                        </button>

                        {/* History - Admin only */}
                        {u.role === "admin" && (
                          <button
                            onClick={() => handleViewHistory(u)}
                            className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                            data-tip="Admin History"
                            style={{ backgroundColor: "#6366f1" }}
                          >
                            📜
                          </button>
                        )}

                        {/* Ban/Unban */}
                        <button
                          onClick={() => { setBanTarget(u); openModal("ban_user_modal"); }}
                          className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                          data-tip={isBanned ? "Unban User" : "Ban User"}
                          style={{ backgroundColor: isBanned ? "#00C48C" : "#F89B29" }}
                        >
                          {isBanned ? <UserCheck size={13} /> : <UserX size={13} />}
                        </button>

                        {/* Delete */}
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
              <>
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

                {/* ✅ Password Input Field */}
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2 opacity-70">
                    🔒 Enter your admin password to confirm
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Your password"
                      className="input input-bordered w-full bg-base-200 focus:outline-none focus:border-error pr-12"
                      disabled={deleting}
                      autoComplete="new-password"
                      name="admin-delete-password"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !deleting) {
                          handleDeleteConfirm();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                      disabled={deleting}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs opacity-40 mt-1.5">
                    Security verification required for user deletion
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3">
              <form method="dialog">
                <button className="btn btn-ghost cursor-pointer" onClick={() => { setDeleteTarget(null); setAdminPassword(""); setShowPassword(false); }}>
                  বাতিল
                </button>
              </form>
              <button
                className="btn text-white border-0 cursor-pointer gap-2"
                style={{ background: "linear-gradient(135deg,#dc2626,#E3436B)" }}
                onClick={handleDeleteConfirm}
                disabled={deleting || !adminPassword.trim()}
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
          <button onClick={() => { setDeleteTarget(null); setAdminPassword(""); setShowPassword(false); }}>close</button>
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

      {/* ══════════════════════════════════
          PROFILE VIEW MODAL
      ══════════════════════════════════ */}
      <dialog id="profile_modal" className="modal">
        <div className="modal-box w-full max-w-5xl p-0 overflow-hidden rounded-2xl mx-4"
          style={{ border: "1px solid rgba(131,35,136,0.2)" }}>
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#832388,#C81D77)" }} />

          <div className="p-4 sm:p-6">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                  style={{ backgroundColor: "rgba(131,35,136,0.1)" }}>
                  👤
                </div>
                <div>
                  <h3 className="font-bold text-lg sm:text-xl leading-tight">User Profile</h3>
                  <p className="text-xs sm:text-sm opacity-50 mt-0.5">Detailed information and activity</p>
                </div>
              </div>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>

            {profileLoading ? (
              <div className="flex justify-center py-12 sm:py-16">
                <span className="loading loading-spinner loading-lg" style={{ color: "#832388" }} />
              </div>
            ) : profileUser ? (
              <div className="space-y-4 sm:space-y-6">
                {/* User Basic Info Card */}
                <div className="rounded-2xl border border-base-300 overflow-hidden bg-base-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    {/* LEFT SIDE - User Basic Info */}
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-base-100 to-base-200 lg:border-r border-base-300">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0">
                          {profileUser.photoURL ? (
                            <img
                              src={profileUser.photoURL}
                              alt={profileUser.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
                            />
                          ) : (
                            <div
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black border-4 border-white shadow-lg"
                              style={{ background: "linear-gradient(135deg,#FF0F7B,#F89B29)" }}
                            >
                              {profileUser.name?.charAt(0) ?? "?"}
                            </div>
                          )}
                        </div>

                        {/* User Details */}
                        <div className="flex-1 space-y-2 sm:space-y-2.5 min-w-0">
                          <div>
                            <h4 className="text-lg sm:text-xl font-black leading-tight truncate">{profileUser.name}</h4>
                            <div className="mt-1.5">
                              {(() => {
                                const r = roleCfg[profileUser.role] ?? roleCfg.student;
                                return (
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${r.bg} ${r.text}`}>
                                    {r.icon} {profileUser.role}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="opacity-40">📧</span>
                              <span className="font-semibold opacity-80">{profileUser.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="opacity-40">�</span>
                              <span className="font-semibold opacity-80">Joined {formatDate(profileUser.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${profileUser.status === "active" ? "bg-success" : "bg-error"}`} />
                              <span className="font-semibold opacity-80 capitalize">{profileUser.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      {profileData?.user?.profile?.bio && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-300">
                          <p className="text-xs sm:text-sm opacity-70 italic leading-relaxed">"{profileData.user.profile.bio}"</p>
                        </div>
                      )}
                    </div>

                    {/* RIGHT SIDE - Contact & Social Links */}
                    <div className="p-4 sm:p-6 bg-base-100 flex flex-col justify-center border-t lg:border-t-0 border-base-300">
                      <div className="space-y-3 sm:space-y-4">
                        {/* Mobile Number */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider opacity-40 mb-2">Contact</p>
                          {profileData?.user?.phone ? (
                            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-base-200 border border-base-300">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-base sm:text-lg flex-shrink-0"
                                style={{ backgroundColor: "rgba(131,35,136,0.1)" }}>
                                📱
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs opacity-50 font-semibold">Mobile Number</p>
                                <p className="text-sm font-bold truncate">{profileData.user.phone}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 sm:p-3 rounded-xl bg-base-200 border border-base-300 text-center">
                              <p className="text-xs opacity-40">No phone number provided</p>
                            </div>
                          )}
                        </div>

                        {/* Social Links */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider opacity-40 mb-2">Social Links</p>
                          {profileData?.user?.profile?.socialLinks &&
                            (profileData.user.profile.socialLinks.website ||
                              profileData.user.profile.socialLinks.linkedin ||
                              profileData.user.profile.socialLinks.github ||
                              profileData.user.profile.socialLinks.twitter) ? (
                            <div className="grid grid-cols-2 gap-2">
                              {profileData.user.profile.socialLinks.website && (
                                <a
                                  href={profileData.user.profile.socialLinks.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2.5 rounded-lg bg-base-200 border border-base-300 hover:border-primary transition-colors"
                                >
                                  <span className="text-lg">🌐</span>
                                  <span className="text-xs font-bold">Website</span>
                                </a>
                              )}
                              {profileData.user.profile.socialLinks.linkedin && (
                                <a
                                  href={profileData.user.profile.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2.5 rounded-lg bg-base-200 border border-base-300 hover:border-primary transition-colors"
                                >
                                  <span className="text-lg">💼</span>
                                  <span className="text-xs font-bold">LinkedIn</span>
                                </a>
                              )}
                              {profileData.user.profile.socialLinks.github && (
                                <a
                                  href={profileData.user.profile.socialLinks.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2.5 rounded-lg bg-base-200 border border-base-300 hover:border-primary transition-colors"
                                >
                                  <span className="text-lg">💻</span>
                                  <span className="text-xs font-bold">GitHub</span>
                                </a>
                              )}
                              {profileData.user.profile.socialLinks.twitter && (
                                <a
                                  href={profileData.user.profile.socialLinks.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2.5 rounded-lg bg-base-200 border border-base-300 hover:border-primary transition-colors"
                                >
                                  <span className="text-lg">🐦</span>
                                  <span className="text-xs font-bold">Twitter</span>
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-base-200 border border-base-300 text-center">
                              <p className="text-xs opacity-40">No social links added</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-based Content */}
                {profileData && (
                  <>
                    {/* INSTRUCTOR: Courses */}
                    {profileUser.role === "instructor" && profileData.courses && (
                      <div className="rounded-2xl border border-base-300 overflow-hidden">
                        <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                          <h5 className="font-bold text-lg flex items-center gap-2">
                            📚 Created Courses
                            <span className="badge badge-sm" style={{ backgroundColor: "#832388", color: "#fff" }}>
                              {profileData.courses.length}
                            </span>
                          </h5>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="table table-sm w-full">
                            <thead>
                              <tr className="border-b border-base-300">
                                <th className="text-xs font-bold uppercase opacity-40">Course</th>
                                <th className="text-xs font-bold uppercase opacity-40">Price</th>
                                <th className="text-xs font-bold uppercase opacity-40">Students</th>
                                <th className="text-xs font-bold uppercase opacity-40">Status</th>
                                <th className="text-xs font-bold uppercase opacity-40">Created</th>
                              </tr>
                            </thead>
                            <tbody>
                              {profileData.courses.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center py-8 opacity-40 text-sm">
                                    No courses created yet
                                  </td>
                                </tr>
                              ) : (
                                profileData.courses.map((course: any) => (
                                  <tr key={course._id} className="hover border-b border-base-200 last:border-0">
                                    <td>
                                      <div className="flex items-center gap-3">
                                        {course.thumbnail && (
                                          <img src={course.thumbnail} className="w-12 h-8 rounded object-cover" alt="" />
                                        )}
                                        <span className="font-semibold text-sm">{course.title}</span>
                                      </div>
                                    </td>
                                    <td className="font-bold text-sm">৳{course.price}</td>
                                    <td className="text-sm opacity-60">{course.enrollmentCount || 0}</td>
                                    <td>
                                      <span className={`badge badge-sm ${course.status === "published" ? "badge-success" : "badge-warning"
                                        }`}>
                                        {course.status}
                                      </span>
                                    </td>
                                    <td className="text-xs opacity-50">{formatDate(course.createdAt)}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        {profileData.stats && (
                          <div className="bg-base-200/50 px-6 py-3 border-t border-base-300 flex justify-between text-xs font-bold">
                            <span>Total Students: {profileData.stats.totalStudents || 0}</span>
                            <span>Total Earnings: ৳{profileData.stats.totalEarnings || 0}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STUDENT: Enrollments */}
                    {profileUser.role === "student" && profileData.enrollments && (
                      <div className="rounded-2xl border border-base-300 overflow-hidden">
                        <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                          <h5 className="font-bold text-lg flex items-center gap-2">
                            🎓 Enrolled Courses
                            <span className="badge badge-sm" style={{ backgroundColor: "#832388", color: "#fff" }}>
                              {profileData.enrollments.length}
                            </span>
                          </h5>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="table table-sm w-full">
                            <thead>
                              <tr className="border-b border-base-300">
                                <th className="text-xs font-bold uppercase opacity-40">Course</th>
                                <th className="text-xs font-bold uppercase opacity-40">Price</th>
                                <th className="text-xs font-bold uppercase opacity-40">Progress</th>
                                <th className="text-xs font-bold uppercase opacity-40">Status</th>
                                <th className="text-xs font-bold uppercase opacity-40">Enrolled</th>
                              </tr>
                            </thead>
                            <tbody>
                              {profileData.enrollments.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="text-center py-8 opacity-40 text-sm">
                                    No enrollments yet
                                  </td>
                                </tr>
                              ) : (
                                profileData.enrollments.map((enrollment: any) => (
                                  <tr key={enrollment._id} className="hover border-b border-base-200 last:border-0">
                                    <td>
                                      <div className="flex items-center gap-3">
                                        {enrollment.courseThumbnail && (
                                          <img src={enrollment.courseThumbnail} className="w-12 h-8 rounded object-cover" alt="" />
                                        )}
                                        <span className="font-semibold text-sm">{enrollment.courseTitle}</span>
                                      </div>
                                    </td>
                                    <td className="font-bold text-sm">৳{enrollment.price}</td>
                                    <td>
                                      <div className="flex items-center gap-2">
                                        <progress
                                          className="progress progress-primary w-16 h-2"
                                          value={enrollment.progress || 0}
                                          max="100"
                                        />
                                        <span className="text-xs font-bold">{enrollment.progress || 0}%</span>
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`badge badge-sm ${enrollment.status === "completed" ? "badge-success" : "badge-info"
                                        }`}>
                                        {enrollment.status}
                                      </span>
                                    </td>
                                    <td className="text-xs opacity-50">{formatDate(enrollment.enrolledAt)}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        {profileData.stats && (
                          <div className="bg-base-200/50 px-6 py-3 border-t border-base-300 flex justify-between text-xs font-bold">
                            <span>Completed: {profileData.stats.completedCourses || 0}</span>
                            <span>Total Spent: ৳{profileData.stats.totalSpent || 0}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ADMIN: Activity Logs */}
                    {profileUser.role === "admin" && profileData.adminLogs && (
                      <div className="rounded-2xl border border-base-300 overflow-hidden">
                        <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                          <h5 className="font-bold text-lg flex items-center gap-2">
                            📊 Admin Activity
                            <span className="badge badge-sm" style={{ backgroundColor: "#832388", color: "#fff" }}>
                              {profileData.adminLogs.length}
                            </span>
                          </h5>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="table table-sm w-full">
                            <thead>
                              <tr className="border-b border-base-300">
                                <th className="text-xs font-bold uppercase opacity-40">Action</th>
                                <th className="text-xs font-bold uppercase opacity-40">Type</th>
                                <th className="text-xs font-bold uppercase opacity-40">Target</th>
                                <th className="text-xs font-bold uppercase opacity-40">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {profileData.adminLogs.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="text-center py-8 opacity-40 text-sm">
                                    No activity history found
                                  </td>
                                </tr>
                              ) : (
                                profileData.adminLogs.map((item: any, i: number) => (
                                  <tr key={i} className="hover border-b border-base-200 last:border-0">
                                    <td>
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                        style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                        {item.icon} {item.action}
                                      </span>
                                    </td>
                                    <td className="text-xs opacity-60 font-semibold">{item.type}</td>
                                    <td className="text-sm font-bold max-w-xs truncate">{item.target}</td>
                                    <td className="text-xs opacity-50 whitespace-nowrap">
                                      {new Date(item.date).toLocaleDateString("en-US", {
                                        month: "short", day: "numeric", year: "numeric",
                                        hour: "2-digit", minute: "2-digit"
                                      })}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-12 opacity-40">
                <p className="text-sm font-semibold">No user selected</p>
              </div>
            )}
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => { setProfileUser(null); setProfileData(null); }}>close</button>
        </form>
      </dialog>

      {/* ══════════════════════════════════
          HISTORY MODAL
      ══════════════════════════════════ */}
      <dialog id="history_modal" className="modal">
        <div className="modal-box w-11/12 max-w-4xl p-0 overflow-hidden rounded-2xl"
          style={{ border: "1px solid rgba(131,35,136,0.2)" }}>
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg,#832388,#C81D77)" }} />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: "rgba(131,35,136,0.1)" }}>📜</div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Admin Activity History</h3>
                  <p className="text-sm opacity-50 mt-0.5">{historyUser?.name}</p>
                </div>
              </div>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>

            {historyLoading ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg" style={{ color: "#832388" }} />
              </div>
            ) : historyData.length === 0 ? (
              <div className="text-center py-12 opacity-40">
                <p className="text-sm font-semibold">No activity history found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr className="border-b border-base-300">
                      <th className="text-xs font-bold uppercase opacity-40">Action</th>
                      <th className="text-xs font-bold uppercase opacity-40">Type</th>
                      <th className="text-xs font-bold uppercase opacity-40">Target</th>
                      <th className="text-xs font-bold uppercase opacity-40">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item, i) => (
                      <tr key={i} className="hover border-b border-base-200 last:border-0">
                        <td>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                            {item.icon} {item.action}
                          </span>
                        </td>
                        <td className="text-xs opacity-60 font-semibold">{item.type}</td>
                        <td className="text-sm font-bold max-w-xs truncate">{item.target}</td>
                        <td className="text-xs opacity-50 whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                            hour: "2-digit", minute: "2-digit"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-base-300 flex justify-between items-center text-xs opacity-50">
              <span>Total activities: <strong>{historyData.length}</strong></span>
              <span>
                ✅ {historyData.filter(h => h.action === "Approved").length} ·
                ❌ {historyData.filter(h => h.action === "Rejected").length} ·
                🗑️ {historyData.filter(h => h.action === "Deleted").length} ·
                🚫 {historyData.filter(h => h.action === "Banned").length}
              </span>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

    </div>
  );
}