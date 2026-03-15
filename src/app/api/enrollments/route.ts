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

function strMatch(a: any, b: any): boolean {
  return String(a) === String(b);
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const view         = searchParams.get("view");
    const courseId     = searchParams.get("courseId");
    const lessonId     = searchParams.get("lessonId");
    const instructorId = searchParams.get("instructorId");
    const populateUser = searchParams.get("populate") === "student";
    const mineOnly     = searchParams.get("mine") === "true";
    const limit        = parseInt(searchParams.get("limit") || "50");
    const status       = searchParams.get("status");

    // ── VIEW: assignments ─────────────────────────────────────────────────────
    if (view === "assignments") {
      const targetInstructorId = instructorId || decoded.userId;
      const courses = await Course.find(
        { instructorId: new mongoose.Types.ObjectId(targetInstructorId) },
        { _id: 1, title: 1, modules: 1, status: 1 }
      ).lean() as any[];

      if (!courses.length)
        return NextResponse.json({ success: true, assignments: [] });

      const courseIds = courses.map((c: any) => c._id);
      const allEnrollments = await Enrollment.find(
        { courseId: { $in: courseIds } },
        { courseId: 1, submissions: 1 }
      ).lean() as any[];

      const assignments: any[] = [];
      for (const course of courses) {
        for (const mod of course.modules || []) {
          for (const lesson of mod.lessons || []) {
            if (lesson.type !== "assignment") continue;

            const lessonIdStr = lesson._id?.toString();
            const courseEnrollments = allEnrollments.filter(
              (e: any) => e.courseId?.toString() === course._id?.toString()
            );
            const allSubs = courseEnrollments.flatMap((e: any) =>
              (e.submissions || []).filter((s: any) => strMatch(s.lessonId, lessonIdStr))
            );

            assignments.push({
              lessonId:    lessonIdStr,
              title:       lesson.title,
              courseId:    course._id,
              courseName:  course.title,
              marks:       lesson.marks || null,
              dueDate:     lesson.dueDate || null,
              description: lesson.assignmentDesc || "",
              submits:     allSubs.length,
              pending:     allSubs.filter((s: any) => s.status === "submitted" || s.status === "late").length,
              graded:      allSubs.filter((s: any) => s.status === "graded").length,
              status:      course.status === "published" ? "Published" : "Draft",
            });
          }
        }
      }

      return NextResponse.json({ success: true, assignments, total: assignments.length });
    }

    // ── VIEW: submissions ─────────────────────────────────────────────────────
    if (view === "submissions" && lessonId) {
      const enrollmentQuery: any = {};
      if (courseId && mongoose.isValidObjectId(courseId))
        enrollmentQuery.courseId = new mongoose.Types.ObjectId(courseId);

      const enrollments = await Enrollment.find(enrollmentQuery).lean() as any[];
      const matched = enrollments.filter((e: any) =>
        (e.submissions || []).some((s: any) => strMatch(s.lessonId, lessonId))
      );

      const studentIds = matched.map((e: any) => e.studentId);
      const users = await User.find(
        { _id: { $in: studentIds } },
        { name: 1, email: 1, photoURL: 1 }
      ).lean() as any[];
      const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));

      const submissions = matched.map((e: any) => {
        const sub = (e.submissions || []).find((s: any) => strMatch(s.lessonId, lessonId));
        return {
          enrollmentId: e._id,
          studentId:    e.studentId,
          student:      userMap.get(e.studentId?.toString()) || null,
          submission:   sub || null,
        };
      }).filter((s: any) => s.submission);

      return NextResponse.json({ success: true, submissions, total: submissions.length });
    }

    // ── VIEW: my-assignments ──────────────────────────────────────────────────
    if (view === "my-assignments") {
      const enrollments = await Enrollment.find(
        { studentId: new mongoose.Types.ObjectId(decoded.userId) },
        { courseId: 1, submissions: 1 }
      ).lean() as any[];

      if (!enrollments.length)
        return NextResponse.json({ success: true, assignments: [], total: 0 });

      const courseIds = enrollments.map((e: any) => e.courseId);
      const courses = await Course.find(
        { _id: { $in: courseIds } },
        { title: 1, modules: 1, status: 1 }
      ).lean() as any[];

      const myAssignments: any[] = [];
      for (const course of courses) {
        const enrollment = enrollments.find(
          (e: any) => e.courseId?.toString() === (course as any)._id?.toString()
        );
        for (const mod of (course as any).modules || []) {
          for (const lesson of mod.lessons || []) {
            if (lesson.type !== "assignment") continue;

            const lessonIdStr = lesson._id?.toString();
            const submission = (enrollment?.submissions || []).find(
              (s: any) => strMatch(s.lessonId, lessonIdStr)
            );

            let assignStatus: "Pending" | "Submitted" | "Graded" = "Pending";
            if (submission?.status === "graded") assignStatus = "Graded";
            else if (submission?.status === "submitted" || submission?.status === "late") assignStatus = "Submitted";

            myAssignments.push({
              lessonId:      lessonIdStr,
              title:         lesson.title,
              courseId:      (course as any)._id,
              courseName:    (course as any).title,
              dueDate:       lesson.dueDate || null,
              totalMarks:    lesson.marks || 0,
              description:   lesson.assignmentDesc || "",
              status:        assignStatus,
              score:         submission?.marks ?? null,
              feedback:      submission?.feedback || "",
              submittedDate: submission?.submittedAt || null,
              fileUrl:       submission?.fileUrl || "",
              textAnswer:    submission?.textAnswer || "",
              linkUrl:       submission?.linkUrl || "",
            });
          }
        }
      }

      return NextResponse.json({ success: true, assignments: myAssignments, total: myAssignments.length });
    }

    // ── Instructor view ───────────────────────────────────────────────────────
    const isInstructorView = instructorId || (mineOnly && decoded.role === "instructor");
    if (isInstructorView) {
      const targetInstructorId = instructorId || decoded.userId;
      const courses = await Course.find(
        { instructorId: new mongoose.Types.ObjectId(targetInstructorId) },
        { _id: 1, title: 1, coverImage: 1 }
      ).lean() as any[];

      if (!courses.length)
        return NextResponse.json({ success: true, enrollments: [], total: 0 });

      const courseIds = courses.map((c: any) => c._id);
      const courseMap = new Map<string, string>(
        courses.map((c: any) => [c._id.toString(), c.title || "Untitled"])
      );
      const query: any = { courseId: { $in: courseIds } };
      if (status) query.status = status;

      const enrollments = await Enrollment.find(query).sort({ enrolledAt: -1 }).limit(limit).lean() as any[];
      let result: any[] = enrollments;

      if (populateUser && enrollments.length > 0) {
        const studentIds = [...new Set(enrollments.map((e: any) => e.studentId.toString()))];
        const users = await User.find(
          { _id: { $in: studentIds.map(id => new mongoose.Types.ObjectId(id)) } },
          { name: 1, email: 1, phone: 1, photoURL: 1, address: 1, stats: 1, status: 1 }
        ).lean() as any[];
        const userMap = new Map(users.map((u: any) => [u._id.toString(), u]));
        result = enrollments.map((e: any) => ({
          ...e,
          studentData: userMap.get(e.studentId.toString()) || null,
          courseName:  e.courseName || courseMap.get(e.courseId.toString()) || "Unknown",
        }));
      } else {
        result = enrollments.map((e: any) => ({
          ...e,
          courseName: e.courseName || courseMap.get(e.courseId.toString()) || "Unknown",
        }));
      }
      return NextResponse.json({ success: true, enrollments: result, total: result.length });
    }

    // ── Student own enrollments ───────────────────────────────────────────────
    const query: any = { studentId: new mongoose.Types.ObjectId(decoded.userId) };
    if (courseId && mongoose.isValidObjectId(courseId))
      query.courseId = new mongoose.Types.ObjectId(courseId);
    if (status) query.status = status;

    const enrollments = await Enrollment.find(query)
      .sort({ enrolledAt: -1 }).limit(limit)
      .populate({
        path: "courseId",
        select: "title coverImage instructorId level category",
        populate: { path: "instructorId", select: "name photoURL" },
      }).lean() as any[];

    const enriched = enrollments.map((e: any) => {
      const course = typeof e.courseId === "object" ? e.courseId : null;
      return {
        ...e,
        courseName:     e.courseName     || course?.title              || "Untitled",
        courseImage:    e.courseImage     || course?.coverImage?.url    || "",
        instructorName: e.instructorName  || course?.instructorId?.name || "Instructor",
      };
    });
    return NextResponse.json({ success: true, enrollments: enriched, total: enriched.length });

  } catch (error: any) {
    console.error("GET /api/enrollments:", error);
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
      submissions:    [],
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

// ─── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const decoded = getDecoded(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action = "progress" } = body;

    // ── ACTION: submit ────────────────────────────────────────────────────────
    if (action === "submit") {
      const { courseId, lessonId, fileUrl, textAnswer, linkUrl } = body;

      if (!courseId || !lessonId)
        return NextResponse.json({ error: "courseId and lessonId required" }, { status: 400 });

      // enrollment খোঁজো
      const enrollment = await Enrollment.findOne({
        studentId: new mongoose.Types.ObjectId(decoded.userId),
        courseId:  new mongoose.Types.ObjectId(courseId),
      });
      if (!enrollment)
        return NextResponse.json({ error: "Enrollment not found. Please enroll first." }, { status: 404 });

      // due date check
      const course = await Course.findById(courseId).lean() as any;
      let isLate = false;
      if (course) {
        for (const mod of course.modules || []) {
          for (const lesson of mod.lessons || []) {
            if (strMatch(lesson._id, lessonId) && lesson.dueDate) {
              isLate = new Date() > new Date(lesson.dueDate);
            }
          }
        }
      }

      const submissionData = {
        lessonId:    String(lessonId),
        courseId:    String(courseId),
        submittedAt: new Date(),
        fileUrl:     fileUrl    || "",
        textAnswer:  textAnswer || "",
        linkUrl:     linkUrl    || "",
        status:      isLate ? "late" : "submitted",
      };

      // ── Native MongoDB driver দিয়ে directly write করো (Mongoose bypass) ──
      const collection = mongoose.connection.collection("enrollments");

      // আগে raw document দেখো
      const rawDoc = await collection.findOne({ _id: enrollment._id }) as any;
      const existingSubs: any[] = Array.isArray(rawDoc?.submissions) ? rawDoc.submissions : [];
      const existingIdx = existingSubs.findIndex((s: any) => strMatch(s.lessonId, lessonId));

      if (existingIdx >= 0) {
        // আগে submit করেছে — update করো
        await collection.updateOne(
          { _id: enrollment._id },
          { $set: { [`submissions.${existingIdx}`]: submissionData } }
        );
      } else {
        // নতুন submission — push করো (array না থাকলেও MongoDB auto-create করে)
        await (collection as any).updateOne(
          { _id: enrollment._id },
          { $push: { submissions: submissionData } }
        );
      }

      return NextResponse.json({
        success: true,
        message: isLate ? "Submitted (late)" : "Assignment submitted successfully",
        isLate,
      });
    }

    // ── ACTION: grade ─────────────────────────────────────────────────────────
    if (action === "grade") {
      if (decoded.role !== "instructor" && decoded.role !== "admin")
        return NextResponse.json({ error: "Only instructors can grade" }, { status: 403 });

      const { courseId, lessonId, studentId, marks, feedback, totalMarks } = body;

      if (!courseId || !lessonId || !studentId || marks === undefined)
        return NextResponse.json({ error: "courseId, lessonId, studentId, marks required" }, { status: 400 });

      const enrollment = await Enrollment.findOne({
        studentId: new mongoose.Types.ObjectId(studentId),
        courseId:  new mongoose.Types.ObjectId(courseId),
      });
      if (!enrollment)
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });

      const collection = mongoose.connection.collection("enrollments");
      const rawDoc = await collection.findOne({ _id: enrollment._id }) as any;
      const subs: any[] = Array.isArray(rawDoc?.submissions) ? rawDoc.submissions : [];
      const subIdx = subs.findIndex((s: any) => strMatch(s.lessonId, lessonId));

      if (subIdx < 0)
        return NextResponse.json({ error: "Submission not found for this lesson" }, { status: 404 });

      await collection.updateOne(
        { _id: enrollment._id },
        {
          $set: {
            [`submissions.${subIdx}.status`]:     "graded",
            [`submissions.${subIdx}.marks`]:      Number(marks),
            [`submissions.${subIdx}.totalMarks`]: totalMarks || Number(marks),
            [`submissions.${subIdx}.feedback`]:   feedback || "",
            [`submissions.${subIdx}.gradedAt`]:   new Date(),
            [`submissions.${subIdx}.gradedBy`]:   decoded.userId,
          },
        }
      );

      return NextResponse.json({ success: true, message: "Assignment graded successfully" });
    }

    // ── ACTION: progress ──────────────────────────────────────────────────────
    const { courseId, lessonId, timeSpent = 0, completed = false } = body;

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

    if (timeSpent > 0) updateOps.$inc = { "progress.totalTimeSpent": timeSpent };

    if (completed && lessonId) {
      const alreadyDone = enrollment.progress.completedLessons.some(
        (id: any) => id.toString() === lessonId.toString()
      );
      if (!alreadyDone)
        updateOps.$addToSet = { "progress.completedLessons": String(lessonId) };
    }

    let updated = await Enrollment.findOneAndUpdate(
      {
        studentId: new mongoose.Types.ObjectId(decoded.userId),
        courseId:  new mongoose.Types.ObjectId(courseId),
      },
      updateOps,
      { returnDocument: "after" }
    );
    if (!updated)
      return NextResponse.json({ error: "Update failed" }, { status: 500 });

    if (completed) {
      const course = await Course.findById(courseId).lean() as any;
      if (course) {
        const totalLessons = course.modules?.reduce(
          (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
        ) || 1;
        const percentage = Math.min(
          Math.round((updated.progress.completedLessons.length / totalLessons) * 100),
          100
        );

        updated = await Enrollment.findOneAndUpdate(
          {
            studentId: new mongoose.Types.ObjectId(decoded.userId),
            courseId:  new mongoose.Types.ObjectId(courseId),
          },
          { $set: { "progress.progressPercentage": percentage } },
          { returnDocument: "after" }
        );

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
            Course.findByIdAndUpdate(courseId, {
              $inc: { "stats.completedCount": 1 },
            }),
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
    console.error("PUT /api/enrollments:", error);
    return NextResponse.json({ error: `Failed: ${error.message}` }, { status: 500 });
  }
}