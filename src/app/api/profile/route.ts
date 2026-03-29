import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { User } from "@/models";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    // ✅ Support fetching other user's basic info via userId query param
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");
    
    // If userId is provided, return basic user info (name, photoURL only)
    if (requestedUserId && requestedUserId !== decoded.userId) {
      const requestedUser = await User.findById(requestedUserId).select("name photoURL role");
      if (!requestedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ 
        success: true, 
        user: {
          _id: requestedUser._id,
          name: requestedUser.name,
          photoURL: requestedUser.photoURL,
          role: requestedUser.role
        }
      });
    }
    
    // Otherwise, return full profile for logged-in user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = new mongoose.Types.ObjectId(decoded.userId);
    const userObj = user.toObject();

    // ── Instructor stats ─────────────────────────────────────────────────────
    // Ensure stats object exists and preserve gamification fields
    if (!userObj.stats) userObj.stats = {};

    // ── Instructor stats ─────────────────────────────────────────────────────
    if (user.role === "instructor") {
      const courses = await Course.find({ instructorId: userId }).select("_id enrollmentCount rating reviewCount").lean();
      const courseIds = courses.map((c: any) => c._id);
      const earningsAgg = await Transaction.aggregate([
        { $match: { courseId: { $in: courseIds }, status: "completed", type: "payment" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);
      const totalStudents = courses.reduce((sum: number, c: any) => sum + (c.enrollmentCount || 0), 0);
      const totalReviews  = courses.reduce((sum: number, c: any) => sum + (c.reviewCount   || 0), 0);
      const avgRating = totalReviews > 0 ? courses.reduce((sum: number, c: any) => sum + (c.rating || 0) * (c.reviewCount || 0), 0) / totalReviews : 0;

      userObj.stats = {
        ...userObj.stats,
        totalCourses  : courses.length,
        totalStudents,
        totalEarnings : earningsAgg[0]?.total || 0,
        rating        : parseFloat(avgRating.toFixed(1)),
        reviewCount   : totalReviews,
      };
    }
    // ── Student stats ────────────────────────────────────────────────────────
    else if (user.role === "student") {
      const [enrollments, certificateCount] = await Promise.all([
        Enrollment.find({ studentId: userId }).select("status progress certificate").lean(),
        Enrollment.countDocuments({ studentId: userId, "certificate.issued": true }),
      ]);
      const enrolled = enrollments.length;
      const completed = enrollments.filter((e: any) => e.status === "completed").length;
      const totalTime = enrollments.reduce((sum: number, e: any) => sum + (e.progress?.totalTimeSpent || 0), 0);

      userObj.stats = {
        ...userObj.stats,
        enrolledCourses: enrolled,
        completedCourses: completed,
        certificatesEarned: certificateCount,
        totalLearningTime: totalTime,
      };
    }
    // ── Admin stats ─────────────────────────────────────────────────────────
    else if (user.role === "admin") {
      const [totalUsers, totalCourses, revenueAgg, activeUsers] = await Promise.all([
        User.countDocuments({ role: { $in: ["student", "instructor"] }, status: "active" }),
        Course.countDocuments({ status: "published", isPublished: true }),
        Transaction.aggregate([
          { $match: { status: "completed", type: "payment" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Enrollment.countDocuments({ "progress.lastAccessedAt": { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      ]);

      userObj.stats = {
        ...userObj.stats,
        totalUsers,
        totalCourses,
        totalRevenue: revenueAgg[0]?.total || 0,
        activeUsers,
      };
    }

    return NextResponse.json({ success: true, user: userObj });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const body = await req.json();
    
    const { name, photoURL, phone, profile, preferences } = body;

    // Build update object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    if (phone !== undefined) updateData.phone = phone || null;
    
    // Update profile fields
    if (profile) {
      if (profile.bio !== undefined) updateData["profile.bio"] = profile.bio;
      if (profile.expertise !== undefined) updateData["profile.expertise"] = profile.expertise;
      if (profile.experience !== undefined) updateData["profile.experience"] = profile.experience;
      if (profile.education !== undefined) updateData["profile.education"] = profile.education;
      if (profile.socialLinks) {
        if (profile.socialLinks.website !== undefined) updateData["profile.socialLinks.website"] = profile.socialLinks.website;
        if (profile.socialLinks.linkedin !== undefined) updateData["profile.socialLinks.linkedin"] = profile.socialLinks.linkedin;
        if (profile.socialLinks.github !== undefined) updateData["profile.socialLinks.github"] = profile.socialLinks.github;
        if (profile.socialLinks.twitter !== undefined) updateData["profile.socialLinks.twitter"] = profile.socialLinks.twitter;
      }
    }

    // Update preferences
    if (preferences) {
      if (preferences.emailNotifications !== undefined) updateData["preferences.emailNotifications"] = preferences.emailNotifications;
      if (preferences.pushNotifications !== undefined) updateData["preferences.pushNotifications"] = preferences.pushNotifications;
      if (preferences.theme !== undefined) updateData["preferences.theme"] = preferences.theme;
      if (preferences.language !== undefined) updateData["preferences.language"] = preferences.language;
      if (preferences.timezone !== undefined) updateData["preferences.timezone"] = preferences.timezone;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}