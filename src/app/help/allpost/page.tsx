"use client";

import React from 'react';
import { HiOutlinePhotograph, HiOutlineSearch, HiOutlineSpeakerphone } from 'react-icons/hi';
import { BiMessageRoundedDetail, BiCategory } from 'react-icons/bi';
import { MdOutlineBugReport, MdOutlineLightbulb, MdCheckCircleOutline } from 'react-icons/md';
import { FiMoreHorizontal } from 'react-icons/fi';
import Image from 'next/image';

const AllPost: React.FC = () => {
  return (
    <div className="min-h-screen  text-white p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Main Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* 1. Create Post Section */}
          <div className="dark:bg-[#110c1d] p-5 shadow rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500">
                 <img src="https://i.pravatar.cc/100" alt="user" />
              </div>
              <input 
                type="text" 
                placeholder="Share or Ask Something to Everyone?" 
                className="w-full bg-[#1a162e] rounded-full px-5 py-2.5 text-sm outline-none border border-white/5 focus:border-purple-500/50"
              />
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="flex items-center gap-2 text-pink-500 text-sm font-semibold hover:opacity-80">
                <HiOutlinePhotograph size={20} /> Photo/Video
              </button>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-xs font-bold transition">
                Create Post
              </button>
            </div>
          </div>

          {/* 2. Filter Tabs & Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-[#110c1d] p-1 rounded-xl border border-white/5">
              <button className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-5 py-1.5 rounded-lg text-xs font-bold">All Posts</button>
              <button className="px-5 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-300">My Posts</button>
              <button className="px-5 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-300">Admin Posts</button>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#110c1d] border border-white/5 px-4 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer group">
                <HiOutlineSearch className="text-gray-500 group-hover:text-purple-500" />
                <span className="text-xs text-gray-500 font-bold">Search</span>
              </div>
              <div className="p-2 bg-[#110c1d] border border-white/5 rounded-lg cursor-pointer text-gray-500">
                 <FiMoreHorizontal />
              </div>
            </div>
          </div>

          {/* 3. Announcement Slider Area */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[260px] bg-[#110c1d] rounded-xl border border-white/5 overflow-hidden">
                <div className="p-3 flex items-center gap-2 border-b border-white/5">
                  <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                    <img src="https://i.pravatar.cc/100?u=nasib" alt="nasib" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[10px] font-bold">Nasib Hossain</p>
                    <p className="text-[8px] text-gray-500">January 7, 2026</p>
                  </div>
                  <HiOutlineSpeakerphone className="ml-auto text-purple-500 text-xs" />
                </div>
                <div className="p-4 bg-gradient-to-b from-transparent to-purple-900/20 text-center min-h-[160px] flex flex-col justify-center items-center">
                   <h4 className="text-[11px] font-bold mb-2">Conceptual Session On NextJS (Project)</h4>
                   <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center relative overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=instructor" alt="inst" className="z-10 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-purple-600/40 mix-blend-multiply"></div>
                   </div>
                   <button className="mt-3 text-[9px] bg-yellow-500 text-black px-3 py-1 rounded font-bold">Today</button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Main Post Card (Certificate Verification) */}
          <div className="bg-[#110c1d] rounded-2xl border border-white/5 overflow-hidden p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
                  <img src="https://i.pravatar.cc/150?u=shamim" alt="profile" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Shamim Hossain</h4>
                  <p className="text-[10px] text-gray-500">15 hours ago</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/20">
                Reopened
              </span>
            </div>

            <h2 className="text-lg font-bold mb-1">certificate verification</h2>
            <p className="text-gray-400 text-xs mb-6 font-medium">certificate verification korbo kivabe</p>

            <div className="bg-[#05010d] rounded-xl border border-white/5 overflow-hidden">
                <div className="p-10 text-center bg-gradient-to-br from-purple-900/10 to-transparent">
                  <h3 className="text-xl font-bold italic mb-6">ertificate Verificatio</h3>
                  <div className="bg-[#1a162e] p-4 rounded-lg max-w-xs mx-auto text-left border border-white/5">
                    <p className="text-[8px] text-gray-500 mb-2 font-bold uppercase">Certificate Validation Number</p>
                    <div className="h-8 bg-[#05010d] rounded flex items-center px-3 mb-4">
                      <span className="text-[8px] text-gray-600 font-bold tracking-widest">CHECKING...</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded text-[10px] font-black uppercase">Check Certificate</button>
                  </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold cursor-pointer">
                <BiMessageRoundedDetail size={18} /> 2 Comments
              </div>
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                <span className="text-[9px] font-black text-red-500 uppercase">Course Topics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#110c1d] rounded-2xl border border-white/5 p-5 sticky top-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3 text-red-500"><BiCategory /> Courses Topics</div>
                <span className="text-gray-500">37</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3 text-yellow-500"><MdOutlineBugReport /> Bugs</div>
                <span className="text-gray-500">1</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3 text-pink-500"><MdOutlineLightbulb /> Feature Requests</div>
                <span className="text-gray-500">1</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3 text-purple-500"><FiMoreHorizontal /> Others</div>
                <span className="text-gray-500 text-xs">12</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3 text-blue-400"><HiOutlineSpeakerphone /> Announcements</div>
                <span className="text-gray-500">114</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold hover:bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="flex items-center gap-3 text-green-500"><MdCheckCircleOutline /> Resolved</div>
                <span className="text-gray-500">54</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllPost;