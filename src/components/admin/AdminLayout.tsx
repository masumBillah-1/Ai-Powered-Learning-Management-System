"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard/admin", icon: "📊" },
    { label: "My Profile", href: "/dashboard/admin/profile", icon: "👤" },
    { label: "Courses", href: "/dashboard/admin/courses", icon: "📚" },
    { label: "Announcements", href: "/dashboard/admin/announcements", icon: "📢" },
    { label: "Assignments", href: "/dashboard/admin/assignments", icon: "📝" },
    { label: "Students", href: "/dashboard/admin/students", icon: "👥" },
    { label: "Quiz", href: "/dashboard/admin/quiz", icon: "❓" },
    { label: "Quiz Results", href: "/dashboard/admin/quiz-results", icon: "🏆" },
    { label: "Certificates", href: "/dashboard/admin/certificates", icon: "📜" },
    { label: "Earnings", href: "/dashboard/admin/earnings", icon: "💰" },
    { label: "Payout", href: "/dashboard/admin/payout", icon: "💳" },
    { label: "Statements", href: "/dashboard/admin/statements", icon: "📄" },
    { label: "Messages", href: "/dashboard/admin/messages", icon: "💬" },
    { label: "Support Tickets", href: "/dashboard/admin/support", icon: "🎫" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Profile Card */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-white/10 rounded-full -mb-24" />
        
        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src="https://i.pravatar.cc/150?u=instructor" 
                  alt="Eugene Andre"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">Eugene Andre</h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <p className="text-purple-200 text-sm">Instructor</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium transition border border-white/20">
                Add New Course
              </button>
              <button className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 text-white rounded-xl font-medium transition shadow-lg">
                Student Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Main Menu</h3>
              <nav className="space-y-1">
                {menuItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive 
                          ? "bg-pink-50 text-pink-600 border border-pink-200" 
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Account Settings</h3>
                <nav className="space-y-1">
                  <Link href="/dashboard/admin/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                    <span>⚙️</span>
                    Settings
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                    <span>🚪</span>
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
