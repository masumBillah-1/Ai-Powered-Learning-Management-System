"use client";
import React from 'react';
import { 
  Users, BookOpen, CheckCircle, GraduationCap, 
  Layers, DollarSign, Calendar 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// Dummy Data for Graph
const chartData = [
  { name: 'Jan', earnings: 80 }, { name: 'Feb', earnings: 100 },
  { name: 'Mar', earnings: 70 }, { name: 'Apr', earnings: 110 },
  { name: 'May', earnings: 80 }, { name: 'Jun', earnings: 90 },
  { name: 'Jul', earnings: 85 }, { name: 'Aug', earnings: 85 },
  { name: 'Sep', earnings: 110 }, { name: 'Oct', earnings: 30 },
  { name: 'Nov', earnings: 100 }, { name: 'Dec', earnings: 90 },
];

const Indashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      
      {/* 1. Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<GraduationCap className="text-purple-600" />} label="Enrolled Courses" value="12" bgColor="bg-purple-50 dark:bg-purple-900/20" />
        <StatCard icon={<BookOpen className="text-pink-500" />} label="Active Courses" value="08" bgColor="bg-pink-50 dark:bg-pink-900/20" />
        <StatCard icon={<CheckCircle className="text-green-500" />} label="Completed Courses" value="06" bgColor="bg-green-50 dark:bg-green-900/20" />
        <StatCard icon={<Users className="text-indigo-600" />} label="Total Students" value="17" bgColor="bg-indigo-50 dark:bg-indigo-900/20" />
        <StatCard icon={<Layers className="text-cyan-500" />} label="Total Courses" value="11" bgColor="bg-cyan-50 dark:bg-cyan-900/20" />
        <StatCard icon={<DollarSign className="text-purple-500" />} label="Total Earnings" value="$486" bgColor="bg-purple-50 dark:bg-purple-900/20" />
      </div>

      {/* 2. Earnings Graph Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold dark:text-white">Earnings by Year</h3>
          <div className="flex items-center gap-2 px-3 py-1.5 border dark:border-slate-700 rounded-lg text-sm text-gray-500">
            <Calendar size={16} /> <span>02/24/2026 - 03/02/2026</span>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="earnings" radius={[4, 4, 0, 0]} barSize={35}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} className="fill-blue-600 dark:fill-blue-500 hover:fill-blue-700 transition-all cursor-pointer" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Recently Created Courses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b dark:border-slate-800">
          <h3 className="text-lg font-bold dark:text-white">Recently Created Courses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Courses</th>
                <th className="px-6 py-4 font-semibold text-center">Enrolled</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              <CourseRow title="Complete HTML, CSS and Javascript Course" enrolled="0" status="Published" img="https://via.placeholder.com/40" />
              <CourseRow title="Complete Course on Fullstack Web Developer" enrolled="2" status="Published" img="https://via.placeholder.com/40" />
              <CourseRow title="Data Science Fundamentals and Advanced Bootcamp" enrolled="2" status="Published" img="https://via.placeholder.com/40" />
              <CourseRow title="Master Microservices with Spring Boot" enrolled="1" status="Published" img="https://via.placeholder.com/40" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Stats Cards
const StatCard = ({ icon, label, value, bgColor }: any) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl flex items-center gap-4 shadow-sm border border-gray-100 dark:border-slate-800">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <h4 className="text-xl font-bold dark:text-white">{value}</h4>
    </div>
  </div>
);

// Helper Component for Table Rows
const CourseRow = ({ title, enrolled, status, img }: any) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <img src={img} alt="course" className="w-10 h-10 rounded object-cover" />
        <span className="font-medium text-gray-700 dark:text-gray-200 text-sm max-w-[250px] truncate md:max-w-none">{title}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">{enrolled}</td>
    <td className="px-6 py-4 text-right">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
        {status}
      </span>
    </td>
  </tr>
);

export default Indashboard;