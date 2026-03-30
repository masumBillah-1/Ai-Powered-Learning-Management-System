// app/api/help/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
;
import mongoose from "mongoose";
import HelpPost from "@/models/Helppost";

type Params = { params: { id: string } };

// ─── GET: single post ─────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const post = await HelpPost.findById(params.id).lean();
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── PATCH: vote / comment / status update ────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const body = await req.json();
    const { action } = body;

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // ── Vote toggle ──────────────────────────────────────────────────────────
    if (action === "vote") {
      const { userId } = body;
      if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

      const post = await HelpPost.findById(params.id);
      if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

      const alreadyVoted = post.votes.includes(userId);
      if (alreadyVoted) {
        post.votes = post.votes.filter((id: string) => id !== userId);
      } else {
        post.votes.push(userId);
      }
      await post.save();
      return NextResponse.json({ votes: post.votes.length, voted: !alreadyVoted });
    }

    // ── Add comment ──────────────────────────────────────────────────────────
    if (action === "comment") {
      const { userId, userName, userImage, content } = body;
      if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

      const post = await HelpPost.findByIdAndUpdate(
        params.id,
        {
          $push: {
            comments: { userId, userName, userImage: userImage || "", content: content.trim(), createdAt: new Date() },
          },
        },
        { new: true }
      );
      return NextResponse.json({ comments: post?.comments });
    }

    // ── Status update (admin only ideally) ───────────────────────────────────
    if (action === "status") {
      const { status } = body;
      const allowed = ["Open", "Resolved", "Reopened", "Pending"];
      if (!allowed.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      const post = await HelpPost.findByIdAndUpdate(params.id, { $set: { status } }, { new: true });
      return NextResponse.json({ status: post?.status });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[HELP_POST_PATCH]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE: post মুছে ফেলা ───────────────────────────────────────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { userId } = await req.json();

    const post = await HelpPost.findById(params.id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // শুধু author বা admin delete করতে পারবে (userId check)
    if (post.author.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await HelpPost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}