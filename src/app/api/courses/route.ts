// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import mongoose from "mongoose";
import { Course } from "@/models";

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

// ✅ coverImage payload → thumbnail string (DB schema)
const extractThumbnail = (coverImage: any): string | null => {
  if (!coverImage) return null;
  if (coverImage.type === "url" && coverImage.url?.trim()) return coverImage.url.trim();
  if (coverImage.type === "upload" && coverImage.base64) return coverImage.base64;
  return null;
};

// ✅ salesVideo payload → salesVideoUrl string (DB schema)
const extractSalesVideoUrl = (salesVideo: any, directUrl?: string): string | null => {
  // Direct URL string (from form salesVideoUrl field)
  if (directUrl && typeof directUrl === "string" && directUrl.trim()) return directUrl.trim();
  if (!salesVideo) return null;
  if (salesVideo.type === "url" && salesVideo.url?.trim()) return salesVideo.url.trim();
  // Upload case — base64 or file URL
  if (salesVideo.type === "upload" && salesVideo.base64) return salesVideo.base64;
  return null;
};

// POST /api/courses ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { instructorId, title } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Course title is required" }, { status: 400 });
    }
    if (!instructorId || !mongoose.Types.ObjectId.isValid(instructorId)) {
      return NextResponse.json({ error: "Valid instructor ID is required" }, { status: 400 });
    }

    const finalStatus    = body.status === "published" ? "pending" : body.status || "draft";
    const topLevelPrice  = body.pricing?.price ?? body.price ?? 0;
    const thumbnail      = extractThumbnail(body.coverImage);
    // ✅ salesVideoUrl — string field
    const salesVideoUrl  = extractSalesVideoUrl(body.salesVideo, body.salesVideoUrl);

    // Remove non-schema fields
    const { coverImage, salesVideo, salesVideoUrl: _svUrl, pricing, ...restBody } = body;

    const course = await Course.create({
      ...restBody,
      instructorId: new mongoose.Types.ObjectId(instructorId),
      title:        title.trim(),
      status:       finalStatus,
      isPublished:  false,
      level:        normalizeLevel(body.level),
      price:        topLevelPrice,
      ...(thumbnail     ? { thumbnail }     : {}),
      // ✅ salesVideoUrl DB তে save হচ্ছে
      ...(salesVideoUrl ? { salesVideoUrl } : {}),
      modules:      normalizeModules(body.modules),
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/courses ─────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get("instructorId");
    const status       = searchParams.get("status");

    const query: any = {};
    if (instructorId && mongoose.Types.ObjectId.isValid(instructorId)) {
      query.instructorId = instructorId;
    }
    if (status) query.status = status;

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .populate("instructorId", "name email photoURL");

    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}