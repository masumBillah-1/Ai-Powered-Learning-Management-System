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

<<<<<<< HEAD
    // ✅ Google login
    if (provider === "google") {
=======
    // ✅ Google/GitHub login
    if (provider === "google" || provider === "github") {
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          photoURL: photoURL || "",
<<<<<<< HEAD
          provider: "google",
          role: "student",
=======
          provider,
          role: "student",
          // ✅ phone field intentionally omitted for social logins
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
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
<<<<<<< HEAD
        message: "Google login successful!",
=======
        message: `${provider} login successful!`,
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          photoURL: user.photoURL || "",
          role: user.role,
        },
      });

<<<<<<< HEAD
      // ✅ Cookie set
=======
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
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
<<<<<<< HEAD
    if (!name || !email || !password)
      return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone: phone || undefined,
      password: hashed,
      photoURL: "",
      provider: "credentials",
    });
=======
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // ✅ Check if phone already exists (if provided)
    if (phone && phone.trim()) {
      const phoneExists = await User.findOne({ phone: phone.trim() });
      if (phoneExists) {
        return NextResponse.json(
          { error: "Phone number already exists" },
          { status: 400 }
        );
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    // ✅ Create user object - only include phone if it's valid
    const userData: any = {
      name,
      email,
      password: hashed,
      photoURL: "",
      provider: "credentials",
    };

    // Only add phone if it exists and is not empty
    if (phone && phone.trim()) {
      userData.phone = phone.trim();
    }

    const user = await User.create(userData);
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

<<<<<<< HEAD
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
=======
    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("❌ Register error:", err.message);

    // Handle duplicate key errors
    if (err.code === 11000) {
      if (err.message.includes("email")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
      if (err.message.includes("phone")) {
        return NextResponse.json(
          { error: "Phone number already exists" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Duplicate data found" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
