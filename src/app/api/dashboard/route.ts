// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import { Course, Enrollment, Transaction, Notification, SystemSettings } from "@/models";

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
    
    // ✅ Leaderboard data fetcher (accessible to any authenticated user)
    const url = new URL(req.url);
    if (url.searchParams.get("leaderboard") === "true") {
      const topUsers = await User.find({ status: "active", role: "student" })
        .sort({ "stats.totalXP": -1 })
        .limit(20)
        .select("name photoURL stats.totalXP stats.level stats.currentStreak stats.badges")
        .lean();
      
      return NextResponse.json({ 
        success: true, 
        leaderboard: topUsers.map((u: any, i: number) => ({
          id: u._id.toString(),
          name: u.name,
          xp: u.stats?.totalXP || 0,
          level: u.stats?.level || 1,
          streak: u.stats?.currentStreak || 0,
          badges: (u.stats?.badges || []).length,
          photo: u.photoURL || "",
          rank: i + 1,
          initials: u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
          trend: "stable",
          courses: (u.stats?.enrolledCourses || 0)
        }))
      });
    }

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

      const [courses, recentEnrollments, earningsStats, unreadCount, commissionSetting, payoutStatsRaw] = await Promise.all([
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
            },
          },
          {
            $group: {
              _id: "$courseId",
              totalAmount: { $sum: "$amount" },
              totalNet: { $sum: "$netAmount" },
              totalPlatform: { $sum: "$platformFee" },
              enrollments: { $count: {} },
            },
          },
        ]),

        Notification.countDocuments({
          $or: [
            { userId: user._id, isRead: false, type: { $ne: "announcement" } },
            { 
              isBroadcast: true,
              type: "announcement",
              createdBy: { $ne: user._id },
              _id: { $nin: user.readNotifications || [] },
              $or: [{ targetRole: "all" }, { targetRole: "instructor" }]
            }
          ],
          $and: [{ $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: new Date() } }] }]
        }),

        SystemSettings.findOne({ key: "platform_commission" }),
        
        // Addition: Payout Stats
        Transaction.aggregate([
          { $match: { instructorId: user._id, type: "payout", status: { $in: ["pending", "completed"] } } },
          { $group: { _id: "$status", total: { $sum: "$amount" } } },
        ]),
      ]);

      const payoutStats = payoutStatsRaw || [];
      const payoutMap = new Map(payoutStats.map((p: any) => [p._id, p.total]));
      const pendingAmount = payoutMap.get("pending") || 0;
      const completedAmount = payoutMap.get("completed") || 0;

      const commissionRate = commissionSetting ? Number(commissionSetting.value) / 100 : 0.3;

      // ✅ Re-calculate TOTAL earnings from enrollments (backup for missing transactions)
      const allEnrollments = await Enrollment.find({ courseId: { $in: instructorCourses } }).lean();
      const coursePricesArr = await Course.find({ _id: { $in: instructorCourses } }).select("_id price originalPrice").lean();
      const coursePriceMap = new Map(coursePricesArr.map((c: any) => [c._id.toString(), c.originalPrice || c.price || 0]));
      
      let totalRevenueFromEnrollments = 0;
      allEnrollments.forEach((e: any) => {
        totalRevenueFromEnrollments += (coursePriceMap.get(e.courseId.toString()) || 0);
      });

      const stats = earningsStats[0] || { totalNet: 0, totalPlatform: 0, monthly: [] };
      
      // Use re-calculated earnings if transaction-based earnings are lower (fix for missing transaction records)
      const calculatedNetFromEnrollments = totalRevenueFromEnrollments * (1 - commissionRate);
      const effectiveNetEarnings = Math.max(stats.totalNet || 0, calculatedNetFromEnrollments);
      const effectivePlatformFees = Math.max(stats.totalPlatform || 0, totalRevenueFromEnrollments * commissionRate);

      // Filter monthly data for the chart (last 6 months)
      const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
      const monthlyEarningsMap = new Map();
      
      (stats.monthly || []).forEach((t: any) => {
        if (new Date(t.date) >= sixMonthsAgo) {
          const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
          monthlyEarningsMap.set(month, (monthlyEarningsMap.get(month) || 0) + (t.amount || 0));
        }
      });

      const monthlyEarnings = Array.from(monthlyEarningsMap.entries())
        .map(([id, total]) => ({ _id: id, total }))
        .sort((a, b) => a._id.localeCompare(b._id));

      const totalNetEarnings = stats.totalNet || 0;
      
      return NextResponse.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: user.role,
        },
        stats: {
          ...user.stats,
          totalNetAmount: effectiveNetEarnings,
          totalPlatformFee: effectivePlatformFees,
        },
        commissionRate,
        courses,
        recentEnrollments,
        monthlyEarnings,
        withdrawStats: {
          available: Math.max(0, effectiveNetEarnings - pendingAmount - completedAmount),
          pending: pendingAmount,
          totalWithdrawn: completedAmount,
          totalLifetime: effectiveNetEarnings,
        },
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
          { 
            $group: { 
              _id: null, 
              total: { $sum: "$amount" },
              profit: { $sum: "$platformFee" }
            } 
          },
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
          totalProfit: revenueData[0]?.profit || 0,
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

