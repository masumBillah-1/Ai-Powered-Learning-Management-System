// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import { Course, Enrollment, Transaction, Notification } from "@/models";

async function getAuthUser(req: NextRequest) {
  // cookie অথবা Authorization header দুটোই check করো
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const user = await User.findById(auth.userId)
      .select("-password -resetToken -resetTokenExpiry");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ── STUDENT ──────────────────────────────────────────────
    if (user.role === "student") {
      const [enrollments, transactions, unreadCount] = await Promise.all([
        Enrollment.find({ studentId: user._id })
          .sort({ enrolledAt: -1 })
          .limit(5)
          .select("courseName courseImage progress status enrolledAt"),

        Transaction.find({ studentId: user._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("courseName amount status paymentMethod createdAt type"),

        Notification.countDocuments({
          $or: [
            { userId: user._id, isRead: false },
            { isBroadcast: true, targetRole: { $in: ["all", "student"] }, isRead: false },
          ],
        }),
      ]);

      return NextResponse.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: user.role,
        },
        stats: user.stats,
        recentEnrollments: enrollments,
        recentTransactions: transactions,
        unreadNotifications: unreadCount,
      });
    }

    // ── INSTRUCTOR ───────────────────────────────────────────
    if (user.role === "instructor") {
      const [courses, recentEnrollments, monthlyEarnings] = await Promise.all([
        Course.find({ instructorId: user._id })
          .select("title coverImage stats status createdAt")
          .sort({ createdAt: -1 }),

        Enrollment.find({ courseId: { $in: await Course.find({ instructorId: user._id }).distinct("_id") } })
          .sort({ enrolledAt: -1 })
          .limit(5)
          .select("courseName studentId progress enrolledAt"),

        Transaction.aggregate([
          {
            $match: {
              instructorId: user._id,
              type: "payment",
              status: "completed",
              createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
            },
          },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              total: { $sum: "$netAmount" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ]);

      return NextResponse.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: user.role,
        },
        stats: user.stats,
        courses,
        recentEnrollments,
        monthlyEarnings,
      });
    }

    // ── ADMIN ────────────────────────────────────────────────
    if (user.role === "admin") {
      const [
        totalUsers,
        totalCourses,
        totalEnrollments,
        revenueData,
        recentTransactions,
        pendingCourses,
      ] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments({ status: "published" }),
        Enrollment.countDocuments(),

        Transaction.aggregate([
          { $match: { type: "payment", status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),

        Transaction.find({ type: "payment" })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("courseName studentName amount status paymentMethod createdAt"),

        Course.countDocuments({ status: "draft" }),
      ]);

      return NextResponse.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: user.role,
        },
        stats: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalRevenue: revenueData[0]?.total || 0,
          pendingCourses,
        },
        recentTransactions,
      });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  } catch (err: any) {
    console.error("❌ Dashboard error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}