import { NextRequest, NextResponse } from "next/server";
import { generateVideoContext } from "@/lib/youtubeTranscript";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
// ── System Prompt 

const QUIZ_SYSTEM_PROMPT = `You are an AI Assessment Engine for CareerCanvas.
TASK: Analyze video transcript and generate a 10-question MCQ quiz.

STRICT OPERATIONAL RULES:
1. LANGUAGE: 100% English. Translate any non-English concepts from the transcript into English questions.
2. OUTPUT: Return ONLY a raw JSON array. No markdown, no \`\`\`json blocks, no conversational text.
3. SPEED: Do not reason or explain. Generate the JSON immediately.
4. CONTENT: 10 unique MCQs, 4 options each, exactly 1 correctAnswer index (0-3), and 1 concise English explanation.

JSON SCHEMA:
[
  {
    "question": "Question text in English?",
    "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
    "correctAnswer": 0,
    "explanation": "Brief English explanation."
  }
]`;

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, videoTitle } = await req.json();

    if (!videoUrl || !videoTitle) {
      return NextResponse.json(
        { error: "videoUrl and videoTitle are required" },
        { status: 400 }
      );
    }

    // Generate enriched video context using the transcript helper
    const videoContext = await generateVideoContext(videoUrl, videoTitle);

    // Ultra-Strong prompt for English enforcement and JSON speed
    const prompt = `VIDEO TITLE: ${videoTitle}
VIDEO CONTEXT: ${videoContext}

INSTRUCTION: Generate 10 high-level MCQs based ONLY on this context. 
STRICT: USE ENGLISH ONLY. OUTPUT RAW JSON ARRAY ONLY.`;

    const contents = [
      {
        role: "user",
        parts: [{ text: QUIZ_SYSTEM_PROMPT + "\n\n" + prompt }],
      }
    ];

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          maxOutputTokens: 3000,
          temperature: 0.1, // Lower temperature = Faster & more accurate JSON
          topP: 0.8,
          response_mime_type: "application/json", // Hard-coded JSON mode
        },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      console.error("Gemini API Error:", err);
      return NextResponse.json(
        { error: "AI service is currently unavailable." },
        { status: 500 }
      );
    }

    const geminiData = await geminiRes.json();
    let textResult = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean up the response just in case API doesn't strip everything
    const firstBracket = textResult.indexOf('[');
    const lastBracket = textResult.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      textResult = textResult.substring(firstBracket, lastBracket + 1);
    } else {
      textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    try {
      const quiz = JSON.parse(textResult);
      return NextResponse.json({ success: true, quiz });
    } catch (parseError) {
      console.error("JSON Parsing failed. Raw text:", textResult);
      return NextResponse.json(
        { error: "Failed to parse quiz data. Please try again." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Quiz Production Error:", error);
    return NextResponse.json(
      { error: "Server error during quiz generation." },
      { status: 500 }
    );
  }
}