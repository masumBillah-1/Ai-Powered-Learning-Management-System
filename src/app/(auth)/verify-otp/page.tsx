"use client";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const mode = searchParams.get("mode") || ""; // "login" হলে dashboard এ যাবে

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [done, setDone] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // ✅ Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ✅ OTP Verify — login mode হলে token save করে dashboard এ যাবে
  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) { toast.error("৬ সংখ্যার OTP দিন!"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // ✅ Login mode — token save করে dashboard এ যাও
      if (mode === "login" && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Login successful!");
        setTimeout(() => {
          if (data.user.role === "admin") window.location.href = "/dashboard/admin";
          else if (data.user.role === "instructor") window.location.href = "/dashboard/instructor";
          else window.location.href = "/dashboard/student";
        }, 800);
        return;
      }

      // ✅ Normal OTP mode
      setDone(true);
      toast.success("OTP verified!");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP!");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      toast.success("নতুন OTP পাঠানো হয়েছে!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
  };

  // ✅ Success State (non-login mode)
  if (done) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center p-4">
        <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] rounded-2xl p-10 max-w-md w-full text-center shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#832388] to-[#F0772F] flex items-center justify-center mx-auto">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">OTP Verified!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">আপনার identity confirm হয়েছে।</p>
          <Link href="/login" className="flex items-center justify-center w-full h-11 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:opacity-90 transition">
            Login করুন →
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center px-4 py-16 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-transparent dark:to-transparent" />

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/90 dark:bg-[#120B1E] border border-gray-200 dark:border-[#2D2438] rounded-2xl p-8 shadow-2xl">

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✉️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {mode === "login" ? "Login Verification" : "OTP Verification"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                <span className="font-medium text-purple-600 dark:text-purple-400">{email}</span>
                <br />এ পাঠানো ৬ সংখ্যার OTP দিন।
              </p>
              {mode === "login" && (
                <p className="text-xs text-amber-500 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg">
                  🔐 Security verification — OTP দিয়ে login confirm করুন
                </p>
              )}
            </div>

            {/* 6 OTP Input Boxes */}
            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`w-12 h-12 text-center text-xl font-bold rounded-lg border-2 transition outline-none
                    bg-white dark:bg-[#1B1229] text-gray-900 dark:text-white
                    ${digit ? "border-purple-500" : "border-gray-300 dark:border-[#2D2438]"}
                    focus:border-purple-500 dark:focus:border-purple-400`}
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || otp.join("").length !== 6}
              className="w-full h-11 rounded-lg text-white font-bold bg-gradient-to-r from-[#832388] via-[#E3436B] to-[#F0772F] hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "login" ? "Logging in..." : "Verifying..."}
                </span>
              ) : mode === "login" ? "Verify & Login" : "Verify OTP"}
            </button>

            {/* Resend */}
            <div className="mt-4 text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Resend OTP in <span className="font-bold text-purple-600 dark:text-purple-400">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-gray-500 dark:text-gray-400 hover:underline text-sm">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
