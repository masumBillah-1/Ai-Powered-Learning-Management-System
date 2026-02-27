import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp)
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });

    const user = await User.findOne({
      email,
      resetToken: otp,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user)
      return NextResponse.json({ error: "Invalid or expired OTP!" }, { status: 400 });

    // ✅ OTP clear করো
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    // ✅ এখন JWT token দাও
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      message: "OTP verified! Login successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL || "",
        role: user.role,
      },
    });

    // ✅ Cookie set
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
