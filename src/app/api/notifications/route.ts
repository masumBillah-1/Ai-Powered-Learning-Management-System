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

    // ✅ Get user's enrolled/related courses for course-specific notifications
    let userEnrolledCourses: string[] = [];
    if (decoded.role === "student") {
      const enrollments = await mongoose.connection.collection("enrollments")
        .find({ studentId: new mongoose.Types.ObjectId(decoded.userId) })
        .toArray();
      userEnrolledCourses = enrollments.map((e: any) => e.courseId?.toString()).filter(Boolean);
    } else if (decoded.role === "instructor") {
      // ✅ Get instructor's courses
      const courses = await mongoose.connection.collection("courses")
        .find({ instructorId: new mongoose.Types.ObjectId(decoded.userId) })
        .toArray();
      userEnrolledCourses = courses.map((c: any) => c._id?.toString()).filter(Boolean);
    }

    // ✅ Role-based notification query
    let query: any;
    
    if (type === "announcement") {
      // ✅ For announcements page - show creator's own + received broadcasts
      query = {
        $or: [
          // Individual notifications (creator's drafts and own announcements)
          { 
            userId: new mongoose.Types.ObjectId(decoded.userId),
            type: "announcement"
          },
          // Own created broadcast announcements (creator নিজের published announcements)
          { 
            createdBy: new mongoose.Types.ObjectId(decoded.userId),
            isBroadcast: true,
            type: "announcement"
          },
          // Received broadcast notifications (others' published announcements)
          { 
            isBroadcast: true,
            type: "announcement",
            createdBy: { $ne: new mongoose.Types.ObjectId(decoded.userId) }, // নিজের না
            $or: [
              { targetRole: "all" },                    // All users
              { targetRole: decoded.role },             // Role-specific
              // Course-specific notifications
              ...(userEnrolledCourses.length > 0 ? [{
                targetCourseId: { $in: userEnrolledCourses.map(id => new mongoose.Types.ObjectId(id)) }
              }] : [])
            ]
          }
        ],
        $and: [
          {
            $or: [
              { expiresAt: { $exists: false } },
              { expiresAt: { $gt: new Date() } },
            ]
          }
        ]
      };
    } else {
      // ✅ For other notifications - original logic
      query = {
        $or: [
          // Individual notifications
          { 
            userId: new mongoose.Types.ObjectId(decoded.userId),
            isBroadcast: { $ne: true }
          },
          // Broadcast notifications
          { 
            isBroadcast: true,
            createdBy: { $ne: new mongoose.Types.ObjectId(decoded.userId) },
            $or: [
              { targetRole: "all" },
              { targetRole: decoded.role },
              ...(decoded.role === "student" && userEnrolledCourses.length > 0 ? [{
                targetCourseId: { $in: userEnrolledCourses.map(id => new mongoose.Types.ObjectId(id)) }
              }] : [])
            ]
          }
        ],
        $and: [
          {
            $or: [
              { expiresAt: { $exists: false } },
              { expiresAt: { $gt: new Date() } },
            ]
          }
        ]
      };
    }

    if (unreadOnly) query.isRead = false;
    // type filter already handled above

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name email role photoURL') // ✅ Populate creator info
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // ✅ Enhanced response with status field and duplicate removal
    const enriched = notifications.map((n: any) => {
      const status = parseStatusFromActionUrl(n.actionUrl);
      return { ...n, status };
    });

    // ✅ Remove duplicates based on title, message, and createdBy
    const uniqueAnnouncements = enriched.filter((item, index, self) => {
      return index === self.findIndex(t => (
        t.title === item.title && 
        t.message === item.message && 
        t.createdBy?._id?.toString() === item.createdBy?._id?.toString()
      ));
    });

    // ✅ Updated unread count calculation - same logic as query
    let unreadQuery: any;
    if (type === "announcement") {
      unreadQuery = {
        $or: [
          // Individual notifications (creator's drafts and own announcements)
          { 
            userId: new mongoose.Types.ObjectId(decoded.userId),
            type: "announcement",
            isRead: false
          },
          // Received broadcast notifications (others' published announcements) - নিজের না
          { 
            isBroadcast: true,
            type: "announcement",
            isRead: false,
            createdBy: { $ne: new mongoose.Types.ObjectId(decoded.userId) }, // নিজের না
            $or: [
              { targetRole: "all" },
              { targetRole: decoded.role }
              // ✅ Removed course-specific to match dashboard API
            ]
          }
        ],
        $and: [
          {
            $or: [
              { expiresAt: { $exists: false } },
              { expiresAt: { $gt: new Date() } },
            ]
          }
        ]
      };
    } else {
      unreadQuery = {
        $or: [
          { 
            userId: new mongoose.Types.ObjectId(decoded.userId),
            isBroadcast: { $ne: true },
            isRead: false
          },
          { 
            isBroadcast: true,
            isRead: false,
            createdBy: { $ne: new mongoose.Types.ObjectId(decoded.userId) },
            $or: [
              { targetRole: "all" },
              { targetRole: decoded.role },
              ...(decoded.role === "student" && userEnrolledCourses.length > 0 ? [{
                targetCourseId: { $in: userEnrolledCourses.map(id => new mongoose.Types.ObjectId(id)) }
              }] : [])
            ]
          }
        ],
        $and: [
          {
            $or: [
              { expiresAt: { $exists: false } },
              { expiresAt: { $gt: new Date() } },
            ]
          }
        ]
      };
    }

    const unreadCount = await Notification.countDocuments(unreadQuery);

    return NextResponse.json({ success: true, notifications: uniqueAnnouncements, unreadCount }, { status: 200 });

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
      targetRole = "all", // ✅ New field for broadcast
    } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    // ✅ Only published announcements create broadcast notifications
    if (status === "Published" && type === "announcement") {
      // ✅ Check if this user already has a similar announcement to prevent duplicates
      const existingAnnouncement = await Notification.findOne({
        createdBy: new mongoose.Types.ObjectId(decoded.userId),
        type: "announcement",
        title: title.trim(),
        message: message.trim(),
        isBroadcast: true,
        createdAt: { $gte: new Date(Date.now() - 10000) } // Within last 10 seconds
      });

      if (existingAnnouncement) {
        return NextResponse.json({
          success: true,
          message: "Announcement already published",
          notification: existingAnnouncement
        }, { status: 200 });
      }

      // ✅ First create individual notification for creator
      const actionUrl = buildActionUrl(status, null);
      const individualNotification = await Notification.create({
        userId: new mongoose.Types.ObjectId(decoded.userId),
        type,
        title: title.trim(),
        message: message.trim(),
        priority,
        isRead: false,
        actionUrl,
        isBroadcast: false,
        createdBy: new mongoose.Types.ObjectId(decoded.userId),
        ...(courseId && mongoose.isValidObjectId(courseId) && {
          courseId: new mongoose.Types.ObjectId(courseId),
        }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      });

      // ✅ Then create broadcast notifications
      await createBroadcastNotification({
        createdBy: decoded.userId,
        title: title.trim(),
        message: message.trim(),
        priority,
        targetRole,
        courseId: courseId && mongoose.isValidObjectId(courseId) ? courseId : null,
      });

      return NextResponse.json({
        success: true,
        message: "Announcement published and notifications sent!",
        notification: {
          ...individualNotification.toObject(),
          status,
          courseId: individualNotification.courseId,
        },
      }, { status: 201 });
    }

    // ✅ Draft announcements - শুধু creator এর জন্য individual notification
    const actionUrl = buildActionUrl(status, null);

    const notificationData: any = {
      userId   : new mongoose.Types.ObjectId(decoded.userId),
      type,
      title    : title.trim(),
      message  : message.trim(),
      priority,
      isRead   : false,
      actionUrl,
      isBroadcast: false, // Individual notification
      createdBy: new mongoose.Types.ObjectId(decoded.userId),
      ...(courseId && mongoose.isValidObjectId(courseId) && {
        courseId: new mongoose.Types.ObjectId(courseId),
      }),
      ...(expiresAt && { expiresAt: new Date(expiresAt) }),
    };

    const notification = await Notification.create(notificationData);

    return NextResponse.json({
      success     : true,
      message     : "Draft saved successfully",
      notification: {
        ...notification.toObject(),
        status,
        courseId: notification.courseId,
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

// ✅ Helper function to create broadcast notifications
async function createBroadcastNotification({
  createdBy,
  title,
  message,
  priority,
  targetRole,
  courseId,
}: {
  createdBy: string;
  title: string;
  message: string;
  priority: string;
  targetRole: string;
  courseId?: string | null;
}) {
  const { User, Enrollment } = await import("@/models");

  if (targetRole === "all") {
    // ✅ All users
    const users = await User.find({ status: "active" }, { _id: 1 }).lean();
    const notifications = users.map((user: any) => ({
      userId: user._id,
      type: "announcement",
      title,
      message,
      priority,
      isRead: false,
      isBroadcast: true,
      targetRole: "all",
      createdBy: new mongoose.Types.ObjectId(createdBy),
      actionUrl: "status:Published",
    }));
    await Notification.insertMany(notifications);
    
  } else if (targetRole === "student" || targetRole === "instructor" || targetRole === "admin") {
    // ✅ Role-specific users
    const users = await User.find({ role: targetRole, status: "active" }, { _id: 1 }).lean();
    const notifications = users.map((user: any) => ({
      userId: user._id,
      type: "announcement",
      title,
      message,
      priority,
      isRead: false,
      isBroadcast: true,
      targetRole,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      actionUrl: "status:Published",
    }));
    await Notification.insertMany(notifications);
    
  } else if (courseId && mongoose.isValidObjectId(courseId)) {
    // ✅ Course-specific students
    const enrollments = await Enrollment.find(
      { courseId: new mongoose.Types.ObjectId(courseId) },
      { studentId: 1 }
    ).lean();
    
    if (enrollments.length > 0) {
      const notifications = enrollments.map((enrollment: any) => ({
        userId: enrollment.studentId,
        type: "announcement",
        title,
        message,
        priority,
        isRead: false,
        isBroadcast: true,
        targetCourseId: new mongoose.Types.ObjectId(courseId),
        createdBy: new mongoose.Types.ObjectId(createdBy),
        actionUrl: "status:Published",
      }));
      await Notification.insertMany(notifications);
    }
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
        {
          $or: [
            { _id: targetId, userId: decoded.userId }, // Individual notification
            { _id: targetId, createdBy: decoded.userId } // Broadcast notification (creator)
          ]
        },
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

    // ✅ Check if status is changing from Draft to Published
    const existingNotification = await Notification.findOne({
      $or: [
        { _id: targetId, userId: decoded.userId }, // Individual notification
        { _id: targetId, createdBy: decoded.userId } // Broadcast notification (creator)
      ]
    });
    
    if (!existingNotification) {
      return NextResponse.json({ error: "Notification not found or unauthorized" }, { status: 404 });
    }

    const oldStatus = parseStatusFromActionUrl(existingNotification.actionUrl);
    const newStatus = status ? status : oldStatus;

    // ✅ If changing from Draft to Published, create broadcast notifications
    if (oldStatus === "Draft" && newStatus === "Published" && existingNotification.type === "announcement") {
      await createBroadcastNotification({
        createdBy: decoded.userId,
        title: updateFields.title || existingNotification.title,
        message: updateFields.message || existingNotification.message,
        priority: updateFields.priority || existingNotification.priority,
        targetRole: "all", // Default to all users for now
        courseId: updateFields.courseId || existingNotification.courseId?.toString() || null,
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        $or: [
          { _id: targetId, userId: decoded.userId }, // Individual notification
          { _id: targetId, createdBy: decoded.userId } // Broadcast notification (creator)
        ]
      },
      { $set: updateFields },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: "Notification not found or unauthorized" }, { status: 404 });
    }

    // ✅ If this is an individual announcement, update all related broadcast notifications
    if (!notification.isBroadcast && notification.type === "announcement") {
      await Notification.updateMany(
        {
          createdBy: decoded.userId,
          isBroadcast: true,
          type: "announcement",
          title: existingNotification.title, // Match original title
          message: existingNotification.message // Match original message
        },
        { $set: updateFields }
      );
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
      $or: [
        { _id: id, userId: decoded.userId }, // Individual notification
        { _id: id, createdBy: decoded.userId } // Broadcast notification (creator)
      ]
    });

    if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // ✅ If this was a broadcast announcement, delete all related broadcast notifications
    if (notification.isBroadcast && notification.type === "announcement") {
      await Notification.deleteMany({
        createdBy: decoded.userId,
        title: notification.title,
        message: notification.message,
        isBroadcast: true,
        type: "announcement"
      });
    }

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