"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp 2026",
      description: "Master HTML, CSS, JavaScript, React, Next.js",
      price: "৳15,000",
      image: "https://i.ibb.co.com/Zp6LgsPy/christopher-gower-m-HRf-Lhg-ABo-unsplash.jpg",
      students: 5420,
      rating: 4.9
    },
    {
      id: 2,
      title: "Digital Marketing Masterclass",
      description: "Facebook Ads, Google Ads, SEO, Content Marketing",
      price: "৳12,000",
      image: "https://i.ibb.co.com/FkxynQ3K/carlos-muza-hpj-Sk-U2-UYSU-unsplash.jpg",
      students: 3200,
      rating: 4.8
    },
    {
      id: 3,
      title: "Graphics Design Professional",
      description: "Adobe Photoshop, Illustrator, Figma",
      price: "৳10,000",
      image: "https://i.ibb.co.com/fzkDftYT/theme-photos-CGpif-H3-Fj-OA-unsplash.jpg",
      students: 2800,
      rating: 4.7
    }
  ];

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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/courses/${course.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-[#C81D77] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#C81D77]">
                        {course.price}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>⭐ {course.rating}</span>
                        <span>({course.students})</span>
                      </div>
                    </div>
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
