// src/app/api/help/releases/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import ReleaseNote from "@/models/ReleaseNote";

// ─── GET: সব published release notes ─────────────────────────────────────────
export async function GET() {
  try {
    await connectDB();

    const notes = await ReleaseNote.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(notes);
  } catch (err) {
    console.error("[RELEASES_GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST: নতুন release note (admin only) ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { date, title, version, tag, description } = body;

    if (!title?.trim() || !version?.trim()) {
      return NextResponse.json(
        { error: "Title and version are required" },
        { status: 400 }
      );
    }

    const note = await ReleaseNote.create({
      date:        date        || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      title:       title.trim(),
      version:     version.trim(),
      tag:         tag         || "",
      description: description || "",
      published:   true,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error("[RELEASES_POST]", err);
    return NextResponse.json({ error: "Failed to create release note" }, { status: 500 });
  }
}