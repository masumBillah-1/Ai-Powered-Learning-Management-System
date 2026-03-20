import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { User, AdminLog, Course, Enrollment, Transaction } from "@/models";
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

// ✅ GET - Fetch user profile with role-based data
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view");

    // Only handle profile view
    if (view !== "profile") {
      return NextResponse.json({ error: "Invalid view parameter" }, { status: 400 });
    }

    await connectDB();

    // Fetch user with profile data
    const user = await User.findById(id)
      .select("-password -resetToken -resetTokenExpiry")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response: any = { user };

    // Role-based data fetching
    if (user.role === "instructor") {
      // Fetch instructor's courses
      const courses = await Course.find({ instructorId: id })
        .select("title thumbnail price status enrollmentCount createdAt")
        .sort({ createdAt: -1 })
        .lean();

      // Calculate stats
      const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);
      const totalEarnings = await Transaction.aggregate([
        { $match: { instructorId: user._id, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      response.courses = courses;
      response.stats = {
        totalCourses: courses.length,
        totalStudents,
        totalEarnings: totalEarnings[0]?.total || 0,
        rating: user.stats?.rating || 0,
      };
    } else if (user.role === "student") {
      // Fetch student's enrollments with course details
      const enrollments = await Enrollment.find({ studentId: id })
        .populate({
          path: "courseId",
          select: "title thumbnail price",
        })
        .sort({ enrolledAt: -1 })
        .lean();

      // Calculate total spent
      const totalSpent = await Transaction.aggregate([
        { $match: { studentId: user._id, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]);

      // Format enrollments
      const formattedEnrollments = enrollments.map((e: any) => ({
        _id: e._id,
        courseTitle: e.courseId?.title || "Unknown Course",
        courseThumbnail: e.courseId?.thumbnail || "",
        price: e.courseId?.price || 0,
        progress: e.progress?.progressPercentage || 0,
        status: e.status,
        enrolledAt: e.enrolledAt,
      }));

      response.enrollments = formattedEnrollments;
      response.stats = {
        totalEnrolled: enrollments.length,
        completedCourses: enrollments.filter((e: any) => e.status === "completed").length,
        totalSpent: totalSpent[0]?.total || 0,
      };
    } else if (user.role === "admin") {
      // Fetch admin activity logs
      const logs = await AdminLog.find({ adminId: id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      // Format logs with icons and colors
      const formattedLogs = logs.map((log: any) => {
        let icon = "📝";
        let color = "#6366f1";
        let action = log.action;

        switch (log.action) {
          case "approve_course":
            icon = "✅";
            color = "#00C48C";
            action = "Approved";
            break;
          case "reject_course":
            icon = "❌";
            color = "#FF0F7B";
            action = "Rejected";
            break;
          case "delete_course":
            icon = "🗑️";
            color = "#dc2626";
            action = "Deleted";
            break;
          case "ban_user":
            icon = "🚫";
            color = "#F89B29";
            action = "Banned";
            break;
          case "unban_user":
            icon = "✅";
            color = "#00C48C";
            action = "Unbanned";
            break;
          case "delete_user":
            icon = "🗑️";
            color = "#dc2626";
            action = "Deleted";
            break;
          default:
            icon = "📝";
            color = "#6366f1";
            action = log.action.replace(/_/g, " ");
        }

        return {
          action,
          type: log.targetType,
          target: log.targetName || "Unknown",
          date: log.createdAt,
          icon,
          color,
        };
      });

      response.adminLogs = formattedLogs;
    }

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("❌ GET /api/admin/users/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PATCH - Update user status (ban/unban)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    await connectDB();
    const { status } = await req.json();

    if (!["active", "suspended", "banned"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };
    
    // ✅ Save admin ID who banned/unbanned
    if (status === "suspended" || status === "banned") {
      updateData.bannedBy = auth.userId;
      updateData.bannedAt = new Date();
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: "-password -resetToken -resetTokenExpiry" }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Log admin action to AdminLog
    try {
      const action = (status === "suspended" || status === "banned") ? "ban_user" : "unban_user";
      await AdminLog.create({
        adminId: auth.userId,
        action,
        targetType: "user",
        targetId: user._id,
        targetName: user.name,
        metadata: {
          email: user.email,
          role: user.role,
        },
      });
    } catch (logErr) {
      console.error("Failed to create admin log:", logErr);
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("❌ PATCH /api/admin/users/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    await connectDB();
    
    // ✅ Get admin password from request body
    const body = await req.json().catch(() => ({}));
    const { adminPassword } = body;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin password required for verification" }, { status: 400 });
    }

    // ✅ Get admin user to check if they have password (credentials login) or not (OAuth)
    const admin = await User.findById(auth.userId).select("+password");
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    let isPasswordValid = false;

    // ✅ Check if admin has password (credentials login)
    if (admin.password) {
      // Verify using bcrypt for credentials users
      const bcrypt = require("bcryptjs");
      isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    } else {
      // ✅ For OAuth users (Google/GitHub), use master password from env
      const masterPassword = process.env.ADMIN_DELETE_PASSWORD;
      if (!masterPassword) {
        return NextResponse.json({ 
          error: "Admin master password not configured. Contact system administrator." 
        }, { status: 500 });
      }
      isPasswordValid = adminPassword === masterPassword;
    }
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    // ⚠️ Prevent deleting yourself
    if (id === auth.userId) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    // ✅ Mark as deleted instead of hard delete (soft delete)
    const user = await User.findByIdAndUpdate(
      id,
      {
        deletedBy: auth.userId,
        deletedAt: new Date(),
        status: "suspended" // Also suspend the account
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Log admin action to AdminLog
    try {
      await AdminLog.create({
        adminId: auth.userId,
        action: "delete_user",
        targetType: "user",
        targetId: user._id,
        targetName: user.name,
        metadata: {
          email: user.email,
          role: user.role,
        },
      });
    } catch (logErr) {
      console.error("Failed to create admin log:", logErr);
    }

    // TODO: Also delete related data (enrollments, courses if instructor, etc.)

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    console.error("❌ DELETE /api/admin/users/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
