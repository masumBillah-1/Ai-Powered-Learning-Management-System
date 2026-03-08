"use client";
import React from 'react';

const SkeletonDashboard = () => {
  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-950 min-h-screen p-4 md:p-8 space-y-8 animate-pulse">
      
      {/* 1. Banner Skeleton */}
      <div className="h-48 md:h-56 w-full bg-gray-200 dark:bg-slate-800 rounded-[2rem]"></div>

      {/* 2. Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-32 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-2xl"></div>
              <div className="w-12 h-4 bg-gray-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-3 bg-gray-200 dark:bg-slate-800 rounded"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle Section Skeleton (Graph & List) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Graph Skeleton */}
        <div className="xl:col-span-2 h-[450px] bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-800">
           <div className="flex justify-between mb-8">
              <div className="space-y-2">
                <div className="w-40 h-6 bg-gray-200 dark:bg-slate-800 rounded"></div>
                <div className="w-60 h-4 bg-gray-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="w-24 h-10 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
           </div>
           <div className="w-full h-64 bg-gray-100 dark:bg-slate-800/50 rounded-xl"></div>
        </div>

        {/* Sidebar List Skeleton */}
        <div className="h-[450px] bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-gray-100 dark:border-slate-800 space-y-6">
           <div className="w-32 h-6 bg-gray-200 dark:bg-slate-800 rounded mb-4"></div>
           {[1, 2, 3, 4, 5].map((i) => (
             <div key={i} className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-800"></div>
               <div className="flex-grow space-y-2">
                 <div className="w-24 h-3 bg-gray-200 dark:bg-slate-800 rounded"></div>
                 <div className="w-32 h-2 bg-gray-200 dark:bg-slate-800 rounded"></div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonDashboard;