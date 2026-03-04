"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BsGrid1X2Fill, 
  BsPerson, 
  BsBook, 
  BsPatchCheck, 
  BsHeart, 
  BsStar, 
  BsQuestionCircle, 
  BsCart3, 
  BsPeople, 
  BsChatLeftDots, 
  BsTicketPerforated,
  BsGear,
  BsBoxArrowRight
} from "react-icons/bs";

const StudentSidebar = () => {
  const pathname = usePathname();

  // Folder structure onujayi href gulo update kora hoyeche
  const mainMenuItems = [
    { 
      name: "Dashboard", 
      icon: <BsGrid1X2Fill />, 
      href: "/dashboard/student/Std-dashboared" 
    },
    // { 
    //   name: "My Profile", 
    //   icon: <BsPerson size={20} />, 
    //   href: "/dashboard/student/profile" 
    // },
    { 
      name: "Enrolled Courses", 
      icon: <BsBook />, 
      href: "/dashboard/student/EnrolledCourses" 
    },
    { 
      name: "My Certificates", 
      icon: <BsPatchCheck />, 
      href: "/dashboard/student/certificates" 
    },
    // { 
    //   name: "Wishlist", 
    //   icon: <BsHeart />, 
    //   href: "/dashboard/student/wishlist" 
    // },
    { 
      name: "Reviews", 
      icon: <BsStar />, 
      href: "/dashboard/student/Reviews" 
    },
    { 
      name: "My Quiz Attempts", 
      icon: <BsQuestionCircle />, 
      href: "/dashboard/student/Quiz-Attempts" 
    },
    // { 
    //   name: "Order History", 
    //   icon: <BsCart3 />, 
    //   href: "/dashboard/student/orders" 
    // },
    // { 
    //   name: "Referrals", 
    //   icon: <BsPeople />, 
    //   href: "/dashboard/student/referrals" 
    // },
    // { 
    //   name: "Messages", 
    //   icon: <BsChatLeftDots />, 
    //   href: "/dashboard/student/messages" 
    // },
    // { 
    //   name: "Support Tickets", 
    //   icon: <BsTicketPerforated />, 
    //   href: "/dashboard/student/support" 
    // },
  ];

  const accountSettingsItems = [
    { name: "Settings", icon: <BsGear />, href: "/dashboard/student/setting" },
    { name: "Logout", icon: <BsBoxArrowRight />, href: "/dashboard/student/logout" },
  ];

  return (
    <div className="w-full max-w-[300px] bg-white border border-gray-100 rounded-2xl shadow-sm p-6 font-sans">
      {/* Main Menu Section */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Main Menu</h3>
        <ul className="space-y-1">
          {mainMenuItems.map((item) => {
            // Path match check (dynamic matching)
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? "bg-[#FFF0F2] text-[#FF5A70] font-bold" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={`text-lg ${isActive ? "text-[#FF5A70]" : "text-gray-400 group-hover:text-gray-900"}`}>
                    {item.icon}
                  </span>
                  <span className="text-[14px]">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-gray-100 my-6"></div>

      {/* Account Settings Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Account Settings</h3>
        <ul className="space-y-1">
          {accountSettingsItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all group"
              >
                <span className="text-lg text-gray-400 group-hover:text-gray-900">
                  {item.icon}
                </span>
                <span className="text-[14px] font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StudentSidebar;