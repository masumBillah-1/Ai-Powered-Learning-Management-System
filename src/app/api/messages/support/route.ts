import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/db/connect";
import { Message, Conversation, Course } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET as string;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;
const BOT_SENDER_ID = "careercanvas_bot";

// ✅ Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 15;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(userId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true };
  }
  if (userLimit.count >= RATE_LIMIT) {
    const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  userLimit.count++;
  return { allowed: true };
}

// POST /api/messages/support - Generate AI bot reply
export async function POST(req: NextRequest) {
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

    const { roomId, userMessage, conversationHistory = [] } = await req.json();

    if (!roomId || !userMessage) {
      return NextResponse.json({ error: "RoomID and userMessage are required" }, { status: 400 });
    }

    // ✅ Rate limit check
    const userId = decoded.userId || decoded.id || "anonymous";
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      const rateLimitMessage = await Message.create({
        senderId: BOT_SENDER_ID,
        content: `দুঃখিত, আপনি খুব দ্রুত অনেক প্রশ্ন করছেন। অনুগ্রহ করে ${rateCheck.retryAfter} সেকেন্ড পর আবার চেষ্টা করুন। 🙏`,
        roomId,
        messageType: "text",
        isRead: false,
      });
      return NextResponse.json({ success: true, message: rateLimitMessage, rateLimited: true });
    }

    // ✅ Fetch full course details so AI can answer questions about modules, content etc.
    const activeCourses = await Course.find({ status: "published" })
      .select("_id title category thumbnail price description whatYouWillLearn requirements modules level language duration")
      .limit(30)
      .lean();

    const coursesContext = activeCourses
      .map((c: any) => {
        // Build module/lesson summary
        const moduleSummary = (c.modules || [])
          .map((mod: any, i: number) => {
            const lessons = (mod.lessons || [])
              .map((l: any) => `    - ${l.title} (${l.type}${l.duration ? ", " + Math.round(l.duration) + " মিনিট" : ""})`)
              .join("\n");
            return `  মডিউল ${i + 1}: ${mod.title}\n${lessons}`;
          })
          .join("\n");

        const learnPoints = (c.whatYouWillLearn || []).length > 0
          ? (c.whatYouWillLearn as string[]).map((p: string) => `    • ${p}`).join("\n")
          : "    (উল্লেখ নেই)";

        const requirements = (c.requirements || []).length > 0
          ? (c.requirements as string[]).map((r: string) => `    • ${r}`).join("\n")
          : "    (কোনো পূর্বশর্ত নেই)";

        return `
━━━ কোর্স: ${c.title} ━━━
  ID: ${c._id}
  ক্যাটাগরি: ${c.category}
  মূল্য: ${c.price} টাকা
  লেভেল: ${c.level || "উল্লেখ নেই"}
  ভাষা: ${c.language || "উল্লেখ নেই"}
  Thumbnail: ${c.thumbnail}
  বিবরণ: ${c.description || "উল্লেখ নেই"}
  যা শিখবেন:
${learnPoints}
  পূর্বশর্ত:
${requirements}
  মডিউল ও লেসন:
${moduleSummary || "    (মডিউল যোগ হয়নি)"}`;
      })
      .join("\n");

    // ✅ Build conversation history for context
    const historyText = conversationHistory.length > 0
      ? conversationHistory
          .map((m: any) => `${m.isBot ? "AI" : "User"}: ${m.content}`)
          .join("\n")
      : "";

    // ✅ Smart prompt
    const prompt = `তুমি CareerCanvas-এর AI সাপোর্ট অ্যাসিস্ট্যান্ট। তোমার নাম "CareerCanvas AI"।

━━━ মূল নিয়মাবলি ━━━
• সবসময় বাংলায় উত্তর দাও।
• সালাম/হ্যালো/হাই হলে "আসসালামু আলাইকুম! 😊 আমি CareerCanvas AI। আপনাকে কীভাবে সাহায্য করতে পারি?" বলো। কখনো "নমস্কার" বলবে না।
• উত্তর সংক্ষিপ্ত, বন্ধুত্বপূর্ণ ও সহজ ভাষায় রাখো।

━━━ প্ল্যাটফর্মে পাওয়া কোর্সসমূহ ━━━
${coursesContext}

━━━ কথোপকথনের স্মার্ট নিয়ম ━━━

নিয়ম ১ — সাধারণ কথা (সালাম, কেমন আছ, ধন্যবাদ ইত্যাদি):
→ স্বাভাবিকভাবে উত্তর দাও। কোনো [COURSE:...] tag দেবে না।

নিয়ম ২ — user জিজ্ঞেস করলে "কী কী কোর্স আছে?" বা "কোন বিষয়ে কোর্স আছে?":
→ কোর্সের নামগুলো বাংলায় তালিকা আকারে বলো (শুধু নাম ও মূল্য, text এ)।
→ কোনো [COURSE:...] tag দেবে না।
→ শেষে জিজ্ঞেস করো: "কোন কোর্সটির বিস্তারিত বা লিংক দেখতে চান?"

নিয়ম ৩ — user জিজ্ঞেস করলে "কোনটা ভালো হবে?" বা দুটো কোর্স তুলনা চাইলে:
→ সংক্ষেপে তুলনা করো (text এ)। কোনো [COURSE:...] tag দেবে না।
→ শেষে জিজ্ঞেস করো: "কোন কোর্সটির লিংক দেখতে চান?"

নিয়ম ৪ — user যদি বলে "লিংক দাও", "কার্ড দেখাও", "এই কোর্সটা দেখাও", কোনো নির্দিষ্ট কোর্সের নাম বলে, অথবা "হ্যাঁ" বলে আগ্রহ দেখায়:
→ তখনই নিচের format এ কোর্স card দেখাও (প্রতিটি আলাদা লাইনে):
   [COURSE:ID:TITLE:THUMBNAIL_URL:PRICE]
→ PRICE শুধু সংখ্যা, কোনো "BDT" বা "টাকা" লিখবে না।
→ আগের কথোপকথনে উল্লেখিত কোর্সটি খুঁজে সেটার card দেখাও।

নিয়ম ৫ — user বাজেট উল্লেখ করলে (যেমন "৫০০০ টাকার মধ্যে", "সস্তা কোর্স"):
→ সেই বাজেটের মধ্যে কোর্স থাকলে card দেখাও।
→ না থাকলে বিনয়ের সাথে বলো।

━━━ [COURSE:...] Format (একদম হুবহু মানতে হবে) ━━━
[COURSE:69c3cd369ff16b3d9cfec728:Complete WordPress Website Developer Course:https://coursevania.com/wp-content/uploads/2022/10/1490124_3f2f_2.jpg:5000]

━━━ আগের কথোপকথন ━━━
${historyText || "(নতুন কথোপকথন শুরু)"}

━━━ User-এর বর্তমান বার্তা ━━━
${userMessage}`;

    // ✅ Call Gemini
    let botReply = "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। অনুগ্রহ করে একটু পরে চেষ্টা করুন।";
    const recommendedCourses: Array<{ id: string; title: string; thumbnail: string; price: number }> = [];

    if (GEMINI_API_KEY) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (generatedText) {
            botReply = generatedText.trim();

            // ✅ Smart regex — handles https:// URLs that contain colons
            // Format: [COURSE:ID:TITLE:THUMBNAIL_URL:PRICE]
            const coursePattern = /\[COURSE:([a-f0-9]{24}):([^:]+):(https?:\/\/[^:]+(?::[^:]+)*?):(\d+)(?:\s*BDT)?\]/gi;
            const matches = [...botReply.matchAll(coursePattern)];

            for (const match of matches) {
              recommendedCourses.push({
                id: match[1],
                title: match[2].trim(),
                thumbnail: match[3].trim(),
                price: Number(match[4]),
              });
              botReply = botReply.replace(match[0], "").trim();
            }

            // Fallback for non-http thumbnails
            if (recommendedCourses.length === 0) {
              const fallback = /\[COURSE:([a-f0-9]{24}):([^:]+):([^:]+):(\d+)(?:\s*BDT)?\]/gi;
              const fb = [...botReply.matchAll(fallback)];
              for (const match of fb) {
                recommendedCourses.push({
                  id: match[1],
                  title: match[2].trim(),
                  thumbnail: match[3].trim(),
                  price: Number(match[4]),
                });
                botReply = botReply.replace(match[0], "").trim();
              }
            }
          }
        } else {
          const errorText = await response.text();
          console.error("❌ Gemini API error:", response.status, errorText);
          if (response.status === 429) {
            botReply = "দুঃখিত, এই মুহূর্তে অনেক বেশি request আসছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন। 🙏";
          }
        }
      } catch (aiErr: any) {
        console.error("❌ AI generation failed:", aiErr.message);
      }
    }

    // ✅ Save bot message
    const botMessage = await Message.create({
      senderId: BOT_SENDER_ID,
      content: botReply,
      roomId,
      messageType: "text",
      isRead: false,
      recommendedCourses: recommendedCourses.length > 0 ? recommendedCourses : undefined,
    });

    await Conversation.findOneAndUpdate(
      { roomId },
      { $set: { lastMessage: botReply, lastMessageAt: new Date() } },
      { upsert: true }
    ).maxTimeMS(5000);

    console.log("✅ Bot reply sent:", botMessage._id, recommendedCourses.length > 0 ? `| ${recommendedCourses.length} course(s)` : "");

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