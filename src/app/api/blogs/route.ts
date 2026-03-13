import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDB } from "@/db/connect";
import Blog from "@/models/Blog";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

function getUser(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.replace("Bearer ", "").trim();
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.userId || decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch { return null; }
}

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ✅ পুরনো blogs এ status নেই — সব blogs কে normalize করে দেয়
function normalizeBlog(blog: any) {
  if (!blog.status) {
    blog.status = blog.published ? "approved" : "pending";
  }
  return blog;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = getUser(req);
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const id = searchParams.get("id");
    const isEditMode = searchParams.get("edit") === "1";

    // ✅ Single blog fetch
    if (action === "single" && id) {
      if (!isValidId(id))
        return NextResponse.json({ success: false, message: "Invalid blog ID" }, { status: 400 });

      const blog = isEditMode
        ? await Blog.findById(id).lean()
        : await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).lean();

      if (!blog)
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

      return NextResponse.json({ success: true, blog: normalizeBlog(blog) });
    }

    // ✅ All blogs — role based filter
    let rawBlogs: any[] = [];

    if (!user) {
      // Guest — শুধু published blogs
      rawBlogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).lean();
    } else if (user.role === "admin") {
      // Admin — সব blogs, কোনো filter নেই
      rawBlogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    } else {
      // Normal user — শুধু নিজের blogs
      rawBlogs = await Blog.find({
        $or: [
          { authorId: user.id },
          { author: user.name },
        ],
      }).sort({ createdAt: -1 }).lean();
    }

    // ✅ পুরনো blogs এ status না থাকলে normalize করে দাও
    const blogs = rawBlogs.map(normalizeBlog);

    return NextResponse.json({ success: true, blogs });

  } catch (error: any) {
    console.error("GET /api/blogs:", error.message);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user)
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const id = searchParams.get("id");

    // ✅ DELETE
    if (action === "delete" && id) {
      if (!isValidId(id))
        return NextResponse.json({ success: false, message: "Invalid blog ID" }, { status: 400 });

      const blog = await Blog.findById(id);
      if (!blog)
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

      if (blog.authorId !== user.id && blog.author !== user.name && user.role !== "admin")
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

      await Blog.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Blog deleted" });
    }

    // ✅ APPROVE (admin only)
    if (action === "approve" && id) {
      if (user.role !== "admin")
        return NextResponse.json({ success: false, message: "Admin only" }, { status: 403 });
      if (!isValidId(id))
        return NextResponse.json({ success: false, message: "Invalid blog ID" }, { status: 400 });

      const blog = await Blog.findByIdAndUpdate(
        id,
        { status: "approved", published: true },
        { new: true }
      );
      if (!blog)
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

      return NextResponse.json({ success: true, blog, message: "Blog approved & published" });
    }

    // ✅ REJECT (admin only)
    if (action === "reject" && id) {
      if (user.role !== "admin")
        return NextResponse.json({ success: false, message: "Admin only" }, { status: 403 });
      if (!isValidId(id))
        return NextResponse.json({ success: false, message: "Invalid blog ID" }, { status: 400 });

      const blog = await Blog.findByIdAndUpdate(
        id,
        { status: "rejected", published: false },
        { new: true }
      );
      if (!blog)
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

      return NextResponse.json({ success: true, blog, message: "Blog rejected" });
    }

    // ✅ UPDATE
    if (action === "update" && id) {
      if (!isValidId(id))
        return NextResponse.json({ success: false, message: "Invalid blog ID" }, { status: 400 });

      const blog = await Blog.findById(id);
      if (!blog)
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

      if (blog.authorId !== user.id && blog.author !== user.name && user.role !== "admin")
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

      const body = await req.json();
      if (body.title) blog.title = body.title.trim();
      if (body.excerpt !== undefined) blog.excerpt = body.excerpt.trim();
      if (body.content) blog.content = body.content;
      if (body.category) blog.category = body.category;
      if (body.tags) blog.tags = body.tags;
      if (body.coverImage !== undefined) blog.coverImage = body.coverImage;

      if (user.role !== "admin") {
        blog.status = "pending";
        blog.published = false;
      } else {
        if (body.published !== undefined) blog.published = body.published;
        if (body.status !== undefined) blog.status = body.status;
      }

      await blog.save();
      return NextResponse.json({ success: true, blog, message: "Blog updated successfully" });
    }

    // ✅ CREATE
    const body = await req.json();
    if (!body.title?.trim() || !body.content?.trim())
      return NextResponse.json({ success: false, message: "Title and content required" }, { status: 400 });

    const slug = body.title.trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") + "-" + Date.now();

    const blog = new Blog({
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt?.trim() || "",
      content: body.content,
      category: body.category || "General",
      tags: body.tags || [],
      coverImage: body.coverImage || "",
      published: user.role === "admin" ? (body.published || false) : false,
      status: user.role === "admin" ? "approved" : "pending",
      author: body.author || user.name,
      authorId: user.id,
      authorRole: user.role,
    });
    await blog.save();

    const message = user.role === "admin"
      ? "Blog created successfully"
      : "Blog submitted! Admin approval এর জন্য অপেক্ষা করুন।";

    return NextResponse.json({ success: true, blog, message }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/blogs:", error.message);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}