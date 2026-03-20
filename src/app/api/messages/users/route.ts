import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { User } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // If student, they only see support (handled by messages API list)
    // If instructor or admin, they can see others to start conversation
    if (user.role === "student") {
      return NextResponse.json({ success: true, users: [] });
    }

    // Admins see everyone except themselves
    // Instructors see everyone (or maybe just students + admins?)
    // Let's allow staff to see all users for now
    const users = await User.find({ _id: { $ne: user._id } })
      .select("name photoURL role email")
      .sort({ name: 1 })
      .limit(50);

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
