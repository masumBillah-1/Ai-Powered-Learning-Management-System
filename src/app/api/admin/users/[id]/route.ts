import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { User, AdminLog } from "@/models";
import jwt from "jsonwebtoken";

// ✅ Auth helper
async function getAuthUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
  } catch {
    return null;
  }
}

// ✅ PATCH - Update user status (ban/unban)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    await connectDB();
    const { status } = await req.json();

    if (!["active", "suspended", "banned"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateData: any = { status };
    
    // ✅ Save admin ID who banned/unbanned
    if (status === "suspended" || status === "banned") {
      updateData.bannedBy = auth.userId;
      updateData.bannedAt = new Date();
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: "-password -resetToken -resetTokenExpiry" }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Log admin action to AdminLog
    try {
      const action = (status === "suspended" || status === "banned") ? "ban_user" : "unban_user";
      await AdminLog.create({
        adminId: auth.userId,
        action,
        targetType: "user",
        targetId: user._id,
        targetName: user.name,
        metadata: {
          email: user.email,
          role: user.role,
        },
      });
    } catch (logErr) {
      console.error("Failed to create admin log:", logErr);
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    console.error("❌ PATCH /api/admin/users/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE - Remove user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = await getAuthUser(req);
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    await connectDB();
    
    // ✅ Get admin password from request body
    const body = await req.json().catch(() => ({}));
    const { adminPassword } = body;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin password required for verification" }, { status: 400 });
    }

    // ✅ Get admin user to check if they have password (credentials login) or not (OAuth)
    const admin = await User.findById(auth.userId).select("+password");
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    let isPasswordValid = false;

    // ✅ Check if admin has password (credentials login)
    if (admin.password) {
      // Verify using bcrypt for credentials users
      const bcrypt = require("bcryptjs");
      isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    } else {
      // ✅ For OAuth users (Google/GitHub), use master password from env
      const masterPassword = process.env.ADMIN_DELETE_PASSWORD;
      if (!masterPassword) {
        return NextResponse.json({ 
          error: "Admin master password not configured. Contact system administrator." 
        }, { status: 500 });
      }
      isPasswordValid = adminPassword === masterPassword;
    }
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    // ⚠️ Prevent deleting yourself
    if (id === auth.userId) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    // ✅ Mark as deleted instead of hard delete (soft delete)
    const user = await User.findByIdAndUpdate(
      id,
      {
        deletedBy: auth.userId,
        deletedAt: new Date(),
        status: "suspended" // Also suspend the account
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Log admin action to AdminLog
    try {
      await AdminLog.create({
        adminId: auth.userId,
        action: "delete_user",
        targetType: "user",
        targetId: user._id,
        targetName: user.name,
        metadata: {
          email: user.email,
          role: user.role,
        },
      });
    } catch (logErr) {
      console.error("Failed to create admin log:", logErr);
    }

    // TODO: Also delete related data (enrollments, courses if instructor, etc.)

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (err: any) {
    console.error("❌ DELETE /api/admin/users/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
