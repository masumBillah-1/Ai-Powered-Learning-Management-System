import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { AdminLog } from "@/models";
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

// GET /api/admin/history/[adminId] - Fetch admin activity history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ adminId: string }> }
) {
  try {
    const { adminId } = await params;
    const auth = await getAuthUser(req);
    
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    await connectDB();

    // Fetch all logs for this admin
    const logs = await AdminLog.find({ adminId })
      .sort({ createdAt: -1 })
      .lean();

    // Transform logs to match frontend format
    const history = logs.map((log) => {
      const actionMap: Record<string, { icon: string; color: string; label: string }> = {
        approve_course: { icon: "✅", color: "#00C48C", label: "Approved" },
        reject_course: { icon: "❌", color: "#EF4444", label: "Rejected" },
        delete_course: { icon: "🗑️", color: "#FF0F7B", label: "Deleted" },
        ban_user: { icon: "🚫", color: "#F59E0B", label: "Banned" },
        unban_user: { icon: "✅", color: "#00C48C", label: "Unbanned" },
        delete_user: { icon: "🗑️", color: "#FF0F7B", label: "Deleted" },
      };

      const config = actionMap[log.action] || { icon: "📝", color: "#832388", label: log.action };

      return {
        action: config.label,
        type: log.targetType === "course" ? "Course" : "User",
        target: log.targetName,
        date: log.createdAt,
        icon: config.icon,
        color: config.color,
      };
    });

    return NextResponse.json({ success: true, history });
  } catch (err: any) {
    console.error("❌ GET /api/admin/history/[adminId] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
