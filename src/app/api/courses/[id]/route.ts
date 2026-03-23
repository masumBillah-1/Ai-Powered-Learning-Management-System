// src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Course, AdminLog, Enrollment, User } from "@/models";
import mongoose from "mongoose";

const normalizeLevel = (level: string): string => {
  const map: Record<string, string> = {
    basic:        "beginner",
    beginner:     "beginner",
    intermediate: "intermediate",
    advanced:     "advanced",
  };
  return map[level?.toLowerCase()] || level?.toLowerCase() || "beginner";
};

const normalizeModules = (modules: any[]) => {
  if (!Array.isArray(modules)) return [];
  return modules.map((m: any, mi: number) => ({
    _id:         m._id || m.id, // Support both _id and id (some frontends use id)
    title:       m.title || `Module ${mi + 1}`,
    description: m.description || "",
    order:       m.order !== undefined ? m.order : mi,
    lessons: Array.isArray(m.lessons)
      ? m.lessons.map((l: any, li: number) => ({
          _id:            l._id || l.id,
          title:          l.title          || "",
          type:           l.type           || "video",
          duration:       l.duration ? Number(l.duration) : 0,
          videoUrl:       l.videoUrl || l.url || "",
          textContent:    l.textContent    || "",
          assignmentDesc: l.assignmentDesc || "",
          marks:          l.marks ? Number(l.marks) : 0,
          dueDate:        l.dueDate || null,
          resources:      l.resources || [],
          isCompleted:    false,
          order:          l.order !== undefined ? l.order : li,
        }))
      : [],
  }));
};

const extractThumbnail = (coverImage: any): string | null => {
  if (!coverImage) return null;
  if (coverImage.type === "url" && coverImage.url?.trim()) return coverImage.url.trim();
  if (coverImage.type === "upload" && coverImage.base64) return coverImage.base64;
  return null;
};

// ✅ salesVideo payload বা direct salesVideoUrl string থেকে URL extract
const extractSalesVideoUrl = (salesVideo: any, directUrl?: string): string | null => {
  if (directUrl && typeof directUrl === "string" && directUrl.trim()) return directUrl.trim();
  if (!salesVideo) return null;
  if (salesVideo.type === "url" && salesVideo.url?.trim()) return salesVideo.url.trim();
  if (salesVideo.type === "upload" && salesVideo.base64) return salesVideo.base64;
  return null;
};

