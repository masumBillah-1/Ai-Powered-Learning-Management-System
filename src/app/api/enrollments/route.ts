import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Enrollment, Course, User } from "@/models";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getDecoded(req: NextRequest) {
  let token = req.cookies.get("token")?.value;
  if (!token) {
    const auth = req.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) token = auth.slice(7);
  }
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }; }
  catch { return null; }
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const courseId     = searchParams.get("courseId");
    const instructorId = searchParams.get("instructorId");
    const populateUser = searchParams.get("populate") === "student";
    const mineOnly     = searchParams.get("mine") === "true";
    const limit        = parseInt(searchParams.get("limit") || "50");
    const status       = searchParams.get("status");

    const isInstructorView = instructorId || (mineOnly && decoded.role === "instructor");

    if (isInstructorView) {
      const targetInstructorId = instructorId || decoded.userId;
      const courses = await Course.find(
        { instructorId: new mongoose.Types.ObjectId(targetInstructorId) },
        { _id: 1, title: 1, coverImage: 1 }
      ).lean();

      if (courses.length === 0)
        return NextResponse.json({ success: true, enrollments: [], total: 0 });

      const courseIds = courses.map((c: any) => c._id);

      // ✅ courseId → title map বানাও
      const courseMap = new Map<string, string>(
        courses.map((c: any) => [c._id.toString(), c.title || "Untitled Course"])
      );

      const query: any = { courseId: { $in: courseIds } };
      if (status) query.status = status;

      const enrollments = await Enrollment.find(query).sort({ enrolledAt: -1 }).limit(limit).lean();
      let result = enrollments;

      if (populateUser && enrollments.length > 0) {
        const studentIds = [...new Set(enrollments.map((e: any) => e.studentId.toString()))];
        const users = await User.find(
          { _id: { $in: studentIds.map(id => new mongoose.Types.ObjectId(id)) } },
          { name: 1, email: 1, phone: 1, photoURL: 1, address: 1, stats: 1, status: 1 }
        ).lean();
        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

        result = enrollments.map((e: any) => ({
          ...e,
          studentData: userMap.get(e.studentId.toString()) || null,
          // ✅ courseName যোগ করা হয়েছে — courseMap থেকে নিচ্ছে
          courseName: e.courseName || courseMap.get(e.courseId.toString()) || "Unknown Course",
        }));
      } else {
        // populate ছাড়াও courseName যোগ করো
        result = enrollments.map((e: any) => ({
          ...e,
          courseName: e.courseName || courseMap.get(e.courseId.toString()) || "Unknown Course",
        }));
      }

      return NextResponse.json({ success: true, enrollments: result, total: result.length, courseCount: courses.length });
    }

    // ─── Student own enrollments ───────────────────────────────────────────────
    const query: any = { studentId: new mongoose.Types.ObjectId(decoded.userId) };
    if (courseId && mongoose.isValidObjectId(courseId))
      query.courseId = new mongoose.Types.ObjectId(courseId);
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .sort({ enrolledAt: -1 })
      .limit(limit)
      .populate({
        path: "courseId",
        select: "title coverImage instructorId level category",
        populate: { path: "instructorId", select: "name photoURL" },
      })
      .lean();

    const enriched = enrollments.map((e: any) => {
      const course = typeof e.courseId === "object" ? e.courseId : null;
      return {
        ...e,
        courseName:     e.courseName     || course?.title              || "Untitled Course",
        courseImage:    e.courseImage     || course?.coverImage?.url    || "",
        instructorName: e.instructorName  || course?.instructorId?.name || "Instructor",
      };
    });

    return NextResponse.json({ success: true, enrollments: enriched, total: enriched.length });

  } catch (error: any) {
    console.error("GET /api/enrollments error:", error);
    return NextResponse.json({ error: `Failed: ${error.message}` }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId } = await req.json();
    if (!courseId || !mongoose.isValidObjectId(courseId))
      return NextResponse.json({ error: "Valid courseId required" }, { status: 400 });

    const existing = await Enrollment.findOne({ studentId: decoded.userId, courseId });
    if (existing) return NextResponse.json({ error: "Already enrolled" }, { status: 409 });

    const course = await Course.findById(courseId).populate("instructorId", "name").lean() as any;
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
        currentLesson:      "",
        progressPercentage: 0,
        totalTimeSpent:     0,
      },
    });

    await Promise.all([
      Course.findByIdAndUpdate(courseId, { $inc: { "stats.enrolledCount": 1 } }),
      User.findByIdAndUpdate(decoded.userId, { $inc: { "stats.enrolledCourses": 1 } }),
    ]);

    return NextResponse.json({ success: true, enrollment }, { status: 201 });

  } catch (error: any) {
    if (error.code === 11000) return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    return NextResponse.json({ error: `Enrollment failed: ${error.message}` }, { status: 500 });
  }
}

