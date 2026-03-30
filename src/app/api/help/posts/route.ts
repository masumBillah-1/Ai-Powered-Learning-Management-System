// app/api/help/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import HelpPost from "@/models/Helppost";


// ─── GET: সব posts পাওয়া (filter, search, pagination সহ) ──────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const postType  = searchParams.get("postType") || "";
    const status    = searchParams.get("status")   || "";
    const search    = searchParams.get("search")   || "";
    const authorId  = searchParams.get("authorId") || "";   // "my posts" ফিল্টার
    const authorRole = searchParams.get("authorRole") || ""; // "admin posts" ফিল্টার
    const page      = parseInt(searchParams.get("page")  || "1");
    const limit     = parseInt(searchParams.get("limit") || "20");
    const skip      = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (postType) query.postType = postType;
    if (status)   query.status   = status;
    if (authorId) query["author.userId"] = authorId;
    if (authorRole) query["author.role"] = authorRole;
    if (search)   query.$text = { $search: search };

    const [posts, total] = await Promise.all([
      HelpPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      HelpPost.countDocuments(query),
    ]);

    // sidebar counts
    const typeCounts = await HelpPost.aggregate([
      { $group: { _id: "$postType", count: { $sum: 1 } } },
    ]);
    const statusCounts = await HelpPost.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      typeCounts,
      statusCounts,
    });
  } catch (err) {
    console.error("[HELP_POSTS_GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST: নতুন post তৈরি ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, content, postType, batch, mediaUrls, author } = body;

    // Validation
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (!author?.userId) {
      return NextResponse.json({ error: "Author info required" }, { status: 401 });
    }

    const post = await HelpPost.create({
      title:     title?.trim() || "",
      content:   content.trim(),
      postType:  postType || "Others",
      batch:     batch    || "",
      mediaUrls: mediaUrls || [],
      author,
      votes:    [],
      comments: [],
      status:   "Open",
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("[HELP_POSTS_POST]", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}