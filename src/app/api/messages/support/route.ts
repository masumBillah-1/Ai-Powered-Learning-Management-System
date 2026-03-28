import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { Message, Conversation } from "@/models";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const BOT_SENDER_ID = "careercanvas_bot";

// POST /api/messages/support - Generate AI bot reply
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.error("❌ POST /api/messages/support: No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr: any) {
      console.error("❌ POST /api/messages/support: JWT verification failed:", jwtErr.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { roomId, userMessage, conversationHistory = [] } = await req.json();

    if (!roomId || !userMessage) {
      return NextResponse.json({ error: "RoomID and userMessage are required" }, { status: 400 });
    }

    console.log("🤖 Generating bot reply for room:", roomId);

    // Build conversation context for AI
    let contextMessages = conversationHistory
      .map((msg: any) => `${msg.isBot ? "Assistant" : "User"}: ${msg.content}`)
      .join("\n");

    contextMessages += `\nUser: ${userMessage}\nAssistant:`;

    // Generate AI response using Gemini
    let botReply = "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। অনুগ্রহ করে একটু পরে চেষ্টা করুন।";

    if (GEMINI_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are CareerCanvas Assistant, a helpful AI support bot for an online learning platform called CareerCanvas. 
                      
Your role:
- Help students and instructors with course-related questions
- Provide information about enrollment, payments, and certificates
- Assist with technical issues
- Be friendly, professional, and concise
- Respond in Bengali (বাংলা) when the user writes in Bengali
- Respond in English when the user writes in English

Previous conversation:
${contextMessages}

Provide a helpful, concise response (max 150 words).`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            botReply = generatedText.trim();
          }
        } else {
          console.error("❌ Gemini API error:", response.status, await response.text());
        }
      } catch (aiErr: any) {
        console.error("❌ AI generation failed:", aiErr.message);
      }
    } else {
      console.warn("⚠️ GEMINI_API_KEY not configured, using fallback response");
    }

    // Save bot message to database
    const botMessage = await Message.create({
      senderId: BOT_SENDER_ID,
      content: botReply,
      roomId,
      messageType: "text",
      isRead: false,
    });

    // Update conversation
    await Conversation.findOneAndUpdate(
      { roomId },
      {
        $set: {
          lastMessage: botReply,
          lastMessageAt: new Date(),
        },
      },
      { upsert: true }
    ).maxTimeMS(5000);

    console.log("✅ Bot reply sent:", botMessage._id);

    return NextResponse.json({ success: true, message: botMessage });
  } catch (err: any) {
    console.error("❌ POST /api/messages/support ERROR:", err.message, err.stack);
    return NextResponse.json({ error: "Failed to generate bot reply" }, { status: 500 });
  }
}

// PATCH /api/messages/support - Admin takeover control
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr: any) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { roomId, takeover } = await req.json();

    if (!roomId || typeof takeover !== "boolean") {
      return NextResponse.json({ error: "RoomID and takeover (boolean) are required" }, { status: 400 });
    }

    // Update conversation takeover status
    await Conversation.findOneAndUpdate(
      { roomId },
      { $set: { adminTakenOver: takeover } },
      { upsert: true }
    ).maxTimeMS(5000);

    console.log(`${takeover ? "✋" : "🤖"} Admin ${takeover ? "took over" : "gave back"} room:`, roomId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ PATCH /api/messages/support ERROR:", err.message, err.stack);
    return NextResponse.json({ error: "Failed to update takeover status" }, { status: 500 });
  }
}
