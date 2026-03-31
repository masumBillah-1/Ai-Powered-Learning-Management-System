// src/app/api/help/features/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import FeatureRequest from "@/models/FeatureRequest";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

// ─── PATCH: vote / comment / status ──────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const { action } = body;

    // ── Vote toggle ──────────────────────────────────────────────────────────
    if (action === "vote") {
      const { userId } = body;
      if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

      const feature = await FeatureRequest.findById(id);
      if (!feature) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const alreadyVoted = feature.votes.includes(userId);
      if (alreadyVoted) {
        feature.votes = feature.votes.filter((id: string) => id !== userId);
      } else {
        feature.votes.push(userId);
      }
      await feature.save();

      return NextResponse.json({
        votes:    feature.votes.length,
        votedBy:  feature.votes,
        voted:    !alreadyVoted,
      });
    }

    // ── Add comment ──────────────────────────────────────────────────────────
    if (action === "comment") {
      const { userId, userName, userImage, content } = body;
      if (!content?.trim()) {
        return NextResponse.json({ error: "Content required" }, { status: 400 });
      }

      const feature = await FeatureRequest.findByIdAndUpdate(
        id,
        {
          $push: {
            comments: {
              userId,
              userName,
              userImage: userImage || "",
              content:   content.trim(),
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );

      return NextResponse.json({ comments: feature?.comments });
    }

    // ── Status update (admin) ─────────────────────────────────────────────────
    if (action === "status") {
      const { status } = body;
      const allowed = ["Acknowledged", "Planned", "In Progress", "Resolved"];
      if (!allowed.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const feature = await FeatureRequest.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );
      return NextResponse.json({ status: feature?.status });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[FEATURES_PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;

    const { userId } = await req.json();
    const feature = await FeatureRequest.findById(id);
    if (!feature) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (feature.user.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await FeatureRequest.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}