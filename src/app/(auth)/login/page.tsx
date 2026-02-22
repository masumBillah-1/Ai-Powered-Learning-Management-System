"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";


type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  // ✅ Email/Password Login
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error === "Invalid email or password") {
          toast.error("Account পাওয়া যায়নি! Register করুন।");
          setTimeout(() => { window.location.href = "/register"; }, 2000);
          return;
        }
        throw new Error(result.error || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", result.token);
      toast.success("Login successful!");

      setTimeout(() => {
        if (result.user.role === "admin") window.location.href = "/dashboard/admin";
        else if (result.user.role === "instructor") window.location.href = "/dashboard/instructor";
        else window.location.href = "/dashboard/student";
      }, 1000);

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 mb-9 relative flex items-center justify-center overflow-hidden px-2">
      <div className="absolute inset-0" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <p className="text-sm text-gray-300 mb-1">Welcome Back</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white">Sign In your account</h1>
        <p className="text-sm text-gray-400 mt-1 mb-6">Please enter your details to sign in.</p>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 text-left">

          {/* ✅ Google Button — উপরে */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 mb-5 rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-400 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="input w-full bg-white/5 border-white/20 text-white placeholder-gray-400"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                })}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input w-full bg-white/5 border-white/20 text-white placeholder-gray-400 pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-xs" />
                Remember Me
              </label>
              <a className="text-purple-400 hover:underline cursor-pointer">Forgot Password?</a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-purple-400 ml-1 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;