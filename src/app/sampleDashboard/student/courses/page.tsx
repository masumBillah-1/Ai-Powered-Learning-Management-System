"use client";

import React, { useState, useEffect } from 'react';
import { Star, Heart, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

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
  status: 'Enrolled' | 'Active' | 'Completed'; // Added status field
  progress?: number; // Optional progress field
}

const EnrolledCoursesPage = () => {
  const [activeTab, setActiveTab] = useState<'Enrolled' | 'Active' | 'Completed'>('Enrolled');
  const [likedCourses, setLikedCourses] = useState<number[]>([]);
  const [theme, setTheme] = useState("light");

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Listen for theme changes
    const interval = setInterval(() => {
      const currentTheme = localStorage.getItem("theme") || "light";
      if (currentTheme !== theme) {
        setTheme(currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [theme]);

  // All courses with status
  const allCourses: Course[] = [
    { id: 1, title: 'Information About UI/UX Design Degree', instructor: 'Brenda Staton', category: 'Design', price: '$120', rating: 4.9, reviews: 200, imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?q=80&w=400', badge: '15% off', status: 'Active', progress: 65 },
    { id: 2, title: 'Wordpress for Beginners - Master Wordpress Quickly', instructor: 'Ana Reyes', category: 'Wordpress', price: '$140', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1461742308919-0146b73e00f7?q=80&w=400', status: 'Enrolled' },
    { id: 3, title: 'Sketch from A to Z (2024): Become an app designer', instructor: 'Andrew Pirte', category: 'Design', price: '$140', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=400', status: 'Active', progress: 45 },
    { id: 4, title: 'Build Responsive Real World Websites with Crash Course', instructor: 'Christy Garner', category: 'Programming', price: '$200', rating: 4.2, reviews: 220, imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400', status: 'Completed', progress: 100 },
    { id: 5, title: 'Learn JavaScript and Express to become a Expert', instructor: 'Justin Gregory', category: 'Programming', price: '$130', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=400', status: 'Enrolled' },
    { id: 6, title: 'Introduction to Python Programming', instructor: 'Carolyn Hines', category: 'Programming', price: '$130', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400', status: 'Active', progress: 30 },
    { id: 7, title: 'Build Responsive Websites with HTML5 and CSS3', instructor: 'Rafael Miller', category: 'Programming', price: '$170', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=400', status: 'Enrolled' },
    { id: 8, title: 'Information About Photoshop Design Degree', instructor: 'Nancy Duarte', category: 'Design', price: '$170', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde2?q=80&w=400', status: 'Completed', progress: 100 },
    { id: 9, title: 'C# Developers Double Your Coding with Visual Studio', instructor: 'James Kagen', category: 'Design', price: '$180', rating: 4.4, reviews: 180, imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=400', status: 'Active', progress: 85 },
    { id: 10, title: 'Advanced React and Redux Course', instructor: 'Sarah Johnson', category: 'Programming', price: '$150', rating: 4.7, reviews: 195, imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400', status: 'Enrolled' },
    { id: 11, title: 'Digital Marketing Masterclass', instructor: 'Michael Brown', category: 'Marketing', price: '$160', rating: 4.5, reviews: 210, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400', status: 'Active', progress: 55 },
    { id: 12, title: 'Complete Node.js Developer Course', instructor: 'David Wilson', category: 'Programming', price: '$145', rating: 4.6, reviews: 188, imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=400', status: 'Completed', progress: 100 },
  ];

  // Filter courses based on active tab
  const filteredCourses = allCourses.filter(course => course.status === activeTab);

  // Count courses by status
  const courseCounts = {
    Enrolled: allCourses.filter(c => c.status === 'Enrolled').length,
    Active: allCourses.filter(c => c.status === 'Active').length,
    Completed: allCourses.filter(c => c.status === 'Completed').length,
  };

  const tabs = [
    { name: 'Enrolled' as const, count: courseCounts.Enrolled.toString().padStart(2, '0') },
    { name: 'Active' as const, count: courseCounts.Active.toString().padStart(2, '0') },
    { name: 'Completed' as const, count: courseCounts.Completed.toString().padStart(2, '0') },
  ];

  const toggleLike = (id: number) => {
    setLikedCourses(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#00C48C';
    if (progress >= 50) return '#F89B29';
    return '#FF0F7B';
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Enrolled Courses</h1>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-base-200 p-1.5 rounded-full border border-base-300 self-start md:self-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeTab === tab.name 
                ? "text-white shadow-lg" 
                : "hover:bg-base-300"
              }`}
              style={{
                backgroundColor: activeTab === tab.name ? '#FF0F7B' : 'transparent'
              }}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold mb-2">No {activeTab} Courses</h3>
          <p className="opacity-60">You don't have any {activeTab.toLowerCase()} courses yet.</p>
        </div>
      ) : (
        <>
          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div 
                key={course.id} 
                className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                {/* Image Thumbnail */}
                <figure className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Badge */}
                  {course.badge && (
                    <span 
                      className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md"
                      style={{ backgroundColor: '#E3436B' }}
                    >
                      {course.badge}
                    </span>
                  )}
                  
                  {/* Heart Button */}
                  <button 
                    onClick={() => toggleLike(course.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-base-100/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform border-0 cursor-pointer"
                  >
                    <Heart 
                      size={16} 
                      className={likedCourses.includes(course.id) ? 'fill-[#FF0F7B] text-[#FF0F7B]' : ''}
                    />
                  </button>

                  {/* Completed Badge - Only for Completed Courses (on image) */}
                  {course.status === 'Completed' && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div 
                        className="text-white text-sm font-bold px-4 py-2 rounded-xl text-center shadow-lg backdrop-blur-md flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#00C48C' }}
                      >
                        <CheckCircle size={16} />
                        <span>Completed</span>
                      </div>
                    </div>
                  )}
                </figure>

                {/* Course Details */}
                <div className="card-body p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-6 h-6 rounded-full">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`} 
                            alt="avatar" 
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold opacity-60">{course.instructor}</span>
                    </div>
                    <span 
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: '#832388' }}
                    >
                      {course.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base leading-snug mb-3 line-clamp-2 h-12 group-hover:text-[#FF0F7B] transition-colors">
                    {course.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star size={14} className="text-[#FDE047] fill-[#FDE047]" />
                    <span className="text-sm font-bold">{course.rating}</span>
                    <span className="text-xs opacity-60">({course.reviews} Reviews)</span>
                  </div>

                  {/* Progress Bar - Only for Active Courses (in card body) */}
                  {course.status === 'Active' && course.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold opacity-60">Progress</span>
                        <span className="text-xs font-bold">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${course.progress}%`,
                            backgroundColor: getProgressColor(course.progress)
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-base-300 pt-4">
                    <span className="font-bold text-xl" style={{ color: '#FF0F7B' }}>
                      {course.price}
                    </span>
                    <button 
                      className="btn btn-sm text-white border-0 gap-1 hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: '#171717' }}
                    >
                      View Course <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-base-300 pt-6">
            <p className="text-xs font-semibold opacity-60">
              Showing {filteredCourses.length} of {filteredCourses.length} courses
            </p>
            
            <div className="flex items-center gap-2">
              <button className="btn btn-sm btn-ghost border border-base-300 cursor-pointer">
                <ChevronLeft size={18} />
              </button>
              
              <button 
                className="btn btn-sm btn-circle text-white font-bold shadow-md border-0 cursor-pointer"
                style={{ backgroundColor: '#FF0F7B' }}
              >
                1
              </button>
              <button className="btn btn-sm btn-circle btn-ghost cursor-pointer">2</button>
              <button className="btn btn-sm btn-circle btn-ghost cursor-pointer">3</button>
              
              <button className="btn btn-sm btn-ghost border border-base-300 cursor-pointer">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnrolledCoursesPage;