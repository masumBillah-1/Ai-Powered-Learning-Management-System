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
    const body = await req.json();
    
    console.log("\n" + "=".repeat(80));
    console.log("📦 RECEIVED COURSE DATA FROM FRONTEND");
    console.log("=".repeat(80));
    console.log(JSON.stringify(body, null, 2));
    console.log("=".repeat(80) + "\n");

    const { instructorId, title, category, level, description, coverImage, salesVideo, faqs, modules, pricing, visibility, status } = body;

    // Validation
    if (!title?.trim()) {
      console.log("❌ Validation Failed: Course title is missing");
      return NextResponse.json({ error: "Course title is required" }, { status: 400 });
    }
    if (!instructorId) {
      console.log("❌ Validation Failed: Instructor ID is missing");
      return NextResponse.json({ error: "Instructor ID is required" }, { status: 400 });
    }

    console.log("✅ Basic validation passed");

    // Handle cover image
    let coverData = { type: "url", url: "" };
    if (coverImage?.type === "upload" && coverImage?.base64) {
      console.log("📤 Uploading cover image to Cloudinary...");
      const url = await uploadToCloudinary(coverImage.base64, "covers");
      coverData = { type: "upload", url };
      console.log("✅ Cover image uploaded:", url);
    } else if (coverImage?.url) {
      coverData = { type: "url", url: coverImage.url };
      console.log("🔗 Using cover image URL:", coverImage.url);
    }

    // Handle sales video
    let videoData = { type: "url", url: "" };
    if (salesVideo?.type === "upload" && salesVideo?.base64) {
      console.log("📤 Uploading sales video to Cloudinary...");
      const url = await uploadToCloudinary(salesVideo.base64, "videos");
      videoData = { type: "upload", url };
      console.log("✅ Sales video uploaded:", url);
    } else if (salesVideo?.url) {
      videoData = { type: "url", url: salesVideo.url };
      console.log("🔗 Using sales video URL:", salesVideo.url);
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

    console.log(`📚 Processed ${cleanModules.length} modules with ${cleanModules.reduce((acc: number, m: any) => acc + m.lessons.length, 0)} total lessons`);

    // Prepare final course data
    const courseData = {
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
    };

    console.log("\n" + "=".repeat(80));
    console.log("💾 FINAL COURSE DATA TO SAVE IN MONGODB");
    console.log("=".repeat(80));
    console.log(JSON.stringify(courseData, null, 2));
    console.log("=".repeat(80) + "\n");

    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected");

    console.log("💾 Saving course to database...");
    const course = await Course.create(courseData);
    console.log("✅ Course saved successfully!");
    console.log("📄 Course ID:", course._id);
    console.log("📄 Course Title:", course.title);
    console.log("📄 Status:", course.status);

    return NextResponse.json({ success: true, course }, { status: 201 });

  } catch (error: any) {
    console.error("\n" + "=".repeat(80));
    console.error("❌ COURSE POST ERROR");
    console.error("=".repeat(80));
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);
    console.error("=".repeat(80) + "\n");
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

    console.log("🔍 Fetching courses with query:", query);

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .populate("instructorId", "name email photoURL");

    console.log(`✅ Found ${courses.length} courses`);

    return NextResponse.json({ success: true, courses });

  } catch (error: any) {
    console.error("[COURSE GET ERROR]", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch courses" }, { status: 500 });
  }
}