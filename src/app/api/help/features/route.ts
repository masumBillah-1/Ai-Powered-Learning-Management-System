// src/app/api/help/features/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import FeatureRequest from "@/models/FeatureRequest";

// ─── GET: সব feature requests ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status   = searchParams.get("status")   || "";
    const platform = searchParams.get("platform") || "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status)   query.status   = status;
    if (platform) query.platform = platform;

    const features = await FeatureRequest.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(features);
  } catch (err) {
    console.error("[FEATURES_GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── POST: নতুন feature request ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, description, platform, user } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    if (!user?.userId) {
      return NextResponse.json({ error: "Login required" }, { status: 401 });
    }

    const feature = await FeatureRequest.create({
      user,
      title:       title.trim(),
      description: description?.trim() || "",
      platform:    platform || "Website",
      status:      "Acknowledged",
      votes:       [],
      comments:    [],
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (err) {
    console.error("[FEATURES_POST]", err);
    return NextResponse.json({ error: "Failed to create feature request" }, { status: 500 });
  }
}