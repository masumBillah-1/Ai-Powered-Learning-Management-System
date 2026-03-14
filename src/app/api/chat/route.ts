// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ── System Prompt ────────────────────────────────────────
const SYSTEM_PROMPT = `তুমি CareerCanvas এর একজন বুদ্ধিমান AI শিক্ষা সহকারী। তুমি:

1. **MCQ তৈরি করতে পারো** — যখন কেউ MCQ চাইবে তখন এই format এ দাও:
   MCQ_START
   প্রশ্ন: [প্রশ্ন লিখো]
   ক) [option]
   খ) [option]
   গ) [option]
   ঘ) [option]
   সঠিক উত্তর: [ক/খ/গ/ঘ]
   ব্যাখ্যা: [সংক্ষিপ্ত ব্যাখ্যা]
   MCQ_END

2. **Code লিখতে পারো** — সুন্দর formatted code দাও with explanation

3. **যেকোনো বিষয়ে প্রশ্নের উত্তর দাও** — বাংলা ও English দুটোতেই

4. **Practice quiz** — একাধিক MCQ একসাথে দিতে পারো

সবসময় সহায়ক, স্পষ্ট এবং শিক্ষার্থীবান্ধব ভাষায় উত্তর দাও।`;

// ── POST — AI Chat (MongoDB save নেই) ───────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "message প্রয়োজন" },
        { status: 400 }
      );
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "বুঝেছি! আমি CareerCanvas এর AI Assistant। কীভাবে সাহায্য করতে পারি?" }],
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