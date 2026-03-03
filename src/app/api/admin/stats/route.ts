import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();

    // Get all users
    const users = await User.find({}).select("-password").lean();
    
    // Get all courses
    const courses = await Course.find({}).lean();

    // Calculate stats
    const totalRevenue = courses.reduce((sum, course) => sum + (course.revenue || 0), 0);
    const totalStudents = users.filter(u => u.role === "student").length;
    const totalInstructors = users.filter(u => u.role === "instructor").length;
    const pendingUsers = users.filter(u => u.status === "pending").length;
    const pendingCourses = courses.filter(c => c.status === "pending").length;

    // Recent activity (last 10 users)
    const recentUsers = users.slice(-10).reverse();

    return NextResponse.json({
      success: true,
      data: {
        users,
        courses,
        stats: {
          totalRevenue,
          totalStudents,
          totalInstructors,
          totalCourses: courses.length,
          pendingUsers,
          pendingCourses,
          pendingTotal: pendingUsers + pendingCourses,
        },
        recentUsers,
      },
    });
  } catch (error: any) {
    console.error("❌ Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
