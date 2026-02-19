"use client";
import CourseCard from "@/app/dashboard/main/CourseCard";

export default function MyClassesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex justify-center items-start">
            <div className="w-full max-w-4xl">
                <CourseCard />
            </div>
        </div>
    );
}
