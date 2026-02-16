"use client";

import React from "react";
import Link from "next/link";


const Register =() => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#05010D] p-4">
          
            <div className="w-full max-w-[550px] flex flex-col">
                
                {/* Header Section - Positioned above the card */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        Sign Up your account
                    </h2>
                    <p className="text-gray-400 text-[12px] mt-1">
                        Please enter your details to sign Up.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#120B1E] border border-[#2D2438] p-7 rounded-2xl shadow-2xl">
                    <form className="space-y-3.5">
                        {/* Input Group: Name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-gray-300 ml-1">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name here"
                                className="w-full h-10 px-3 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px] placeholder:text-gray-600 focus:outline-none focus:border-purple-600 transition-all"
                            />
                        </div>

                        {/* Input Group: Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-gray-300 ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email here"
                                className="w-full h-10 px-3 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px] placeholder:text-gray-600 focus:outline-none focus:border-purple-600 transition-all"
                            />
                        </div>

                        {/* Input Group: Phone */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-gray-300 ml-1">Phone No.</label>
                            <div className="flex items-center h-10 bg-[#1B1229] border border-[#2D2438] rounded-lg px-3 focus-within:border-purple-600 transition-all">
                                <div className="flex items-center gap-2 pr-2 border-r border-[#2D2438] cursor-pointer">
                                    <span className="text-base">🇧🇩</span>
                                    <span className="text-[8px] text-gray-400">▼</span>
                                    <span className="text-[12px] text-white font-medium">+880</span>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone No."
                                    className="bg-transparent border-none flex-1 text-[13px] pl-3 text-white focus:ring-0 outline-none placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Input Group: Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full h-10 px-3 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px] placeholder:text-gray-600 focus:outline-none focus:border-purple-600 transition-all"
                                />
                                {/* <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-300" size={16} /> */}
                            </div>
                        </div>

                        {/* Input Group: Confirm Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full h-10 px-3 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px] placeholder:text-gray-600 focus:outline-none focus:border-purple-600 transition-all"
                                />
                                {/* <Eye className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-300" size={16} /> */}
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded bg-[#1B1229] border-[#2D2438] text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-[11px] text-gray-400">
                                I agree to the <Link href="#" className="text-purple-500 underline decoration-purple-500/30">terms and conditions</Link>
                            </span>
                        </div>

                        {/* Gradient Submit Button */}
                        <button
                            type="submit"
                            className="w-full h-11 rounded-lg text-white font-bold text-sm mt-4 transition-all hover:opacity-90 active:scale-[0.98] shadow-lg shadow-purple-900/20 bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] "
                           
                        >
                            Sign Up
                        </button>

                        {/* Footer Link */}
                        <p className="text-center text-[12px] text-gray-400 pt-3">
                            Already have an account? <Link href="/login" className="text-[#E02994] font-semibold hover:underline">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;