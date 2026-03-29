import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { User } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.error("❌ GET /api/messages/users: No token found");
      return NextResponse.json({ error: "Unauthorized - Please login again" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr: any) {
      console.error("❌ GET /api/messages/users: JWT verification failed:", jwtErr.message);
      return NextResponse.json({ error: "Invalid token - Please login again" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("role").lean().maxTimeMS(3000);
    if (!user) {
      console.error("❌ GET /api/messages/users: User not found:", decoded.userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If student, they only see support (handled by messages API list)
    // If instructor or admin, they can see others to start conversation
    if (user.role === "student") {
      return NextResponse.json({ success: true, users: [] });
    }

    // Admins see everyone except themselves
    // Instructors see everyone (or maybe just students + admins?)
    // Let's allow staff to see all users for now
    const users = await User.find({ _id: { $ne: decoded.userId } })
      .select("name photoURL role email")
      .sort({ name: 1 })
      .limit(50)
      .lean()
      .maxTimeMS(10000);

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    console.error("❌ GET /api/messages/users ERROR:", err.message, err.stack);
    
    if (err.name === 'MongooseError' || err.name === 'MongoError') {
      return NextResponse.json({ error: "Database connection issue. Please try again." }, { status: 503 });
    }
    
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
