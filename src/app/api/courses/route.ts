import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import Course from "@/models/Course";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const course = await Course.create(body);

    return NextResponse.json(course);

  } catch (error) {
    return NextResponse.json({ error: "Course create failed" });
  }
}