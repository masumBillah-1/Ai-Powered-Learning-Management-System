"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const password = watch("password");

  const redirect = (role: string) => {
    if (role === "admin") window.location.href = "/dashboard/admin";
    else if (role === "instructor") window.location.href = "/dashboard/instructor";
    else window.location.href = "/dashboard/student";
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: u.displayName, email: u.email, photoURL: u.photoURL, provider: "google" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Google login successful!");
      setTimeout(() => redirect(data.user.role), 800);
    } catch (err: any) {
      toast.error(err.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ✅ Email/Password Register
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, phone: data.phone, password: data.password }),
      });
      const result = await res.json();
      
      console.log("Register response:", { status: res.status, result });
      
      if (!res.ok) {
        console.log("Register failed:", result.error);
        
        if (result.error === "Email already exists") {
          toast.error("এই email দিয়ে আগেই account আছে! Login করুন।");
          setTimeout(() => { window.location.href = "/login"; }, 2000);
          return;
        }
        
        toast.error(result.error || "Registration failed");
        return;
      }
      
      setRegistered(true);
      toast.success("Registration successful!");
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Screen
  if (registered) {
    return (
      <>
        <Navbar />
        <div className="py-16 flex items-center justify-center bg-white dark:bg-[#05010D] px-4 transition-colors relative overflow-hidden min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-transparent dark:to-transparent" />
          <div className="w-full max-w-[420px] text-center relative z-10">
            <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-5 transition-colors">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Registration Complete!</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                আপনার account সফলভাবে তৈরি হয়েছে।<br />এখন login করুন।
              </p>
              <Link href="/login" className="w-full h-11 mt-2 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] flex items-center justify-center hover:opacity-90 transition">
                Login করুন →
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="py-16 flex items-center justify-center bg-white dark:bg-[#05010D] px-4 transition-colors relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-transparent dark:to-transparent" />
        <div className="absolute inset-0 backdrop-blur-3xl" />

        <div className="w-full max-w-[550px] flex flex-col relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign Up your account</h2>
            <p className="text-gray-600 dark:text-gray-400 text-[12px] mt-1">Please enter your details to sign up.</p>
          </div>

          <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] p-7 rounded-2xl shadow-2xl transition-colors">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Name</label>
                <input type="text" placeholder="Enter your name"
                  className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                  {...register("name", { required: "Name is required" })} />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Email</label>
                <input type="email" placeholder="Enter your email"
                  className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Phone No. (Optional)</label>
                <div className="flex items-center h-10 bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] rounded-lg px-3 focus-within:border-purple-500 transition">
                  <span className="text-gray-900 dark:text-white text-sm mr-2">🇧🇩 +880</span>
                  <input type="tel" inputMode="numeric" placeholder="1XXXXXXXXX"
                    className="bg-transparent flex-1 text-[13px] text-gray-900 dark:text-white outline-none placeholder-gray-500 dark:placeholder-gray-400"
                    {...register("phone", { 
                      validate: (value) => {
                        if (!value) return true; // Optional
                        const digits = value.replace(/\D/g, "");
                        return (digits.length >= 10 && digits.length <= 11) || "Valid phone number দিন";
                      }
                    })} />
                </div>
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Password"
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                    {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })} />
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password"
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                    {...register("confirmPassword", { required: "Confirm your password", validate: v => v === password || "Passwords do not match" })} />
                  <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full h-11 mt-4 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition">
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-300 dark:bg-[#2D2438]" />
              <span className="text-gray-600 dark:text-gray-500 text-xs font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-[#2D2438]" />
            </div>

            {/* ✅ Social Buttons — Google + GitHub */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-[#2D2438] bg-white dark:bg-[#1B1229] text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2D2438] transition disabled:opacity-50 shadow-sm text-sm font-medium"
              >
                {googleLoading
                  ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <GoogleIcon />
                }
                Google
              </button>

              {/* GitHub */}
              <Link
                href="/api/auth/github"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-[#2D2438] bg-white dark:bg-[#1B1229] text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2D2438] transition shadow-sm text-sm font-medium"
              >
                <GitHubIcon />
                GitHub
              </Link>
            </div>

            <p className="text-center text-[12px] text-gray-700 dark:text-gray-400 pt-3">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 dark:text-[#E02994] font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;