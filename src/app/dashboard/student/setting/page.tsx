"use client";

import React from 'react';
import { Camera, Trash2, Calendar, ChevronDown } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black text-[#171717] mb-6">Settings</h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap">
          {['Edit Profile', 'Security', 'Social Profiles', 'Linked Accounts', 'Notifications', 'Billing Address'].map((tab, index) => (
            <button
              key={tab}
              className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                index === 0 
                ? "border-[#FF4667] text-[#FF4667]" 
                : "border-transparent text-gray-500 hover:text-[#FF4667]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* Personal Details Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm">
            <h2 className="text-xl font-black text-[#171717] mb-8">Personal Details</h2>
            
            {/* Profile Photo Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 pb-10 border-b border-gray-50">
              <div className="relative group">
                <img 
                  src="https://dreamslms.dreamstechnologies.com/html/assets/img/user/user-11.jpg" 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-[#FF4667] text-white rounded-full shadow-lg">
                  <Camera size={14} />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-black text-[#171717] mb-1">Profile Photo</h3>
                <p className="text-sm text-gray-400 font-medium mb-4">PNG or JPG no bigger than 800px width and height</p>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-black hover:bg-gray-200 transition-all">Upload</button>
                  <button className="px-6 py-2 bg-[#FF4667]/10 text-[#FF4667] rounded-xl text-sm font-black hover:bg-[#FF4667] hover:text-white transition-all">Delete</button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-black text-[#171717] mb-2">First Name <span className="text-[#FF4667]">*</span></label>
                <input type="text" defaultValue="Ronald" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#FF4667] outline-none font-bold text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-black text-[#171717] mb-2">Last Name <span className="text-[#FF4667]">*</span></label>
                <input type="text" defaultValue="Richard" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#FF4667] outline-none font-bold text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-black text-[#171717] mb-2">User Name <span className="text-[#FF4667]">*</span></label>
                <input type="text" defaultValue="studentdemo" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#FF4667] outline-none font-bold text-gray-600" />
              </div>
              <div>
                <label className="block text-sm font-black text-[#171717] mb-2">Phone Number <span className="text-[#FF4667]">*</span></label>
                <input type="text" defaultValue="90154-91036" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#FF4667] outline-none font-bold text-gray-600" />
              </div>
              <div className="relative">
                <label className="block text-sm font-black text-[#171717] mb-2">Gender <span className="text-[#FF4667]">*</span></label>
                <select className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#FF4667] outline-none font-bold text-gray-600 appearance-none">
                  <option>Select</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <ChevronDown className="absolute right-5 top-[52px] text-gray-400" size={18} />
              </div>
              <div className="relative">
                <label className="block text-sm font-black text-[#171717] mb-2">DOB <span className="text-[#FF4667]">*</span></label>
                <input type="text" placeholder="dd/mm/yyyy" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#FF4667] outline-none font-bold text-gray-600" />
                <Calendar className="absolute right-5 top-[52px] text-gray-400" size={18} />
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-black text-[#171717] mb-2">Bio <span className="text-[#FF4667]">*</span></label>
              <textarea 
                rows={4}
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:border-[#FF4667] outline-none font-bold text-gray-600 resize-none"
                defaultValue="Hello! I'm Ronald Richard. I'm passionate about developing innovative software solutions, analyzing classic literature. I aspire to become a software developer, work as an editor."
              />
            </div>

            <button className="px-10 py-4 bg-[#FF4667] text-white rounded-2xl font-black text-sm hover:bg-[#832388] transition-all shadow-lg shadow-pink-100">
              Update Profile
            </button>
          </div>

          {/* Delete Account Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm">
            <h2 className="text-xl font-black text-[#171717] mb-4">Delete Account</h2>
            <div className="mb-8">
              <p className="font-black text-[#171717] mb-2">Are you sure you want to delete your account?</p>
              <p className="text-sm text-gray-400 font-bold">Refers to the action of permanently removing a user's account and associated data from a system, service and platform.</p>
            </div>
            <button className="px-10 py-4 bg-[#FF4667] text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all shadow-lg shadow-pink-100">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;