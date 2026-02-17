


// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useTheme } from "next-themes";
// import { 
//   FaBars, 
//   FaTimes, 
//   FaSun, 
//   FaMoon, 
//   FaThLarge, 
//   FaUser, 
//   FaSignOutAlt, 
//   FaChevronRight,
//   FaBookOpen 
// } from "react-icons/fa";
// import Logo from "./Logo";

// const Navbar = () => {
//   const [mounted, setMounted] = useState(false);
//   const { theme, setTheme } = useTheme();
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(true); // Testing er jonno true rakha hoyeche
//   const [showMenu, setShowMenu] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (!mounted) return null;

//   const navLinks = [
//     { name: "Course Details", href: "/courses" },
//     { name: "Student Feedback", href: "/feedback" },
//     { name: "Blog", href: "/blog" },
//   ];

//   return (
//     <nav className="bg-[var(--nav-bg)] border-b border-[var(--border-color)] sticky top-0 z-[100] shadow-sm transition-all duration-300">
//       <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
//         <div className="flex justify-between items-center h-20">
          
//           <Logo />

//           {/* --- DESKTOP NAVIGATION --- */}
//           <div className="hidden lg:flex items-center space-x-8">
//             <div className="flex items-center space-x-7 font-bold text-[15px] text-gray-700 dark:text-gray-300">
//                {navLinks.map((link) => (
//                  <Link key={link.name} href={link.href} className="hover:text-[#C81D77] transition-colors">
//                    {link.name}
//                  </Link>
//                ))}
               
//                {/* --- MY CLASSES (Only visible if Logged In) --- */}
//                {isLoggedIn && (
//                  <Link 
//                    href="/dashboard/my-classes" 
//                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#C81D77] transition-colors"
//                  >
//                     My Classes
//                  </Link>
//                )}
//             </div>

//             <div className="flex items-center gap-5 border-l border-gray-200 dark:border-gray-700 pl-6">
              
//               <button 
//                 onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//                 className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-purple-500 dark:text-sky-400 hover:scale-110 transition-all"
//               >
//                 {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
//               </button>

//               {!isLoggedIn ? (
//                 <div className="flex items-center gap-4">
//                   <button className="bg-[#2D2D2D] hover:bg-gray-50 transition-all border-2 hover:border-[#FF0F7B] hover:text-[#FF0F7B] dark:bg-gray-700 text-white px-7 py-2.5 rounded-xl font-bold text-sm">Login</button>
//                   <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md">Enroll Now</button>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-4">
//                   <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="hidden xl:block text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-lg">Enroll Now</button>

//                   <div className="relative" ref={menuRef}>
//                     <button onClick={() => setShowMenu(!showMenu)} className="flex items-center p-0.5 rounded-full border-2 border-[#6710C2] hover:scale-105 transition-transform">
//                       <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" alt="User" className="w-10 h-10 rounded-full object-cover" />
//                     </button>

//                     {showMenu && (
//                       <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#161d2f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-3 z-50 animate-in fade-in zoom-in duration-200">
//                         <Link href="/dashboard" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold dark:text-gray-200"><FaThLarge className="text-[#6710C2]" /> Dashboard</Link>
//                         <Link href="/dashboard/my-profile" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold dark:text-gray-200"><FaUser className="text-[#6710C2]" /> My Profile</Link>
//                         <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-5 py-3 text-red-600 font-bold hover:bg-red-50 border-t dark:border-gray-700 mt-2"><FaSignOutAlt /> Logout</button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* --- MOBILE & TABLET CONTROLS --- */}
//           <div className="lg:hidden flex items-center gap-3">
//              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
//                 {theme === "dark" ? <FaSun size={20} className="text-yellow-500" /> : <FaMoon size={20} className="text-gray-600" />}
//              </button>
//              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-white p-2">
//                {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
//              </button>
//           </div>
//         </div>
//       </div>

//       {/* --- MOBILE NAVIGATION DRAWER --- */}
//       <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[101] lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsOpen(false)}>
//         <div 
//           className={`absolute top-0 right-0 h-full w-[80%] max-w-[350px] bg-white dark:bg-[#0b1120] shadow-2xl transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="p-6 flex flex-col h-full">
//             <div className="flex justify-between items-center mb-8">
//               <Logo />
//               <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500"><FaTimes size={24} /></button>
//             </div>

//             <div className="space-y-3 flex-grow overflow-y-auto">
//               {navLinks.map((link) => (
//                 <Link key={link.name} href={link.href} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold" onClick={() => setIsOpen(false)}>
//                   {link.name} <FaChevronRight size={12} className="text-gray-400" />
//                 </Link>
//               ))}
              
//               {/* --- MOBILE MY CLASSES --- */}
//               {isLoggedIn && (
//                 <Link 
//                   href="/dashboard/my-classes" 
//                   className="flex justify-between items-center p-4 rounded-xl bg-pink-50 dark:bg-pink-900/10 text-[#C81D77] dark:text-[#FF0F7B] font-bold"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <span className="flex items-center gap-2"><FaBookOpen /> My Classes</span>
//                   <FaChevronRight size={12} />
//                 </Link>
//               )}
//             </div>

