// src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Course } from "@/models";
import mongoose from "mongoose";

// GET /api/courses/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    
    const course = await Course.findById(params.id).populate("instructorId", "name email photoURL");
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/courses/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    
    const body = await request.json();
    
    const course = await Course.findByIdAndUpdate(params.id, body, { 
      new: true, 
      runValidators: true 
    }).populate("instructorId", "name email photoURL");
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/courses/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    
    const course = await Course.findByIdAndDelete(params.id);
    
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}