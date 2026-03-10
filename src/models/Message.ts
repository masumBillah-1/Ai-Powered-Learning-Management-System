import mongoose, { Schema, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface IMessageDocument extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  conversationId?: mongoose.Types.ObjectId;
  
  content: string;
  messageType: "text" | "image" | "file" | "system";
  
  // File/Image specific fields
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  
  // Message status
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  
  // System message fields
  systemMessageType?: "enrollment" | "course_update" | "payment" | "certificate";
  
  createdAt: Date;
  updatedAt: Date;
}

// ─── Main Schema ──────────────────────────────────────────────────────────────
const MessageSchema = new Schema<IMessageDocument>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
    
    // File/Image fields
    fileUrl: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
      min: 0,
    },
    
    // Status fields
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    
    // System message fields
    systemMessageType: {
      type: String,
      enum: ["enrollment", "course_update", "payment", "certificate"],
    },
  },
  {
    timestamps: true,
    collection: "messages",
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });
MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ isDeleted: 1 });

// ─── Methods ──────────────────────────────────────────────────────────────────
MessageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

MessageSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

// ─── Static methods ───────────────────────────────────────────────────────────
MessageSchema.statics.getConversation = function(userId1: string, userId2: string, limit: number = 50) {
  return this.find({
    $or: [
      { senderId: userId1, receiverId: userId2 },
      { senderId: userId2, receiverId: userId1 }
    ],
    isDeleted: false
  })
    .populate("senderId", "name photoURL")
    .populate("receiverId", "name photoURL")
    .sort({ createdAt: -1 })
    .limit(limit);
};

MessageSchema.statics.markConversationAsRead = function(userId: string, otherUserId: string) {
  return this.updateMany(
    {
      senderId: otherUserId,
      receiverId: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date()
      }
    }
  );
};

MessageSchema.statics.getUnreadCount = function(userId: string) {
  return this.countDocuments({
    receiverId: userId,
    isRead: false,
    isDeleted: false
  });
};

// ✅ Better model export pattern
const Message = mongoose.models.Message || mongoose.model<IMessageDocument>("Message", MessageSchema);
export default Message;