//             <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
//                {isLoggedIn ? (
//                  <>
//                    <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full bg-[#f3f4f6] dark:bg-gray-800 text-gray-800 dark:text-white py-4 rounded-2xl font-bold" onClick={() => setIsOpen(false)}>
//                      <FaThLarge /> Dashboard
//                    </Link>
//                    <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="w-full text-white py-4 rounded-2xl font-bold shadow-lg">Enroll Now</button>
//                    <button onClick={() => {setIsLoggedIn(false); setIsOpen(false);}} className="w-full text-red-600 font-bold py-2">Logout</button>
//                  </>
//                ) : (
//                  <>
//                    <button className="w-full bg-[#2D2D2D] dark:bg-gray-700 text-white py-4 rounded-2xl font-bold">Login</button>
//                    <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="w-full text-white py-4 rounded-2xl font-bold shadow-lg">Enroll Now</button>
//                  </>
//                )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";
import React, { useState, useEffect, useRef } from "react";
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
  FaBookOpen 
} from "react-icons/fa";
import Logo from "./Logo";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
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

  const navLinks = [
    { name: "Course Details", href: "/courses" },
    { name: "Student Feedback", href: "/feedback" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav className="bg-[var(--nav-bg)] border-b border-[var(--border-color)] sticky top-0 z-[100] shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          <Logo />

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-7 font-bold text-[15px] text-gray-700 dark:text-gray-300">
               {navLinks.map((link) => (
                 <Link key={link.name} href={link.href} className="hover:text-[#C81D77] transition-colors">
                   {link.name}
                 </Link>
               ))}
               
               {isLoggedIn && (
                 <Link 
                   href="/dashboard/my-classes" 
                   className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-[#C81D77] transition-colors"
                 >
                    My Classes
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

              {!isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="bg-[#2D2D2D] hover:bg-gray-50 transition-all border-2 hover:border-[#FF0F7B] hover:text-[#FF0F7B] dark:bg-gray-700 text-white px-7 py-2.5 rounded-xl font-bold text-sm">Login</Link>
                  <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-md hover:scale-105 transition-all active:scale-95 animate-shimmer relative overflow-hidden group">Enroll Now</button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="hidden xl:block text-white px-8 py-2.5 rounded-xl font-extrabold text-sm shadow-lg hover:scale-105 transition-all active:scale-95 animate-shimmer relative overflow-hidden group">Enroll Now</button>

                  <div className="relative" ref={menuRef}>
                    <button onClick={() => setShowMenu(!showMenu)} className="flex items-center p-0.5 rounded-full border-2 border-[#6710C2] hover:scale-105 transition-transform">
                      <img src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" alt="User" className="w-10 h-10 rounded-full object-cover" />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-[#161d2f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-3 z-50 animate-in fade-in zoom-in duration-200">
                        <Link href="/dashboard" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold dark:text-gray-200 text-gray-700"><FaThLarge className="text-[#6710C2]" /> Dashboard</Link>
                        <Link href="/dashboard/my-profile" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold dark:text-gray-200 text-gray-700"><FaUser className="text-[#6710C2]" /> My Profile</Link>
                        <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-5 py-3 text-red-600 font-bold hover:bg-red-50 border-t dark:border-gray-700 mt-2"><FaSignOutAlt /> Logout</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- MOBILE & TABLET --- */}
          <div className="lg:hidden flex items-center gap-3">
             <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                {theme === "dark" ? <FaSun size={20} className="text-yellow-500" /> : <FaMoon size={20} className="text-gray-600" />}
             </button>
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-white p-2">
               {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
             </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[101] lg:hidden transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsOpen(false)}>
        <div 
          className={`absolute top-0 right-0 h-full w-[80%] max-w-[350px] bg-white dark:bg-[#0b1120] shadow-2xl transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <Logo />
              <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500"><FaTimes size={24} /></button>
            </div>

            <div className="space-y-3 flex-grow overflow-y-auto">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold" onClick={() => setIsOpen(false)}>
                  {link.name} <FaChevronRight size={12} className="text-gray-400" />
                </Link>
              ))}
              
              {isLoggedIn && (
                <Link 
                  href="/dashboard/my-classes" 
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex items-center gap-2"> My Classes</span>
                  <FaChevronRight size={12} />
                </Link>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
               {isLoggedIn ? (
                 <>
                   <Link href="/dashboard" className="flex items-center justify-center gap-2 w-full bg-[#f3f4f6] dark:bg-gray-800 text-gray-800 dark:text-white py-4 rounded-2xl font-bold" onClick={() => setIsOpen(false)}>
                     <FaThLarge /> Dashboard
                   </Link>
                   <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="w-full text-white py-4 rounded-2xl font-bold shadow-lg">Enroll Now</button>
                   <button onClick={() => {setIsLoggedIn(false); setIsOpen(false);}} className="w-full text-red-600 font-bold py-2">Logout</button>
                 </>
               ) : (
                 <>
                   <button className="w-full bg-[#2D2D2D] dark:bg-gray-700 text-white py-4 rounded-2xl font-bold">Login</button>
                   <button style={{ background: "linear-gradient(90deg, #FF0F7B, #F89B29)" }} className="w-full text-white py-4 rounded-2xl font-bold shadow-lg">Enroll Now</button>
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