import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { User } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { name, photoURL, phone } = await req.json();

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { name, photoURL, phone },
      { new: true }
    ).select("-password");

    // localStorage এর user ও update করার জন্য নতুন data পাঠাও
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}