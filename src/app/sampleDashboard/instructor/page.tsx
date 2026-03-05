"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, CheckCircle, GraduationCap, 
  Layers, DollarSign, Calendar, TrendingUp, ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// Dummy Data for Graph
const chartData = [
  { name: 'Jan', earnings: 45 }, { name: 'Feb', earnings: 52 },
  { name: 'Mar', earnings: 48 }, { name: 'Apr', earnings: 61 },
  { name: 'May', earnings: 55 }, { name: 'Jun', earnings: 67 },
  { name: 'Jul', earnings: 70 }, { name: 'Aug', earnings: 75 },
  { name: 'Sep', earnings: 85 }, { name: 'Oct', earnings: 90 },
  { name: 'Nov', earnings: 95 }, { name: 'Dec', earnings: 110 },
];

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
  role: string;
}

const Indashboard = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="space-y-6">
        
        {/* 1. COMPACT HERO BANNER - Height Optimized */}
        <div className="relative overflow-hidden rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl transition-all duration-500 group"
             style={{ background: "linear-gradient(135deg, #6710C2 0%, #A8227B 50%, #FF0F7B 100%)" }}>
          
          {/* Animated Background Elements */}
          <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-black/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col gap-2 text-center md:text-left">
            <div className="inline-flex items-center self-center md:self-start gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                {user?.role || "Instructor"} Dashboard
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
              Welcome Back, <span className="text-orange-200">{user?.name?.split(' ')[0] || "Instructor"}!</span>
            </h1>
            
            <p className="text-white/80 text-xs md:text-sm max-w-md font-medium">
              Track your student progress and manage your courses efficiently.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
               <button className="bg-white text-[#6710C2] px-5 py-2 rounded-lg font-bold text-xs shadow-lg hover:bg-orange-50 transition-all flex items-center gap-2">
                 New Course <ArrowRight size={14} />
               </button>
            </div>
          </div>

          {/* Compact Profile Section */}
          <div className="relative mt-6 md:mt-0 z-10">
            <div className="relative p-1.5 rounded-full border-4 border-white/20 bg-white/5 backdrop-blur-sm">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Profile" 
                  className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center font-black text-white text-3xl bg-gradient-to-br from-[#FF0F7B] to-[#F89B29]">
                  {user?.name?.charAt(0).toUpperCase() || "I"}
                </div>
              )}
            </div>
            {/* Rating Badge */}
            <div className="absolute -bottom-2 -left-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 flex items-center gap-2">
               <TrendingUp size={14} className="text-green-600" />
               <p className="text-[10px] font-bold dark:text-white">4.9 Rating</p>
            </div>
          </div>
        </div>

        {/* 2. STATS CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={<GraduationCap />} label="Enrolled Students" value="1,248" color="purple" trend="+12%" />
          <StatCard icon={<BookOpen />} label="Active Courses" value="08" color="pink" trend="Stable" />
          <StatCard icon={<CheckCircle />} label="Course Completed" value="86%" color="green" trend="+5%" />
          <StatCard icon={<Users />} label="Followers" value="542" color="indigo" trend="+18%" />
          <StatCard icon={<Layers />} label="Total Lessons" value="156" color="cyan" trend="+24" />
          <StatCard icon={<DollarSign />} label="Total Earnings" value="$12,486" color="orange" trend="+15%" />
        </div>

        {/* 3. CHARTS & TABLES SECTION */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Earnings Graph */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold dark:text-white">Revenue Analytics</h3>
                <p className="text-sm text-gray-500 mt-1">Detailed view of your monthly income</p>
              </div>
              <select className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold p-2 focus:ring-2 ring-purple-500 dark:text-white">
                <option>Year 2026</option>
                <option>Year 2025</option>
              </select>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6710C2" stopOpacity={1} />
                      <stop offset="100%" stopColor="#FF0F7B" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="earnings" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Sidebar - Recent Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-slate-800">
            <h3 className="text-xl font-bold dark:text-white mb-6">Recent Enrolled</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-pink-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-purple-600 text-xs">
                    ST
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold dark:text-white leading-none">Student {i}</p>
                    <p className="text-[11px] text-gray-500 mt-1">Enrolled in React Course</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">2m ago</span>
                </div>
              ))}
              <button className="w-full py-3 mt-4 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-gray-500 hover:border-purple-400 hover:text-purple-500 transition-all">
                View All Students
              </button>
            </div>
          </div>

        </div>

        {/* 4. ACTIVE COURSES TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white">Active Courses</h3>
            <button className="text-purple-600 font-bold text-sm hover:underline">Manage All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 text-[11px] uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5 font-black">Course Info</th>
                  <th className="px-8 py-5 font-black text-center">Enrollments</th>
                  <th className="px-8 py-5 font-black text-center">Price</th>
                  <th className="px-8 py-5 font-black text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                <CourseRow title="Next.js 14 Ultimate Guide" enrolled="420" status="Live" price="$89" img="https://img.freepik.com/free-vector/code-optimization-abstract-concept-illustration_335657-3705.jpg" />
                <CourseRow title="UI/UX Mastery with Figma" enrolled="128" status="Live" price="$45" img="https://img.freepik.com/free-vector/app-development-concept-design_23-2148670354.jpg" />
                <CourseRow title="Backend with Node.js" enrolled="85" status="Draft" price="$55" img="https://img.freepik.com/free-vector/cloud-computing-concept-design_23-2148682055.jpg" />
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, label, value, color, trend }: any) => {
  const colors: any = {
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
    pink: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20",
    cyan: "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <h4 className="text-2xl font-black dark:text-white mt-1">{value}</h4>
      </div>
    </div>
  );
};

const CourseRow = ({ title, enrolled, status, img, price }: any) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors group">
    <td className="px-8 py-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm">
           <img src={img} alt="course" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
        </div>
        <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{title}</span>
      </div>
    </td>
    <td className="px-8 py-5 text-center text-sm font-bold text-gray-500 dark:text-gray-400">{enrolled}</td>
    <td className="px-8 py-5 text-center text-sm font-black text-gray-800 dark:text-white">{price}</td>
    <td className="px-8 py-5 text-right">
      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
        status === 'Live' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
      }`}>
        {status}
      </span>
    </td>
  </tr>
);

export default Indashboard;