"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

type Role = "student" | "instructor" | "admin";

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  role: string;
}

// ─── Menu Config ─────────────────────────────────────────────────────────────
const menus: Record<Role, { label: string; href: string }[]> = {
  student: [
    { label: "Dashboard",    href: "/sampleDashboard/student" },
    { label: "Profile",      href: "/sampleDashboard/profile" },
    { label: "Courses",      href: "/sampleDashboard/student/courses" },
    { label: "Assignments",  href: "/sampleDashboard/student/assignments" },
    { label: "Quiz",         href: "/sampleDashboard/student/quiz" },
    { label: "Certificates", href: "/sampleDashboard/student/certificates" },
    { label: "Messages",     href: "/sampleDashboard/messages" },
    { label: "Settings",     href: "/sampleDashboard/settings" },
  ],
  instructor: [
    { label: "Dashboard",    href: "/sampleDashboard/instructor" },
    { label: "Profile",      href: "/sampleDashboard/profile" },
    { label: "Courses",      href: "/sampleDashboard/instructor/courses" },
    { label: "Announcements",href: "/sampleDashboard/instructor/announcements" },
    { label: "Assignments",  href: "/sampleDashboard/instructor/assignments" },
    { label: "Students",     href: "/sampleDashboard/instructor/students" },
    { label: "Quiz",         href: "/sampleDashboard/instructor/quiz" },
    { label: "Quiz Results", href: "/sampleDashboard/instructor/quiz-results" },
    { label: "Earnings",     href: "/sampleDashboard/instructor/earnings" },
    { label: "Messages",     href: "/sampleDashboard/messages" },
    { label: "Settings",     href: "/sampleDashboard/settings" },
  ],
  admin: [
    { label: "Dashboard",    href: "/sampleDashboard/admin" },
    { label: "Profile",      href: "/sampleDashboard/profile" },
    { label: "Courses",      href: "/sampleDashboard/admin/courses" },
    { label: "Users",        href: "/sampleDashboard/admin/users" },
    { label: "Announcements",href: "/sampleDashboard/admin/announcements" },
    { label: "Earnings",     href: "/sampleDashboard/admin/earnings" },
    { label: "Messages",     href: "/sampleDashboard/messages" },
    { label: "Settings",     href: "/sampleDashboard/settings" },
  ],
};

const roleHome: Record<Role, string> = {
  student:    "/sampleDashboard/student",
  instructor: "/sampleDashboard/instructor",
  admin:      "/sampleDashboard/admin",
};

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const colors = {
  dark: {
    navBg:             "#1A1A1A",
    navBorder:         "#2a2a2a",
    navText:           "#f0f0f0",
    dropBg:            "#1A1A1A",
    dropBorder:        "#2a2a2a",
    dropText:          "#f0f0f0",
    dropSubText:       "#aaa",
    badgeBg:           "#2a2a2a",
    badgeText:         "#ccc",
    notifUnread:       "#2a1520",
    mainBg:            "#111111",
    sidebarBg:         "#1A1A1A",
    sidebarBorder:     "#2a2a2a",
    sidebarRoleBg:     "#2a2a2a",
    sidebarRoleBorder: "#3a3a3a",
    sidebarItemActive: "#2a2a2a",
    sidebarItemBorder: "#3a3a3a",
  },
  light: {
    navBg:             "#ffffff",
    navBorder:         "#e5e5e5",
    navText:           "#1a1a1a",
    dropBg:            "#ffffff",
    dropBorder:        "#e5e5e5",
    dropText:          "#333",
    dropSubText:       "#999",
    badgeBg:           "#f0f0f0",
    badgeText:         "#555",
    notifUnread:       "#fff8fb",
    mainBg:            "#f5f5f5",
    sidebarBg:         "#1a1a1a",
    sidebarBorder:     "#333",
    sidebarRoleBg:     "#2a2a2a",
    sidebarRoleBorder: "#3a3a3a",
    sidebarItemActive: "#333",
    sidebarItemBorder: "#3a3a3a",
  },
};

