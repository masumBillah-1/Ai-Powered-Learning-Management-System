import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { Message, Conversation, User } from "@/models";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const STAFF_ROLES = ["admin", "instructor"];

// GET /api/messages - Fetch conversation list
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

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

    const conversations = await Conversation.find(query)
      .populate("participants", "name photoURL role")
      .sort({ lastMessageAt: -1 });

    return NextResponse.json({ success: true, conversations });
  } catch (err: any) {
    console.error("❌ GET /api/messages ERROR:", err.message);
    return NextResponse.json({ error: "Server connection failed. Try again." }, { status: 500 });
  }
}

// POST /api/messages - Send a new message
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const senderId = decoded.userId;

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
    );

    return NextResponse.json({ success: true, message, conversation });
  } catch (err: any) {
    console.error("❌ POST /api/messages ERROR:", err.message);
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
