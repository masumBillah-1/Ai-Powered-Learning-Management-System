"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
      toast.success("Reset link পাঠানো হয়েছে!");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center px-4 py-16 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-transparent dark:to-transparent" />

        <div className="relative z-10 w-full max-w-md">
          {sent ? (
            /* ✅ Success State */
            <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] rounded-2xl p-10 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center mx-auto mb-4 text-2xl">
                📧
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Sent!</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                <span className="font-medium text-purple-600 dark:text-purple-400">{email}</span> এ reset link পাঠানো হয়েছে। Email চেক করুন।
              </p>
              <Link href="/login" className="block w-full h-11 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] flex items-center justify-center hover:opacity-90 transition">
                ← Back to Login
              </Link>
            </div>
          ) : (
            /* ✅ Form State */
            <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🔐</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  আপনার email দিন, reset link পাঠানো হবে।
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 dark:text-gray-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    required
                    className="w-full h-11 px-3 rounded-lg bg-white dark:bg-[#1B1229] border border-gray-300 dark:border-[#2D2438] text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:border-purple-500 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-5 text-center space-y-2">
                <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline text-sm block">
                  ← Back to Login
                </Link>
                <Link href="/send-otp" className="text-gray-500 dark:text-gray-400 hover:underline text-sm block">
                  OTP দিয়ে verify করবেন? →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}