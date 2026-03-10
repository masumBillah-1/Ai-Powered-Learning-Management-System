import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Notification } from "@/models";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { searchParams } = new URL(req.url);
    const limit         = parseInt(searchParams.get("limit") || "20");
    const unreadOnly    = searchParams.get("unreadOnly") === "true";
    const type          = searchParams.get("type");
    const allAnnouncements = searchParams.get("all") === "true";

    let query: any = {
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    };

    if (!allAnnouncements) {
      query.userId = decoded.userId;
    }

    if (unreadOnly) query.isRead = false;
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // ── response এ status field সহ পাঠাও (actionUrl থেকে parse করে) ──────────
    const enriched = notifications.map((n: any) => {
      const status = parseStatusFromActionUrl(n.actionUrl);
      return { ...n, status };
    });

    const unreadCount = await Notification.countDocuments({
      userId: decoded.userId,
      isRead: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
    });

    return NextResponse.json({ success: true, notifications: enriched, unreadCount }, { status: 200 });

  } catch (error: any) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const body = await req.json();

    const {
      type     = "announcement",
      title,
      message,
      priority = "medium",
      status   = "Draft",
      courseId,
      expiresAt,
    } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    // ── status → actionUrl এ store করো (schema তে status field নেই) ───────────
    const actionUrl = buildActionUrl(status, null); // courseId ObjectId হিসেবে schema তে আছে

    const notificationData: any = {
      userId   : decoded.userId,
      type,
      title    : title.trim(),
      message  : message.trim(),
      priority,
      isRead   : false,
      actionUrl,
      ...(courseId && mongoose.isValidObjectId(courseId) && {
        courseId: new mongoose.Types.ObjectId(courseId),
      }),
      ...(expiresAt && { expiresAt: new Date(expiresAt) }),
    };

    const notification = await Notification.create(notificationData);

    return NextResponse.json({
      success     : true,
      message     : "Announcement created successfully",
      notification: {
        ...notification.toObject(),
        status,                          // ← frontend এর জন্য inject করে দাও
        courseId: notification.courseId, // ← ObjectId as-is
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/notifications error:", error);

    if (error.name === "CastError") {
      return NextResponse.json({ error: `Invalid ID: ${error.path}` }, { status: 400 });
    }
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors).map((e: any) => e.message).join(", ");
      return NextResponse.json({ error: `Validation: ${msg}` }, { status: 400 });
    }

    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}

// ─── PUT ──────────────────────────────────────────────────────────────────────
// দুই ধরনের request handle করে:
//   1) Announcement edit  → body: { title, message, priority, status, courseId }
//                           query: ?id=<notificationId>
//   2) Mark as read       → body: { id } বা { markAll: true }
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // ── query string থেকে id নাও (announcement edit এর ক্ষেত্রে) ─────────────
    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get("id");

    const body = await req.json();

    // ── Case 1: markAll → সব notification read mark করো ───────────────────────
    if (body.markAll) {
      const result = await Notification.updateMany(
        { userId: decoded.userId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );
      return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
    }

    // ── Case 2: Announcement full edit (title, message, status, etc.) ──────────
    const targetId = queryId || body.id;
    if (!targetId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 });
    }

    if (!mongoose.isValidObjectId(targetId)) {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
    }

    // body তে কী কী এসেছে সেটা দিয়ে $set তৈরি করো
    const {
      title,
      message,
      priority,
      status,   // ← "Published" | "Draft"
      courseId,
      isRead,   // ← backward compat: simple read mark
    } = body;

    // ── Simple read mark (body তে শুধু isRead আছে) ────────────────────────────
    if (isRead !== undefined && !title && !message && !status) {
      const notification = await Notification.findOneAndUpdate(
        { _id: targetId, userId: decoded.userId },
        { $set: { isRead: true, readAt: new Date() } },
        { new: true }
      );
      if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ success: true, notification });
    }

    // ── Announcement edit ─────────────────────────────────────────────────────
    const updateFields: any = {};

    if (title)    updateFields.title   = title.trim();
    if (message)  updateFields.message = message.trim();
    if (priority) updateFields.priority = priority;

    // status → actionUrl এ store করো
    if (status) {
      updateFields.actionUrl = buildActionUrl(status, null);
    }

    // courseId → schema তে ObjectId field হিসেবে আছে
    if (courseId !== undefined) {
      if (courseId && mongoose.isValidObjectId(courseId)) {
        updateFields.courseId = new mongoose.Types.ObjectId(courseId);
      } else if (!courseId) {
        updateFields.courseId = null; // clear করো
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: targetId, userId: decoded.userId },
      { $set: updateFields },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: "Notification not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({
      success     : true,
      message     : "Updated successfully",
      notification: {
        ...notification.toObject(),
        status  : parseStatusFromActionUrl(notification.actionUrl), // ← inject
        courseId: notification.courseId,
      },
    });

  } catch (error: any) {
    console.error("PUT /api/notifications error:", error);
    return NextResponse.json({ error: `Failed to update: ${error.message}` }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
    }

    const notification = await Notification.findOneAndDelete({
      _id     : id,
      userId  : decoded.userId,
    });

    if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Deleted successfully" });

  } catch (error: any) {
    console.error("DELETE /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * actionUrl এ status store করো — format: "status:Published"
 * courseId এখন schema তে ObjectId হিসেবে আছে, তাই actionUrl এ রাখার দরকার নেই
 */
function buildActionUrl(status: string, _unused: null): string {
  return `status:${status}`;
}

/**
 * actionUrl থেকে status parse করো
 * format: "status:Published" বা "status:Draft"
 */
function parseStatusFromActionUrl(actionUrl?: string): 'Published' | 'Draft' {
  if (!actionUrl) return 'Draft';
  const parts: Record<string, string> = {};
  actionUrl.split("|").forEach(part => {
    const idx = part.indexOf(":");
    if (idx !== -1) parts[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
  });
  const s = parts["status"];
  return s === "Published" ? "Published" : "Draft";
}