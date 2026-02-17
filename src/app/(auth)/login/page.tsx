"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

  const onSubmit = (data: LoginFormData) => {
    console.log("Login Data:", data);
  };

  return (
    <div className="mt-5 mb-9 relative flex items-center justify-center overflow-hidden px-2">

      <div className="absolute inset-0" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative z-10 w-full max-w-lg text-center">
        {/* Header */}
        <p className="text-sm text-gray-300 mb-1">Welcome Back</p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white">
          Sign In your account
        </h1>
        <p className="text-sm text-gray-400 mt-1 mb-6">
          Please enter your details to sign in.
        </p>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 text-left">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="input w-full bg-white/5 border-white/20 text-white placeholder-gray-400"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input w-full bg-white/5 border-white/20 text-white placeholder-gray-400 pr-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

           
            <div className="flex items-center justify-between text-sm text-gray-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-xs" />
                Remember Me
              </label>
              <a className="text-purple-400 hover:underline cursor-pointer">
                Forgot Password?
              </a>
            </div>

       
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?
            <a
              href="/register"
              className="text-purple-400 ml-1 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
