"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";

type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const password = watch("password");

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: "google",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Google login successful!");
      setTimeout(() => {
        if (data.user.role === "admin") window.location.href = "/dashboard/admin";
        else if (data.user.role === "instructor") window.location.href = "/dashboard/instructor";
        else window.location.href = "/dashboard/student";
      }, 1000);

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Email or phone already exists") {
          toast.error("এই email দিয়ে আগেই account আছে! Login করুন।");
          setTimeout(() => { window.location.href = "/login"; }, 2000);
          return;
        }
        throw new Error(result.error || "Registration failed");
      }

      setRegistered(true);
      toast.success("Registration successful!");

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Screen
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05010D] p-4">
        <div className="w-full max-w-[420px] text-center">
          <div className="bg-[#120B1E] border border-[#2D2438] p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Registration Complete!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              আপনার account সফলভাবে তৈরি হয়েছে।<br />এখন login করুন।
            </p>
            <Link
              href="/login"
              className="w-full h-11 mt-2 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] flex items-center justify-center hover:opacity-90 transition"
            >
              Login করুন →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05010D] p-4">
      <div className="w-full max-w-[550px] flex flex-col">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Sign Up your account</h2>
          <p className="text-gray-400 text-[12px] mt-1">Please enter your details to sign up.</p>
        </div>

        <div className="bg-[#120B1E] border border-[#2D2438] p-7 rounded-2xl shadow-2xl">

          {/* ✅ Google Button — উপরে */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 mb-5 rounded-lg border border-[#2D2438] bg-[#1B1229] text-white hover:bg-[#2D2438] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* ✅ OR Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#2D2438]" />
            <span className="text-gray-500 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-[#2D2438]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">

            {/* Name */}
            <div>
              <label className="text-[12px] text-gray-300 ml-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full h-10 px-3 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px]"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-[12px] text-gray-300 ml-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-10 px-3 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px]"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-[12px] text-gray-300 ml-1">Phone No.</label>
              <div className="flex items-center h-10 bg-[#1B1229] border border-[#2D2438] rounded-lg px-3">
                <span className="text-white text-sm mr-2">🇧🇩 +880</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="1XXXXXXXXX"
                  className="bg-transparent flex-1 text-[13px] text-white outline-none"
                  {...register("phone", {
                    required: "Phone number is required",
                    minLength: { value: 11, message: "Phone number must be 11 digits" },
                    maxLength: { value: 11, message: "Phone number must be 11 digits" },
                  })}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-[12px] text-gray-300 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[12px] text-gray-300 ml-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px]"
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white">
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-4 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-center text-[12px] text-gray-400 pt-3">
              Already have an account?{" "}
              <Link href="/login" className="text-[#E02994] font-semibold">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;