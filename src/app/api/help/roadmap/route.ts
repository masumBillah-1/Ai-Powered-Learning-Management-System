// src/app/api/help/roadmap/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import RoadmapTicket from "@/models/RoadmapTicket";

// ─── GET: সব tickets grouped by column ───────────────────────────────────────
export async function GET() {
  try {
    await connectDB();

    const tickets = await RoadmapTicket.find().sort({ createdAt: -1 }).lean();

    // column অনুযায়ী group করো
    const grouped = {
      investigating: tickets.filter((t) => t.column === "investigating"),
      inProgress:    tickets.filter((t) => t.column === "inProgress"),
      resolved:      tickets.filter((t) => t.column === "resolved"),
    };

    return NextResponse.json(grouped);
  } catch (err) {
    console.error("[ROADMAP_GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST: নতুন ticket তৈরি (student নিজের issue post করবে) ─────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, tags, category, column, user } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    if (!user?.userId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const ticket = await RoadmapTicket.create({
      user,
      title:    title.trim(),
      tags:     tags    || [],
      category: category || "",
      column:   column  || "investigating",
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (err) {
    console.error("[ROADMAP_POST]", err);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}