// ─── PUT — Update lesson progress ─────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId, lessonId, timeSpent = 0, completed = false } = await req.json();

    if (!courseId || !mongoose.isValidObjectId(courseId))
      return NextResponse.json({ error: "Valid courseId required" }, { status: 400 });

    const enrollment = await Enrollment.findOne({
      studentId: new mongoose.Types.ObjectId(decoded.userId),
      courseId:  new mongoose.Types.ObjectId(courseId),
    });

    if (!enrollment)
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });

    const updateOps: any = {
      $set: {
        "progress.lastAccessedAt": new Date(),
        "progress.currentLesson":  lessonId ?? "",
      },
    };

    if (timeSpent > 0) {
      updateOps.$inc = { "progress.totalTimeSpent": timeSpent };
    }

    if (completed && lessonId) {
      const alreadyDone = enrollment.progress.completedLessons
        .some((id: any) => id.toString() === lessonId.toString());
      if (!alreadyDone) {
        updateOps.$addToSet = { "progress.completedLessons": String(lessonId) };
      }
    }

    let updated = await Enrollment.findOneAndUpdate(
      {
        studentId: new mongoose.Types.ObjectId(decoded.userId),
        courseId:  new mongoose.Types.ObjectId(courseId),
      },
      updateOps,
      { returnDocument: "after" }
    );

    if (!updated) return NextResponse.json({ error: "Update failed" }, { status: 500 });

    if (completed) {
      const course = await Course.findById(courseId).lean() as any;
      if (course) {
        const totalLessons = course.modules?.reduce(
          (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
        ) || 1;

        const completedCount = updated.progress.completedLessons.length;
        const percentage = Math.min(Math.round((completedCount / totalLessons) * 100), 100);

        updated = await Enrollment.findOneAndUpdate(
          {
            studentId: new mongoose.Types.ObjectId(decoded.userId),
            courseId:  new mongoose.Types.ObjectId(courseId),
          },
          { $set: { "progress.progressPercentage": percentage } },
          { returnDocument: "after" }
        );

        if (updated?.status === "completed" && percentage < 100) {
          await Enrollment.findByIdAndUpdate(updated._id, {
            $set: { status: "active", completedAt: null },
          });
        }

        if (percentage === 100 && updated && !updated.certificate?.issued) {
          const certId = `CERT-${Date.now()}-${decoded.userId.slice(-6).toUpperCase()}`;
          await Enrollment.findByIdAndUpdate(updated._id, {
            $set: {
              status:                         "completed",
              completedAt:                    new Date(),
              "certificate.issued":           true,
              "certificate.issuedAt":         new Date(),
              "certificate.verificationCode": certId,
            },
          });
          await Promise.all([
            User.findByIdAndUpdate(decoded.userId, {
              $inc: { "stats.completedCourses": 1, "stats.totalCertificates": 1 },
            }),
            Course.findByIdAndUpdate(courseId, { $inc: { "stats.completedCount": 1 } }),
          ]);
        }
      }
    }

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