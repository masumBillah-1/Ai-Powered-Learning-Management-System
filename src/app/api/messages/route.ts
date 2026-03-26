import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { Message, Conversation, User } from "@/models";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const STAFF_ROLES = ["admin", "instructor"];

// GET /api/messages - Fetch conversation list (OPTIMIZED)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.error("❌ GET /api/messages: No token found");
      return NextResponse.json({ error: "Unauthorized - Please login again" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr: any) {
      console.error("❌ GET /api/messages: JWT verification failed:", jwtErr.message);
      return NextResponse.json({ error: "Invalid token - Please login again" }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      console.error("❌ GET /api/messages: No userId in token");
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 });
    }

    const user = await User.findById(userId).select("role").lean().maxTimeMS(3000);
    if (!user) {
      console.error("❌ GET /api/messages: User not found:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let query: any = { participants: userId };

    // If staff, also allow seeing support rooms (even if they haven't replied yet)
    if (STAFF_ROLES.includes(user.role)) {
      query = {
        $or: [
          { participants: userId },
          { roomId: { $regex: /^support_/ } }
        ]
      };
    }

    // ✅ OPTIMIZED: Limit to 50 recent conversations, lean query, select only needed fields
    const conversations = await Conversation.find(query)
      .populate("participants", "name photoURL role")
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean()
      .maxTimeMS(10000); // 10 second timeout

    return NextResponse.json({ success: true, conversations });
  } catch (err: any) {
    console.error("❌ GET /api/messages ERROR:", err.message, err.stack);
    
    // Better error messages
    if (err.name === 'MongooseError' || err.name === 'MongoError') {
      return NextResponse.json({ error: "Database connection issue. Please try again." }, { status: 503 });
    }
    
    return NextResponse.json({ error: "Server error. Please refresh and try again." }, { status: 500 });
  }
}

// POST /api/messages - Send a new message
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.error("❌ POST /api/messages: No token found");
      return NextResponse.json({ error: "Unauthorized - Please login again" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr: any) {
      console.error("❌ POST /api/messages: JWT verification failed:", jwtErr.message);
      return NextResponse.json({ error: "Invalid token - Please login again" }, { status: 401 });
    }

    const senderId = decoded.userId;
    if (!senderId) {
      console.error("❌ POST /api/messages: No userId in token");
      return NextResponse.json({ error: "Invalid token format" }, { status: 401 });
    }

    const { content, roomId, receiverId, messageType = "text" } = await req.json();

    if (!content || !roomId) {
      return NextResponse.json({ error: "Content and RoomID are required" }, { status: 400 });
    }

    // 1. Create the message
    const message = await Message.create({
      senderId,
      receiverId,
      content,
      roomId,
      messageType,
      isRead: false,
    });

    // 2. Find or update the conversation
    // Participants list: sender and receiver (if receiverId specified)
    // If it's a student sending to "support", the roomId is "support_{studentId}"
    // Staff will be added to participants when they respond/join
    
    let participants = [new mongoose.Types.ObjectId(senderId)];
    if (receiverId && receiverId !== "support" && mongoose.isValidObjectId(receiverId)) {
      participants.push(new mongoose.Types.ObjectId(receiverId));
    }

    const conversation = await Conversation.findOneAndUpdate(
      { roomId },
      {
        $addToSet: { participants: { $each: participants } },
        $set: {
          lastMessage: content,
          lastMessageAt: new Date(),
        },
        $inc: receiverId ? { [`unreadCount.${receiverId}`]: 1 } : {}
      },
      { upsert: true, new: true }
    ).maxTimeMS(5000);

    return NextResponse.json({ success: true, message, conversation });
  } catch (err: any) {
    console.error("❌ POST /api/messages ERROR:", err.message, err.stack);
    
    if (err.name === 'MongooseError' || err.name === 'MongoError') {
      return NextResponse.json({ error: "Database connection issue. Please try again." }, { status: 503 });
    }
    
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
