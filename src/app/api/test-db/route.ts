import { connectDB } from "@/db/connect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connected successfully! ✅" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "MongoDB connection failed ❌",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
