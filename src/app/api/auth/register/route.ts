import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, phone, password, photoURL, provider } = await req.json();

    // ✅ Google login
    if (provider === "google") {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          photoURL: photoURL || "",
          provider: "google",
          role: "student",
        });
      } else {
        user.photoURL = photoURL || user.photoURL;
        await user.save();
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        success: true,
        message: "Google login successful!",
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
    }

    // ✅ Email/Password register
    if (!name || !email || !phone || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing)
      return NextResponse.json({ error: "Email or phone already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      photoURL: "",
      provider: "credentials",
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      message: "Registration successful!",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL || "",
        role: user.role,
      },
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
