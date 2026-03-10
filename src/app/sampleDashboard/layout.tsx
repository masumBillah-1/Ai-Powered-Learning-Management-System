"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

type Role = "student" | "instructor" | "admin";
interface UserData { name: string; email: string; photoURL?: string; role: Role; }

const Icon = {
  Dashboard:     () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Profile:       () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Courses:       () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Assignments:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Quiz:          () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Certificates:  () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Messages:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Settings:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Announcements: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.18 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Students:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  QuizResults:   () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Earnings:      () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Users:         () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  ChevronLeft:   () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight:  () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  Menu:          () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Bell:          () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Logout:        () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const menus: Record<Role, { label: string; href: string; icon: keyof typeof Icon }[]> = {
  student: [
    { label: "Dashboard",    href: "/sampleDashboard/student",              icon: "Dashboard"    },
    { label: "Profile",      href: "/sampleDashboard/profile",              icon: "Profile"      },
    { label: "Courses",      href: "/sampleDashboard/student/courses",      icon: "Courses"      },
    { label: "Assignments",  href: "/sampleDashboard/student/assignments",  icon: "Assignments"  },
    { label: "Quiz",         href: "/sampleDashboard/student/quiz",         icon: "Quiz"         },
    { label: "Certificates", href: "/sampleDashboard/student/certificates", icon: "Certificates" },
    { label: "Messages",     href: "/sampleDashboard/messages",             icon: "Messages"     },
    { label: "Settings",     href: "/sampleDashboard/settings",             icon: "Settings"     },
  ],
  instructor: [
    { label: "Dashboard",     href: "/sampleDashboard/instructor",               icon: "Dashboard"     },
    { label: "Profile",       href: "/sampleDashboard/profile",                  icon: "Profile"       },
    { label: "Courses",       href: "/sampleDashboard/instructor/courses",        icon: "Courses"       },
    { label: "Announcements", href: "/sampleDashboard/instructor/announcements",  icon: "Announcements" },
    { label: "Assignments",   href: "/sampleDashboard/instructor/assignments",    icon: "Assignments"   },
    { label: "Students",      href: "/sampleDashboard/instructor/students",       icon: "Students"      },
    { label: "Quiz",          href: "/sampleDashboard/instructor/quiz",           icon: "Quiz"          },
    { label: "Quiz Results",  href: "/sampleDashboard/instructor/quiz-results",   icon: "QuizResults"   },
    { label: "Earnings",      href: "/sampleDashboard/instructor/earnings",       icon: "Earnings"      },
    { label: "Messages",      href: "/sampleDashboard/messages",                  icon: "Messages"      },
    { label: "Settings",      href: "/sampleDashboard/settings",                  icon: "Settings"      },
  ],
  admin: [
    { label: "Dashboard",     href: "/sampleDashboard/admin",               icon: "Dashboard"     },
    { label: "Profile",       href: "/sampleDashboard/profile",             icon: "Profile"       },
    { label: "Courses",       href: "/sampleDashboard/admin/courses",       icon: "Courses"       },
    { label: "Users",         href: "/sampleDashboard/admin/users",         icon: "Users"         },
    { label: "Announcements", href: "/sampleDashboard/admin/announcements", icon: "Announcements" },
    { label: "Earnings",      href: "/sampleDashboard/admin/earnings",      icon: "Earnings"      },
    { label: "Messages",      href: "/sampleDashboard/messages",            icon: "Messages"      },
    { label: "Settings",      href: "/sampleDashboard/settings",            icon: "Settings"      },
  ],
};

const roleMeta: Record<Role, { color: string; bg: string; label: string }> = {
  student:    { color: "#00C48C", bg: "rgba(0,196,140,0.15)",  label: "Student"    },
  instructor: { color: "#F89B29", bg: "rgba(248,155,41,0.15)", label: "Instructor" },
  admin:      { color: "#FF0F7B", bg: "rgba(255,15,123,0.15)", label: "Admin"      },
};

const rootHrefs = ["/sampleDashboard/instructor", "/sampleDashboard/student", "/sampleDashboard/admin"];

// SIDEBAR — design same, only position:fixed added
function Sidebar({ role, items, collapsed, onToggle, mobileOpen, onMobileClose }: {
  role: Role; items: typeof menus.student;
  collapsed: boolean; onToggle: () => void;
  mobileOpen: boolean; onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const rm = roleMeta[role];
  const sideW = collapsed ? 68 : 240;

  const SideContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const expand = !collapsed || isMobile;
    return (
      <div style={{
        width: isMobile ? 240 : sideW, height: "100%",
        display: "flex", flexDirection: "column",
        background: "linear-gradient(180deg,#1a1a2e 0%,#16213e 55%,#0f3460 100%)",
        overflow: "hidden", transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
      }}>
        <div style={{
          height: 64, display: "flex", alignItems: "center", flexShrink: 0,
          padding: expand ? "0 14px" : "0",
          justifyContent: expand ? "space-between" : "center",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          {expand ? (
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: "linear-gradient(135deg,#832388,#FF0F7B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff" }}>S</div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>SmartLMS<span style={{ color: "#FF0F7B" }}>Pro</span></span>
            </Link>
          ) : (
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#832388,#FF0F7B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#fff" }}>S</div>
            </Link>
          )}
          {!isMobile && (
            <button onClick={onToggle} style={{ background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", width: 26, height: 26, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.55)" }}>
              {collapsed ? <Icon.ChevronRight /> : <Icon.ChevronLeft />}
            </button>
          )}
          {isMobile && (
            <button onClick={onMobileClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", fontSize: 16 }}>✕</button>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "6px 0", scrollbarWidth: "none" }}>
          {items.map(item => {
            const isActive = pathname === item.href || (!rootHrefs.includes(item.href) && pathname.startsWith(item.href));
            const IC = Icon[item.icon];
            return (
              <Link key={item.href} href={item.href} title={!expand ? item.label : undefined}
                style={{ display: "flex", alignItems: "center", gap: expand ? 11 : 0, padding: expand ? "10px 14px" : "11px 0", justifyContent: expand ? "flex-start" : "center", margin: "1px 8px", borderRadius: 8, textDecoration: "none", position: "relative", transition: "background 0.15s", background: isActive ? "linear-gradient(90deg,rgba(131,35,136,0.55),rgba(255,15,123,0.28))" : "transparent", color: isActive ? "#fff" : "rgba(255,255,255,0.48)" }}>
                {isActive && <div style={{ position: "absolute", left: 0, top: "18%", height: "64%", width: 3, borderRadius: "0 3px 3px 0", background: "linear-gradient(180deg,#832388,#FF0F7B)" }} />}
                <span style={{ flexShrink: 0, display: "flex", color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}><IC /></span>
                {expand && <span style={{ fontSize: 13.5, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {expand && (
          <div style={{ padding: "11px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.18)" }}>SmartLMS Pro v2.0</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ✅ position:fixed — scroll করলেও বামে আটকে থাকবে */}
      <aside className="lms-desk-sidebar" style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: sideW, zIndex: 60, transition: "width 0.25s cubic-bezier(.4,0,.2,1)", overflow: "hidden" }}>
        <SideContent />
      </aside>

      {mobileOpen && (
        <>
          <div onClick={onMobileClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, backdropFilter: "blur(2px)" }} />
          <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 101, boxShadow: "4px 0 30px rgba(0,0,0,0.4)" }}>
            <SideContent isMobile />
          </div>
        </>
      )}
      <style>{`@media(max-width:768px){.lms-desk-sidebar{display:none!important;}}`}</style>
    </>
  );
}

// NAVBAR — design same, only position:fixed added
function TopNavbar({ role, items, theme, toggleTheme, user, onLogout, onMobileMenu, sideW }: {
  role: Role; items: typeof menus.student; theme: "dark" | "light"; toggleTheme: () => void;
  user: UserData | null; onLogout: () => void; onMobileMenu: () => void; sideW: number;
}) {
  const pathname = usePathname();
  const [showUser,  setShowUser]  = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const userRef  = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const currentPage = items.find(i => i.href === pathname || (!rootHrefs.includes(i.href) && pathname.startsWith(i.href)))?.label || "Dashboard";
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";
  const rm = roleMeta[role];

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
    // ✅ position:fixed, left=sideW — scroll করলেও উপরে আটকে থাকবে
    <div className="bg-base-100 border-b border-base-300 shadow-sm lms-navbar"
      style={{ position: "fixed", top: 0, left: sideW, right: 0, height: 64, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", transition: "left 0.25s cubic-bezier(.4,0,.2,1)" }}>

      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onMobileMenu} className="btn btn-ghost btn-sm btn-square cursor-pointer lms-ham"><Icon.Menu /></button>
        <div>
          <h1 className="m-0 text-[17px] font-bold text-base-content leading-tight">{currentPage}</h1>
          <p className="m-0 text-[11px] text-base-content/40 leading-none capitalize">{role} Dashboard</p>
        </div>
      </div>

      {/* Right — flex-shrink:0 যাতে কখনো কাটা না যায় */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
        <button onClick={toggleTheme} className="btn btn-ghost btn-sm btn-square cursor-pointer" style={{ color: theme === "dark" ? "#facc15" : "#6b7280" }}>
          {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>

        <div ref={notifRef} className="relative">
          <button onClick={() => { setShowNotif(v => !v); setShowUser(false); }} className="btn btn-ghost btn-sm btn-square cursor-pointer relative">
            <Icon.Bell />
            {unread > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white font-bold" style={{ fontSize: 9, background: "#FF0F7B" }}>{unread}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-[300px] bg-base-100 border border-base-300 rounded-xl shadow-2xl z-[200] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                <span className="text-sm font-bold text-base-content">Notifications</span>
                <span className="text-xs font-semibold cursor-pointer" style={{ color: "#832388" }}>Mark all read</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-base-300 cursor-pointer items-start hover:bg-base-200 transition-colors ${!n.read ? "bg-base-200/50" : ""}`}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-[6px]" style={{ background: n.read ? "oklch(var(--bc)/0.2)" : "#FF0F7B" }} />
                  <div>
                    <p className={`text-[13px] leading-snug m-0 ${n.read ? "text-base-content/60" : "text-base-content font-semibold"}`}>{n.text}</p>
                    <p className="text-[11px] text-base-content/40 mt-0.5 m-0">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="py-2.5 text-center"><span className="text-xs font-semibold cursor-pointer" style={{ color: "#832388" }}>View all →</span></div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-base-300 mx-1" />

        <div ref={userRef} className="relative">
          <button onClick={() => { setShowUser(v => !v); setShowNotif(false); }} className="btn btn-ghost btn-sm px-2 h-auto py-1.5 rounded-xl cursor-pointer flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#832388,#FF0F7B)" }}>
              {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : firstLetter}
            </div>
            <div className="text-left lms-hide-xs">
              <div className="text-[13px] font-semibold text-base-content leading-tight max-w-[88px] truncate">{user?.name?.split(" ")[0] || "User"}</div>
              <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: rm.color }}>{role}</div>
            </div>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="lms-hide-xs opacity-40"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          {showUser && (
            <div className="absolute right-0 top-[calc(100%+6px)] w-[220px] bg-base-100 border border-base-300 rounded-xl shadow-2xl z-[200] overflow-hidden">
              <div className="px-4 py-3.5 border-b border-base-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg,#832388,#FF0F7B)" }}>
                    {user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : firstLetter}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-base-content truncate">{user?.name || "User"}</div>
                    <div className="text-[11px] text-base-content/40 truncate">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: rm.bg, border: `1px solid ${rm.color}30` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: rm.color, boxShadow: `0 0 5px ${rm.color}` }} />
                  <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: rm.color }}>{rm.label}</span>
                </div>
              </div>
              <Link href="/sampleDashboard/profile" onClick={() => setShowUser(false)} className="flex items-center px-4 py-2.5 text-[13.5px] text-base-content border-b border-base-300 hover:bg-base-200 transition-colors no-underline">My Profile</Link>
              <Link href="/sampleDashboard/settings" onClick={() => setShowUser(false)} className="flex items-center px-4 py-2.5 text-[13.5px] text-base-content border-b border-base-300 hover:bg-base-200 transition-colors no-underline">Settings</Link>
              <button onClick={() => { setShowUser(false); onLogout(); }} className="flex items-center gap-2 w-full px-4 py-2.5 text-[13.5px] font-semibold bg-transparent border-none cursor-pointer hover:bg-base-200 transition-colors text-left" style={{ color: "#FF0F7B" }}><Icon.Logout /> Logout</button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .lms-ham { display: none !important; }
        @media(max-width:768px) { .lms-ham { display: flex !important; } .lms-navbar { left: 0 !important; } }
        @media(max-width:480px) { .lms-hide-xs { display: none !important; } }
      `}</style>
    </div>
  );
}

function PageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, [pathname]);
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <span className="loading loading-spinner loading-lg" style={{ color: "#832388" }} />
      <p className="text-sm text-base-content/40 font-medium m-0">Loading...</p>
    </div>
  );
  return <>{children}</>;
}

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
      if (["student", "instructor", "admin"].includes(parsed.role)) setRole(parsed.role);
      else setRole("student");
    } catch { window.location.href = "/login"; return; }
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next); localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user"); localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-base-200" data-theme={theme}>
      <span className="loading loading-spinner loading-lg" style={{ color: "#832388" }} />
    </div>
  );

  const sideW = collapsed ? 68 : 240;
  const items  = menus[role];

  return (
    <div className="bg-base-200 min-h-screen" data-theme={theme}>
      <Sidebar role={role} items={items} collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopNavbar role={role} items={items} theme={theme} toggleTheme={toggleTheme} user={user} onLogout={handleLogout} onMobileMenu={() => setMobileOpen(true)} sideW={sideW} />

      {/* paddingLeft=sidebar, paddingTop=navbar(64px) — content কখনো এদের নিচে যাবে না */}
      <main className="bg-base-200 lms-main" style={{ paddingLeft: sideW, paddingTop: 64, minHeight: "100vh", transition: "padding-left 0.25s cubic-bezier(.4,0,.2,1)" }}>
        <div className="p-6">
          <PageLoader>{children}</PageLoader>
        </div>
      </main>

      <style>{`@media(max-width:768px){.lms-main{padding-left:0!important;}}`}</style>
    </div>
  );
}