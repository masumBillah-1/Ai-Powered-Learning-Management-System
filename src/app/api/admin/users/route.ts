import { NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const users = await User.find()
    .select("-password -resetToken -resetTokenExpiry")
    .sort({ createdAt: -1 });
  return NextResponse.json({ total: users.length, users });
}
