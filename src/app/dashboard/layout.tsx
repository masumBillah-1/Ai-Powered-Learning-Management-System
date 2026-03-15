"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, User, BookOpen, FileText, HelpCircle, Award,
  MessageSquare, Settings, Bell, ChevronLeft, ChevronRight,
  Menu, X, LogOut, Users, DollarSign, BarChart2, Megaphone,
} from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";

type Role = "student" | "instructor" | "admin";
interface UserData { name: string; email: string; photoURL?: string; role: Role; }

// ✅ Poll interval বাড়ানো হয়েছে — 5s থেকে 60s
// বারবার API call = বারবার MongoDB connection = timeout বেশি
const POLL_INTERVAL = 60_000;

const menus: Record<Role, { label: string; href: string; icon: React.ReactNode }[]> = {
  student: [
    { label: "Dashboard", href: "/dashboard/student", icon: <LayoutDashboard size={18} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
    { label: "Courses", href: "/dashboard/student/courses", icon: <BookOpen size={18} /> },
    { label: "Assignments", href: "/dashboard/student/assignments", icon: <FileText size={18} /> },
    { label: "Announcements", href: "/dashboard/announcements", icon: <Megaphone size={18} /> },
    { label: "Quiz", href: "/dashboard/student/quiz", icon: <HelpCircle size={18} /> },
    { label: "Certificates", href: "/dashboard/student/certificates", icon: <Award size={18} /> },
    { label: "Blog", href: "/dashboard/blog", icon: <BookOpen size={18} /> },
    { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={18} /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ],
  instructor: [
    { label: "Dashboard", href: "/dashboard/instructor", icon: <LayoutDashboard size={18} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
    { label: "Courses", href: "/dashboard/instructor/courses", icon: <BookOpen size={18} /> },
    { label: "Announcements", href: "/dashboard/announcements", icon: <Megaphone size={18} /> },
    { label: "Assignments", href: "/dashboard/instructor/assignments", icon: <FileText size={18} /> },
    { label: "Students", href: "/dashboard/instructor/students", icon: <Users size={18} /> },
    { label: "Quiz", href: "/dashboard/instructor/quiz", icon: <HelpCircle size={18} /> },
    { label: "Quiz Results", href: "/dashboard/instructor/quiz-results", icon: <BarChart2 size={18} /> },
    { label: "Earnings", href: "/dashboard/instructor/earnings", icon: <DollarSign size={18} /> },
    { label: "Blog", href: "/dashboard/blog", icon: <BookOpen size={18} /> },
    { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={18} /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
    { label: "Courses", href: "/dashboard/admin/courses", icon: <BookOpen size={18} /> },
    { label: "Users", href: "/dashboard/admin/users", icon: <Users size={18} /> },
    { label: "Announcements", href: "/dashboard/announcements", icon: <Megaphone size={18} /> },
    { label: "Earnings", href: "/dashboard/admin/earnings", icon: <DollarSign size={18} /> },
    { label: "Blog", href: "/dashboard/blog", icon: <BookOpen size={18} /> },
    { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={18} /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> },
  ],
};

const roleDashboard: Record<Role, string> = {
  student: "/dashboard/student",
  instructor: "/dashboard/instructor",
  admin: "/dashboard/admin",
};

const roleProtectedPrefixes: Record<Role, string[]> = {
  student: ["/dashboard/student"],
  instructor: ["/dashboard/instructor"],
  admin: ["/dashboard/admin"],
};

const sharedPaths = [
  "/dashboard/profile",
  "/dashboard/messages",
  "/dashboard/settings",
  "/dashboard/announcements",
  "/dashboard/blog",
];

function isUnauthorizedPath(path: string, userRole: Role): boolean {
  if (sharedPaths.some(p => path.startsWith(p))) return false;
  for (const [role, prefixes] of Object.entries(roleProtectedPrefixes) as [Role, string[]][]) {
    if (role === userRole) continue;
    if (prefixes.some(prefix => path.startsWith(prefix))) return true;
  }
  return false;
}

const roleMeta: Record<Role, { color: string; label: string }> = {
  student: { color: "#00C48C", label: "Student" },
  instructor: { color: "#F89B29", label: "Instructor" },
  admin: { color: "#FF0F7B", label: "Admin" },
};

const rootHrefs = ["/dashboard/instructor", "/dashboard/student", "/dashboard/admin"];

function Avatar({ user, sm }: { user: UserData | null; sm?: boolean }) {
  const letter = user?.name?.charAt(0).toUpperCase() || "?";
  const cls = sm ? "w-7 h-7" : "w-9 h-9";
  return user?.photoURL
    ? <img src={user.photoURL} alt="" className={`${cls} rounded-lg object-cover flex-shrink-0`} />
    : <div className={`${cls} rounded-lg flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br from-[#832388] to-[#FF0F7B] flex-shrink-0`}>{letter}</div>;
}

function Sidebar({ items, collapsed, onToggle, mobileOpen, onMobileClose }: {
  items: { label: string; href: string; icon: React.ReactNode }[];
  collapsed: boolean; onToggle: () => void;
  mobileOpen: boolean; onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const wide = !collapsed;

  const NavContent = ({ forceWide = false }: { forceWide?: boolean }) => {
    const w = forceWide || wide;
    return (
      <div className={`flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] transition-all duration-300 ${w ? "w-60" : "w-[68px]"}`}>
        <div className={`h-16 flex items-center flex-shrink-0 border-b border-white/[0.07] ${w ? "px-3.5 justify-between" : "justify-center px-0"}`}>
          {w && (
            <Link href="/" className="flex items-center gap-2.5 no-underline min-w-0">
              <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[15px] font-black text-white bg-gradient-to-br from-[#832388] to-[#FF0F7B]">S</div>
              <span className="text-[15px] font-black text-white whitespace-nowrap tracking-tight">SmartLMS<span className="text-[#FF0F7B]">Pro</span></span>
            </Link>
          )}
          {!forceWide ? (
            <button onClick={onToggle} className="w-7 h-7 rounded-md flex items-center justify-center bg-white/[0.08] text-white/55 hover:bg-white/15 transition-colors border-0 cursor-pointer flex-shrink-0">
              {w ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          ) : (
            <button onClick={onMobileClose} className="w-7 h-7 rounded-md flex items-center justify-center bg-white/[0.08] text-white/60 hover:bg-white/15 border-0 cursor-pointer flex-shrink-0">
              <X size={15} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-1.5 [scrollbar-width:none]">
          {items.map(item => {
            const active = pathname === item.href || (!rootHrefs.includes(item.href) && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} title={!w ? item.label : undefined}
                className={`relative flex items-center mx-2 my-0.5 rounded-lg no-underline transition-colors duration-150
                  ${w ? "gap-3 px-3.5 py-2.5 justify-start" : "justify-center py-3"}
                  ${active ? "bg-gradient-to-r from-[#83238888] to-[#FF0F7B44] text-white" : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"}`}>
                {active && <span className="absolute left-0 top-[18%] h-[64%] w-[3px] rounded-r-sm bg-gradient-to-b from-[#832388] to-[#FF0F7B]" />}
                <span className={active ? "text-white" : "text-white/40"}>{item.icon}</span>
                {w && <span className={`text-[13.5px] whitespace-nowrap ${active ? "font-semibold" : "font-normal"}`}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        {w && <div className="px-3.5 py-3 border-t border-white/[0.07] text-[11px] text-white/20 flex-shrink-0">SmartLMS Pro v2.0</div>}
      </div>
    );
  };

  return (
    <>
      <aside className={`fixed top-0 left-0 bottom-0 z-60 overflow-hidden transition-all duration-300 hidden md:block ${collapsed ? "w-[68px]" : "w-60"}`}>
        <NavContent />
      </aside>
      {mobileOpen && (
        <>
          <div onClick={onMobileClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] md:hidden" />
          <aside className="fixed top-0 left-0 bottom-0 z-[101] shadow-2xl md:hidden">
            <NavContent forceWide />
          </aside>
        </>
      )}
    </>
  );
}

function TopNavbar({ role, items, theme, toggleTheme, user, onLogout, onMobileMenu, collapsed, unreadCount }: {
  role: Role;
  items: { label: string; href: string; icon: React.ReactNode }[];
  theme: "dark" | "light"; toggleTheme: () => void;
  user: UserData | null; onLogout: () => void;
  onMobileMenu: () => void; collapsed: boolean;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const rm = roleMeta[role];

  const currentPage = items.find(i =>
    i.href === pathname || (!rootHrefs.includes(i.href) && pathname.startsWith(i.href))
  )?.label || "Dashboard";

  const handleNotifOpen = async () => {
    setShowNotif(v => !v);
    setShowUser(false);
    if (notifications.length === 0) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/notifications", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.notifications) setNotifications(data.notifications);
      } catch { }
    }
  };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className={`
      fixed top-0 right-0 h-16 z-50 flex items-center justify-between px-4
      bg-white dark:bg-[#0f172a]
      border-b border-gray-200 dark:border-gray-700/60
      shadow-sm transition-all duration-300
      max-md:left-0 ${collapsed ? "md:left-[68px]" : "md:left-60"}
    `}>
      <div className="flex items-center gap-2">
        <button onClick={onMobileMenu} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden cursor-pointer">
          <Menu size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div>
          <p className="m-0 text-[17px] font-bold text-gray-900 dark:text-white leading-tight">{currentPage}</p>
          <p className="m-0 text-[11px] text-gray-400 dark:text-gray-500 leading-none capitalize">{role} Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
          {theme === "dark" ? <FaSun size={16} className="text-yellow-400" /> : <FaMoon size={16} className="text-gray-500" />}
        </button>

        <div ref={notifRef} className="relative">
          <button onClick={handleNotifOpen} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer relative">
            <Bell size={18} className="text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-white font-bold flex items-center justify-center text-[9px] bg-[#FF0F7B]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-72 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[200] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Notifications</span>
                <span className="text-xs font-semibold cursor-pointer text-[#832388]">Mark all read</span>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">কোনো notification নেই</div>
              ) : notifications.slice(0, 5).map((n, i) => (
                <div key={i} className={`flex gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer items-start hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!n.isRead ? "bg-gray-50 dark:bg-gray-800/50" : ""}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${n.isRead ? "bg-gray-300 dark:bg-gray-600" : "bg-[#FF0F7B]"}`} />
                  <div>
                    <p className={`text-[13px] leading-snug m-0 ${n.isRead ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white font-semibold"}`}>{n.title}</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 m-0">{n.message}</p>
                  </div>
                </div>
              ))}
              <div className="py-2.5 text-center">
                <Link href="/dashboard/settings" className="text-xs font-semibold text-[#832388]">View all →</Link>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <div ref={userRef} className="relative">
          <button onClick={() => { setShowUser(v => !v); setShowNotif(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            <Avatar user={user} sm />
            <div className="text-left hidden sm:block">
              <p className="m-0 text-[13px] font-semibold text-gray-900 dark:text-white leading-tight max-w-[80px] truncate">{user?.name?.split(" ")[0] || "User"}</p>
              <p className="m-0 text-[10px] font-bold uppercase tracking-wide" style={{ color: rm.color }}>{role}</p>
            </div>
            <ChevronRight size={11} className="opacity-40 rotate-90 hidden sm:block text-gray-500" />
          </button>

          {showUser && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-56 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-[200] overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="m-0 text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
                  <p className="m-0 text-[11px] text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide"
                  style={{ color: rm.color, background: `${rm.color}22`, border: `1px solid ${rm.color}33` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: rm.color }} />
                  {rm.label}
                </span>
              </div>
              <Link href="/dashboard/profile" onClick={() => setShowUser(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline">
                <User size={14} className="opacity-50" /> My Profile
              </Link>
              <Link href="/dashboard/settings" onClick={() => setShowUser(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline">
                <Settings size={14} className="opacity-50" /> Settings
              </Link>
              <button onClick={() => { setShowUser(false); onLogout(); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13.5px] font-semibold bg-transparent border-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-[#FF0F7B]">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function PageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [pathname]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-10 h-10 border-4 border-[#832388]/20 border-t-[#832388] rounded-full animate-spin" />
      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium m-0">Loading...</p>
    </div>
  );
  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [role, setRole] = useState<Role>("student");
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const currentRoleRef = useRef<Role | null>(null);
  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "dark" | "light") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
    if (saved === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  // ✅ localStorage থেকে user load করার helper
  const loadFromCache = useCallback((isInitial: boolean) => {
    const raw = localStorage.getItem("user");
    if (!raw) return false;
    try {
      const parsed: UserData = JSON.parse(raw);
      const r = (["student", "instructor", "admin"].includes(parsed.role)
        ? parsed.role : "student") as Role;
      currentRoleRef.current = r;
      setUser(parsed);
      setRole(r);
      if (isInitial) {
        setIsLoading(false);
        if (isUnauthorizedPath(pathname, r)) router.replace(roleDashboard[r]);
      }
      return true;
    } catch {
      return false;
    }
  }, [pathname, router]);

  const fetchUser = useCallback(async (isInitial = false) => {
    const token = localStorage.getItem("token");

    // ✅ Token নেই → সত্যিকারের logout
    if (!token) {
      router.replace("/login");
      return;
    }

    // Debounce — 2s এর মধ্যে duplicate call skip
    const now = Date.now();
    if (!isInitial && now - lastFetchRef.current < 2000) return;
    lastFetchRef.current = now;

    try {
      const res = await fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      // ✅ KEY FIX: 500/503 = MongoDB timeout বা server error
      // token delete করবো না — cached user দিয়ে চালিয়ে যাবো
      if (res.status >= 500) {
        console.warn(`⚠️ Server error ${res.status} — keeping cached session, NOT logging out`);
        if (isInitial) {
          const ok = loadFromCache(true);
          if (!ok) {
            // cache ও নেই — তখন login
            router.replace("/login");
          }
        }
        return;
      }

      // ✅ 401 = token expire বা invalid → তখনই logout
      if (res.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      const data = await res.json();

      if (!data.user) {
        // data নেই কিন্তু 200 response — unexpected, cache রাখো
        if (isInitial) loadFromCache(true);
        return;
      }

      const freshUser: UserData = data.user;
      const newRole = (["student", "instructor", "admin"].includes(freshUser.role)
        ? freshUser.role : "student") as Role;

      localStorage.setItem("user", JSON.stringify(freshUser));

      // Role change হলে redirect
      if (currentRoleRef.current !== null && newRole !== currentRoleRef.current) {
        currentRoleRef.current = newRole;
        setUser(freshUser);
        setRole(newRole);
        router.replace(roleDashboard[newRole]);
        return;
      }

      currentRoleRef.current = newRole;
      setUser(freshUser);
      setRole(newRole);
      setUnreadCount(data.unreadNotifications || 0);

      if (isInitial) {
        setIsLoading(false);
        const isWrongRoleDashboard = Object.entries(roleDashboard).some(
          ([r, path]) => r !== newRole && pathname.startsWith(path)
        );
        if (isWrongRoleDashboard || isUnauthorizedPath(pathname, newRole)) {
          router.replace(roleDashboard[newRole]);
        }
      }

    } catch (err) {
      // ✅ Network error বা fetch throw — logout করবো না
      console.warn("⚠️ fetchUser error — keeping session:", err);
      if (isInitial) {
        const ok = loadFromCache(true);
        if (!ok) router.replace("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadFromCache]);

  useEffect(() => { fetchUser(true); }, [fetchUser]);

  // ✅ Poll interval বাড়ানো হয়েছে: 5s → 60s
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) fetchUser(false);
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isLoading, fetchUser]);

  // Tab visible হলে check
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && !isLoading) fetchUser(false);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [isLoading, fetchUser]);

  // Window focus হলে check
  useEffect(() => {
    const onFocus = () => { if (!isLoading) fetchUser(false); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [isLoading, fetchUser]);

  // Route change হলে check
  useEffect(() => {
    if (!isLoading) fetchUser(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // URL guard
  useEffect(() => {
    if (isLoading) return;
    if (isUnauthorizedPath(pathname, role)) {
      router.replace(roleDashboard[role]);
    }
  }, [pathname, role, isLoading, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#0b1120]">
      <div className="w-12 h-12 border-4 border-[#832388]/20 border-t-[#832388] rounded-full animate-spin" />
    </div>
  );

  const items = menus[role];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120]">
      <Sidebar
        items={items} collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopNavbar
        role={role} items={items}
        theme={theme} toggleTheme={toggleTheme}
        user={user} onLogout={handleLogout}
        onMobileMenu={() => setMobileOpen(true)}
        collapsed={collapsed} unreadCount={unreadCount}
      />
      <main className={`min-h-screen pt-16 transition-all duration-300 ${collapsed ? "md:pl-[68px]" : "md:pl-60"}`}>
        <div className="p-6">
          <PageLoader>{children}</PageLoader>
        </div>
      </main>
    </div>
  );
}