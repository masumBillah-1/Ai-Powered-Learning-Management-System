"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, User, BookOpen, FileText, HelpCircle, Award,
  MessageSquare, Settings, Bell, ChevronLeft, ChevronRight,
  Menu, X, LogOut, Users, DollarSign, BarChart2, Megaphone,
} from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";

type Role = "student" | "instructor" | "admin";
interface UserData { name: string; email: string; photoURL?: string; role: Role; }

const menus: Record<Role, { label: string; href: string; icon: React.ReactNode }[]> = {
  student: [
    { label: "Dashboard",    href: "/sampleDashboard/student",              icon: <LayoutDashboard size={18} /> },
    { label: "Profile",      href: "/sampleDashboard/profile",              icon: <User size={18} />            },
    { label: "Courses",      href: "/sampleDashboard/student/courses",      icon: <BookOpen size={18} />        },
    { label: "Assignments",  href: "/sampleDashboard/student/assignments",  icon: <FileText size={18} />        },
    { label: "Quiz",         href: "/sampleDashboard/student/quiz",         icon: <HelpCircle size={18} />      },
    { label: "Certificates", href: "/sampleDashboard/student/certificates", icon: <Award size={18} />           },
    { label: "Messages",     href: "/sampleDashboard/messages",             icon: <MessageSquare size={18} />   },
    { label: "Settings",     href: "/sampleDashboard/settings",             icon: <Settings size={18} />        },
  ],
  instructor: [
    { label: "Dashboard",     href: "/sampleDashboard/instructor",              icon: <LayoutDashboard size={18} /> },
    { label: "Profile",       href: "/sampleDashboard/profile",                 icon: <User size={18} />            },
    { label: "Courses",       href: "/sampleDashboard/instructor/courses",      icon: <BookOpen size={18} />        },
    { label: "Announcements", href: "/sampleDashboard/instructor/announcements",icon: <Megaphone size={18} />       },
    { label: "Assignments",   href: "/sampleDashboard/instructor/assignments",  icon: <FileText size={18} />        },
    { label: "Students",      href: "/sampleDashboard/instructor/students",     icon: <Users size={18} />           },
    { label: "Quiz",          href: "/sampleDashboard/instructor/quiz",         icon: <HelpCircle size={18} />      },
    { label: "Quiz Results",  href: "/sampleDashboard/instructor/quiz-results", icon: <BarChart2 size={18} />       },
    { label: "Earnings",      href: "/sampleDashboard/instructor/earnings",     icon: <DollarSign size={18} />      },
    { label: "Messages",      href: "/sampleDashboard/messages",                icon: <MessageSquare size={18} />   },
    { label: "Settings",      href: "/sampleDashboard/settings",                icon: <Settings size={18} />        },
  ],
  admin: [
    { label: "Dashboard",     href: "/sampleDashboard/admin",               icon: <LayoutDashboard size={18} /> },
    { label: "Profile",       href: "/sampleDashboard/profile",             icon: <User size={18} />            },
    { label: "Courses",       href: "/sampleDashboard/admin/courses",       icon: <BookOpen size={18} />        },
    { label: "Users",         href: "/sampleDashboard/admin/users",         icon: <Users size={18} />           },
    { label: "Announcements", href: "/sampleDashboard/admin/announcements", icon: <Megaphone size={18} />       },
    { label: "Earnings",      href: "/sampleDashboard/admin/earnings",      icon: <DollarSign size={18} />      },
    { label: "Messages",      href: "/sampleDashboard/messages",            icon: <MessageSquare size={18} />   },
    { label: "Settings",      href: "/sampleDashboard/settings",            icon: <Settings size={18} />        },
  ],
};

// dynamic color বলে inline রাখতে হবে শুধু এটুকু
const roleMeta: Record<Role, { color: string; label: string }> = {
  student:    { color: "#00C48C", label: "Student"    },
  instructor: { color: "#F89B29", label: "Instructor" },
  admin:      { color: "#FF0F7B", label: "Admin"      },
};

const rootHrefs = ["/sampleDashboard/instructor", "/sampleDashboard/student", "/sampleDashboard/admin"];

function Avatar({ user, sm }: { user: UserData | null; sm?: boolean }) {
  const letter = user?.name?.charAt(0).toUpperCase() || "?";
  const cls = sm ? "w-7 h-7" : "w-9 h-9";
  return user?.photoURL
    ? <img src={user.photoURL} alt="" className={`${cls} rounded-lg object-cover flex-shrink-0`} />
    : <div className={`${cls} rounded-lg flex items-center justify-center font-bold text-sm text-white bg-gradient-to-br from-[#832388] to-[#FF0F7B] flex-shrink-0`}>{letter}</div>;
}

