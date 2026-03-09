"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  coverImage: {
    type: string;
    url: string;
  };
  pricing: {
    type: string;
    price: number;
    discountPrice?: number;
  };
  enrolledCount: number;
  instructorId: {
    _id: string;
    name: string;
    photoURL?: string;
  };
  status: string;
  visibility: string;
}

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/courses?status=published');
      const data = await res.json();
      
      if (data.success) {
        // Filter only public and published courses
        const publicCourses = data.courses.filter(
          (course: Course) => course.visibility === "public" && course.status === "published"
        );
        setCourses(publicCourses);
      } else {
        setError("Failed to load courses");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              All Courses
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose your path and start learning today
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error}
          </h2>
          <button
            onClick={fetchCourses}
            className="mt-4 px-6 py-3 bg-[#C81D77] text-white rounded-lg hover:bg-[#a0155e] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              All Courses
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Choose your path and start learning today
            </p>
          </div>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No courses available yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new courses!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1120] py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
            All Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose your path and start learning today
          </p>
          <div className="mt-4">
            <span className="inline-block px-4 py-2 bg-[#C81D77]/10 text-[#C81D77] rounded-full text-sm font-semibold">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/courses/${course._id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.coverImage.url || 'https://via.placeholder.com/400x300?text=No+Image'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Course+Image';
                      }}
                    />
                    {/* Level Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {course.level}
                      </span>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#C81D77] text-white text-xs font-semibold rounded-full">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-[#C81D77] transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                      {course.description}
                    </p>

                    {/* Instructor Info */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
                        {course.instructorId.photoURL ? (
                          <img 
                            src={course.instructorId.photoURL} 
                            alt={course.instructorId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#C81D77] text-white text-xs font-bold">
                            {course.instructorId.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {course.instructorId.name}
                      </span>
                    </div>

                    {/* Price and Stats */}
                    <div className="flex items-center justify-between">
                      <div>
                        {course.pricing.type === "free" ? (
                          <span className="text-2xl font-black text-green-600">
                            Free
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-[#C81D77]">
                              ৳{course.pricing.discountPrice || course.pricing.price}
                            </span>
                            {course.pricing.discountPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ৳{course.pricing.price}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>👥 {course.enrolledCount || 0}</span>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {course.pricing.discountPrice && course.pricing.price > course.pricing.discountPrice && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                          {Math.round(((course.pricing.price - course.pricing.discountPrice) / course.pricing.price) * 100)}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;