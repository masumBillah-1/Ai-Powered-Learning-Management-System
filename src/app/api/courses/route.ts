// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Course from "@/models/Course";
import cloudinary from "@/lib/cloudinary";

// ─── Helper: upload base64 → Cloudinary ──────────────────────────────────────
async function uploadToCloudinary(base64: string, folder: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64, {
    folder: `smartlms/${folder}`,
    resource_type: "auto",
  });
  return result.secure_url;
}

// ─── POST /api/courses ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { instructorId, title, category, level, description, coverImage, salesVideo, faqs, modules, pricing, visibility, status } = body;

    if (!title?.trim())    return NextResponse.json({ error: "Course title is required" }, { status: 400 });
    if (!instructorId)     return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 });

    // Handle cover image
    let coverData = { type: "url", url: "" };
    if (coverImage?.type === "upload" && coverImage?.base64) {
      const url = await uploadToCloudinary(coverImage.base64, "covers");
      coverData = { type: "upload", url };
    } else if (coverImage?.url) {
      coverData = { type: "url", url: coverImage.url };
    }

    // Handle sales video
    let videoData = { type: "url", url: "" };
    if (salesVideo?.type === "upload" && salesVideo?.base64) {
      const url = await uploadToCloudinary(salesVideo.base64, "videos");
      videoData = { type: "upload", url };
    } else if (salesVideo?.url) {
      videoData = { type: "url", url: salesVideo.url };
    }

    // Clean modules
    const cleanModules = (modules || []).map((mod: any, mi: number) => ({
      title:   mod.title,
      order:   mi,
      lessons: (mod.lessons || []).map((les: any, li: number) => ({
        title:    les.title,
        type:     les.type,
        duration: les.duration,
        url:      les.url || "",
        order:    li,
      })),
    }));

    const course = await Course.create({
      instructorId,
      title:       title.trim(),
      category:    category    || "Data Management",
      level:       level       || "Basic",
      description: description || "",
      coverImage:  coverData,
      salesVideo:  videoData,
      faqs:        faqs || [],
      modules:     cleanModules,
      pricing: {
        type:            pricing?.type            || "paid",
        price:           Number(pricing?.price)   || 0,
        discountPrice:   pricing?.discountPrice   ? Number(pricing.discountPrice)   : null,
        enrollmentLimit: pricing?.enrollmentLimit ? Number(pricing.enrollmentLimit) : null,
        accessDuration:  pricing?.accessDuration  || "lifetime",
      },
      visibility: visibility || "public",
      status:     status     || "draft",
    });

    return NextResponse.json({ success: true, course }, { status: 201 });

  } catch (error: any) {
    console.error("[COURSE POST ERROR]", error);
    return NextResponse.json({ error: error?.message || "Course create failed" }, { status: 500 });
  }
}

// ─── GET /api/courses ─────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get("instructorId");
    const status       = searchParams.get("status");

    const query: any = {};
    if (instructorId) query.instructorId = instructorId;
    if (status)       query.status = status;

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .populate("instructorId", "name email photoURL");

    return NextResponse.json({ success: true, courses });

  } catch (error: any) {
    console.error("[COURSE GET ERROR]", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch courses" }, { status: 500 });
  }
}