// ── SIDEBAR ───────────────────────────────────────────────
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

        {/* Header */}
        <div className={`h-16 flex items-center flex-shrink-0 border-b border-white/[0.07] ${w ? "px-3.5 justify-between" : "justify-center"}`}>
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[15px] font-black text-white bg-gradient-to-br from-[#832388] to-[#FF0F7B]">S</div>
            {w && <span className="text-[15px] font-black text-white whitespace-nowrap tracking-tight">SmartLMS<span className="text-[#FF0F7B]">Pro</span></span>}
          </Link>
          {!forceWide && (
            <button onClick={onToggle} className="w-7 h-7 rounded-md flex items-center justify-center bg-white/[0.08] text-white/55 hover:bg-white/15 transition-colors border-0 cursor-pointer flex-shrink-0">
              {w ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          )}
          {forceWide && (
            <button onClick={onMobileClose} className="w-7 h-7 rounded-md flex items-center justify-center bg-white/[0.08] text-white/60 hover:bg-white/15 border-0 cursor-pointer flex-shrink-0">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-1.5 [scrollbar-width:none]">
          {items.map(item => {
            const active = pathname === item.href || (!rootHrefs.includes(item.href) && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} title={!w ? item.label : undefined}
                className={`relative flex items-center mx-2 my-0.5 rounded-lg no-underline transition-colors duration-150
                  ${w ? "gap-3 px-3.5 py-2.5 justify-start" : "justify-center py-3"}
                  ${active
                    ? "bg-gradient-to-r from-[#83238888] to-[#FF0F7B44] text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
                  }`}
              >
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
      {/* Desktop sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 z-60 overflow-hidden transition-all duration-300 hidden md:block ${collapsed ? "w-[68px]" : "w-60"}`}>
        <NavContent />
      </aside>

      {/* Mobile */}
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

// ── TOP NAVBAR ────────────────────────────────────────────
function TopNavbar({ role, items, theme, toggleTheme, user, onLogout, onMobileMenu, collapsed }: {
  role: Role;
  items: { label: string; href: string; icon: React.ReactNode }[];
  theme: "dark" | "light"; toggleTheme: () => void;
  user: UserData | null; onLogout: () => void;
  onMobileMenu: () => void; collapsed: boolean;
}) {
  const pathname = usePathname();
  const [showUser,  setShowUser]  = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const userRef  = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const rm = roleMeta[role];

  const currentPage = items.find(i =>
    i.href === pathname || (!rootHrefs.includes(i.href) && pathname.startsWith(i.href))
  )?.label || "Dashboard";

  const notifications = [
    { id: 1, text: "New assignment submitted by Rahim", time: "2 min ago",   read: false },
    { id: 2, text: "Quiz Results are ready",            time: "1 hour ago",  read: false },
    { id: 3, text: "New student enrolled in Web Dev",   time: "3 hours ago", read: true  },
  ];
  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (userRef.current  && !userRef.current.contains(e.target as Node))  setShowUser(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className={`fixed top-0 right-0 h-16 z-50 flex items-center justify-between px-4 bg-base-100 border-b border-base-300 shadow-sm transition-all duration-300 max-md:left-0 ${collapsed ? "md:left-[68px]" : "md:left-60"}`}>

      {/* Left */}
      <div className="flex items-center gap-2">
        <button onClick={onMobileMenu} className="btn btn-ghost btn-sm btn-square cursor-pointer md:hidden">
          <Menu size={20} />
        </button>
        <div>
          <p className="m-0 text-[17px] font-bold text-base-content leading-tight">{currentPage}</p>
          <p className="m-0 text-[11px] text-base-content/40 leading-none capitalize">{role} Dashboard</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 flex-shrink-0">

        <button onClick={toggleTheme} className="btn btn-ghost btn-sm btn-square cursor-pointer" style={{ color: theme === "dark" ? "#facc15" : "#6b7280" }}>
          {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>

        {/* Bell */}
        <div ref={notifRef} className="relative">
          <button onClick={() => { setShowNotif(v => !v); setShowUser(false); }} className="btn btn-ghost btn-sm btn-square cursor-pointer relative">
            <Bell size={18} />
            {unread > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-white font-bold flex items-center justify-center text-[9px] bg-[#FF0F7B]">{unread}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-72 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-[200] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                <span className="text-sm font-bold text-base-content">Notifications</span>
                <span className="text-xs font-semibold cursor-pointer text-[#832388]">Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-base-300 cursor-pointer items-start hover:bg-base-200 transition-colors ${!n.read ? "bg-base-200/50" : ""}`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${n.read ? "bg-base-content/20" : "bg-[#FF0F7B]"}`} />
                  <div>
                    <p className={`text-[13px] leading-snug m-0 ${n.read ? "text-base-content/60" : "text-base-content font-semibold"}`}>{n.text}</p>
                    <p className="text-[11px] text-base-content/40 mt-0.5 m-0">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="py-2.5 text-center">
                <span className="text-xs font-semibold cursor-pointer text-[#832388]">View all →</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-base-300 mx-1" />

        {/* User dropdown */}
        <div ref={userRef} className="relative">
          <button onClick={() => { setShowUser(v => !v); setShowNotif(false); }} className="btn btn-ghost btn-sm h-auto py-1.5 px-2 rounded-xl cursor-pointer flex items-center gap-2">
            <Avatar user={user} sm />
            <div className="text-left hidden sm:block">
              <p className="m-0 text-[13px] font-semibold text-base-content leading-tight max-w-[80px] truncate">{user?.name?.split(" ")[0] || "User"}</p>
              <p className="m-0 text-[10px] font-bold uppercase tracking-wide" style={{ color: rm.color }}>{role}</p>
            </div>
            <ChevronRight size={11} className="opacity-40 rotate-90 hidden sm:block" />
          </button>

          {showUser && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-56 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-[200] overflow-hidden">
              <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-base-300">
                <Avatar user={user} />
                <div className="min-w-0">
                  <p className="m-0 text-sm font-bold text-base-content truncate">{user?.name || "User"}</p>
                  <p className="m-0 text-[11px] text-base-content/40 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="px-4 py-2.5 border-b border-base-300">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide" style={{ color: rm.color, background: `${rm.color}22`, border: `1px solid ${rm.color}33` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: rm.color }} />
                  {rm.label}
                </span>
              </div>
              <Link href="/sampleDashboard/profile" onClick={() => setShowUser(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-base-content border-b border-base-300 hover:bg-base-200 transition-colors no-underline">
                <User size={14} className="opacity-50" /> My Profile
              </Link>
              <Link href="/sampleDashboard/settings" onClick={() => setShowUser(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-base-content border-b border-base-300 hover:bg-base-200 transition-colors no-underline">
                <Settings size={14} className="opacity-50" /> Settings
              </Link>
              <button onClick={() => { setShowUser(false); onLogout(); }} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13.5px] font-semibold bg-transparent border-none cursor-pointer hover:bg-base-200 transition-colors text-[#FF0F7B]">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ── PAGE LOADER ───────────────────────────────────────────
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
      <span className="loading loading-spinner loading-lg text-[#832388]" />
      <p className="text-sm text-base-content/40 font-medium m-0">Loading...</p>
    </div>
  );
  return <>{children}</>;
}

// ── ROOT LAYOUT ───────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role,       setRole]       = useState<Role>("student");
  const [theme,      setTheme]      = useState<"dark" | "light">("light");
  const [user,       setUser]       = useState<UserData | null>(null);
  const [isLoading,  setIsLoading]  = useState(true);
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const t = (localStorage.getItem("theme") || "light") as "dark" | "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    const raw = localStorage.getItem("user");
    if (!raw) { window.location.href = "/login"; return; }
    try {
      const parsed: UserData = JSON.parse(raw);
      setUser(parsed);
      setRole(["student", "instructor", "admin"].includes(parsed.role) ? parsed.role : "student");
    } catch { window.location.href = "/login"; return; }
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-base-200" data-theme={theme}>
      <span className="loading loading-spinner loading-lg text-[#832388]" />
    </div>
  );

  const items = menus[role];

  return (
    <div className="bg-base-200 min-h-screen" data-theme={theme}>
      <Sidebar
        items={items}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <TopNavbar
        role={role} items={items}
        theme={theme} toggleTheme={toggleTheme}
        user={user} onLogout={handleLogout}
        onMobileMenu={() => setMobileOpen(true)}
        collapsed={collapsed}
      />
      <main className={`bg-base-200 min-h-screen pt-16 transition-all duration-300 ${collapsed ? "md:pl-[68px]" : "md:pl-60"}`}>
        <div className="p-6">
          <PageLoader>{children}</PageLoader>
        </div>
      </main>
    </div>
  );
}