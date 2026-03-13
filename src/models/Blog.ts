import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    coverImage: string;
    published: boolean;
    status: "pending" | "approved" | "rejected";
    author: string;
    authorId: string;
    authorRole: string;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },
        excerpt: { type: String, default: "" },
        content: { type: String, required: true },
        category: { type: String, default: "General" },
        tags: [{ type: String }],
        coverImage: { type: String, default: "" },
        published: { type: Boolean, default: false },
        // ✅ status — পুরনো document এ না থাকলে route এ normalize হবে
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        author: { type: String, required: true },
        authorId: { type: String, required: true },
        authorRole: { type: String, default: "student" },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// ✅ পুরনো blogs migrate করার জন্য — একবার চালালেই হবে
// db.blogs.updateMany({ status: { $exists: false }, published: true }, { $set: { status: "approved" } })
// db.blogs.updateMany({ status: { $exists: false }, published: false }, { $set: { status: "pending" } })

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);