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

type InstructorFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z" />
  </svg>
);

const BecomeInstructor = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<InstructorFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const password = watch("password");

  // ✅ Google Login as Instructor
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;

      const res = await fetch("/api/auth/become-instructor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: u.displayName,
          email: u.email,
          photoURL: u.photoURL,
          provider: "google"
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to become instructor");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(data.message || "Welcome Instructor!");
      setTimeout(() => { window.location.href = "/dashboard/instructor"; }, 1000);

    } catch (err: any) {
      toast.error(err.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  // ✅ Email/Password Registration as Instructor
  const onSubmit = async (data: InstructorFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/become-instructor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password
        }),
      });

      const result = await res.json();

      console.log("Become instructor response:", { status: res.status, result });

      if (!res.ok) {
        toast.error(result.error || "Failed to register");
        return;
      }

      // ✅ If OTP required (new user with email/password)
      if (result.requireOtp) {
        toast.success("Registration successful! Check your email for OTP.");
        setTimeout(() => {
          window.location.href = `/verify-otp?email=${encodeURIComponent(data.email)}&mode=register`;
        }, 1000);
        return;
      }

      // ✅ If no OTP required (existing user upgraded to instructor)
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success(result.message);
        setTimeout(() => { window.location.href = "/dashboard/instructor"; }, 1000);
        return;
      }

      setSuccess(true);

    } catch (err: any) {
      console.error("Become instructor error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Screen
  if (success) {
    return (
      <>
        <Navbar />
        <div className="py-16 flex items-center justify-center bg-white dark:bg-[#05010D] px-4 transition-colors relative overflow-hidden min-h-screen">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-transparent dark:to-transparent" />
          <div className="w-full max-w-[420px] text-center relative z-10">
            <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Instructor! 👨‍🏫</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                আপনার instructor account সফলভাবে তৈরি হয়েছে!<br />
                এখন login করুন এবং course তৈরি করা শুরু করুন।
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
      <title>Become an Instructor</title>

      <div className="py-16 flex items-center justify-center bg-white dark:bg-[#05010D] px-4 transition-colors relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-transparent dark:to-transparent" />
        <div className="absolute inset-0 backdrop-blur-3xl" />

        <div className="w-full max-w-[550px] flex flex-col relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Become an Instructor 👨‍🏫</h2>
            <p className="text-gray-600 dark:text-gray-400 text-[12px] mt-1">
              Share your knowledge and earn by teaching on our platform
            </p>
          </div>

          <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] p-7 rounded-2xl shadow-2xl">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                  })}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Phone (Optional)</label>
                <div className="flex items-center h-10 bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] rounded-lg px-3 focus-within:border-purple-500 transition">
                  <span className="text-gray-900 dark:text-white text-sm mr-2">🇧🇩 +880</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="1XXXXXXXXX"
                    className="bg-transparent flex-1 text-[13px] text-gray-900 dark:text-white outline-none placeholder-gray-500 dark:placeholder-gray-400"
                    {...register("phone", {
                      validate: (value) => {
                        if (!value) return true;
                        const digits = value.replace(/\D/g, "");
                        return (digits.length >= 10 && digits.length <= 11) || "Valid phone number required";
                      }
                    })}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" }
                    })}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-[12px] text-gray-700 dark:text-gray-300 ml-1 font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-[13px] placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: v => v === password || "Passwords do not match"
                    })}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-4 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition"
              >
                {loading ? "Processing..." : "Become an Instructor"}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-300 dark:bg-[#2D2438]" />
              <span className="text-gray-600 dark:text-gray-500 text-xs font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-[#2D2438]" />
            </div>

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-[#2D2438] bg-white dark:bg-[#1B1229] text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2D2438] transition disabled:opacity-50 shadow-sm text-sm font-medium mb-4"
            >
              {googleLoading ? (
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            <p className="text-center text-[12px] text-gray-700 dark:text-gray-400 pt-3">
              Already an instructor?{" "}
              <Link href="/login" className="text-purple-600 dark:text-[#E02994] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BecomeInstructor;