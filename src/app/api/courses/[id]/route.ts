// src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Course } from "@/models";
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
    title:       m.title || `Module ${mi + 1}`,
    description: m.description || "",
    order:       mi,
    lessons: Array.isArray(m.lessons)
      ? m.lessons.map((l: any, li: number) => ({
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
          order:          li,
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

    // Status logic
    if (!isAdminAction) {
      if (body.status === "published") {
        updateData.status      = "pending";
        updateData.isPublished = false;
      }
    } else {
      if (body.status === "published") {
        updateData.isPublished = true;
        updateData.publishedAt = new Date();
      } else if (body.status === "rejected") {
        updateData.isPublished = false;
      }
    }

    const course = await Course.findByIdAndUpdate(id, updateData, {
      new:           true,
      runValidators: true,
    }).populate("instructorId", "name email photoURL");

    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
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
    const course = await Course.findByIdAndDelete(id);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}