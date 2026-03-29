import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Portal | CareerCanvas",
  description: "Explore courses, watch videos, and grow with CareerCanvas AI Learning platform.",
};

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="learn-page-container min-h-screen bg-[#0d1117]">
            {children}
        </div>
    );
}
