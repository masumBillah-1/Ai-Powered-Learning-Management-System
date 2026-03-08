"use client";

import React from 'react';
import { LogOut, ArrowLeft, Mail, Lock, EyeOff, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const LogoutPage = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF0F2] font-sans">
      <div className="flex w-full h-screen bg-white overflow-hidden shadow-2xl">
        
        {/* LEFT SIDE: Illustration (Exact mirror of DreamsLMS Login) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#FFF5F7] flex-col items-center justify-center p-12 xl:p-24 border-r border-pink-50 relative">
          <div className="max-w-[550px] text-center">
            <div className="relative inline-block mb-12">
              <img 
                src="https://dreamslms.dreamstechnologies.com/html/assets/img/login-img.png" 
                alt="Welcome Illustration" 
                className="w-full h-auto relative z-10"
              />
            </div>
            <h2 className="text-[36px] xl:text-[42px] font-black text-[#171717] leading-tight mb-6">
              Welcome to <span className="text-[#FF4667]">SmartLMS</span> Courses.
            </h2>
            <p className="text-gray-500 text-lg font-bold leading-relaxed mb-10 px-10">
              Platform designed to help organizations, educators, and learners manage, deliver, and track learning activities.
            </p>
            <div className="flex justify-center gap-3">
              <div className="w-10 h-2 bg-[#FF4667] rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Logout Form Content */}
        <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 md:p-20 xl:p-32 bg-white relative overflow-y-auto">
          
          {/* Top Branding & Navigation */}
          <div className="flex justify-between items-center mb-12 lg:mb-16">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-[#832388] rounded-xl shadow-lg shadow-purple-100">
                   <div className="w-6 h-6 border-2 border-white rounded-md relative flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                </div>
                <span className="text-2xl font-black text-[#171717] tracking-tighter">Smart<span className="text-[#832388] text-[10px] align-top ml-0.5 font-bold uppercase tracking-widest">LMS</span></span>
             </div>
             
             <Link href="/" className="text-sm font-black text-[#FF4667] hover:underline transition-all">
                Back to Home
             </Link>
          </div>

          <div className="max-w-[480px] w-full mx-auto my-auto">
            {/* Header section matching image_71351a.png */}
            <div className="mb-10">
              <h1 className="text-[32px] md:text-[40px] font-black text-[#171717] mb-8 tracking-tight">Sign into Your Account</h1>
              
              {/* Email Input Field */}
              <div className="mb-6">
                <label className="block text-sm font-black text-[#171717] mb-2">Email <span className="text-[#FF4667]">*</span></label>
                <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full py-4 px-5 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#FF4667] focus:outline-none transition-all font-bold text-gray-600 placeholder:text-gray-300 pr-12"
                  />
                  <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FF4667] transition-colors" size={20} />
                </div>
              </div>

              {/* Password Input Field */}
              <div className="mb-4">
                <label className="block text-sm font-black text-[#171717] mb-2">Password <span className="text-[#FF4667]">*</span></label>
                <div className="relative group">
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full py-4 px-5 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#FF4667] focus:outline-none transition-all font-bold text-gray-600 placeholder:text-gray-300 pr-12"
                  />
                  <EyeOff className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FF4667] transition-colors cursor-pointer" size={20} />
                </div>
              </div>

              {/* Remember Me & Forgot Password link as per image_71351a.png */}
              <div className="flex items-center justify-between mb-10">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 border-2 border-gray-200 rounded accent-[#FF4667]" />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">Remember Me</span>
                </label>
                <Link href="/" className="text-sm font-black text-[#FF4667] hover:underline">Forgot Password ?</Link>
              </div>
            </div>

            {/* Login/Sign Out Button Styled like the Red Button in image */}
            <div className="space-y-4">
              <button 
                className="w-full py-5 bg-[#FF4667] text-white rounded-2xl font-black text-lg shadow-xl shadow-pink-200 hover:bg-[#832388] transition-all flex items-center justify-center gap-2 transform active:scale-95 group"
              >
                Login <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-4 py-6 text-gray-200">
                <div className="h-px w-full bg-gray-100"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Or</span>
                <div className="h-px w-full bg-gray-100"></div>
              </div>

              {/* Social Logins as per image footer */}
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 border-2 border-gray-100 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" /> Google
                </button>
                <button className="py-4 border-2 border-gray-100 rounded-2xl text-sm font-black text-gray-500 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-3">
                  <img src="https://www.facebook.com/favicon.ico" className="w-4 h-4" alt="F" /> Facebook
                </button>
              </div>
            </div>

            {/* Signup Link as per image footer */}
            <p className="mt-10 text-center text-sm font-bold text-gray-400">
              Don't you have an account? <Link href="/" className="text-[#FF4667] font-black hover:underline">Sign up</Link>
            </p>
          </div>

          
        </div>

      </div>
    </div>
  );
};

export default LogoutPage;