import { NextRequest, NextResponse } from "next/server";
import { generateVideoContext } from "@/lib/youtubeTranscript";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ── System Prompt ────────────────────────────────────────
const SYSTEM_PROMPT = `তুমি CareerCanvas এর একজন বুদ্ধিমান AI শিক্ষা সহকারী। তুমি নিচের নিয়মগুলো কঠোরভাবে মেনে চলবে:

1. **ভাষা নিয়ন্ত্রণ (Language Control):** ভিডিওর কন্টেন্ট বা ট্রান্সক্রিপ্ট যদি হিন্দি বা অন্য কোনো ভাষায় থাকে, তবে সেগুলোকে সরাসরি উত্তরে ব্যবহার করা যাবে না। অবশ্যই সেগুলোকে বাংলা বা ইংরেজিতে অনুবাদ করে উত্তর দাও। উত্তরের ভেতরে কোনো হিন্দি শব্দ (যেমন: "हम", "है", "करना") ব্যবহার করা সম্পূর্ণ নিষেধ।

2. **MCQ তৈরি করতে পারো** — যখন কেউ MCQ চাইবে তখন এই format এ দাও:
   MCQ_START
   প্রশ্ন: [প্রশ্ন লিখো]
   ক) [option]
   খ) [option]
   গ) [option]
   ঘ) [option]
   সঠিক উত্তর: [ক/খ/গ/ঘ]
   ব্যাখ্যা: [সংক্ষিপ্ত ব্যাখ্যা অবশ্যই বাংলা বা ইংরেজিতে]
   MCQ_END

3. **Code লিখতে পারো** — সুন্দর formatted code দাও with explanation।

4. **যেকোনো বিষয়ে প্রশ্নের উত্তর দাও** — শুধুমাত্র বাংলা ও English-এ। ভিডিওর ভাষা হিন্দি হলেও উত্তর শুধুমাত্র বাংলা বা ইংরেজিতে হবে।

5. **Practice quiz** — একাধিক MCQ একসাথে দিতে পারো।

সবসময় সহায়তামূলক, স্পষ্ট এবং সম্পূর্ণ বাংলা অথবা ইংরেজি ভাষায় উত্তর দাও।`;

// ── POST — AI Chat (MongoDB save নেই) ───────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, history, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "message প্রয়োজন" },
        { status: 400 }
      );
    }

    // Video context এর জন্য enhanced system prompt
    let enhancedPrompt = SYSTEM_PROMPT;
    
    if (context?.type === "video_lesson") {
      try {
        // Generate video context with transcript
        const videoContext = await generateVideoContext(context.videoUrl, context.videoTitle);
        enhancedPrompt += `\n\n${videoContext}`;
      } catch (error) {
        // Fallback without transcript
        enhancedPrompt += `\n\n🎥 **Video Context:**
আপনি এখন "${context.videoTitle}" নামক video lesson সম্পর্কে কথা বলছেন।
এই video এর context এ প্রশ্নের উত্তর দিন। যেমন:
- "এই video তে কি শিখলাম?" 
- "Main points গুলো কি?"
- "এই concept টা আরো explain করো"
- "Practice questions দাও এই video based এ"
- "Real-life examples দাও"

Video Title: ${context.videoTitle}
Lesson ID: ${context.lessonId}
Course ID: ${context.courseId}

এই video এর content এর সাথে relevant উত্তর দিন।`;
      }
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: enhancedPrompt }],
      },
      {
        role: "model",
        parts: [{ text: context?.type === "video_lesson" 
          ? `বুঝেছি! আমি "${context.videoTitle}" video সম্পর্কে আপনার যেকোনো প্রশ্নের উত্তর দিতে পারি। কি জানতে চান?`
          : "বুঝেছি! আমি CareerCanvas এর AI Assistant। কীভাবে সাহায্য করতে পারি?" }],
      },
      ...(history || []).slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.7,
        },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      console.error("Gemini Error:", err);
      
      if (err.error?.code === 429) {
        return NextResponse.json(
          { error: "AI এখন ব্যস্ত (Limit Exceeded)। কিছুক্ষণ পর আবার চেষ্টা করুন।" },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Gemini API সমস্যা হয়েছে" },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    const assistantMessage =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "দুঃখিত, উত্তর পাওয়া যায়নি।";

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Server সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}