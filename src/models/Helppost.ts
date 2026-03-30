import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment {
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  createdAt: Date;
}

export interface IHelpPost extends Document {
  title: string;
  content: string;
  postType: "Courses Topics" | "Bugs" | "Feature Requests" | "Announcements" | "Others";
  batch: string;
  mediaUrls: string[];
  status: "Open" | "Resolved" | "Reopened" | "Pending";
  author: {
    userId: string;
    name: string;
    email: string;
    image: string;
  };
  votes: string[];        // array of userIds who voted
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId:    { type: String, required: true },
  userName:  { type: String, required: true },
  userImage: { type: String, default: "" },
  content:   { type: String, required: true },
  createdAt: { type: Date,   default: Date.now },
});

const HelpPostSchema = new Schema<IHelpPost>(
  {
    title:    { type: String, required: true, trim: true },
    content:  { type: String, required: true },
    postType: {
      type: String,
      enum: ["Courses Topics", "Bugs", "Feature Requests", "Announcements", "Others"],
      default: "Others",
    },
    batch:     { type: String, default: "" },
    mediaUrls: [{ type: String }],
    status: {
      type: String,
      enum: ["Open", "Resolved", "Reopened", "Pending"],
      default: "Open",
    },
    author: {
      userId: { type: String, required: true },
      name:   { type: String, required: true },
      email:  { type: String, required: true },
      image:  { type: String, default: "" },
    },
    votes:    [{ type: String }],   // userIds
    comments: [CommentSchema],
  },
  { timestamps: true }
);

// Text index for search
HelpPostSchema.index({ title: "text", content: "text" });

const HelpPost: Model<IHelpPost> =
  mongoose.models.HelpPost || mongoose.model<IHelpPost>("HelpPost", HelpPostSchema);

export default HelpPost;