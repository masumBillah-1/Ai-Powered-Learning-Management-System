import React from 'react';
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle, 
  Star, 
  Download, 
  ChevronRight,
  Heart
} from 'lucide-react';

const Dashboard = () => {
  // Stats Data based on brand colors
  const stats = [
    { label: 'Enrolled Courses', value: '12', icon: <BookOpen className="text-white" />, bgColor: 'bg-gradient-to-br from-[#FF0F7B] to-[#E3436B]' },
    { label: 'Active Courses', value: '03', icon: <PlayCircle className="text-white" />, bgColor: 'bg-gradient-to-br from-[#832388] to-[#E3436B]' },
    { label: 'Completed Courses', value: '10', icon: <CheckCircle className="text-white" />, bgColor: 'bg-gradient-to-br from-[#00C48C] to-[#00ED64]' },
  ];

  const courses = [
    {
      title: 'Information About UI/UX Design Degree',
      instructor: 'Brenda Staton',
      category: 'Design',
      rating: '4.9',
      reviews: '200',
      price: '$120',
      img: 'https://images.unsplash.com/photo-1586717791821-3f44a563de4c?w=400'
    },
    {
      title: 'Wordpress for Beginners - Master Wordpress Quickly',
      instructor: 'Ana Reyes',
      category: 'Wordpress',
      rating: '4.4',
      reviews: '180',
      price: '$140',
      img: 'https://images.unsplash.com/photo-1461742308919-0146b73e00f7?w=400'
    },
    {
      title: 'Sketch from A to Z (2024): Become an app designer',
      instructor: 'Andrew Pirte',
      category: 'Design',
      rating: '4.4',
      reviews: '180',
      price: '$140',
      img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400'
    }
  ];

  const invoices = [
    { id: '#INV001', title: 'Build Responsive Real World Websites...', amount: '$200' },
    { id: '#INV002', title: 'Wordpress for Beginners', amount: '$170' },
    { id: '#INV003', title: 'Information About UI/UX Design Degree', amount: '$170' },
    { id: '#INV004', title: 'Sketch from A to Z (2024)', amount: '$180' },
    { id: '#INV005', title: 'Become an app designer', amount: '$170' },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Quiz Banner - Using Secondary Gradient */}
        <div className="bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F89B29] rounded-2xl p-6 flex justify-between items-center shadow-lg text-white">
          <div>
            <h3 className="font-bold text-lg">Quiz: Build Responsive Real World</h3>
            <p className="text-sm opacity-90">Answered: 15/22</p>
          </div>
          <button className="bg-white text-[#E3436B] px-6 py-2.5 rounded-xl text-sm font-bold hover:scale-105 transition shadow-md">
            Continue Quiz
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl flex items-center space-x-5 shadow-sm border border-[#f3f4f6]">
              <div className={`${stat.bgColor} p-4 rounded-2xl shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{stat.label}</p>
                <h2 className="text-2xl font-black text-[#171717]">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Recently Enrolled Courses */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-[#171717]">Recently Enrolled Courses</h2>
            <button className="text-[#FF0F7B] font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#f3f4f6] group hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img src={course.img} alt={course.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full backdrop-blur-sm text-[#FF0F7B] shadow-sm">
                    <Heart size={16} fill="currentColor" />
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#832388] uppercase tracking-widest">{course.category}</span>
                    <div className="flex items-center text-xs text-[#FDE047]">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1 font-bold text-gray-700">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-[#171717] text-sm leading-tight h-10 line-clamp-2 group-hover:text-[#FF0F7B] transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[#FF0F7B] font-black text-lg">{course.price}</span>
                    <button className="flex items-center text-[11px] font-bold bg-[#171717] text-white px-4 py-2 rounded-lg hover:bg-black transition">
                      View Course <ChevronRight size={14} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section: Invoices & Quizzes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Invoices */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f3f4f6]">
            <h2 className="text-lg font-black text-[#171717] mb-6 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-[#832388] rounded-full"></span> Recent Invoices
            </h2>
            <div className="space-y-4">
              {invoices.map((inv, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-[#171717] truncate max-w-[200px]">{inv.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-bold text-[#832388]">{inv.id}</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Amt: {inv.amount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="bg-[#00C48C]/10 text-[#00C48C] text-[9px] font-black px-2 py-1 rounded">PAID</span>
                    <Download size={16} className="text-gray-400 cursor-pointer hover:text-[#FF0F7B]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Quizzes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f3f4f6]">
            <h2 className="text-lg font-black text-[#171717] mb-6 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-[#F89B29] rounded-full"></span> Latest Quizzes
            </h2>
            <div className="space-y-6">
              {[
                { title: 'Sketch from A to Z (2024)', score: '15/22', pct: '68%', color: '#00C48C' },
                { title: 'Build Responsive Real World', score: '18/22', pct: '82%', color: '#FF0F7B' },
                { title: 'UI/UX Design Degree', score: '25/30', pct: '83%', color: '#832388' },
                { title: 'Become an app designer', score: '12/20', pct: '20%', color: '#ef4444' },
              ].map((quiz, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#171717]">{quiz.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Correct: {quiz.score}</p>
                  </div>
                  <div className="text-[10px] font-black w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all" style={{ borderColor: quiz.color, color: quiz.color }}>
                    {quiz.pct}
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

export default Dashboard;