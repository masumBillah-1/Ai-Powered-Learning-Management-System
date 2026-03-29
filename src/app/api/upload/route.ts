import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

const JWT_SECRET = process.env.JWT_SECRET as string;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get file from form data
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type
    const isImage = file.type.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType as "image" | "raw",
          folder: "chat_files",
          allowed_formats: isImage 
            ? ["jpg", "jpeg", "png", "gif", "webp"]
            : ["pdf", "doc", "docx", "txt", "zip", "rar"],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    console.log("✅ File uploaded to Cloudinary:", uploadResult.secure_url);

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      type: isImage ? "image" : "file",
      publicId: uploadResult.public_id,
    });
  } catch (err: any) {
    console.error("❌ Upload error:", err.message);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