// ─── Top Navbar ──────────────────────────────────────────────────────────────
function TopNavbar({ role, items, theme, toggleTheme, user, onLogout }: {
  role: Role;
  items: { label: string; href: string }[];
  theme: "dark" | "light";
  toggleTheme: () => void;
  user: UserData | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const c = colors[theme];

  const currentPage = items.find((item) => item.href === pathname)?.label || "Dashboard";

  // user এর নাম বা email এর প্রথম অক্ষর
  const firstLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "?";

  const notifications = [
    { id: 1, text: "New assignment submitted by Rahim", time: "2 min ago", read: false },
    { id: 2, text: "Quiz Results are ready", time: "1 hour ago", read: false },
    { id: 3, text: "New student enrolled in Web Dev", time: "3 hours ago", read: true },
  ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header style={{
      height: "64px",
      background: c.navBg,
      borderBottom: `1px solid ${c.navBorder}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>

      {/* Page Title */}
      <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: c.navText }}>
        {currentPage}
      </h1>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

        {/* Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: "4px", display: "flex", alignItems: "center" }}
        >
          {theme === "dark"
            ? <FaSun style={{ color: "#facc15" }} />
            : <FaMoon style={{ color: "#6b7280" }} />
          }
        </button>

        {/* Notification Bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setShowUserMenu(false); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", position: "relative", padding: "4px" }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-2px", right: "-2px",
                background: "#FF0F7B", color: "#fff",
                fontSize: "10px", fontWeight: "700", borderRadius: "50%",
                width: "16px", height: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: "300px", background: c.dropBg,
              border: `1px solid ${c.dropBorder}`, borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 200, overflow: "hidden",
            }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${c.dropBorder}`, fontWeight: "700", fontSize: "14px", color: c.dropText }}>
                Notifications
              </div>
              {notifications.map((n) => (
                <div key={n.id} style={{
                  padding: "12px 16px", borderBottom: `1px solid ${c.dropBorder}`,
                  background: n.read ? c.dropBg : c.notifUnread,
                  display: "flex", gap: "10px", alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "18px" }}>{n.read ? "🔔" : "🔴"}</span>
                  <div>
                    <div style={{ fontSize: "13px", color: c.dropText, fontWeight: n.read ? "400" : "600" }}>{n.text}</div>
                    <div style={{ fontSize: "11px", color: c.dropSubText, marginTop: "2px" }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setNotifOpen(false); }}
            style={{
              background: "none", border: "2px solid #e5e5e5", borderRadius: "50%",
              cursor: "pointer", padding: 0, width: "38px", height: "38px", overflow: "hidden",
            }}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                background: "linear-gradient(135deg, #FF0F7B, #F89B29)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: "700", fontSize: "16px",
              }}>
                {firstLetter}
              </div>
            )}
          </button>

          {showUserMenu && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: "220px", background: c.dropBg,
              border: `1px solid ${c.dropBorder}`, borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 200, overflow: "hidden",
            }}>
              {/* User Info */}
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${c.dropBorder}` }}>
                <div style={{ fontWeight: "700", fontSize: "14px", color: c.dropText }}>
                  {user?.name || "User"}
                </div>
                <div style={{ fontSize: "12px", color: c.dropSubText, marginTop: "2px" }}>
                  {user?.email || ""}
                </div>
                <div style={{
                  display: "inline-block", marginTop: "6px", padding: "2px 10px",
                  background: c.badgeBg, borderRadius: "20px",
                  fontSize: "11px", fontWeight: "600", textTransform: "uppercase", color: c.badgeText,
                }}>
                  {role}
                </div>
              </div>
              <Link href="/sampleDashboard/profile" onClick={() => setShowUserMenu(false)}
                style={{ display: "block", padding: "11px 16px", fontSize: "14px", color: c.dropText, textDecoration: "none", borderBottom: `1px solid ${c.dropBorder}` }}>
                👤 My Profile
              </Link>
              <Link href="/sampleDashboard/settings" onClick={() => setShowUserMenu(false)}
                style={{ display: "block", padding: "11px 16px", fontSize: "14px", color: c.dropText, textDecoration: "none", borderBottom: `1px solid ${c.dropBorder}` }}>
                ⚙️ Settings
              </Link>
              {/* ── Logout ── */}
              <button
                onClick={() => { setShowUserMenu(false); onLogout(); }}
                style={{
                  display: "block", width: "100%", padding: "11px 16px",
                  fontSize: "14px", color: "#FF0F7B", background: "none",
                  border: "none", textAlign: "left", cursor: "pointer", fontWeight: "600",
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ role, setRole, items, theme }: {
  role: Role;
  setRole: (r: Role) => void;
  items: { label: string; href: string }[];
  theme: "dark" | "light";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const roles: Role[] = ["student", "instructor", "admin"];
  const c = colors[theme];

  return (
    <aside style={{
      width: "220px",
      minHeight: "100vh",
      background: c.sidebarBg,
      padding: "20px 0",
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{
        padding: "0 20px 20px",
        borderBottom: `1px solid ${c.sidebarBorder}`,
        marginBottom: "10px",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "18px",
      }}>
        <Link href={"/"} style={{ color: "#fff", textDecoration: "none" }}>
          Smartlms-Pro
        </Link>
      </div>

      {/* Role Dropdown */}
      <div style={{ position: "relative", padding: "8px 20px", marginBottom: "10px" }}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            background: c.sidebarRoleBg, border: `1px solid ${c.sidebarRoleBorder}`,
            borderRadius: "6px", padding: "7px 12px", color: "#fff",
            fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer",
          }}
        >
          <span>{role}</span>
          <span style={{ fontSize: "10px" }}>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div style={{
            position: "absolute", top: "100%", left: "20px", right: "20px",
            background: c.sidebarRoleBg, border: `1px solid ${c.sidebarRoleBorder}`,
            borderRadius: "6px", zIndex: 100, overflow: "hidden",
          }}>
            {roles.map((r) => (
              <Link
                key={r}
                href={roleHome[r]}
                onClick={() => { setRole(r); setOpen(false); }}
                style={{
                  display: "block", padding: "9px 12px",
                  color: r === role ? "#4ade80" : "#ccc",
                  fontSize: "13px", textDecoration: "none",
                  background: r === role ? c.sidebarItemActive : "transparent",
                  borderBottom: `1px solid ${c.sidebarItemBorder}`,
                  textTransform: "capitalize",
                }}
              >
                {r === role ? "✓ " : "  "}{r}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block", padding: "10px 20px",
                color: isActive ? "#fff" : "#aaa",
                background: isActive ? c.sidebarItemActive : "transparent",
                textDecoration: "none", fontSize: "14px",
                borderLeft: isActive ? "3px solid #4ade80" : "3px solid transparent",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [user, setUser] = useState<UserData | null>(null);
  const items = menus[role];

  useEffect(() => {
    // theme load
    const savedTheme = (localStorage.getItem("theme") || "light") as "dark" | "light";
    setTheme(savedTheme);

    // user load — Navbar এর মতো same key "user"
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed: UserData = JSON.parse(savedUser);
      setUser(parsed);
      // user এর role অনুযায়ী sidebar set করো
      if (parsed.role === "student" || parsed.role === "instructor" || parsed.role === "admin") {
        setRole(parsed.role as Role);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next); // Navbar এর মতো same key
  };

  // ── Logout — Navbar এর মতো same logic ──
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role={role} setRole={setRole} items={items} theme={theme} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopNavbar
          role={role}
          items={items}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onLogout={handleLogout}
        />
        <main style={{ flex: 1, padding: "30px", background: colors[theme].mainBg }}>
          {children}
        </main>
      </div>
    </div>
  );
}