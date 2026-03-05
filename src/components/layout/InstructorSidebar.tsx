// "use client";
// import React from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation'; 
// import { 
//   MdDashboard, MdOutlinePlayLesson, MdAnnouncement, 
//   MdQuiz, MdAssignment, MdMessage, MdSettings, MdLogout 
// } from 'react-icons/md';
// import { FaUserCircle, FaUsers, FaCertificate, FaWallet, FaHistory } from 'react-icons/fa';
// import { IoIosListBox } from "react-icons/io";
// import { HiTicket } from "react-icons/hi2";

// const InstructorSidebar = () => {
//   const pathname = usePathname(); 


//   const menuItems = [
//     { name: 'Dashboard', icon: <MdDashboard />, link: '/dashboard/instructor/indashboard' },
//     { name: 'My Profile', icon: <FaUserCircle />, link: '/dashboard/instructor/profile' },
//     { name: 'Courses', icon: <MdOutlinePlayLesson />, link: '/dashboard/instructor/course' },
//     { name: 'Announcements', icon: <MdAnnouncement />, link: '/dashboard/instructor/announcements' },
//     { name: 'Assignments', icon: <IoIosListBox />, link: '/dashboard/instructor/assignments' },
//     { name: 'Students', icon: <FaUsers />, link: '/dashboard/instructor/students' },
//     { name: 'Quiz', icon: <MdQuiz />, link: '/dashboard/instructor/quiz' },
//     { name: 'Quiz Results', icon: <MdAssignment />, link: '/dashboard/instructor/quiz-results' },
//     { name: 'Certificates', icon: <FaCertificate />, link: '/dashboard/instructor/certificates' },
//     { name: 'Earnings', icon: <FaWallet />, link: '/dashboard/instructor/earnings' },
//     { name: 'Payout', icon: <MdSettings />, link: '/dashboard/instructor/payout' },
//     { name: 'Statements', icon: <FaHistory />, link: '/dashboard/instructor/statements' },
//     { name: 'Messages', icon: <MdMessage />, link: '/dashboard/instructor/messages' },
//     { name: 'Support Tickets', icon: <HiTicket />, link: '/dashboard/instructor/support' },
//   ];

//   const accountSettings = [
//     { name: 'Settings', icon: <MdSettings />, link: '/dashboard/instructor/settings' },
//     { name: 'Logout', icon: <MdLogout />, link: '/logout' },
//   ];

//   return (
//     <div className="w-72 bg-white h-screen border-r border-gray-200 p-6 flex flex-col overflow-y-auto shadow-sm">
//        {/* <DashboardNavbar /> */}
//       <div className="mb-6">
        
//         <h3 className="text-gray-900 font-bold text-lg mb-4">Main Menu</h3>
       
//         <nav className="space-y-1">
//           {menuItems.map((item) => {
//             // Dynamic bhabe active link check kora
//             const isActive = pathname === item.link;
            
//             return (
//               <Link 
//                 key={item.name} 
//                 href={item.link}
//                 className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
//                   isActive 
//                   ? 'text-pink-500 font-bold bg-pink-50/50' 
//                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                 }`}
//               >
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="text-[15px]">{item.name}</span>
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       <hr className="border-gray-100 mb-6" />

//       <div>
//         <h3 className="text-gray-900 font-bold text-lg mb-4">Account Settings</h3>
//         <nav className="space-y-1">
//           {accountSettings.map((item) => (
//             <Link 
//               key={item.name} 
//               href={item.link}
//               className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
//             >
//               <span className="text-xl">{item.icon}</span>
//               <span className="text-[15px]">{item.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// };

// export default InstructorSidebar;

"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { 
  MdDashboard, MdOutlinePlayLesson, MdAnnouncement, 
  MdQuiz, MdAssignment, MdMessage, MdSettings, MdLogout 
} from 'react-icons/md';
import { FaUserCircle, FaUsers, FaCertificate, FaWallet, FaHistory } from 'react-icons/fa';
import { IoIosListBox } from "react-icons/io";
import { HiTicket } from "react-icons/hi2";

const InstructorSidebar = () => {
  const pathname = usePathname(); 

  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard />, link: '/dashboard/instructor/indashboard' },
    { name: 'My Profile', icon: <FaUserCircle />, link: '/dashboard/instructor/profile' },
    { name: 'Courses', icon: <MdOutlinePlayLesson />, link: '/dashboard/instructor/course' },
    { name: 'Announcements', icon: <MdAnnouncement />, link: '/dashboard/instructor/announcements' },
    { name: 'Assignments', icon: <IoIosListBox />, link: '/dashboard/instructor/assignments' },
    { name: 'Students', icon: <FaUsers />, link: '/dashboard/instructor/students' },
    { name: 'Quiz', icon: <MdQuiz />, link: '/dashboard/instructor/quiz' },
    { name: 'Quiz Results', icon: <MdAssignment />, link: '/dashboard/instructor/quiz-results' },
    { name: 'Certificates', icon: <FaCertificate />, link: '/dashboard/instructor/certificates' },
    { name: 'Earnings', icon: <FaWallet />, link: '/dashboard/instructor/earnings' },
    { name: 'Payout', icon: <MdSettings />, link: '/dashboard/instructor/payout' },
    { name: 'Statements', icon: <FaHistory />, link: '/dashboard/instructor/statements' },
    { name: 'Messages', icon: <MdMessage />, link: '/dashboard/instructor/messages' },
    { name: 'Support Tickets', icon: <HiTicket />, link: '/dashboard/instructor/support' },
  ];

  const accountSettings = [
    { name: 'Settings', icon: <MdSettings />, link: '/dashboard/instructor/settings' },
    { name: 'Logout', icon: <MdLogout />, link: '/logout' },
  ];

  return (
    <div className="w-72 bg-white dark:bg-[#0f172a] h-screen border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col overflow-y-auto shadow-sm transition-colors duration-300">
      
      {/* Main Menu Section */}
      <div className="mb-6">
        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-4 px-3">Main Menu</h3>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.link;
            
            return (
              <Link 
                key={item.name} 
                href={item.link}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'text-white font-bold bg-gradient-to-r from-[#FF0F7B] to-[#F89B29] shadow-md shadow-pink-500/20' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                  {item.icon}
                </span>
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <hr className="border-gray-100 dark:border-gray-800 mb-6 mx-3" />

      {/* Account Settings Section */}
      <div>
        <h3 className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-4 px-3">Account</h3>
        <nav className="space-y-1">
          {accountSettings.map((item) => (
            <Link 
              key={item.name} 
              href={item.link}
              className={`flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all group ${
                item.name === 'Logout' ? 'hover:text-red-500 dark:hover:text-red-400' : ''
              }`}
            >
              <span className={`text-xl ${item.name === 'Logout' ? 'group-hover:text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="text-[15px]">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer Info (Optional) */}
      <div className="mt-auto pt-10 pb-4 px-3">
        <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
           <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 dark:text-gray-500">
             Version 2.0.1
           </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorSidebar;