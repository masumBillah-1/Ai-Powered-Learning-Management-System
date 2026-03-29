import mongoose, { Schema, Document } from "mongoose";

export interface IConversationDocument extends Document {
  participants: mongoose.Types.ObjectId[];
  roomId: string; // support_{studentId}
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Map<string, number>; // userId -> count
  adminTakenOver?: boolean; // ✅ Admin manually handling this conversation
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversationDocument>(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    lastMessageAt: {
      type: Date,
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
    adminTakenOver: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "conversations",
  }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ roomId: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

const Conversation = mongoose.models.Conversation || mongoose.model<IConversationDocument>("Conversation", ConversationSchema);
export default Conversation;
