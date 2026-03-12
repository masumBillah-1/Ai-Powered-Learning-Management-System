

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { User } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, phone, password, photoURL, provider } = await req.json();

    // ── Google / GitHub ────────────────────────────────────────────────
    if (provider === "google" || provider === "github") {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          photoURL: photoURL || "",
          provider,
          role: "student",
          // ✅ phone intentionally omitted — social login এ phone নেই
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
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: user.role,
        },
      });

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // ── Email / Password Register ──────────────────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // ✅ Phone check — শুধু তখনই check করো যদি phone দেওয়া হয়েছে
    const cleanPhone = phone && phone.trim() ? phone.trim() : null;
    if (cleanPhone) {
      const phoneExists = await User.findOne({ phone: cleanPhone });
      if (phoneExists) {
        return NextResponse.json(
          { error: "Phone number already registered. অন্য নম্বর ব্যবহার করুন।" },
          { status: 400 }
        );
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    // ✅ phone null হলে userData তে রাখবো না
    const userData: any = {
      name,
      email,
      password: hashed,
      photoURL: "",
      provider: "credentials",
    };

    if (cleanPhone) {
      userData.phone = cleanPhone;
    }

    const user = await User.create(userData);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful!",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Register error:", err.message);

    if (err.code === 11000) {
      if (err.keyPattern?.email) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
      if (err.keyPattern?.phone) {
        return NextResponse.json(
          { error: "Phone number already registered. অন্য নম্বর ব্যবহার করুন।" },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Duplicate data found" }, { status: 400 });
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
