

// "use client";
// import { useState, useEffect, useRef } from "react";
// import { 
//   FaSun, FaMoon, FaBell, FaSearch, FaChevronDown, 
//   FaUser, FaSignOutAlt, FaThLarge 
// } from "react-icons/fa";
// import Link from "next/link";

// const DashboardNavbar = () => {
//   const [mounted, setMounted] = useState(false);
//   const [theme, setTheme] = useState("light");
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const menuRef = useRef<HTMLDivElement>(null);

//   // 1. Initial Theme Load (Apnar logic onujayi)
//   useEffect(() => {
//     setMounted(true);
//     const savedTheme = localStorage.getItem("theme") || "light";
//     setTheme(savedTheme);
//     applyTheme(savedTheme);
//   }, []);

//   // 2. Theme apply korar function
//   const applyTheme = (currentTheme: string) => {
//     document.documentElement.setAttribute("data-theme", currentTheme);
//     if (currentTheme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   };

//   // 3. Toggle Theme
//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     applyTheme(newTheme);
//   };

//   // Close menu on click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <nav className="w-full bg-white dark:bg-[#0f172a] border-b border-gray-100 dark:border-gray-800 px-6 py-3 sticky top-0 z-40 transition-all duration-300">
//       <div className="flex items-center justify-between gap-4">
        
//         {/* --- Left: Search Bar --- */}
//         <div className="flex-1 max-w-md hidden md:block">
//           <div className="relative group">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
//             <input 
//               type="text" 
//               placeholder="Search dashboard..." 
//               className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 dark:text-gray-200 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
//             />
//           </div>
//         </div>

//         {/* --- Right Actions --- */}
//         <div className="flex items-center gap-2 md:gap-4">
          
//           {/* THEME TOGGLE (Same as your Main Navbar) */}
//           <button
//             onClick={toggleTheme}
//             className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-purple-600 dark:text-yellow-400 hover:scale-110 transition-all border border-transparent dark:border-gray-700"
//           >
//             {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
//           </button>

//           {/* Notifications */}
//           <button className="relative p-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
//             <FaBell size={18} />
//             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a]"></span>
//           </button>

//           <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-1"></div>

//           {/* Profile Dropdown */}
//           <div className="relative" ref={menuRef}>
//             <button 
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
//             >
//               <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center text-white font-bold shadow-sm">
//                 A
//               </div>
//               <div className="hidden lg:block text-left leading-tight">
//                 <p className="text-xs font-bold text-gray-800 dark:text-white">Admin User</p>
//                 <p className="text-[10px] text-gray-400 font-medium uppercase">Instructor</p>
//               </div>
//               <FaChevronDown size={12} className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
//             </button>

//             {/* Dropdown Menu */}
//             {showProfileMenu && (
//               <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#161d2f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
//                 <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
//                   <FaUser className="text-indigo-500" /> My Profile
//                 </Link>
//                 <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
//                   <FaThLarge className="text-indigo-500" /> Back to Home
//                 </Link>
//                 <div className="h-[1px] bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>
//                 <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
//                   <FaSignOutAlt /> Logout
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </nav>
//   );
// };

// export default DashboardNavbar;
"use client";
import { useState, useEffect, useRef } from "react";
import { 
  FaSun, FaMoon, FaBell, FaSearch, FaChevronDown, 
  FaUser, FaSignOutAlt, FaThLarge, FaCog, FaHistory
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  role: string;
}

const DashboardNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 1. Initial Load & Auth Sync
  useEffect(() => {
    setMounted(true);
    // Theme logic
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // User Data logic
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const applyTheme = (currentTheme: string) => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // --- Logout Functionality ---
  const handleLogout = () => {
    // 1. Clear LocalStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Jodi token thake
    
    // 2. Redirect to Login/Home
    router.push("/login"); 
    
    // 3. Refresh (Optional: to clear state across the app)
    // window.location.reload(); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="w-full bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 md:px-8 py-3 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        
        {/* --- Left: Search Bar (Enhanced) --- */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search lessons, analytics..." 
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100/50 dark:bg-gray-800/50 dark:text-gray-200 border border-transparent focus:border-purple-500/30 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-purple-500/5 transition-all"
            />
          </div>
        </div>

        {/* --- Right Actions --- */}
        <div className="flex items-center gap-3 md:gap-5">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-yellow-400 hover:rotate-12 transition-all active:scale-95 shadow-sm"
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* Notifications with Pulse Effect */}
          <button className="relative p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group">
            <FaBell size={18} className="group-hover:animate-ring" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#0f172a] animate-pulse"></span>
          </button>

          <div className="h-8 w-[1.5px] bg-gray-200 dark:bg-gray-800 mx-1 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1 pr-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              {/* Dynamic User Image */}
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                )}
              </div>
              
              <div className="hidden lg:block text-left leading-tight">
                <p className="text-sm font-black text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
                  {user?.name || "Instructor Name"}
                </p>
                <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest">
                  {user?.role || "Instructor"}
                </p>
              </div>
              <FaChevronDown size={10} className={`text-gray-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Premium Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-4 w-64 bg-white dark:bg-[#111827] rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                {/* Header Section */}
                <div className="px-5 py-4 bg-gray-50/50 dark:bg-gray-800/30 border-b dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user?.email || "user@example.com"}</p>
                </div>

                <div className="p-2">
                  <DropdownLink href="/dashboard/profile" icon={<FaUser />} label="My Profile" color="text-blue-500" />
                  <DropdownLink href="/dashboard/settings" icon={<FaCog />} label="Settings" color="text-gray-500" />
                  <DropdownLink href="/dashboard/history" icon={<FaHistory />} label="Activities" color="text-orange-500" />
                  <DropdownLink href="/" icon={<FaThLarge />} label="Public View" color="text-purple-500" />
                  
                  <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-2 mx-3"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all group"
                  >
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg group-hover:scale-110 transition-transform">
                      <FaSignOutAlt />
                    </div>
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

// --- Sub-component for Dropdown Links ---
const DropdownLink = ({ href, icon, label, color }: { href: string, icon: any, label: string, color: string }) => (
  <Link href={href} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all group">
    <span className={`${color} p-1.5 rounded-lg group-hover:scale-110 transition-transform`}>{icon}</span>
    {label}
  </Link>
);

export default DashboardNavbar;