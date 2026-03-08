import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect"; // আপনার ফাইল পাথ অনুযায়ী
import Course from "@/models/course";


export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ createdAt: -1 });

    // ড্যাশবোর্ড কার্ডের হিসাব (ইমেজ অনুযায়ী)
    const stats = {
      activeCourses: courses.filter(c => c.status === "PUBLISHED").length,
      pendingCourses: courses.filter(c => c.status === "PENDING").length,
      draftCourses: courses.filter(c => c.status === "DRAFT").length,
      freeCourses: courses.filter(c => c.price === 0).length,
      paidCourses: courses.filter(c => c.price > 0).length,
    };

    return NextResponse.json({ success: true, stats, data: courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newCourse = await Course.create(body);
    
    return NextResponse.json({ success: true, data: newCourse }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}