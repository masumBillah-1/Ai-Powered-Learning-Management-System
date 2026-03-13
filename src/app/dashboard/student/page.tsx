"use client";
import React, { useState } from 'react';
import {
  BookOpen, PlayCircle, CheckCircle, Star, Download,
  ChevronRight, Heart, Clock, TrendingUp, Award, Calendar
} from 'lucide-react';

// ✅ theme state নেই — DashboardLayout data-theme set করে
// CSS variables (bg-base-100, text-base-content ইত্যাদি) auto কাজ করে

const StudentDashboard = () => {
  const [likedCourses, setLikedCourses] = useState<number[]>([]);

  const stats = [
    { label: 'Enrolled Courses', value: '12', icon: BookOpen, color: '#832388', bg: 'bg-purple-100 dark:bg-purple-950/40' },
    { label: 'Active Courses', value: '03', icon: PlayCircle, color: '#FF0F7B', bg: 'bg-pink-100   dark:bg-pink-950/40' },
    { label: 'Completed Courses', value: '10', icon: CheckCircle, color: '#00C48C', bg: 'bg-green-100  dark:bg-green-950/40' },
  ];

  const courses = [
    { id: 1, title: 'Information About UI/UX Design Degree', instructor: 'Brenda Staton', category: 'Design', rating: '4.9', reviews: '200', price: '$120', progress: 65, img: 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?w=400&h=250&fit=crop' },
    { id: 2, title: 'Wordpress for Beginners - Master Wordpress Quickly', instructor: 'Ana Reyes', category: 'Development', rating: '4.4', reviews: '180', price: '$140', progress: 45, img: 'https://images.unsplash.com/photo-1461742308919-0146b73e00f7?w=400&h=250&fit=crop' },
    { id: 3, title: 'Sketch from A to Z (2024): Become an app designer', instructor: 'Andrew Pirte', category: 'Design', rating: '4.4', reviews: '180', price: '$140', progress: 30, img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=250&fit=crop' },
  ];

  const invoices = [
    { id: '#INV001', title: 'Build Responsive Real World Websites...', amount: '$200', date: 'Jan 15, 2024' },
    { id: '#INV002', title: 'Wordpress for Beginners', amount: '$310', date: 'Jan 12, 2024' },
    { id: '#INV003', title: 'Information About UI/UX Design Degree', amount: '$270', date: 'Jan 10, 2024' },
    { id: '#INV004', title: 'Sketch from A to Z (2024)', amount: '$180', date: 'Jan 08, 2024' },
    { id: '#INV005', title: 'Become an app designer', amount: '$220', date: 'Jan 05, 2024' },
  ];

  const quizzes = [
    { title: 'Sketch from A to Z (2024)', score: '15/22', percentage: 68, color: '#00C48C' },
    { title: 'Build Responsive Real World', score: '18/22', percentage: 82, color: '#832388' },
    { title: 'UI/UX Design Degree', score: '25/30', percentage: 83, color: '#FF0F7B' },
    { title: 'Become an app designer', score: '12/20', percentage: 60, color: '#F89B29' },
  ];

  const toggleLike = (id: number) =>
    setLikedCourses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const getProgressColor = (p: number) => p >= 80 ? '#00C48C' : p >= 50 ? '#F89B29' : '#FF0F7B';

  return (
    <div className="min-h-screen space-y-6">

      {/* Quiz Banner */}
      <div className="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
        <div className="card-body p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 dark:bg-purple-950/40">
                  <Award className="w-6 h-6" style={{ color: '#832388' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Quiz: Build Responsive Real World</h3>
                  <p className="text-sm opacity-60">Answered: 15/22</p>
                </div>
              </div>
              <div className="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: '68%', background: 'linear-gradient(90deg, #832388, #E3436B)' }} />
              </div>
            </div>
            <button className="btn btn-md px-6 border-0 text-white whitespace-nowrap hover:opacity-90 transition-opacity"
              style={{ background: '#832388' }}>
              Continue Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300">
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-60">{s.label}</p>
                  <h2 className="text-4xl font-bold mb-2">{s.value}</h2>
                  <div className="flex items-center gap-1.5 text-xs opacity-60">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="font-semibold">+12% from last month</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <s.icon className="w-7 h-7" style={{ color: s.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recently Enrolled Courses</h2>
          <button className="btn btn-ghost btn-sm gap-1.5 hover:bg-transparent font-semibold" style={{ color: '#832388' }}>
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <figure className="relative overflow-hidden h-48">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <button onClick={() => toggleLike(course.id)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border-0 bg-white/95 hover:scale-110 transition-transform">
                  <Heart className={`w-4 h-4 transition-all ${likedCourses.includes(course.id) ? 'fill-[#FF0F7B] text-[#FF0F7B]' : 'text-gray-400'}`} />
                </button>
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold bg-white/95" style={{ color: '#832388' }}>
                  {course.category}
                </div>
              </figure>
              <div className="card-body p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-[#FDE047] text-[#FDE047]" />
                    <span className="text-sm font-bold">{course.rating}</span>
                    <span className="text-xs opacity-60">({course.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs opacity-60">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-semibold">12h 30m</span>
                  </div>
                </div>
                <h3 className="text-base font-bold leading-snug mb-3 line-clamp-2 group-hover:text-[#832388] transition-colors">{course.title}</h3>
                <p className="text-sm opacity-60 mb-4 font-medium">by {course.instructor}</p>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold opacity-60">Progress</span>
                    <span className="text-xs font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%`, backgroundColor: getProgressColor(course.progress) }} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-base-300">
                  <span className="text-2xl font-bold" style={{ color: '#832388' }}>{course.price}</span>
                  <button className="btn btn-sm px-4 text-white border-0 gap-1.5 hover:opacity-90" style={{ backgroundColor: '#1a1a1a' }}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invoices & Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: '#FF0F7B' }} />
              <h2 className="text-xl font-bold">Recent Invoices</h2>
            </div>
            <div className="space-y-3">
              {invoices.map((inv, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-base-200 transition-all duration-200 border border-transparent hover:border-base-300 cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate mb-1.5">{inv.title}</h4>
                    <div className="flex items-center gap-3 text-xs opacity-70">
                      <span className="font-bold" style={{ color: '#832388' }}>{inv.id}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-semibold"><Calendar className="w-3 h-3" />{inv.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <span className="text-base font-bold">{inv.amount}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-green-100 dark:bg-green-950/40 text-[#00C48C]">PAID</span>
                      <button className="btn btn-ghost btn-xs hover:bg-transparent hover:opacity-70">
                        <Download className="w-4 h-4" style={{ color: '#832388' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-7 rounded-full" style={{ backgroundColor: '#F89B29' }} />
              <h2 className="text-xl font-bold">Latest Quizzes</h2>
            </div>
            <div className="space-y-4">
              {quizzes.map((quiz, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-base-300 hover:border-base-content/30 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1.5">{quiz.title}</h4>
                    <p className="text-xs opacity-60 font-semibold">Correct: {quiz.score}</p>
                  </div>
                  <div className="relative ml-4">
                    <div className="radial-progress font-bold"
                      style={{ "--value": quiz.percentage, "--size": "4rem", "--thickness": "5px", color: quiz.color } as React.CSSProperties}
                      role="progressbar">
                      <span className="text-sm">{quiz.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
