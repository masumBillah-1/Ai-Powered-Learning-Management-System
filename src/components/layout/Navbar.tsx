"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaThLarge,
  FaUser,
  FaSignOutAlt,
  FaChevronRight,
} from "react-icons/fa";
import Logo from "./Logo";

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  role: string;
}

function getStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredTheme(): string {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("theme") || "light";
}

const Navbar = () => {
  // ✅ null দিয়ে শুরু — server/client hydration mismatch এড়াতে
  const [user, setUser] = useState<UserData | null>(null);
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Mount এ সব client-side data একবার load করো
  useEffect(() => {
    setMounted(true);

    // Theme set করো
    const savedTheme = getStoredTheme();
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // ✅ KEY FIX: httpOnly cookie JS দিয়ে read হয় না — তাই আগের
    // hasTokenCookie() সবসময় false return করত এবং localStorage clear করত।
    // Solution: শুধু localStorage token check করো।
    // Real security guard = middleware (server-side httpOnly cookie check)।
    const token = localStorage.getItem("token");
    if (token) {
      setUser(getStoredUser());
    }
  }, []);

  // ✅ অন্য tab এ logout/login হলে sync করো
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") {
        if (!e.newValue) {
          setUser(null);
        } else {
          setUser(getStoredUser());
        }
      }
      if (e.key === "user") {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ✅ Tab focus এ token check — অন্য tab logout হলে এই tab ও sync
  useEffect(() => {
    if (!mounted) return;
    const onFocus = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
      } else {
        setUser(getStoredUser());
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [mounted]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowMenu(false);
    setIsOpen(false);
    window.location.href = "/login";
  };

  const firstLetter =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "?";

  const AvatarImage = () =>
    user?.photoURL ? (
      <img
        src={user.photoURL}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg bg-gradient-to-br from-[#832388] to-[#F0772F]">
        {firstLetter}
      </div>
    );

  const navLinks = [
    { name: "Course Details", href: "/courses" },
    { name: "Student Feedback", href: "/feedback" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  // ✅ Hydration fix: mounted হওয়ার আগে minimal navbar দেখাও
  if (!mounted) {
    return (
      <nav className="bg-[var(--nav-bg)] border-b border-[var(--border-color)] sticky top-0 z-[100] shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">
            <Logo />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes navLinkFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoPopIn {
          0%   { opacity: 0; transform: scale(0.8) rotate(-4deg); }
          70%  { transform: scale(1.05) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes dropdownSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalZoomIn {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .nav-animate      { animation: navSlideDown 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .logo-animate     { animation: logoPopIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .nav-link-animate { animation: navLinkFadeIn 0.4s ease both; }
        .dropdown-animate { animation: dropdownSlide 0.22s cubic-bezier(0.22,1,0.36,1) both; }
        .drawer-animate   { animation: drawerSlideIn 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .overlay-animate  { animation: overlayFadeIn 0.3s ease both; }
        .modal-animate    { animation: modalZoomIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
        .nav-link-hover { position: relative; }
        .nav-link-hover::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #FF0F7B, #F89B29);
          border-radius: 99px;
          transition: width 0.28s cubic-bezier(0.22,1,0.36,1);
        }
        .nav-link-hover:hover::after { width: 100%; }
      `}</style>

      <nav
        className={`
          nav-animate
          bg-[var(--nav-bg)] border-b border-[var(--border-color)]
          sticky top-0 z-[100] transition-all duration-300
          ${scrolled
            ? "shadow-lg backdrop-blur-md bg-white/90 dark:bg-[#0b1120]/90"
            : "shadow-sm"
          }
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">

            <div className="logo-animate">
              <Logo />
            </div>

            {/* ── DESKTOP ── */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-7 font-bold text-[15px] text-gray-700 dark:text-gray-300">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="nav-link-hover hover:text-[#C81D77] transition-colors nav-link-animate"
                    style={{ animationDelay: `${0.15 + i * 0.07}s` }}
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <Link href="/myclasses" className="nav-link-hover hover:text-[#C81D77] transition-colors nav-link-animate" style={{ animationDelay: "0.43s" }}>
                    My Classes
                  </Link>
                )}
                {user && (
                  <Link href="/help" className="nav-link-hover hover:text-[#C81D77] transition-colors nav-link-animate" style={{ animationDelay: "0.50s" }}>
                    Helpdesk
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-5 border-l border-gray-200 dark:border-gray-700 pl-6 nav-link-animate" style={{ animationDelay: "0.55s" }}>
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-purple-500 dark:text-sky-400 hover:scale-110 hover:rotate-12 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
                </button>

                {!user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href="/login"
                      className="bg-[#2D2D2D] hover:bg-gray-50 transition-all border-2 border-transparent hover:border-[#FF0F7B] hover:text-[#FF0F7B] dark:bg-gray-700 text-white px-7 py-2.5 rounded-xl font-bold text-sm"
                    >
                      Login
                    </Link>
                    <button
                      onClick={() => setIsEnrollModalOpen(true)}
                      style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                      className="text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md hover:scale-105 hover:shadow-pink-300/40 hover:shadow-lg transition-all duration-200"
                    >
                      Enroll Now
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsEnrollModalOpen(true)}
                      style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                      className="hidden xl:block text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-lg hover:scale-105 hover:shadow-pink-300/40 transition-all duration-200"
                    >
                      Enroll Now
                    </button>

                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="flex items-center cursor-pointer p-0.5 rounded-full border-2 border-[#6710C2] hover:scale-105 hover:border-[#FF0F7B] transition-all duration-200"
                      >
                        <AvatarImage />
                      </button>

                      {showMenu && (
                        <div className="dropdown-animate absolute right-0 mt-3 w-64 bg-white dark:bg-[#161d2f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-700">
                            <AvatarImage />
                            <div className="min-w-0">
                              <p className="m-0 text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                              <p className="m-0 text-[11px] text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide bg-[#FF0F7B22] border border-[#FF0F7B33] text-[#FF0F7B]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0F7B] animate-pulse" />
                              {user.role}
                            </span>
                          </div>
                          {/* My Profile */}
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline"
                            onClick={() => setShowMenu(false)}
                          >
                            <FaUser size={13} className="text-[#6710C2] opacity-70" /> My Profile
                          </Link>
                          {/* Dashboard — role অনুযায়ী link */}
                          <Link
                            href={
                              user.role === "admin"
                                ? "/dashboard/admin"
                                : user.role === "instructor"
                                ? "/dashboard/instructor"
                                : "/dashboard/student"
                            }
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline"
                            onClick={() => setShowMenu(false)}
                          >
                            <FaThLarge size={13} className="text-[#6710C2] opacity-70" />
                            {user.role === "admin"
                              ? "Admin Dashboard"
                              : user.role === "instructor"
                              ? "Instructor Dashboard"
                              : "Student Dashboard"}
                          </Link>
                          {/* Settings */}
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors no-underline"
                            onClick={() => setShowMenu(false)}
                          >
                            <FaThLarge size={13} className="text-[#6710C2] opacity-70" /> Settings
                          </Link>
                          {/* Logout */}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13.5px] font-semibold text-[#FF0F7B] bg-transparent border-none cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                          >
                            <FaSignOutAlt size={13} /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── MOBILE ── */}
            <div className="lg:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:scale-110 transition-transform"
                aria-label="Toggle theme"
              >
                {theme === "dark"
                  ? <FaSun size={20} className="text-yellow-500" />
                  : <FaMoon size={20} className="text-gray-600" />
                }
              </button>
              {user && (
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-0.5 rounded-full border-2 border-[#6710C2] hover:scale-105 transition-transform"
                >
                  <AvatarImage />
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-800 dark:text-white p-2 hover:scale-110 transition-transform"
              >
                {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        {isOpen && (
          <>
            <div
              className="overlay-animate fixed inset-0 bg-black/50 backdrop-blur-sm z-[101] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <div className="drawer-animate fixed top-0 right-0 h-full w-[80%] max-w-[350px] bg-white dark:bg-[#0b1120] shadow-2xl z-[102] lg:hidden">
              <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <Logo />
                  <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                    <FaTimes size={24} />
                  </button>
                </div>

                {user && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4">
                    <AvatarImage />
                    <div className="flex flex-col leading-tight overflow-hidden">
                      <span className="font-bold text-gray-800 dark:text-white text-sm truncate">{user.name}</span>
                      <span className="text-xs text-gray-400 truncate">{user.email}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-1 flex-grow overflow-y-auto">
                  {navLinks.map((link, i) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold transition-colors"
                      style={{ animationDelay: `${i * 0.05}s` }}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                      <FaChevronRight size={12} className="text-gray-400" />
                    </Link>
                  ))}
                  {user && (
                    <Link
                      href="/myclasses"
                      className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Classes <FaChevronRight size={12} />
                    </Link>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                  {user ? (
                    <>
                      <Link
                        href={`/dashboard/${user.role}`}
                        className="flex items-center justify-center gap-2 w-full bg-[#f3f4f6] dark:bg-gray-800 text-gray-800 dark:text-white py-4 rounded-2xl font-bold"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaThLarge /> Dashboard
                      </Link>
                      <button
                        onClick={() => { setIsOpen(false); setIsEnrollModalOpen(true); }}
                        style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                        className="w-full text-white py-4 rounded-2xl font-bold shadow-lg hover:scale-[1.02] transition-transform"
                      >
                        Enroll Now
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-red-600 font-bold py-2 flex items-center justify-center gap-2"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block text-center w-full bg-[#2D2D2D] dark:bg-gray-700 text-white py-4 rounded-2xl font-bold"
                        onClick={() => setIsOpen(false)}
                      >
                        Login
                      </Link>
                      <button
                        onClick={() => { setIsOpen(false); setIsEnrollModalOpen(true); }}
                        style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                        className="w-full text-white py-4 rounded-2xl font-bold shadow-lg"
                      >
                        Enroll Now
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* ── ENROLL MODAL ── */}
      {isEnrollModalOpen && (
        <div
          className="overlay-animate fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsEnrollModalOpen(false)}
        >
          <div
            className="modal-animate relative bg-white dark:bg-[#1a2236] w-full max-w-[480px] rounded-[32px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors z-10"
            >
              <FaTimes size={22} />
            </button>
            <div className="p-8 md:p-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl animate-bounce">🚀</span>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-tight mb-4">
                ৬ মাসে একজন প্রফেশনাল হওয়ার চ্যালেঞ্জ নিতে চাও?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">
                সঠিক গাইডলাইনে তোমার শেখার যাত্রা শুরু হোক আজই।
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 mb-8 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col gap-2 font-bold">
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-500">এনরোলমেন্ট শুরু:</span>
                    <span className="text-[#F89B29]">১ আগস্ট, ২০২৬</span>
                  </div>
                  <div className="h-[1px] bg-gray-200 dark:bg-gray-700 w-full" />
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-500">এনরোলমেন্ট শেষ:</span>
                    <span className="text-[#FF0F7B]">১৫ আগস্ট, ২০২৬</span>
                  </div>
                </div>
              </div>
              <Link href="/login" onClick={() => setIsEnrollModalOpen(false)}>
                <button
                  style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                  className="w-full py-4 rounded-xl text-white font-black text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Register Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;