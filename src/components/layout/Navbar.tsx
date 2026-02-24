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


const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
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


  // ✅ Logout — API call করে cookie clear করে
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setShowMenu(false);
    setIsOpen(false);
    window.location.href = "/login";
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  if (!mounted) return null;


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


  return (
    <nav className="bg-[var(--nav-bg)] border-b border-[var(--border-color)] sticky top-0 z-[100] shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <Logo />


          {/* DESKTOP */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-7 font-bold text-[15px] text-gray-700 dark:text-gray-300">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-[#C81D77] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard/my-classes"
                  className="hover:text-[#C81D77] transition-colors"
                >
                  My Classes
                </Link>
              )}
              {user && (
                <Link
                  href="/help"
                  className="hover:text-[#C81D77] transition-colors"
                >
                  Helpdesk
                </Link>
              )}
            </div>


            <div className="flex items-center gap-5 border-l border-gray-200 dark:border-gray-700 pl-6">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-purple-500 dark:text-sky-400 hover:scale-110 transition-all"
              >
                {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>


              {!user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/login"
                    className="bg-[#2D2D2D] hover:bg-gray-50 transition-all border-2 hover:border-[#FF0F7B] hover:text-[#FF0F7B] dark:bg-gray-700 text-white px-7 py-2.5 rounded-xl font-bold text-sm"
                  >
                    Login
                  </Link>
                  <button
                    style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                    className="text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md hover:scale-105 transition-all"
                  >
                    Enroll Now
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                    className="hidden xl:block text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-lg hover:scale-105 transition-all"
                  >
                    Enroll Now
                  </button>


                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="flex items-center p-0.5 rounded-full border-2 border-[#6710C2] hover:scale-105 transition-transform"
                    >
                      <AvatarImage />
                    </button>


                    {showMenu && (
                      <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-[#161d2f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-3 z-50">
                        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                          <AvatarImage />
                          <div className="flex flex-col leading-tight overflow-hidden">
                            <span className="font-bold text-gray-800 dark:text-white text-sm truncate">
                              {user.name}
                            </span>
                            <span className="text-xs text-gray-400 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/${user.role}`}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold dark:text-gray-200 text-gray-700"
                          onClick={() => setShowMenu(false)}
                        >
                          <FaThLarge className="text-[#6710C2]" /> Dashboard
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold dark:text-gray-200 text-gray-700"
                          onClick={() => setShowMenu(false)}
                        >
                          <FaUser className="text-[#6710C2]" /> My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-5 py-3 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 border-t dark:border-gray-700 mt-2"
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* MOBILE */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              {theme === "dark" ? (
                <FaSun size={20} className="text-yellow-500" />
              ) : (
                <FaMoon size={20} className="text-gray-600" />
              )}
            </button>
            {user && (
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-0.5 rounded-full border-2 border-[#6710C2]"
              >
                <AvatarImage />
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 dark:text-white p-2"
            >
              {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
        </div>
      </div>


      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[101] lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-[350px] bg-white dark:bg-[#0b1120] shadow-2xl transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <Logo />
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500">
                <FaTimes size={24} />
              </button>
            </div>


            {user && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4">
                <AvatarImage />
                <div className="flex flex-col leading-tight overflow-hidden">
                  <span className="font-bold text-gray-800 dark:text-white text-sm truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-400 truncate">{user.email}</span>
                </div>
              </div>
            )}


            <div className="space-y-3 flex-grow overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name} <FaChevronRight size={12} className="text-gray-400" />
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard/my-classes"
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold"
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
                    style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }}
                    className="w-full text-white py-4 rounded-2xl font-bold shadow-lg"
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
                  >
                    Login
                  </Link>
                  <button
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
      </div>
    </nav>
  );
};


export default Navbar;









