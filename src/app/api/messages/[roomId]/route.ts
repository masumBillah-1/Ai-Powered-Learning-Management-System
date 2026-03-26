import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { Message, Conversation, User } from "@/models";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;

// GET /api/messages/[roomId] - Fetch message history
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.error("❌ GET /api/messages/[roomId]: No token found");
      return NextResponse.json({ error: "Unauthorized - Please login again" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr: any) {
      console.error("❌ GET /api/messages/[roomId]: JWT verification failed:", jwtErr.message);
      return NextResponse.json({ error: "Invalid token - Please login again" }, { status: 401 });
    }

    const { roomId } = await params;

    const messages = await Message.find({ roomId })
      .populate("senderId", "name photoURL role")
      .sort({ createdAt: 1 })
      .lean()
      .maxTimeMS(10000);

    return NextResponse.json(
      { success: true, messages },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("❌ GET /api/messages/[roomId] error:", err.message, err.stack);
    
    if (err.name === 'MongooseError' || err.name === 'MongoError') {
      return NextResponse.json({ error: "Database connection issue. Please try again." }, { status: 503 });
    }
    
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}

// PUT /api/messages/[roomId] - Mark messages as read
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.error("❌ PUT /api/messages/[roomId]: No token found");
      return NextResponse.json({ error: "Unauthorized - Please login again" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr: any) {
      console.error("❌ PUT /api/messages/[roomId]: JWT verification failed:", jwtErr.message);
      return NextResponse.json({ error: "Invalid token - Please login again" }, { status: 401 });
    }

    const userId = decoded.userId;
    const { roomId } = await params;

    // 1. Mark messages where receiver is current user as read
    await Message.updateMany(
      { roomId, receiverId: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    ).maxTimeMS(5000);

    // 2. Reset unread count for this user in the conversation
    await Conversation.findOneAndUpdate(
      { roomId },
      { $set: { [`unreadCount.${userId}`]: 0 } }
    ).maxTimeMS(5000);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ PUT /api/messages/[roomId] error:", err.message, err.stack);
    
    if (err.name === 'MongooseError' || err.name === 'MongoError') {
      return NextResponse.json({ error: "Database connection issue. Please try again." }, { status: 503 });
    }
    
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
