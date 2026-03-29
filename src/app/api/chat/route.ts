import { NextRequest, NextResponse } from "next/server";
import { generateVideoContext } from "@/lib/youtubeTranscript";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;


// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ── System Prompt 

// ── System Prompt 

const SYSTEM_PROMPT = `You are "CareerCanvas AI", a professional and friendly educational assistant. 
GUIDELINES:
1. LANGUAGE: Respond strictly in Bengali or English. If the input/video is in Hindi/Urdu, translate and explain in Bengali/English. Never use Hindi words like "hain", "karna", etc.
2. FORMATTING: Use Markdown (bold, lists, code blocks) to make answers readable.
3. MCQ FORMAT:
   MCQ_START
   প্রশ্ন: [Question]
   ক) [Option] খ) [Option] গ) [Option] ঘ) [Option]
   সঠিক উত্তর: [Option Letter]
   ব্যাখ্যা: [Brief explanation in Bengali]
   MCQ_END
4. PERSONA: Be encouraging like a mentor. If a user asks something irrelevant to education, politely bring them back to the topic.`;

export async function POST(req: NextRequest) {
  try {
    const { message, history, context } = await req.json();

    // PRODUCTION check for API key
    if (!GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY in environment");
      return NextResponse.json({ error: "AI সার্ভিস সংযোগের জন্য API কী সেট করা হয়নি।" }, { status: 500 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // --- ADVANCED: Context Management ---
    let videoInfoText = "";
    if (context?.type === "video_lesson") {
      try {
        const videoContext = await generateVideoContext(context.videoUrl, context.videoTitle);
        videoInfoText = `\n\n[VIDEO CONTEXT ACTIVE]\n${videoContext}`;
      } catch (err) {
        videoInfoText = `\n\n[VIDEO METADATA]\nTitle: ${context.videoTitle}\nNote: Transcript unavailable. Answer based on title and general knowledge.`;
      }
    }

    // --- ADVANCED: Dynamic Prompt Construction ---
    const contents: any[] = [
      {
        role: "user",
        parts: [{ text: `${SYSTEM_PROMPT}${videoInfoText}\n\nUser is asking about: ${context?.videoTitle || "General topics"}` }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am ready to assist you in Bengali and English based on the rules." }],
      },
      ...(history || []).slice(-6).map((m: any) => ({
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
          maxOutputTokens: 2000,
          temperature: 0.6,
          topP: 0.8,
          stopSequences: [],
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    if (!geminiRes.ok) {
      const status = geminiRes.status;
      let errorData: any = null;
      let errorText = null;

      try {
        errorData = await geminiRes.json();
        errorText = errorData?.error || errorData?.message || JSON.stringify(errorData);
      } catch (parseErr) {
        console.error("Gemini response parse error:", parseErr);
      }

      console.error("Gemini API Error", { status, errorData });

      const errorMsg = status === 429
        ? "AI এখন ব্যস্ত। ১ মিনিট পরে আবার চেষ্টা করুন।"
        : "দুঃখিত, AI সার্ভিস বর্তমানে অপ্রাপ্য। পরে চেষ্টা করুন।";

      const localFallback = `দুঃখিত, AI সার্ভার এখন পাওয়া যাচ্ছে না (status=${status}, reason=${errorText || 'unknown'}). আজকের জন্য শীঘ্রই চেষ্টা করুন।`;

      return NextResponse.json({
        message: localFallback,
        error: `${errorMsg} (${errorText || 'no detail'})`,
        provider: "gemini",
        status,
      }, { status: 200 });
    }

    const geminiData = await geminiRes.json();
    const assistantMessage = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
      || "আমি দুঃখিত, আমি আপনার প্রশ্নটি বুঝতে পারছি না।";

    return NextResponse.json({ message: assistantMessage, provider: "gemini" });

  } catch (error) {
    console.error("AI Server Error:", error);
    return NextResponse.json({ error: "সার্ভার ত্রুটি: পুনরায় চেষ্টা করুন।", message: "দুঃখিত, সিস্টেমে সাময়িক সমস্যা।" }, { status: 500 });
  }
}