"use client";
import DashboardNavbar from '@/components/DasboardNavbar';
import InstructorSidebar from '@/components/layout/InstructorSidebar';
import React from 'react';
 

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. Fixed Sidebar (Bame thakbe) */}
      <aside className="hidden md:flex md:shrink-0 h-full">
        <InstructorSidebar />
      </aside>

      {/* 2. Right Side: Content Area (Full width) */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        
        {/* --- NAVBAR: Shobar upore full width jure thakbe --- */}
        <header className="z-40">
          <DashboardNavbar />
        </header>

        {/* 3. Main Page Content (Ekhane Course/Earnings load hobe) */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div>
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;