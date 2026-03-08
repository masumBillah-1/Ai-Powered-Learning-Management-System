import React from 'react';
import { 
  Search, Grid, List, Edit2, 
  PlayCircle, HelpCircle, Clock 
} from 'lucide-react';
import { getCourses } from '@/inserver.ts/course';

const Course = async ({ searchParams }: { searchParams: any }) => {
  const getParams = await searchParams;
  
  // ১. ব্যাকএন্ড থেকে ডাইনামিক ডাটা আনা
  const response = await getCourses({ ...getParams });
  
  // ব্যাকএন্ডের রেসপন্স থেকে ডাটা আলাদা করা
  const courseList = response?.data || [];
  const backendStats = response?.stats || {};

  // ২. স্ট্যাটাস কার্ডের কনফিগারেশন (ম্যাপিং এর জন্য)
  const statsCards = [
    { label: 'Active Courses', count: backendStats.activeCourses || 0, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
    { label: 'Pending Courses', count: backendStats.pendingCourses || 0, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
    { label: 'Draft Courses', count: backendStats.draftCourses || 0, bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    { label: 'Free Courses', count: backendStats.freeCourses || 0, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    { label: 'Paid Courses', count: backendStats.paidCourses || 0, bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100' },
  ];

  return (
    <div className="p-6 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen font-sans">
      
      {/* ১. স্ট্যাটাস কার্ডস ম্যাপিং */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {statsCards.map((stat, index) => (
          <div 
            key={index}
            className={`${stat.bg} ${stat.border} border p-5 rounded-2xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1`}
          >
            <p className={`text-xs font-bold uppercase tracking-wider opacity-80 ${stat.text}`}>{stat.label}</p>
            <h2 className={`text-3xl font-black mt-1 ${stat.text}`}>{stat.count}</h2>
          </div>
        ))}
      </div>

      {/* ২. কোর্স টেবিল কার্ড */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Course Overview</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button className="p-2 bg-white dark:bg-slate-700 shadow-sm rounded-lg text-indigo-600"><List size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600"><Grid size={18} /></button>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
              + Create Course
            </button>
          </div>
        </div>

        {/* ৩. ডাইনামিক টেবিল ম্যাপিং */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] border-b border-slate-50 dark:border-slate-800">
                <th className="pb-5 px-2">Course Name</th>
                <th className="pb-5 text-center">Students</th>
                <th className="pb-5 text-center">Price</th>
                <th className="pb-5">Status</th>
                <th className="pb-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {courseList.length > 0 ? (
                courseList.map((course: any) => (
                  <tr key={course._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                    <td className="py-6 px-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                          <PlayCircle size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{course.name}</h4>
                          <div className="flex gap-3 mt-1 text-[11px] font-bold text-slate-400 uppercase">
                            <span className="flex items-center gap-1"><Clock size={12}/> {course.duration || '00:00:00'}</span>
                            <span className="flex items-center gap-1"><HelpCircle size={12}/> {course.quizCount || 0} Quiz</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 text-center text-sm font-bold text-slate-600 dark:text-slate-400">{course.students || 0}</td>
                    <td className="py-6 text-center text-sm font-black text-slate-800 dark:text-white">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </td>
                    <td className="py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        course.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-600' : 
                        course.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="py-6 text-right">
                      <button className="p-2 hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-transparent hover:border-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400 font-medium">
                    No courses found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Course;