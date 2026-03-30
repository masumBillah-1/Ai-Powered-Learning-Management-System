// src/app/api/help/roadmap/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import RoadmapTicket from "@/models/RoadmapTicket";
import mongoose from "mongoose";

type Params = { params: { id: string } };

// ─── PATCH: column পরিবর্তন (admin drag-drop বা status update) ───────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const allowed = ["investigating", "inProgress", "resolved"];

    if (body.column && !allowed.includes(body.column)) {
      return NextResponse.json({ error: "Invalid column" }, { status: 400 });
    }

    const ticket = await RoadmapTicket.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    );

    if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(ticket);
  } catch (err) {
    console.error("[ROADMAP_PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const { userId } = await req.json();
    const ticket = await RoadmapTicket.findById(params.id);
    if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (ticket.user.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await RoadmapTicket.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}