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
      try {
        // ✅ Get user's enrolled courses for course-specific notifications
        const userEnrolledCourses = await Enrollment.find({ studentId: user._id }).distinct("courseId");

        const [enrollmentsData, transactions, unreadCount] = await Promise.all([
          Enrollment.find({ studentId: user._id })
            .populate({
              path: "courseId",
              select: "title thumbnail",
            })
            .sort({ enrolledAt: -1 })
            .select("courseId courseName courseImage progress status enrolledAt")
            .lean(),

          Transaction.find({ studentId: user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("courseName amount status paymentMethod createdAt type"),

          Notification.countDocuments({
            $or: [
              { userId: user._id, isRead: false, type: { $ne: "announcement" } },
              { 
                isBroadcast: true,
                type: "announcement",
                createdBy: { $ne: user._id },
                _id: { $nin: user.readNotifications || [] },
                $or: [{ targetRole: "all" }, { targetRole: "student" }]
              }
            ],
            $and: [{ $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }] }]
          }),
        ]);

        const totalLearningTime = enrollmentsData.reduce((sum: number, e: any) => sum + (e.progress?.totalTimeSpent || 0), 0);
        const enrolledCourses = enrollmentsData.length;
        const completedCourses = enrollmentsData.filter((e: any) => e.status === "completed").length;

        return NextResponse.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            photoURL: user.photoURL || "",
            role: user.role,
          },
          stats: {
            ...(user.stats || {}),
            enrolledCourses: enrolledCourses,
            completedCourses: completedCourses,
            totalLearningTime: totalLearningTime || user.stats?.totalLearningTime || 0,
          },
          recentEnrollments: enrollmentsData.slice(0, 5) || [],
          recentTransactions: transactions || [],
          unreadNotifications: unreadCount || 0,
        });
      } catch (studentErr: any) {
        console.error("❌ Student dashboard error:", studentErr);
        return NextResponse.json({ 
          error: `Student dashboard error: ${studentErr.message}`,
          details: studentErr.stack 
        }, { status: 500 });
      }
    }

    // ── INSTRUCTOR ───────────────────────────────────────────
    if (user.role === "instructor") {
      // ✅ Get instructor's courses for course-specific notifications
      const instructorCourses = await Course.find({ instructorId: user._id }).distinct("_id");

      const [courses, recentEnrollments, monthlyEarnings, unreadCount] = await Promise.all([
        Course.find({ instructorId: user._id })
          .select("title thumbnail stats status createdAt")
          .sort({ createdAt: -1 })
          .lean(),

        Enrollment.find({ courseId: { $in: instructorCourses } })
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

        // ✅ Updated unread count for instructor (matching notifications API logic)
        Notification.countDocuments({
          $or: [
            // Individual notifications (non-broadcast)
            { 
              userId: user._id, 
              isRead: false, 
              type: { $ne: "announcement" }
            },
            // Broadcast notifications (others' published announcements)
            { 
              isBroadcast: true,
              type: "announcement",
              createdBy: { $ne: user._id }, // Not my own
              _id: { $nin: user.readNotifications || [] }, // Not already read
              $or: [
                { targetRole: "all" },
                { targetRole: "instructor" }
              ]
            }
          ],
          $and: [
            {
              $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: { $gt: new Date() } },
              ]
            }
          ]
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
        courses,
        recentEnrollments,
        monthlyEarnings,
        unreadNotifications: unreadCount,
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
        unreadCount,
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

        // ✅ Updated unread count for admin (matching notifications API logic)
        Notification.countDocuments({
          $or: [
            // Individual notifications (non-broadcast)
            { 
              userId: user._id, 
              isRead: false, 
              type: { $ne: "announcement" }
            },
            // Broadcast notifications (others' published announcements)
            { 
              isBroadcast: true,
              type: "announcement",
              createdBy: { $ne: user._id }, // Not my own
              _id: { $nin: user.readNotifications || [] }, // Not already read
              $or: [
                { targetRole: "all" },
                { targetRole: "admin" }
              ]
            }
          ],
          $and: [
            {
              $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: { $gt: new Date() } },
              ]
            }
          ]
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
        stats: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalRevenue: revenueData[0]?.total || 0,
          pendingCourses,
        },
        recentTransactions,
        unreadNotifications: unreadCount,
      });
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  } catch (err: any) {
    console.error("❌ Dashboard error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}