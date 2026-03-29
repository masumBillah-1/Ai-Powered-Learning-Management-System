import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ── System Prompt 


const SYSTEM_PROMPT = `You are an AI Learning Assistant for CareerCanvas.
TASK: Analyze a student's quiz mistakes and identify their weakness.

STRICT OPERATIONAL RULES:
1. LANGUAGE: English only.
2. OUTPUT: Return ONLY a raw JSON object. No markdown, no conversational text.
3. JSON SCHEMA:
{
  "weakTopic": "The specific concept they are struggling with (max 3-4 words)",
  "suggestion": "A clear, actionable suggestion on what they should review (1-2 sentences)",
  "encouragement": "A short, positive encouraging remark (1 sentence)",
  "suggestedTimestamp": 180
} 

CRITICAL: 
1. Always guess a logical timestamp (in seconds) where this topic is likely discussed in a tutorial. 
2. Never return 0 or null unless absolutely impossible.
3. If the video is 10 minutes, and the topic is advanced, return something like 300-400.`;

export async function POST(req: NextRequest) {
  try {
    const { mistakes, videoTitle } = await req.json();

    if (!mistakes || !videoTitle || !Array.isArray(mistakes) || mistakes.length === 0) {
      return NextResponse.json(
        { error: "Mistakes array and videoTitle are required" },
        { status: 400 }
      );
    }

    const mistakesText = mistakes.map((m: any, idx: number) => 
      `Q${idx + 1}: ${m.question}\nCorrect Answer was: ${m.options[m.correctAnswer]}\nExplanation: ${m.explanation}`
    ).join("\n\n");

    const prompt = `VIDEO TITLE: ${videoTitle}
STUDENT MISTAKES: 
${mistakesText}

INSTRUCTION: Analyze these mistakes. What concept are they weak in? Generate the JSON object strictly matching the schema.`;

    const contents = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT + "\n\n" + prompt }],
      }
    ];

    const geminiRes = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.2, 
            topP: 0.8,
            response_mime_type: "application/json", 
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
      
      try {
        const analysis = JSON.parse(textResult);
        return NextResponse.json({ success: true, analysis });
      } catch (parseError) {
        console.error("JSON Parsing failed. Raw text:", textResult);
        return NextResponse.json(
          { error: "Failed to parse analysis data." },
          { status: 500 }
        );
      }

  } catch (error) {
    console.error("Analyze Mistakes Error:", error);
    return NextResponse.json(
      { error: "Server error during analysis generation." },
      { status: 500 }
    );
  }
}
