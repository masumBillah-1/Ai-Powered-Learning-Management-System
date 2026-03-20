import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import SystemSettings from "@/models/SystemSettings";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// GET - Fetch system settings
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get all settings
    const settings = await SystemSettings.find({});
    
    // Convert to key-value object
    const settingsObj: Record<string, any> = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    return NextResponse.json({
      success: true,
      settings: settingsObj,
    });
  } catch (error: any) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update system settings (Admin only)
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = req.headers.get("Authorization")?.replace("Bearer ", "") || req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Setting key is required" }, { status: 400 });
    }

    // Update or create setting
    const setting = await SystemSettings.findOneAndUpdate(
      { key },
      { 
        key,
        value,
        updatedBy: user._id,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      setting: {
        key: setting.key,
        value: setting.value,
      },
    });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
