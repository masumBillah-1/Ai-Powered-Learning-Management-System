"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, Plus, Calendar, 
  Trash2, Globe, Shield, 
  Bell, CreditCard, User 
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');

  const tabs = [
    'Profile', 'Security', 'Plans', 'Social Profiles', 
    'Linked Accounts', 'Notifications', 'Integrations', 'Withdraw'
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <h1 className="text-2xl font-black text-gray-800 dark:text-white mb-6 tracking-tight">Settings</h1>

      {/* --- Tab Navigation --- */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl mb-8 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold transition-all relative ${
                activeTab === tab 
                ? 'text-pink-500' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl space-y-8">
        {/* --- Profile Content --- */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-sm">
          
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-10 pb-10 border-b dark:border-slate-800">
            <div className="relative group">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white mb-1">Your Avatar</h3>
              <p className="text-sm font-bold text-gray-400 mb-3">PNG or JPG no bigger than 800px width and height</p>
              <div className="flex gap-3">
                <button className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-xs font-black hover:bg-gray-200 transition-colors">Upload</button>
                <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-xs font-black hover:bg-pink-600 transition-colors">Delete</button>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-gray-800 dark:text-white">Personal Details</h3>
            <p className="text-xs font-bold text-gray-400 -mt-4">Edit your personal information</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 dark:text-gray-300">First Name <span className="text-pink-500">*</span></label>
                <input type="text" defaultValue="Eugene" className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 dark:text-gray-300">Last Name <span className="text-pink-500">*</span></label>
                <input type="text" defaultValue="Andre" className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 dark:text-gray-300">User Name <span className="text-pink-500">*</span></label>
                <input type="text" defaultValue="instructordemo" className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 dark:text-gray-300">Phone Number <span className="text-pink-500">*</span></label>
                <input type="text" defaultValue="90154-91036" className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-gray-600" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-black text-gray-700 dark:text-gray-300">Bio <span className="text-pink-500">*</span></label>
                <textarea rows={4} className="w-full p-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 font-medium text-gray-600">I am a web developer with a vast array of knowledge in many different front end and back end languages, responsive frameworks, databases, and best code practices.</textarea>
              </div>
            </div>
          </div>

          {/* Educational Details */}
          <div className="mt-12 space-y-6">
            <h3 className="text-lg font-black text-gray-800 dark:text-white">Educational Details</h3>
            <p className="text-xs font-bold text-gray-400 -mt-4">Edit your Educational information</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500">Degree <span className="text-pink-500">*</span></label>
                <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500">University <span className="text-pink-500">*</span></label>
                <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500">From Date <span className="text-pink-500">*</span></label>
                <div className="relative">
                  <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500">To Date <span className="text-pink-500">*</span></label>
                <div className="relative">
                  <input type="text" className="w-full p-3 bg-gray-50 dark:bg-slate-800 border rounded-xl" />
                  <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
            <button className="text-pink-500 font-black text-sm flex items-center gap-1 mt-2 hover:underline">
              <Plus size={16} /> Add New
            </button>
          </div>

          <button className="mt-12 bg-pink-500 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all">
            Update Profile
          </button>
        </section>

        {/* Delete Account Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">Delete Account</h3>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-400 mb-1">Are you sure you want to delete your account?</p>
          <p className="text-xs font-medium text-gray-400 mb-6">Refers to the action of permanently removing a user's account and associated data from a system, service and platform.</p>
          <button className="bg-pink-500 text-white px-8 py-3 rounded-xl font-black hover:bg-pink-600 transition-all">
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;