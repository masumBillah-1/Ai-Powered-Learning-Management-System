"use client";

import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  School, 
  Calendar, 
  Plus, 
  PencilLine,
  Lightbulb,
  ChevronDown
} from 'lucide-react';

const EducationPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="  flex items-center justify-center p-4">
      {/* Main Education Card */}
      <div className="w-full max-w-4xl bg-[#11081a] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="flex justify-between items-center p-5 px-6 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-lg font-medium text-white/90 tracking-wide">Education</h2>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <PencilLine size={19} />
          </button>
        </div>

        <div className="p-8 md:p-10">
          {!isEditing ? (
            /* --- EMPTY STATE (image_7fbaff.png) --- */
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in duration-500">
              <div className="relative mb-8">
                 {/* Lightbulb Icon with Glow Effect */}
                 <div className="bg-yellow-400/5 p-6 rounded-3xl border border-yellow-400/10 shadow-[0_0_40px_rgba(250,204,21,0.05)]">
                    <Lightbulb size={60} className="text-yellow-400/90 fill-yellow-400/10" />
                 </div>
              </div>
              <p className="text-gray-400/80 max-w-xs mb-10 text-[15px] leading-relaxed">
                Currently No Data Exists! Please Click On The Following Button To Add Your Details Education.
              </p>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white px-10 py-3.5 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-purple-900/20"
              >
                <Plus size={20} /> Add Education
              </button>
            </div>
          ) : (
            /* --- FORM STATE (image_7fbafa.png) --- */
            <div className="space-y-7 animate-in fade-in slide-in-from-bottom-3 duration-500">
              
              {/* Education Level */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[14px] text-gray-400/90">
                  <BookOpen size={17} className="text-gray-500" /> Select your Education level
                </label>
                <div className="relative group">
                  <select className="w-full bg-[#0d071b] border border-white/10 rounded-xl p-4 text-gray-300 appearance-none outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all cursor-pointer">
                    <option>JSC/JDC/8 pass</option>
                    <option>SSC</option>
                    <option>HSC</option>
                    <option>Graduation</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-gray-300 transition-colors" />
                </div>
              </div>

              {/* Degree Title */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[14px] text-gray-400/90">
                  <GraduationCap size={17} className="text-gray-500" /> Exam/Degree Title
                </label>
                <div className="relative group">
                  <select className="w-full bg-[#0d071b] border border-white/10 rounded-xl p-4 text-gray-300 appearance-none outline-none focus:border-purple-500/50 transition-all cursor-pointer">
                    <option value="" >Select Degree</option>
                    <option>Science</option>
                    <option>Commerce</option>
                    <option>Arts</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Institution */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[14px] text-gray-400/90">
                  <School size={17} className="text-gray-500" /> Institution Name
                </label>
                <div className="relative group">
                  <select className="w-full bg-[#0d071b] border border-white/10 rounded-xl p-4 text-gray-300 appearance-none outline-none focus:border-purple-500/50 transition-all cursor-pointer">
                    <option value="" >Select Institution</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Checkbox Study Status */}
              <label className="flex items-center gap-3.5 cursor-pointer group w-fit py-1">
                <div className="relative flex items-center">
                    <input type="checkbox" className="peer w-5 h-5 rounded-md border-white/10 bg-[#0d071b] accent-purple-600 cursor-pointer" />
                </div>
                <span className="text-[14px] text-gray-400 group-hover:text-gray-200 transition-colors">I'm Currently Studying</span>
              </label>

              {/* Passing Year */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2.5 text-[14px] text-gray-400/90">
                  <Calendar size={17} className="text-gray-500" /> Passing Year
                </label>
                <input 
                  type="text" 
                  defaultValue="2026"
                  className="w-full md:w-40 bg-[#0d071b] border border-white/10 rounded-xl p-4 text-gray-300 outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              {/* CS Student Radio Options */}
              <div className="space-y-4">
                <label className="flex items-center gap-2.5 text-[14px] text-gray-400/90">
                  <School size={17} className="text-gray-500" /> Are you a CSE/CS student?
                </label>
                <div className="flex gap-10 pl-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="cs_student" className="w-4 h-4 accent-purple-600 bg-transparent border-white/20" /> 
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="cs_student" className="w-4 h-4 accent-purple-600 bg-transparent border-white/20" /> 
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">No</span>
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-4 pt-10 border-t border-white/5">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium text-[15px]"
                >
                  Cancel
                </button>
                <button className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white font-semibold text-[15px] hover:shadow-[0_0_25px_rgba(147,51,234,0.35)] transition-all">
                  Save changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducationPage;