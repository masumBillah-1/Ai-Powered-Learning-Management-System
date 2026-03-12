// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import mongoose from "mongoose";
import { Course } from "@/models";

// POST /api/courses
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

    const course = await Course.create({
      ...body,
      instructorId: new mongoose.Types.ObjectId(instructorId),
      title: title.trim()
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/courses
export async function GET(req: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get("instructorId");
    const status = searchParams.get("status");

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