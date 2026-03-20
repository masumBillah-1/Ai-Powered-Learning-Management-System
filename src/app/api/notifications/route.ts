import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import { Notification, User } from "@/models";
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

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit         = parseInt(searchParams.get("limit") || "20");
    const type          = searchParams.get("type");

    // ✅ Get user's read notification IDs
    const currentUser = await User.findById(decoded.userId).select('readNotifications').lean();
    const readIds = currentUser?.readNotifications?.map((id: any) => id.toString()) || [];

    // ✅ Get user's enrolled/related courses and their instructors
    let userEnrolledCourses: mongoose.Types.ObjectId[] = [];
    let myInstructors: mongoose.Types.ObjectId[] = [];

    if (decoded.role === "student") {
      const enrollments = await mongoose.connection.collection("enrollments")
        .find({ studentId: new mongoose.Types.ObjectId(decoded.userId) })
        .toArray();
      userEnrolledCourses = enrollments.map((e: any) => new mongoose.Types.ObjectId(e.courseId)).filter(Boolean);
      
      if (userEnrolledCourses.length > 0) {
        const courses = await mongoose.connection.collection("courses")
          .find({ _id: { $in: userEnrolledCourses } })
          .project({ instructorId: 1 })
          .toArray();
        myInstructors = courses.map((c: any) => new mongoose.Types.ObjectId(c.instructorId)).filter(Boolean);
      }
    } else if (decoded.role === "instructor") {
      const courses = await mongoose.connection.collection("courses")
        .find({ instructorId: new mongoose.Types.ObjectId(decoded.userId) })
        .toArray();
      userEnrolledCourses = courses.map((c: any) => new mongoose.Types.ObjectId(c._id)).filter(Boolean);
    }

    const broadcastCriteria: any[] = [
      { targetRole: "all" },
      { targetRole: decoded.role },
      ...(userEnrolledCourses.length > 0 ? [{ targetCourseId: { $in: userEnrolledCourses } }] : []),
      // ✅ Handle "all-my-students"
      ...(decoded.role === "student" && myInstructors.length > 0 ? [{
        targetRole: "all-my-students",
        createdBy: { $in: myInstructors }
      }] : [])
    ];

    let query: any;
    const expirationCriteria = {
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ]
    };

    if (type === "announcement") {
      query = {
        type: "announcement",
        $and: [
          {
            $or: [
              { userId: new mongoose.Types.ObjectId(decoded.userId) },
              { createdBy: new mongoose.Types.ObjectId(decoded.userId) },
              {
                isBroadcast: true,
                createdBy: { $ne: new mongoose.Types.ObjectId(decoded.userId) },
                $or: broadcastCriteria
              }
            ]
          },
          expirationCriteria
        ]
      };
    } else {
      query = {
        $and: [
          {
            $or: [
              { 
                userId: new mongoose.Types.ObjectId(decoded.userId),
                type: { $ne: "announcement" },
                isBroadcast: { $ne: true },
                isRead: false 
              },
              {
                isBroadcast: true,
                createdBy: { $ne: new mongoose.Types.ObjectId(decoded.userId) },
                _id: { $nin: readIds.map((id: string) => new mongoose.Types.ObjectId(id)) },
                $or: broadcastCriteria
              }
            ]
          },
          expirationCriteria
        ]
      };
    }

    const notifications = await Notification.find(query)
      .populate('createdBy', 'name email role photoURL')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const enriched = notifications.map((n: any) => {
      const isRead = n.isBroadcast 
        ? readIds.includes(n._id.toString())
        : n.isRead;
      
      const status = parseStatusFromActionUrl(n.actionUrl);
      return { ...n, isRead, status };
    });

    const uniqueAnnouncements = enriched.filter((item, index, self) => {
      return index === self.findIndex(t => (
        t.title === item.title && 
        t.message === item.message && 
        t.createdBy?._id?.toString() === item.createdBy?._id?.toString()
      ));
    });

    // Calculate unread count reliably
    const unreadCount = enriched.filter(n => !n.isRead).length;

    return NextResponse.json({ success: true, notifications: uniqueAnnouncements, unreadCount }, { status: 200 });

  } catch (error: any) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch notifications" }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const body = await req.json();

    const {
      type       = "announcement",
      title,
      message,
      priority   = "medium",
      status     = "Draft",
      courseId,
      expiresAt,
      targetRole = "all",
    } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required." }, { status: 400 });
    }

    const actionUrl = `status:${status}`;
    
    const notification = await Notification.create({
      userId: new mongoose.Types.ObjectId(decoded.userId),
      type,
      title: title.trim(),
      message: message.trim(),
      priority,
      isRead: false,
      actionUrl,
      isBroadcast: status === "Published" && type === "announcement",
      targetRole,
      targetCourseId: courseId && mongoose.isValidObjectId(courseId) ? new mongoose.Types.ObjectId(courseId) : undefined,
      createdBy: new mongoose.Types.ObjectId(decoded.userId),
      ...(courseId && mongoose.isValidObjectId(courseId) && { courseId: new mongoose.Types.ObjectId(courseId) }),
      ...(expiresAt && { expiresAt: new Date(expiresAt) }),
    });

    await notification.populate('createdBy', 'name email role photoURL');

    return NextResponse.json({
      success: true,
      message: status === "Published" ? "Announcement published!" : "Draft saved!",
      notification: { ...notification.toObject(), status },
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { searchParams } = new URL(req.url);
    const queryId = searchParams.get("id");
    const body = await req.json();

    // ── CASE 1: Mark as Read ──────────────────────────────────────────────────
    if (body.markAll || body.isRead || (queryId && body.isRead)) {
      if (body.markAll) {
        // 1. Mark individual unread notifications as read
        await Notification.updateMany({ userId: decoded.userId, isRead: false }, { $set: { isRead: true, readAt: new Date() } });
        
        // 2. Add all currently visible unread broadcast IDs to user's readNotifications array
        // (Note: This is a bit limited but covers most cases for the bell icon)
        const unreadBroadcasts = await Notification.find({
          isBroadcast: true,
          createdBy: { $ne: new mongoose.Types.ObjectId(decoded.userId) }
        }).select('_id');
        
        if (unreadBroadcasts.length > 0) {
          await User.findByIdAndUpdate(decoded.userId, {
            $addToSet: { readNotifications: { $each: unreadBroadcasts.map(b => b._id) } }
          });
        }
        return NextResponse.json({ success: true });
      }

      const targetId = queryId || body.id;
      if (!mongoose.isValidObjectId(targetId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

      const notif = await Notification.findById(targetId);
      if (!notif) return NextResponse.json({ error: "Not found" }, { status: 404 });

      if (notif.isBroadcast) {
        await User.findByIdAndUpdate(decoded.userId, {
          $addToSet: { readNotifications: new mongoose.Types.ObjectId(targetId) }
        });
      } else {
        notif.isRead = true;
        notif.readAt = new Date();
        await notif.save();
      }
      return NextResponse.json({ success: true });
    }

    // ── CASE 2: Edit Announcement ─────────────────────────────────────────────
    if (!queryId) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const updateFields: any = {};
    if (body.title)    updateFields.title   = body.title.trim();
    if (body.message)  updateFields.message = body.message.trim();
    if (body.priority) updateFields.priority = body.priority;
    if (body.status)   updateFields.actionUrl = `status:${body.status}`;
    if (body.targetRole) updateFields.targetRole = body.targetRole;
    if (body.courseId) {
       updateFields.targetCourseId = new mongoose.Types.ObjectId(body.courseId);
       updateFields.courseId = new mongoose.Types.ObjectId(body.courseId);
    }
    
    if (body.status === "Published") updateFields.isBroadcast = true;

    const notification = await Notification.findOneAndUpdate(
      { _id: queryId, createdBy: decoded.userId },
      { $set: updateFields },
      { new: true }
    ).populate('createdBy', 'name email role photoURL');

    if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      notification: {
        ...notification.toObject(),
        status: body.status || parseStatusFromActionUrl(notification.actionUrl)
      }
    });

  } catch (error: any) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const id = new URL(req.url).searchParams.get("id");

    const notification = await Notification.findOneAndDelete({
      _id: id,
      createdBy: decoded.userId
    });

    if (!notification) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseStatusFromActionUrl(actionUrl?: string): 'Published' | 'Draft' {
  if (!actionUrl || !actionUrl.startsWith("status:")) return 'Draft';
  return actionUrl.replace("status:", "") as 'Published' | 'Draft';
}