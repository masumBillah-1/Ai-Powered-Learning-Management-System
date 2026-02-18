"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

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

  const password = watch("password");

  const onSubmit = (data: RegisterFormData) => {
    console.log("Register Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05010D] p-4">
      <div className="w-full max-w-[550px] flex flex-col">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Sign Up your account
          </h2>
          <p className="text-gray-400 text-[12px] mt-1">
            Please enter your details to sign up.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#120B1E] border border-[#2D2438] p-7 rounded-2xl shadow-2xl">
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
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
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
                    minLength: {
                      value: 11,
                      message: "Phone number must be 11 digits",
                    },
                    maxLength: {
                      value: 11,
                      message: "Phone number must be 11 digits",
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.phone.message}
                </p>
              )}
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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[12px] text-gray-300 ml-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-10 px-3 pr-10 rounded-lg bg-[#1B1229] border border-[#2D2438] text-white text-[13px]"
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <span
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 mt-4 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F]"
            >
              Sign Up
            </button>
            
            <p className="text-center text-[12px] text-gray-400 pt-3">
              Already have an account?{" "}
              <Link href="/login" className="text-[#E02994] font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
