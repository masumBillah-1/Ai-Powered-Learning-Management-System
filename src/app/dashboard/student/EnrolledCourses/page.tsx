"use client";

import React, { useState } from 'react';
import { Star, Heart, ChevronRight, ChevronLeft } from 'lucide-react';

// TypeScript Interface for Course
interface Course {
  id: number;
  title: string;
  instructor: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  imageUrl: string;
  badge?: string;
}

const EnrolledCoursesPage = () => {
  const [activeTab, setActiveTab] = useState('Enrolled');

  const courses: Course[] = [
    { id: 1, title: 'Information About UI/UX Design Degree', instructor: 'Brenda Staton', category: 'Design', price: '$120', rating: 4.9, reviews: 200, imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?q=80&w=400', badge: '15% off' },
    { id: 2, title: 'Wordpress for Beginners - Master Wordpress Quickly', instructor: 'Ana Reyes', category: 'Wordpress', price: '$140', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1461742308919-0146b73e00f7?q=80&w=400' },
    { id: 3, title: 'Sketch from A to Z (2024): Become an app designer', instructor: 'Andrew Pirte', category: 'Design', price: '$140', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=400' },
    { id: 4, title: 'Build Responsive Real World Websites with Crash Course', instructor: 'Christy Garner', category: 'Programming', price: '$200', rating: 4.2, reviews: 220, imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400' },
    { id: 5, title: 'Learn JavaScript and Express to become a Expert', instructor: 'Justin Gregory', category: 'Programming', price: '$130', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=400' },
    { id: 6, title: 'Introduction to Python Programming', instructor: 'Carolyn Hines', category: 'Programming', price: '$130', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400' },
    { id: 7, title: 'Build Responsive Websites with HTML5 and CSS3', instructor: 'Rafael Miller', category: 'Programming', price: '$170', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=400' },
    { id: 8, title: 'Information About Photoshop Design Degree', instructor: 'Nancy Duarte', category: 'Design', price: '$170', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde2?q=80&w=400' },
    { id: 9, title: 'C# Developers Double Your Coding with Visual Studio', instructor: 'James Kagen', category: 'Design', price: '$180', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400' },
  ];

  const tabs = [
    { name: 'Enrolled', count: '09' },
    { name: 'Active', count: '06' },
    { name: 'Completed', count: '03' },
  ];

  return (
    <div className="w-full bg-white min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-xl font-black text-[#171717]">Enrolled Courses</h1>
        
        {/* Navigation Tabs - Using Hot Pink for active state */}
        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-100 self-start md:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 ${
                activeTab === tab.name 
                ? "bg-[#FF0F7B] text-white shadow-lg shadow-pink-100" 
                : "text-gray-500 hover:text-[#832388]"
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
            {/* Image Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Badge - Using Rose Pink */}
              {course.badge && (
                <span className="absolute top-3 left-3 bg-[#E3436B] text-white text-[10px] font-black px-2 py-1 rounded">
                  {course.badge}
                </span>
              )}
              {/* Heart - Using Hot Pink on hover */}
              <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-gray-400 hover:text-[#FF0F7B] transition-colors shadow-sm">
                <Heart size={16} fill={activeTab === 'Enrolled' ? 'none' : 'currentColor'} />
              </button>
            </div>

            {/* Course Details */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-100 overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} alt="avatar" />
                  </div>
                  <span className="text-[11px] font-bold text-gray-500">{course.instructor}</span>
                </div>
                {/* Category - Using Brand Purple */}
                <span className="text-[10px] font-black text-[#832388] uppercase tracking-widest">{course.category}</span>
              </div>

              <h3 className="font-bold text-[#171717] text-sm leading-snug mb-3 line-clamp-2 h-10 group-hover:text-[#FF0F7B] transition-colors">
                {course.title}
              </h3>

              {/* Rating - Using Brand Yellow */}
              <div className="flex items-center gap-1 mb-4">
                <Star size={14} className="text-[#FDE047] fill-[#FDE047]" />
                <span className="text-xs font-black text-gray-700">{course.rating}</span>
                <span className="text-[10px] text-gray-400 font-bold">({course.reviews} Reviews)</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                {/* Price - Using Hot Pink */}
                <span className="text-[#FF0F7B] font-black text-lg">{course.price}</span>
                {/* Button - Using Grayscale Foreground (#171717) with brand hover */}
                <button className="bg-[#171717] text-white px-4 py-2 rounded-lg text-[11px] font-black flex items-center gap-1 hover:bg-[#832388] transition-all">
                  View Course <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
        <p className="text-xs font-bold text-gray-400">Page 1 of 2</p>
        
        <div className="flex items-center gap-2">
          <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-[#F89B29] transition-colors">
            <ChevronLeft size={18} />
          </button>
          
          {/* Active Page - Using Hot Pink */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FF0F7B] text-white text-xs font-black shadow-md shadow-pink-100">1</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 text-xs font-bold hover:bg-gray-50 hover:text-[#832388]">2</button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 text-xs font-bold hover:bg-gray-50 hover:text-[#832388]">3</button>
          
          <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-[#F89B29] transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;