"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaLock,
  FaArrowRight,
  FaSpinner,
  FaBook,
  FaStar,
  FaShieldAlt,
  FaCreditCard,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";

// ── Stripe init ───────────────────────────────────────────────────────────────
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface CourseInfo {
  title: string;
  coverImage?: { url: string };
  pricing: {
    type: string;
    price: number;
    discountPrice?: number;
  };
  instructorId?: { name: string; photoURL?: string };
  level?: string;
  category?: string;
  enrolledCount?: number;
}

// ── Inner CheckoutForm (Stripe Elements এর ভেতরে থাকতে হবে) ──────────────────
function CheckoutForm({
  courseId,
  courseName,
  amount,
  onSuccess,
}: {
  courseId: string;
  courseName: string;
  amount: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg("");

    // Return URL — এখানে payment_intent query param auto-inject হবে Stripe দ্বারা
    const returnUrl = `${window.location.origin}/enrollment/${courseId}?courseId=${courseId}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (error) {
      setErrorMsg(error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
    // Success হলে Stripe নিজেই redirect করবে return_url এ
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FaCreditCard className="text-[#C81D77]" />
          <span className="font-bold text-gray-800 dark:text-white">
            Payment Details
          </span>
        </div>
        <PaymentElement
          options={{
            layout: "tabs",
            paymentMethodOrder: ["card"],
          }}
        />
      </div>

      {/* Error */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium"
          >
            ⚠️ {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!stripe || !elements || loading}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
        style={{
          background: loading
            ? "#888"
            : "linear-gradient(90deg, #C81D77, #6710C2)",
        }}
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <FaLock className="text-sm" />
            Pay ৳{amount.toLocaleString()} Securely
            <FaArrowRight className="text-sm" />
          </>
        )}
      </motion.button>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <FaShieldAlt className="text-green-500" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center gap-1">
          <FaLock className="text-blue-500" />
          <span>256-bit Encryption</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCheckCircle className="text-purple-500" />
          <span>Stripe Powered</span>
        </div>
      </div>
    </form>
  );
}

// ── Success View ──────────────────────────────────────────────────────────────
function SuccessView({ courseName }: { courseName: string }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/sampleDashboard/student/courses");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
      className="text-center py-12 px-6"
    >
      {/* Animated Check */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}
      >
        <FaCheckCircle className="text-white text-4xl" />
      </motion.div>

      {/* Sparkles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <HiSparkles className="text-yellow-400 text-xl animate-pulse" />
          <span className="text-4xl font-black text-gray-900 dark:text-white">
            Enrollment Successful!
          </span>
          <HiSparkles className="text-yellow-400 text-xl animate-pulse" />
        </div>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
          You are now enrolled in
        </p>
        <p className="text-xl font-black text-[#C81D77] mb-6">{courseName}</p>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 mb-8 border border-purple-100 dark:border-purple-800">
          <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            🎉 Redirecting to your courses in a moment...
          </p>
        </div>

        <Link href="/sampleDashboard/student/courses">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl text-white font-black text-lg shadow-xl flex items-center gap-2 mx-auto"
            style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
          >
            Go to My Courses <FaArrowRight />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EnrollmentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;

  // Stripe redirect করলে এগুলো আসে
  const paymentIntentId = searchParams.get("payment_intent");
  const paymentIntentStatus = searchParams.get("payment_intent_client_secret");

  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: Stripe redirect থেকে ফিরে আসলে payment verify করো ──────────────
  useEffect(() => {
    if (paymentIntentId && courseId) {
      verifyPayment(paymentIntentId);
    }
  }, [paymentIntentId, courseId]);

  const verifyPayment = async (intentId: string) => {
    setVerifying(true);
    try {
      const res = await fetch(
        `/api/transactions/checkout?payment_intent=${intentId}&courseId=${courseId}`
      );
      const data = await res.json();

      if (data.success && data.status === "succeeded") {
        setSuccess(true);
        // Course name set করো
        if (course?.title) {
          // already loaded
        } else {
          const courseRes = await fetch(`/api/courses/${courseId}`);
          const courseData = await courseRes.json();
          if (courseData.success) setCourse(courseData.course);
        }
      } else {
        setError(data.message || "Payment verification failed");
      }
    } catch {
      setError("Something went wrong during verification");
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  // ── Step 2: Normal page load — course info + PaymentIntent তৈরি করো ──────────
  useEffect(() => {
    if (!paymentIntentId) {
      initCheckout();
    }
  }, [courseId]);

  const initCheckout = async () => {
    try {
      setLoading(true);

      // Course details আনো
      const courseRes = await fetch(`/api/courses/${courseId}`);
      const courseData = await courseRes.json();
      if (!courseData.success) {
        setError("Course not found");
        setLoading(false);
        return;
      }
      setCourse(courseData.course);

      // Free course হলে সরাসরি enroll করো
      if (courseData.course.pricing?.type === "free") {
        const res = await fetch("/api/transactions/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        const data = await res.json();
        if (data.success && data.free) {
          setSuccess(true);
        } else if (data.error === "Already enrolled in this course") {
          router.push("/sampleDashboard/student/courses");
        } else {
          setError(data.error || "Enrollment failed");
        }
        setLoading(false);
        return;
      }

      // Paid course — PaymentIntent তৈরি করো
      const checkoutRes = await fetch("/api/transactions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutData.error === "Already enrolled in this course") {
        router.push("/sampleDashboard/student/courses");
        return;
      }

      if (!checkoutData.success || !checkoutData.clientSecret) {
        setError(checkoutData.error || "Failed to initialize payment");
        setLoading(false);
        return;
      }

      setClientSecret(checkoutData.clientSecret);
      setAmount(checkoutData.amount);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const discountPercent =
    course?.pricing?.discountPrice && course?.pricing?.price
      ? Math.round(
          ((course.pricing.price - course.pricing.discountPrice) /
            course.pricing.price) *
            100
        )
      : 0;

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C81D77, #6710C2)" }}
          >
            <FaSpinner className="text-white text-3xl animate-spin" />
          </div>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {verifying ? "Verifying payment..." : "Preparing checkout..."}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Please wait a moment
          </p>
        </motion.div>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0b1120] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            {error}
          </h2>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-300 hover:border-[#C81D77] transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={initCheckout}
              className="px-6 py-3 rounded-xl text-white font-bold"
              style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success State ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120] flex items-center justify-center">
        <div className="max-w-lg w-full mx-4 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div
            className="h-2 w-full"
            style={{ background: "linear-gradient(90deg, #C81D77, #6710C2)" }}
          />
          <SuccessView courseName={course?.title || "this course"} />
        </div>
      </div>
    );
  }

  // ── Main Checkout UI ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-[#0b1120] dark:via-[#1a1535] dark:to-[#0b1120] py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 mb-4">
            <HiSparkles className="text-[#C81D77] animate-pulse" />
            <span className="text-xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Complete Your Enrollment
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Course Summary ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Course Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              {/* Course Image */}
              {course?.coverImage?.url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.coverImage.url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/600x300?text=Course";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {course?.category && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-black uppercase tracking-wider border border-white/30">
                        {course.category}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                  {course?.title}
                </h2>

                {/* Instructor */}
                {course?.instructorId?.name && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-[#C81D77] flex items-center justify-center">
                      {course.instructorId.photoURL ? (
                        <img
                          src={course.instructorId.photoURL}
                          alt={course.instructorId.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">
                          {course.instructorId.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {course.instructorId.name}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {course?.level && (
                    <span className="px-2 py-1 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-bold text-xs">
                      {course.level}
                    </span>
                  )}
                  {course?.enrolledCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <FaBook className="text-xs" />
                      <span>{course.enrolledCount}+ students</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                Order Summary
              </h3>

              <div className="space-y-3">
                {course?.pricing?.discountPrice && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      Original Price
                    </span>
                    <span className="text-gray-400 line-through">
                      ৳{course.pricing.price?.toLocaleString()}
                    </span>
                  </div>
                )}

                {discountPercent > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Discount ({discountPercent}% off)
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      -৳
                      {(
                        (course?.pricing?.price || 0) -
                        (course?.pricing?.discountPrice || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                  <span className="font-black text-gray-900 dark:text-white text-lg">
                    Total
                  </span>
                  <span
                    className="text-3xl font-black"
                    style={{
                      background: "linear-gradient(90deg, #C81D77, #6710C2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ৳{amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* What you get */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                {[
                  "Lifetime access",
                  "Certificate of completion",
                  "Mobile & desktop access",
                  "24/7 support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <FaCheckCircle className="text-[#C81D77] text-xs flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Payment Form ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              {/* Top gradient bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: "linear-gradient(90deg, #C81D77, #6710C2)",
                }}
              />

              <div className="p-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FaLock className="text-[#C81D77]" />
                  Payment Information
                </h3>

                {clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#C81D77",
                          colorBackground: "#ffffff",
                          colorText: "#1f2937",
                          colorDanger: "#ef4444",
                          fontFamily: "system-ui, sans-serif",
                          spacingUnit: "4px",
                          borderRadius: "12px",
                        },
                      },
                    }}
                  >
                    <CheckoutForm
                      courseId={courseId}
                      courseName={course?.title || ""}
                      amount={amount}
                      onSuccess={() => setSuccess(true)}
                    />
                  </Elements>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FaSpinner className="animate-spin text-2xl mx-auto mb-3 text-[#C81D77]" />
                    <p>Loading payment form...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Back Link */}
            <div className="text-center mt-4">
              <button
                onClick={() => router.back()}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#C81D77] transition-colors font-medium"
              >
                ← Back to course details
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}