// GET /api/courses/[id] ───────────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    const course = await Course.findById(id).populate("instructorId", "name email photoURL");
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/courses/[id] ─────────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }

    const body = await request.json();
    const isAdminAction = body._adminAction === true;
    
    // ✅ Get admin ID from JWT token if admin action
    let adminId: string | null = null;
    if (isAdminAction) {
      const jwt = await import("jsonwebtoken");
      const cookieHeader = request.headers.get("cookie") || "";
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[1] : null;
      
      if (token) {
        try {
          const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
          if (decoded.role === "admin") {
            adminId = decoded.userId;
          }
        } catch (err) {
          console.error("JWT verification failed:", err);
        }
      }
    }

    // Extract & remove non-schema fields
    const {
      _adminAction,
      coverImage,
      salesVideo,
      salesVideoUrl: bodyVideoUrl,
      pricing,
      ...restBody
    } = body;

    let updateData: any = { ...restBody };

    // Level normalize
    if (updateData.level) {
      updateData.level = normalizeLevel(updateData.level);
    }

    // Modules normalize
    if (Array.isArray(updateData.modules)) {
      updateData.modules = normalizeModules(updateData.modules);
    }

    // Pricing → flat price
    if (pricing?.price !== undefined) {
      updateData.price = pricing.price ?? 0;
    }
    if (pricing?.discountPrice !== undefined) {
      updateData.originalPrice = pricing.discountPrice;
    }

    // ✅ coverImage → thumbnail
    const thumbnail = extractThumbnail(coverImage);
    if (thumbnail) {
      updateData.thumbnail = thumbnail;
    }

    // ✅ salesVideo / salesVideoUrl → salesVideoUrl field
    const salesVideoUrl = extractSalesVideoUrl(salesVideo, bodyVideoUrl);
    if (salesVideoUrl !== null) {
      updateData.salesVideoUrl = salesVideoUrl;
    }

    // Fetch existing course to check current status
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Status logic
    if (!isAdminAction) {
      if (body.status === "published") {
        // If course is already published (approved), keep it published.
        // Once approved, subsequent updates don't need review.
        if (existingCourse.status === "published" || existingCourse.isPublished) {
          updateData.status = "published";
          updateData.isPublished = true;
        } else {
          // If first time publishing or previously draft/rejected/pending
          updateData.status = "pending";
          updateData.isPublished = false;
        }
      }
    } else {
      if (body.status === "published") {
        updateData.isPublished = true;
        updateData.publishedAt = new Date();
        // ✅ Save admin ID who approved
        if (adminId) {
          updateData.approvedBy = adminId;
          updateData.approvedAt = new Date();
        }
      } else if (body.status === "rejected") {
        updateData.isPublished = false;
        // ✅ Save admin ID who rejected
        if (adminId) {
          updateData.rejectedBy = adminId;
          updateData.rejectedAt = new Date();
        }
      }
    }

    const course = await Course.findByIdAndUpdate(id, updateData, {
      new:           true,
      runValidators: true,
    }).populate("instructorId", "name email photoURL");

    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    
    // ✅ Log admin action to AdminLog
    if (isAdminAction && adminId) {
      try {
        if (body.status === "published") {
          await AdminLog.create({
            adminId,
            action: "approve_course",
            targetType: "course",
            targetId: course._id,
            targetName: course.title,
            metadata: {
              instructorId: course.instructorId,
              category: course.category,
            },
          });
        } else if (body.status === "rejected") {
          await AdminLog.create({
            adminId,
            action: "reject_course",
            targetType: "course",
            targetId: course._id,
            targetName: course.title,
            metadata: {
              instructorId: course.instructorId,
              category: course.category,
            },
          });
        }
      } catch (logErr) {
        console.error("Failed to create admin log:", logErr);
      }
    }
    
    // ✅ Retroactive Certificate Issuance
    try {
      if (course.isCertificateEnabled) {
        const enrollments = await Enrollment.find({
          courseId: course._id,
          $or: [
            { status: "completed" },
            { "progress.progressPercentage": 100 }
          ],
          "certificate.issued": { $ne: true }
        });
        
        for (const enrollment of enrollments) {
          const certId = `CERT-${Date.now()}-${enrollment.studentId.toString().slice(-6).toUpperCase()}`;
          await Enrollment.findByIdAndUpdate(enrollment._id, {
            $set: {
              status: "completed",
              completedAt: new Date(),
              "certificate.issued": true,
              "certificate.issuedAt": new Date(),
              "certificate.verificationCode": certId,
            }
          });
          
          await Promise.all([
            User.findByIdAndUpdate(enrollment.studentId, {
              $inc: { "stats.completedCourses": 1, "stats.totalCertificates": 1 },
            }),
            Course.findByIdAndUpdate(course._id, {
              $inc: { "stats.completedCount": 1 },
            }),
          ]);
        }
      }
    } catch (certErr) {
      console.error("Failed to retroactively issue certificates:", certErr);
    }
    
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/courses/[id] ────────────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    
    // ✅ Get admin ID from JWT token
    let adminId: string | null = null;
    const jwt = await import("jsonwebtoken");
    const cookieHeader = request.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded.role === "admin") {
          adminId = decoded.userId;
        }
      } catch (err) {
        console.error("JWT verification failed:", err);
      }
    }
    
    const course = await Course.findById(id);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    
    // ✅ Save course info before deleting
    const courseInfo = {
      title: course.title,
      instructorId: course.instructorId,
      category: course.category,
    };
    
    // Delete course
    await Course.findByIdAndDelete(id);
    
    // ✅ Log admin action to AdminLog
    if (adminId) {
      try {
        await AdminLog.create({
          adminId,
          action: "delete_course",
          targetType: "course",
          targetId: id,
          targetName: courseInfo.title,
          metadata: {
            instructorId: courseInfo.instructorId,
            category: courseInfo.category,
          },
        });
      } catch (logErr) {
        console.error("Failed to create admin log:", logErr);
      }
    }
    
    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}