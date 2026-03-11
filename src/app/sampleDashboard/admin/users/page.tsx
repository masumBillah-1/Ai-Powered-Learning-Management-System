"use client";
import { useState, useEffect } from "react";
import { Search, UserCheck, UserX, Trash2, Shield, GraduationCap, BookOpen } from "lucide-react";

type Role = "student" | "instructor" | "admin";
type Status = "active" | "banned";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;
  courses: number;
}

export default function AdminUsersPage() {
  const [theme, setTheme] = useState("light");
  const [filter, setFilter] = useState<"all" | Role>("all");
  const [search, setSearch] = useState("");

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

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Rahim Uddin",    email: "rahim@example.com",   role: "student",    status: "active", joined: "Jan 5, 2024",  courses: 4 },
    { id: 2, name: "Sumaiya Islam",  email: "sumaiya@example.com", role: "student",    status: "active", joined: "Jan 12, 2024", courses: 2 },
    { id: 3, name: "Karim Hossain",  email: "karim@example.com",   role: "instructor", status: "active", joined: "Dec 1, 2023",  courses: 3 },
    { id: 4, name: "Sadia Islam",    email: "sadia@example.com",   role: "instructor", status: "banned", joined: "Nov 20, 2023", courses: 1 },
    { id: 5, name: "Tanvir Ahmed",   email: "tanvir@example.com",  role: "student",    status: "active", joined: "Feb 2, 2024",  courses: 6 },
    { id: 6, name: "Nusrat Jahan",   email: "nusrat@example.com",  role: "student",    status: "banned", joined: "Feb 10, 2024", courses: 1 },
    { id: 7, name: "Admin User",     email: "admin@example.com",   role: "admin",      status: "active", joined: "Oct 1, 2023",  courses: 0 },
  ]);

  const toggleBan  = (id: number) => setUsers(p => p.map(u => u.id === id ? { ...u, status: u.status === "active" ? "banned" : "active" } : u));
  const removeUser = (id: number) => setUsers(p => p.filter(u => u.id !== id));

  const filtered = users
    .filter(u => filter === "all" || u.role === filter)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all:        users.length,
    student:    users.filter(u => u.role === "student").length,
    instructor: users.filter(u => u.role === "instructor").length,
    admin:      users.filter(u => u.role === "admin").length,
  };

  const roleCfg: Record<Role, { bg: string; text: string; icon: React.ReactNode }> = {
    student:    { bg: "bg-info/10",    text: "text-info",    icon: <GraduationCap size={11} /> },
    instructor: { bg: "bg-warning/10", text: "text-warning", icon: <BookOpen size={11} />      },
    admin:      { bg: "bg-error/10",   text: "text-error",   icon: <Shield size={11} />         },
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Admin Panel</p>
        <h1 className="text-3xl font-black tracking-tight">Users</h1>
        <p className="text-sm opacity-50 mt-1">Manage all platform users</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">

        {/* Filter Tabs */}
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
                  : { backgroundColor: "rgba(0,0,0,0.08)" }
                }
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
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
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 opacity-40 text-sm font-semibold">
                    No users found
                  </td>
                </tr>
              )}
              {filtered.map((u, i) => {
                const r = roleCfg[u.role];
                return (
                  <tr key={u.id} className="hover">

                    {/* Index */}
                    <td className="text-xs font-black opacity-25">{String(i + 1).padStart(2, "0")}</td>

                    {/* User */}
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#FF0F7B,#F89B29)" }}
                        >
                          {u.name.charAt(0)}
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

                    {/* Courses */}
                    <td className="text-sm font-bold opacity-60">{u.courses}</td>

                    {/* Joined */}
                    <td className="text-xs opacity-50 whitespace-nowrap">{u.joined}</td>

                    {/* Status */}
                    <td>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${u.status === "active" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                        {u.status === "active" ? "Active" : "Banned"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggleBan(u.id)}
                          className="btn btn-xs btn-square border-0 text-white cursor-pointer tooltip"
                          data-tip={u.status === "active" ? "Ban User" : "Unban User"}
                          style={{ backgroundColor: u.status === "active" ? "#F89B29" : "#00C48C" }}
                        >
                          {u.status === "active" ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                        <button
                          onClick={() => removeUser(u.id)}
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
            <span className="text-error">{users.filter(u => u.status === "banned").length} Banned</span>
          </div>
        </div>
      </div>
    </div>
  );
}