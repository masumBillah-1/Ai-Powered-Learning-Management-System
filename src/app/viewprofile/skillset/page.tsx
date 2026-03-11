"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Info, 
  ChevronDown, 
  Link as LinkIcon, 
  Layout, 
  Monitor, 
  Cpu,
  Settings
} from 'lucide-react';

const SkillSetPage = () => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="bg-[#11081a] rounded-2xl p-6 md:p-8 text-white border border-white/5 shadow-2xl">
      
      {/* Main Skill Set Card */}
      <div className="w-full max-w-4xl rounded-2xl  overflow-hidden ">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 px-8 border-b border-gray-800/50 bg-[#190f2d]/30">
          <div className="flex items-center gap-2">
            <h3 className="text-[#a855f7] font-semibold text-lg">Skill Set</h3>
            <Info size={16} className="text-[#a855f7] cursor-help" />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Plus size={18} /> Add Skill
          </button>
        </div>

        <div className="p-8 md:p-12">
          {!isAdding ? (
            /* --- EMPTY STATE (image_73fc98.png) --- */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-8">
                {/* Visual Illustration Mockup */}
                <div className="bg-[#1c1233] p-8 rounded-3xl border border-gray-700/30 relative">
                   <Layout size={80} className="text-slate-700" />
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-blue-500/20 p-3 rounded-full border border-blue-500/40">
                         <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                         </div>
                      </div>
                   </div>
                   <Settings size={24} className="absolute -bottom-2 -right-2 text-blue-400" />
                </div>
              </div>
              
              <p className="text-gray-400 max-w-sm mb-10 leading-relaxed">
                Currently no data exists! Please click on the following button to add your details Skill Set.
              </p>
              
              <button 
                onClick={() => setIsAdding(true)}
                className="px-10 py-3.5 bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white rounded-full font-medium hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
              >
                <Plus size={20} /> Add Skill Set
              </button>
            </div>
          ) : (
            /* --- FORM STATE (image_73fc7b.png) --- */
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div>
                <button className="px-5 py-2 border border-[#3b2271] text-[#a855f7] text-sm rounded-lg hover:bg-[#a855f7]/10 transition-colors">
                  Take a skill test
                </button>
              </div>

              <div className="space-y-8">
                <h4 className="text-[#f59e0b] font-medium text-xl">Add an Skill</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Skill Name */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-gray-300 font-light">
                      <Cpu size={18} className="text-gray-400" /> Skill Name
                    </label>
                    <div className="relative group">
                      <select className="w-full bg-[#0d071b] border border-gray-700/50 rounded-xl p-4 outline-none appearance-none focus:border-purple-500 transition-colors cursor-pointer text-gray-200">
                        <option>HTML</option>
                        <option>CSS</option>
                        <option>JavaScript</option>
                        <option>React</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-4 text-gray-500 pointer-events-none group-hover:text-gray-300 transition-colors" />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-gray-300 font-light">
                      <Monitor size={18} className="text-gray-400" /> Experience in Year
                    </label>
                    <div className="relative group">
                      <select className="w-full bg-[#0d071b] border border-gray-700/50 rounded-xl p-4 outline-none appearance-none focus:border-purple-500 transition-colors cursor-pointer text-gray-200">
                        <option>Select</option>
                        <option>1 Year</option>
                        <option>2 Years</option>
                        <option>3+ Years</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-4 text-gray-500 pointer-events-none group-hover:text-gray-300 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Project Links */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300 font-light">
                    <LinkIcon size={18} className="text-gray-400" /> Project links
                  </label>
                  <textarea 
                    className="w-full bg-[#0d071b] border border-gray-700/50 rounded-xl p-4 outline-none focus:border-purple-500 transition-colors min-h-[120px] resize-none text-gray-200"
                    placeholder="Paste your project links here..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-800/50">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-8 py-2.5 rounded-xl border border-[#3b2271] text-gray-300 hover:bg-gray-800 transition-all font-medium"
                >
                  Cancel
                </button>
                <button className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] text-white font-semibold hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all">
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

export default SkillSetPage;