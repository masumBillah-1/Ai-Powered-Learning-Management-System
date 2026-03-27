"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const user = searchParams.get("user");
    const token = searchParams.get("token");

    if (user && token) {
      // Save to localStorage
      localStorage.setItem("user", user);
      localStorage.setItem("token", token);

      // Parse user to get role
      const userData = JSON.parse(decodeURIComponent(user));

      // Redirect based on role
      if (userData.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (userData.role === "instructor") {
        router.replace("/dashboard/instructor");
      } else {
        router.replace("/dashboard/student");
      }
    } else {
      router.replace("/login?error=auth_failed");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#05010D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
