import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Enrollment, Course, User } from "@/models";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getDecoded(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }; }
  catch { return null; }
}

// ─── GET ──────────────────────────────────────────────────────────────────────
// Handles two modes:
//   A) Student view  → GET /api/enrollments?courseId=   (নিজের enrollments)
//   B) Instructor view → GET /api/enrollments?instructorId=<id>&populate=student
//                     → GET /api/enrollments?mine=true&populate=student   (cookie থেকে)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId      = searchParams.get("courseId");
    const instructorId  = searchParams.get("instructorId");
    const populateUser  = searchParams.get("populate") === "student";
    const mineOnly      = searchParams.get("mine") === "true";
    const limit         = parseInt(searchParams.get("limit") || "50");
    const status        = searchParams.get("status"); // optional filter

    // ── Mode B: Instructor চাইছে তার course এর students ────────────────────────
    const isInstructorView = (instructorId || (mineOnly && decoded.role === "instructor"));

    if (isInstructorView) {
      const targetInstructorId = instructorId || decoded.userId;

      // 1. Instructor এর সব published/draft course IDs বের করো
      const courses = await Course.find(
        { instructorId: new mongoose.Types.ObjectId(targetInstructorId) },
        { _id: 1, title: 1, coverImage: 1 }
      ).lean();

      if (courses.length === 0) {
        return NextResponse.json({ success: true, enrollments: [], total: 0 });
      }

      const courseIds = courses.map((c: any) => c._id);

      // 2. ওই courses এর সব enrollments আনো
      const query: any = { courseId: { $in: courseIds } };
      if (status) query.status = status;

      const enrollments = await Enrollment.find(query)
        .sort({ enrolledAt: -1 })
        .limit(limit)
        .lean();

      // 3. populate=student হলে User data join করো
      let result = enrollments;

      if (populateUser && enrollments.length > 0) {
        // unique studentId গুলো বের করো
        const studentIds = [...new Set(enrollments.map((e: any) => e.studentId.toString()))];

        // User collection থেকে batch fetch (N+1 এড়াতে)
        const users = await User.find(
          { _id: { $in: studentIds.map(id => new mongoose.Types.ObjectId(id)) } },
          { name: 1, email: 1, phone: 1, photoURL: 1, address: 1, stats: 1, status: 1 }
        ).lean();

        // userId → user map তৈরি করো
        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

        // enrollment এ studentData inject করো
        result = enrollments.map((e: any) => ({
          ...e,
          studentData: userMap.get(e.studentId.toString()) || null,
        }));
      }

      return NextResponse.json({
        success: true,
        enrollments: result,
        total: result.length,
        courseCount: courses.length,
      });
    }

    // ── Mode A: Student নিজের enrollments দেখছে ────────────────────────────────
    const query: any = { studentId: new mongoose.Types.ObjectId(decoded.userId) };
    if (courseId && mongoose.isValidObjectId(courseId)) {
      query.courseId = new mongoose.Types.ObjectId(courseId);
    }
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .sort({ enrolledAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, enrollments, total: enrollments.length });

  } catch (error: any) {
    console.error("GET /api/enrollments error:", error);
    return NextResponse.json({ error: `Failed to fetch enrollments: ${error.message}` }, { status: 500 });
  }
}

// ─── POST — Enroll in a course ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await req.json();
    if (!courseId || !mongoose.isValidObjectId(courseId)) {
      return NextResponse.json({ error: "Valid courseId required" }, { status: 400 });
    }

    // Already enrolled check
    const existing = await Enrollment.findOne({
      studentId: decoded.userId,
      courseId,
    });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
    }

    // Course info (denormalized data এর জন্য)
    const course = await Course.findById(courseId)
      .populate("instructorId", "name")
      .lean() as any;

    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const enrollment = await Enrollment.create({
      studentId:      decoded.userId,
      courseId,
      courseName:     course.title,
      courseImage:    course.coverImage?.url || "",
      instructorName: (course.instructorId as any)?.name || "",
      status:         "active",
      enrolledAt:     new Date(),
      progress: {
        completedLessons:   [],
        progressPercentage: 0,
        totalTimeSpent:     0,
      },
    });

    // Course + User stats update (parallel)
    await Promise.all([
      Course.findByIdAndUpdate(courseId, { $inc: { "stats.enrolledCount": 1 } }),
      User.findByIdAndUpdate(decoded.userId, { $inc: { "stats.enrolledCourses": 1 } }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Enrolled successfully",
      enrollment,
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/enrollments error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 });
    }
    return NextResponse.json({ error: `Enrollment failed: ${error.message}` }, { status: 500 });
  }
}

// ─── PUT — Update lesson progress ────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId, lessonId, timeSpent = 0, completed = false } = await req.json();

    if (!courseId || !mongoose.isValidObjectId(courseId)) {
      return NextResponse.json({ error: "Valid courseId required" }, { status: 400 });
    }

    const enrollment = await Enrollment.findOne({
      studentId: decoded.userId,
      courseId,
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    // Progress update
    const updateOps: any = {
      $set: {
        "progress.lastAccessedAt": new Date(),
        "progress.currentLessonId": lessonId,
      },
      $inc: { "progress.totalTimeSpent": timeSpent },
    };

    // lessonId completed হলে completedLessons এ add করো (duplicate ছাড়া)
    if (completed && lessonId && mongoose.isValidObjectId(lessonId)) {
      const alreadyDone = enrollment.progress.completedLessons.some(
        (id: any) => id.toString() === lessonId
      );
      if (!alreadyDone) {
        updateOps.$push = { "progress.completedLessons": new mongoose.Types.ObjectId(lessonId) };
      }
    }

    let updated = await Enrollment.findOneAndUpdate(
      { studentId: decoded.userId, courseId },
      updateOps,
      { new: true }
    );

    // Total lesson count এর জন্য course আনো
    if (completed && updated) {
      const course = await Course.findById(courseId).lean() as any;
      if (course) {
        const totalLessons = course.modules?.reduce(
          (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
        ) || 1;

        const completedCount = updated.progress.completedLessons.length;
        const percentage = Math.min(Math.round((completedCount / totalLessons) * 100), 100);

        updated = await Enrollment.findOneAndUpdate(
          { studentId: decoded.userId, courseId },
          { $set: { "progress.progressPercentage": percentage } },
          { new: true }
        );

        // Course 100% complete হলে certificate issue করো
        if (percentage === 100 && updated && !updated.certificate.issued) {
          const certId = `CERT-${Date.now()}-${decoded.userId.slice(-6).toUpperCase()}`;
          await Enrollment.findByIdAndUpdate(updated._id, {
            $set: {
              status: "completed",
              completedAt: new Date(),
              "certificate.issued":     true,
              "certificate.issuedAt":   new Date(),
              "certificate.certificateId": certId,
            },
          });
          await User.findByIdAndUpdate(decoded.userId, {
            $inc: { "stats.completedCourses": 1, "stats.totalCertificates": 1 },
          });
          await Course.findByIdAndUpdate(courseId, { $inc: { "stats.completedCount": 1 } });
        }
      }
    }

    // timeSpent → user stats update
    if (timeSpent > 0) {
      await User.findByIdAndUpdate(decoded.userId, {
        $inc: { "stats.totalTimeSpent": timeSpent },
      });
    }

    return NextResponse.json({ success: true, enrollment: updated });

  } catch (error: any) {
    console.error("PUT /api/enrollments error:", error);
    return NextResponse.json({ error: `Progress update failed: ${error.message}` }, { status: 500 });
  }
}