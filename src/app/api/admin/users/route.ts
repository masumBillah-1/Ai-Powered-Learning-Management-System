import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// ✅ Auth helper
async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    // ✅ Admin authentication check
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    await connectDB();
    
    // pagination or limit to prevent large data crashes
    const url = new URL(req.url);
    const limitParams = parseInt(url.searchParams.get("limit") || "100");
    const deletedBy = url.searchParams.get("deletedBy");
    const bannedBy = url.searchParams.get("bannedBy");

    let query: any = {
      deletedAt: { $exists: false } // ✅ Exclude soft-deleted users
    };
    
    // ✅ Filter by admin who deleted users (if explicitly requested)
    if (deletedBy && deletedBy !== "null") {
      query.deletedBy = deletedBy;
      delete query.deletedAt; // Show deleted users when filtering by deletedBy
    }
    
    // ✅ Filter by admin who banned users
    if (bannedBy && bannedBy !== "null") {
      query.bannedBy = bannedBy;
    }

    const users = await User.find(query)
      .select("-password -resetToken -resetTokenExpiry -verificationToken -lockUntil")
      .sort({ createdAt: -1 })
      .limit(limitParams)
      .lean();
    
    // ✅ Fetch course counts for each user
    const { default: Course } = await import("@/models/Course");
    const { default: Enrollment } = await import("@/models/Enrollment");
    
    const usersWithStats = await Promise.all(
      users.map(async (user: any) => {
        let stats = { enrolledCourses: 0, totalCourses: 0, approvedCourses: 0 };
        
        if (user.role === "instructor") {
          // Count courses created by this instructor
          stats.totalCourses = await Course.countDocuments({ instructorId: user._id });
        } else if (user.role === "student") {
          // Count enrollments for this student
          stats.enrolledCourses = await Enrollment.countDocuments({ studentId: user._id });
        } else if (user.role === "admin") {
          // ✅ Count courses approved by this admin
          stats.approvedCourses = await Course.countDocuments({ approvedBy: user._id });
        }
        
        return { ...user, stats };
      })
    );
    
    // Provide total count separately
    const totalCount = await User.countDocuments();
    
    return NextResponse.json({ total: totalCount, users: usersWithStats });
  } catch (err: any) {
    console.error("❌ GET /api/admin/users error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
