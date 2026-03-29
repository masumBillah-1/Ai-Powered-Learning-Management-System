"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

type LoginFormData = { email: string; password: string; };

const roleDashboard: Record<string, string> = {
  admin: "/dashboard/admin",
  instructor: "/dashboard/instructor",
  student: "/dashboard/student",
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.3 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.8 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

function LoginContent() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checking, setChecking] = useState(true); // checking existing session
  const [showDemoButtons, setShowDemoButtons] = useState(true); // demo buttons visibility

  // Demo credentials
  const demoCredentials = {
    admin: { email: "admin@demo.com", password: "demo123" },
    instructor: { email: "instructor@demo.com", password: "demo123" },
    student: { email: "student@demo.com", password: "demo123" },
  };

  // ── If already logged in → redirect immediately ──────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");

    if (token && raw) {
      try {
        const user = JSON.parse(raw);
        const dest = redirectUrl || roleDashboard[user.role] || "/dashboard/student";
        router.replace(dest);
        return;
      } catch { /* corrupt data — fall through */ }
    }
    setChecking(false);
  }, [router, redirectUrl]);

  // ── Fetch demo login visibility setting ──────
  useEffect(() => {
    const fetchDemoSetting = async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        if (data.success && data.settings) {
          setShowDemoButtons(data.settings.showDemoLogin ?? true);
        }
      } catch (error) {
        // Default to true if fetch fails
        setShowDemoButtons(true);
      }
    };
    fetchDemoSetting();
  }, []);

  const doRedirect = (role: string) => {
    const dest = redirectUrl || roleDashboard[role] || "/dashboard/student";
    router.replace(dest);
  };

  // ── Google Login ──────────────────────────────────────
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
      toast.success("🎉 Google login successful!");
      setTimeout(() => doRedirect(data.user.role), 500);
    } catch (err: any) {
      toast.error("🚫 " + (err.message || "Google login failed"));
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Email/Password Login ──────────────────────────────
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await res.json();

      if (!res.ok) {
        if (result.locked) {
          toast.error("🔒 " + result.error);
          return;
        }
        if (result.error === "Invalid email or password") {
          toast.error("❌ Email বা Password ভুল! আবার চেষ্টা করুন।");
          return;
        }
        if (result.error?.includes("social login")) {
          toast.error("🔗 " + result.error);
          return;
        }
        toast.error("❌ " + (result.error || "Login failed"));
        return;
      }

      if (result.requireOtp) {
        toast.success("📧 OTP পাঠানো হয়েছে! Email চেক করুন।");
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&mode=login${redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : ""}`);
        }, 600);
        return;
      }

      // ✅ Direct login (for demo accounts manual entry)
      if (result.token && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success(`🎉 Welcome ${result.user.name}!`);
        setTimeout(() => doRedirect(result.user.role), 500);
        return;
      }

    } catch (err: any) {
      toast.error("⚠️ " + (err.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  // ── Demo Login Handler ──────────────────────────────
  const handleDemoLogin = async (role: "admin" | "instructor" | "student") => {
    const credentials = demoCredentials[role];
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error("❌ Demo login failed. Please create demo users first.");
        return;
      }

      if (result.requireOtp) {
        toast.success("📧 OTP পাঠানো হয়েছে! Email চেক করুন।");
        setTimeout(() => {
          router.push(`/verify-otp?email=${encodeURIComponent(credentials.email)}&mode=login${redirectUrl ? `&redirect=${encodeURIComponent(redirectUrl)}` : ""}`);
        }, 600);
        return;
      }

      // Direct login (demo account bypass)
      if (result.token && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success(`🎉 Welcome ${result.user.name}!`);
        setTimeout(() => doRedirect(result.user.role), 500);
        return;
      }

    } catch (err: any) {
      toast.error("⚠️ Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Show nothing while checking existing session ──────
  if (checking) return null;

  return (
    <>
      <Navbar />
      <title>Login</title>

      <div className="py-16 relative flex items-center justify-center overflow-hidden px-2 min-h-screen bg-white dark:bg-[#05010D] transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-transparent dark:to-transparent" />
        <div className="absolute inset-0 backdrop-blur-3xl" />

        <div className="relative z-10 w-full max-w-lg text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Welcome Back</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">Sign In your account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-6">Please enter your details to sign in.</p>

          <div className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-gray-200 dark:border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 text-left transition-colors">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="input w-full bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                  })}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 block mb-1 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="input w-full bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-10 focus:border-purple-500"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300">
                  <input type="checkbox" className="checkbox checkbox-xs" />
                  Remember Me
                </label>
                <Link href="/forgot-password" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending OTP...
                  </span>
                ) : "Sign In"}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-300 dark:bg-white/10" />
              <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">OR CONTINUE WITH</span>
              <div className="flex-1 h-px bg-gray-300 dark:bg-white/10" />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition disabled:opacity-50 shadow-sm text-sm font-medium cursor-pointer"
              >
                {googleLoading
                  ? <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  : <GoogleIcon />
                }
                Google
              </button>

              <Link
                href="/api/auth/github"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition shadow-sm text-sm font-medium"
              >
                <GitHubIcon />
                GitHub
              </Link>
            </div>

            <p className="text-center text-sm text-gray-700 dark:text-gray-400 mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-purple-600 dark:text-purple-400 ml-1 hover:underline font-semibold">Sign Up</Link>
            </p>

            {/* Demo Login Buttons - Conditional */}
            {showDemoButtons && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
                <p className="text-center text-md text-gray-600 dark:text-gray-400 mb-3 font-bold ">
                  Quick Demo Login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition text-purple-700 dark:text-purple-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xs font-semibold">Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin("instructor")}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition text-blue-700 dark:text-blue-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    <span className="text-xs font-semibold">Instructor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin("student")}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg border border-orange-300 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition text-orange-700 dark:text-orange-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    <span className="text-xs font-semibold">Student</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}