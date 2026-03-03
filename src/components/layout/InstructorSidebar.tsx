// "use client";
// import React from 'react';
// import Link from 'next/link';
// import { 
//   MdDashboard, MdOutlinePlayLesson, MdAnnouncement, 
//   MdQuiz, MdAssignment, MdMessage, MdSettings, MdLogout 
// } from 'react-icons/md';
// import { FaUserCircle, FaUsers, FaCertificate, FaWallet, FaHistory } from 'react-icons/fa';
// import { IoIosListBox } from "react-icons/io";
// import { HiTicket } from "react-icons/hi2";

// const InstructorSidebar = () => {
//   const menuItems = [
//     { name: 'Dashboard', icon: <MdDashboard />, link: 'instructor/indashboard', active: true },
//     { name: 'My Profile', icon: <FaUserCircle />, link: '/profile' },
//     { name: 'Courses', icon: <MdOutlinePlayLesson />, link: 'instructor/course' },
//     { name: 'Announcements', icon: <MdAnnouncement />, link: 'instructor/announcements' },
//     { name: 'Assignments', icon: <IoIosListBox />, link: 'instructor/assignments' },
//     { name: 'Students', icon: <FaUsers />, link: 'instructor/students' },
//     { name: 'Quiz', icon: <MdQuiz />, link: 'instructor/quiz' },
//     { name: 'Quiz Results', icon: <MdAssignment />, link: 'instructor/quiz-results' },
//     { name: 'Certificates', icon: <FaCertificate />, link: 'instructor/certificates' },
//     { name: 'Earnings', icon: <FaWallet />, link: 'instructor/earnings' },
//     { name: 'Payout', icon: <MdSettings />, link: 'instructor/payout' },
//     { name: 'Statements', icon: <FaHistory />, link: 'instructor/statements' },
//     { name: 'Messages', icon: <MdMessage />, link: 'instructor/messages' },
//     { name: 'Support Tickets', icon: <HiTicket />, link: 'instructor/support' },
//   ];

//   const accountSettings = [
//     { name: 'Settings', icon: <MdSettings />, link: '/settings' },
//     { name: 'Logout', icon: <MdLogout />, link: '/logout' },
//   ];

//   return (
//     <div className="w-72 bg-white h-screen border-r border-gray-200 p-6 flex flex-col overflow-y-auto shadow-sm">
//       {/* Main Menu Section */}
//       <div className="mb-6">
//         <h3 className="text-gray-900 font-bold text-lg mb-4">Main Menu</h3>
//         <nav className="space-y-1">
//           {menuItems.map((item) => (
//             <Link 
//               key={item.name} 
//               href={item.link}
//               className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
//                 item.active 
//                 ? 'text-pink-500 font-medium' 
//                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//               }`}
//             >
//               <span className="text-xl">{item.icon}</span>
//               <span className="text-[15px]">{item.name}</span>
//             </Link>
//           ))}
//         </nav>
//       </div>

//       <hr className="border-gray-100 mb-6" />

//       {/* Account Settings Section */}
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
import { usePathname } from 'next/navigation'; // Active link check korar jonno
import { 
  MdDashboard, MdOutlinePlayLesson, MdAnnouncement, 
  MdQuiz, MdAssignment, MdMessage, MdSettings, MdLogout 
} from 'react-icons/md';
import { FaUserCircle, FaUsers, FaCertificate, FaWallet, FaHistory } from 'react-icons/fa';
import { IoIosListBox } from "react-icons/io";
import { HiTicket } from "react-icons/hi2";

const InstructorSidebar = () => {
  const pathname = usePathname(); // Bortoman URL janar jonno

  // Protiti link-er agey '/' add kora hoyeche (Absolute Path)
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
    <div className="w-72 bg-white h-screen border-r border-gray-200 p-6 flex flex-col overflow-y-auto shadow-sm">
      <div className="mb-6">
        <h3 className="text-gray-900 font-bold text-lg mb-4">Main Menu</h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            // Dynamic bhabe active link check kora
            const isActive = pathname === item.link;
            
            return (
              <Link 
                key={item.name} 
                href={item.link}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                  ? 'text-pink-500 font-bold bg-pink-50/50' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <hr className="border-gray-100 mb-6" />

      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-4">Account Settings</h3>
        <nav className="space-y-1">
          {accountSettings.map((item) => (
            <Link 
              key={item.name} 
              href={item.link}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[15px]">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default InstructorSidebar;