// ── Withdrawal Request Handler ──
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { action, amount, payoutMethod, accountDetails } = await req.json();

    if (action === "withdraw") {
      if (!amount || amount <= 0 || !payoutMethod || !accountDetails) {
        return NextResponse.json({ error: "Invalid withdrawal details" }, { status: 400 });
      }

      const instructorId = auth.userId;
      const instructorCourses = await Course.find({ instructorId: instructorId }).distinct("_id");

      // Verify available balance by synchronizing with logic in GET request
      const [earningsStats, payouts, commissionSetting, allEnrollments, coursePricesArr] = await Promise.all([
        Transaction.aggregate([
          { $match: { instructorId, type: "payment", status: "completed" } },
          { $group: { _id: null, totalNet: { $sum: "$netAmount" } } },
        ]),
        Transaction.aggregate([
          { $match: { instructorId, type: "payout", status: { $in: ["pending", "completed"] } } },
          { $group: { _id: "$status", total: { $sum: "$amount" } } },
        ]),
        SystemSettings.findOne({ key: "platform_commission" }),
        Enrollment.find({ courseId: { $in: instructorCourses } }).lean(),
        Course.find({ _id: { $in: instructorCourses } }).select("_id price originalPrice").lean()
      ]);

      const commissionRate = commissionSetting ? Number(commissionSetting.value) / 100 : 0.3;
      const coursePriceMap = new Map(coursePricesArr.map((c: any) => [c._id.toString(), c.originalPrice || c.price || 0]));
      
      let totalRevenueFromEnrollments = 0;
      allEnrollments.forEach((e: any) => {
        totalRevenueFromEnrollments += (coursePriceMap.get(e.courseId.toString()) || 0);
      });

      const stats = earningsStats[0] || { totalNet: 0 };
      const calculatedNetFromEnrollments = totalRevenueFromEnrollments * (1 - commissionRate);
      const effectiveNetEarnings = Math.max(stats.totalNet || 0, calculatedNetFromEnrollments);

      const payoutMap = new Map(payouts.map((p: any) => [p._id, p.total]));
      const availableBalance = effectiveNetEarnings - (payoutMap.get("pending") || 0) - (payoutMap.get("completed") || 0);

      if (amount < 500) {
        return NextResponse.json({ error: "Minimum withdrawal amount is 500" }, { status: 400 });
      }

      if (amount > availableBalance) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }

      if (availableBalance < 500) {
        return NextResponse.json({ error: "Insufficient balance. Minimum 500 required to withdraw." }, { status: 400 });
      }

      const user = await User.findById(instructorId).select("name");

      const transaction = await Transaction.create({
        type: "payout",
        amount: amount,
        status: "pending",
        instructorId: instructorId,
        instructorName: user?.name || "Instructor",
        payoutMethod: payoutMethod.toLowerCase(),
        accountDetails: accountDetails,
        description: `Withdrawal request via ${payoutMethod}`,
      });

      return NextResponse.json({
        success: true,
        message: "Withdrawal request submitted successfully",
        transaction
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("POST /api/dashboard:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}