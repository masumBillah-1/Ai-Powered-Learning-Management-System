"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaSun, FaMoon, FaThLarge, FaUser, FaSignOutAlt, FaChevronRight } from "react-icons/fa";
import Logo from "./Logo";

interface UserData { name: string; email: string; photoURL?: string; role: string; }

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try { const raw = localStorage.getItem("user"); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function getStoredTheme(): string {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
}

const Navbar = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    const token = localStorage.getItem("token");
    if (token) setUser(getStoredUser());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        const el = document.getElementById('mobile-sidebar-drawer') as HTMLInputElement;
        if (el) el.checked = false;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user"); localStorage.removeItem("token");
    setUser(null); setShowMenu(false);
    window.location.href = "/login";
  };

  const firstLetter = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";

  const AvatarImage = () => user?.photoURL ? (
    <img src={user.photoURL} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
  ) : (
    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
  );

  const navLinks = [
    { name: "Course Details", href: "/courses" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const closeSidebar = () => { const el = document.getElementById('mobile-sidebar-drawer') as HTMLInputElement; if (el) el.checked = false; };

  if (!mounted) return (
    <nav className="bg-[var(--nav-bg)] border-b border-[var(--border-color)] sticky top-0 z-[100] shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10"><div className="flex justify-between items-center h-20"><Logo /></div></div>
    </nav>
  );

  return (
    <>
      <div className="drawer drawer-end">
        <input id="mobile-sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <nav className={`bg-[var(--nav-bg)] border-b border-[var(--border-color)] fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${scrolled ? "shadow-lg backdrop-blur-md bg-white/95 dark:bg-[#0b1120]/95" : "shadow-sm"}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
              <div className="flex justify-between items-center h-20">
                <Logo />

                {/* Desktop */}
                <div className="hidden lg:flex items-center space-x-8">
                  <div className="flex items-center space-x-7 font-bold text-[15px] text-gray-700 dark:text-gray-300">
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.href} className="hover:text-[#C81D77] transition-colors">{link.name}</Link>
                    ))}
                    {user && (
                      <Link href={user.role === "instructor" ? "/dashboard/instructor/courses" : user.role === "admin" ? "/dashboard/admin/courses" : "/dashboard/student/courses"} className="hover:text-[#C81D77] transition-colors">
                        {user.role === "instructor" ? "My Courses" : user.role === "admin" ? "All Courses" : "My Classes"}
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-5 border-l border-gray-200 dark:border-gray-700 pl-6">
                    <button onClick={toggleTheme} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-purple-500 dark:text-sky-400">
                      {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
                    </button>

                    {!user ? (
                      <div className="flex items-center gap-4">
                        <Link href="/login" className="bg-[#2D2D2D] dark:bg-gray-700 text-white px-7 py-2.5 rounded-xl font-bold text-sm">Login</Link>
                        <button onClick={() => setIsEnrollModalOpen(true)} style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="text-white px-8 py-2.5 rounded-xl font-extrabold text-sm border-none cursor-pointer">Enroll Now</button>
                      </div>
                    ) : (
                      <div className="relative" ref={menuRef}>
                        <button onClick={() => setShowMenu(!showMenu)} className="flex items-center cursor-pointer p-0.5 rounded-full border-2 border-[#6710C2] bg-transparent">
                          <AvatarImage />
                        </button>

                        {/* ── COMPACT DROPDOWN ── */}
                        {showMenu && (
                          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#161d2f] rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[110]">

                            {/* Header — compact */}
                            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border border-purple-200 dark:border-purple-700">
                                  {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 0 }}>
                                  <p className="m-0 text-[12px] font-bold text-gray-900 dark:text-white truncate leading-[1.2]">{user.name}</p>
                                  <p className="m-0 text-[10px] text-gray-500 dark:text-gray-400 truncate leading-[1.2]">{user.email}</p>
                                  <span className="inline-flex items-center px-1 rounded text-[8px] font-bold uppercase tracking-wide bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] text-white leading-[1.4] w-fit">
                                    {user.role}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Links */}
                            <div className="py-1">
                              {[
                                { href: "/dashboard/profile", icon: <FaUser size={11} className="text-purple-500" />, label: "My Profile" },
                                {
                                  href: user.role === "admin" ? "/dashboard/admin" : user.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student",
                                  icon: <FaThLarge size={11} className="text-blue-500" />,
                                  label: user.role === "admin" ? "Admin Dashboard" : user.role === "instructor" ? "Instructor Dashboard" : "Student Dashboard"
                                },
                              ].map((item) => (
                                <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 transition-all no-underline" onClick={() => setShowMenu(false)}>
                                  {item.icon}{item.label}
                                </Link>
                              ))}
                              <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-3 py-2 text-[12px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-800 transition-all no-underline" onClick={() => setShowMenu(false)}>
                                <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Settings
                              </Link>
                            </div>

                            {/* Logout */}
                            <div className="border-t border-gray-100 dark:border-gray-700 py-1">
                              <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] font-semibold text-red-500 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border-none cursor-pointer">
                                <FaSignOutAlt size={11} /> Logout
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile */}
                <div className="lg:hidden flex items-center gap-3">
                  <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border-none cursor-pointer">
                    {theme === "dark" ? <FaSun size={18} className="text-yellow-500" /> : <FaMoon size={18} className="text-gray-600" />}
                  </button>
                  <label htmlFor="mobile-sidebar-drawer" className="drawer-button text-gray-800 dark:text-white p-2 cursor-pointer"><FaBars size={26} /></label>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar */}
        <div className="drawer-side z-[1000]">
          <label htmlFor="mobile-sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <div className="menu p-0 w-80 min-h-full bg-white dark:bg-[#0b1120] text-base-content flex flex-col">
            <div className="px-6 py-4">
              {user && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-gray-700 mb-3">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-200 dark:border-purple-700 flex-shrink-0">
                      {user?.photoURL ? <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-white text-2xl bg-gradient-to-br from-[#832388] to-[#F0772F]">{firstLetter}</div>}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                      <p className="m-0 font-bold text-gray-800 dark:text-white text-base truncate">{user.name}</p>
                      <p className="m-0 text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] text-white shadow-sm w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />{user.role}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold no-underline" onClick={closeSidebar}>
                    {link.name} <FaChevronRight size={12} className="text-gray-400" />
                  </Link>
                ))}
                {user && (
                  <>
                    <Link href={user.role === "instructor" ? "/dashboard/instructor/courses" : user.role === "admin" ? "/dashboard/admin/courses" : "/dashboard/student/courses"} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold no-underline" onClick={closeSidebar}>
                      {user.role === "instructor" ? "My Courses" : user.role === "admin" ? "All Courses" : "My Classes"} <FaChevronRight size={12} className="text-gray-400" />
                    </Link>
                    <Link href="/help" className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold no-underline" onClick={closeSidebar}>
                      Helpdesk <FaChevronRight size={12} className="text-gray-400" />
                    </Link>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-3" />
                    <Link href="/dashboard/profile" className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold no-underline" onClick={closeSidebar}><FaUser size={16} className="text-purple-500" /><span>My Profile</span></Link>
                    <Link href={user.role === "admin" ? "/dashboard/admin" : user.role === "instructor" ? "/dashboard/instructor" : "/dashboard/student"} className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold no-underline" onClick={closeSidebar}><FaThLarge size={16} className="text-blue-500" /><span>{user.role === "admin" ? "Admin Dashboard" : user.role === "instructor" ? "Instructor Dashboard" : "Student Dashboard"}</span></Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold no-underline" onClick={closeSidebar}>
                      <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span>Settings</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="mt-auto p-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
              {!user ? (
                <Link href="/login" className="block text-center w-full bg-[#2D2D2D] dark:bg-gray-700 text-white py-4 rounded-2xl font-bold no-underline" onClick={closeSidebar}>Login</Link>
              ) : (
                <button onClick={handleLogout} className="w-full text-red-600 font-bold py-2 bg-transparent border-none flex items-center justify-center gap-2 cursor-pointer"><FaSignOutAlt /> Logout</button>
              )}
              <button onClick={() => { setIsEnrollModalOpen(true); closeSidebar(); }} style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="w-full text-white py-4 rounded-2xl font-bold shadow-lg border-none cursor-pointer">Enroll Now</button>
            </div>
          </div>
        </div>
      </div>

      {/* Enroll Modal — unchanged */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsEnrollModalOpen(false)}>
          <div className="relative bg-white dark:bg-[#1a2236] w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsEnrollModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-red-500 border-none bg-transparent cursor-pointer z-10"><FaTimes size={22} /></button>
            <div className="p-8 md:p-10 text-center">
              <div className="flex justify-center mb-6"><div className="w-20 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center"><span className="text-4xl animate-bounce">🚀</span></div></div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-tight mb-4">৬ মাসে একজন প্রফেশনাল হওয়ার চ্যালেঞ্জ নিতে চাও?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">সঠিক গাইডলাইনে তোমার শেখার যাত্রা শুরু হোক আজই।</p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 mb-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col gap-2 font-bold text-gray-800 dark:text-white">
                  <div className="flex justify-between items-center text-sm md:text-base"><span className="text-gray-500">এনরোলমেন্ট শুরু:</span><span className="text-[#F89B29]">১ আগস্ট, ২০২৬</span></div>
                  <div className="h-[1px] bg-gray-200 dark:bg-gray-700 w-full" />
                  <div className="flex justify-between items-center text-sm md:text-base"><span className="text-gray-500">এনরোলমেন্ট শেষ:</span><span className="text-[#FF0F7B]">১৫ আগস্ট, ২০২৬</span></div>
                </div>
              </div>
              <Link href="/login" onClick={() => setIsEnrollModalOpen(false)}>
                <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="w-full py-4 rounded-xl text-white font-black text-lg shadow-lg border-none cursor-pointer">Register Now</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;