import mongoose, { Schema, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface INotificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: "course_update" | "payment" | "certificate" | "announcement" | "message" | "enrollment" | "system";
  title: string;
  message: string;
  courseId?: mongoose.Types.ObjectId;
  transactionId?: mongoose.Types.ObjectId;
  messageId?: mongoose.Types.ObjectId;
  actionUrl?: string;
  isRead: boolean;
  readAt?: Date;
  priority: "low" | "medium" | "high" | "urgent";
  icon?: string;
  color?: string;
  expiresAt?: Date;
  
  // ✅ Broadcast/Announcement fields
  isBroadcast: boolean;
  targetRole?: "all" | "student" | "instructor" | "admin";
  targetCourseId?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const NotificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["course_update", "payment", "certificate", "announcement", "message", "enrollment", "system"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
    },
    
    // ✅ Broadcast/Announcement fields
    isBroadcast: {
      type: Boolean,
      default: false,
    },
    targetRole: {
      type: String,
      enum: ["all", "student", "instructor", "admin"],
    },
    targetCourseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ expiresAt: 1 });
NotificationSchema.index({ createdAt: -1 });
// ✅ New indexes for broadcast notifications
NotificationSchema.index({ isBroadcast: 1, targetRole: 1 });
NotificationSchema.index({ targetCourseId: 1 });
NotificationSchema.index({ createdBy: 1 });

// ─── Instance Methods ─────────────────────────────────────────────────────────
NotificationSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

NotificationSchema.methods.isExpired = function () {
  return this.expiresAt && this.expiresAt < new Date();
};

// ─── Static Methods ───────────────────────────────────────────────────────────
NotificationSchema.statics.createNotification = function (data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  courseId?: string;
  transactionId?: string;
  actionUrl?: string;
  priority?: string;
  expiresAt?: Date;
}) {
  return this.create({
    userId: new mongoose.Types.ObjectId(data.userId),
    type: data.type,
    title: data.title,
    message: data.message,
    courseId: data.courseId ? new mongoose.Types.ObjectId(data.courseId) : undefined,
    transactionId: data.transactionId ? new mongoose.Types.ObjectId(data.transactionId) : undefined,
    actionUrl: data.actionUrl,
    priority: data.priority || "medium",
    expiresAt: data.expiresAt,
  });
};

NotificationSchema.statics.getUserNotifications = function (
  userId: string,
  limit: number = 20,
  unreadOnly: boolean = false
) {
  const query: any = {
    userId: new mongoose.Types.ObjectId(userId),
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  };
  if (unreadOnly) query.isRead = false;
  return this.find(query)
    .populate("courseId", "title")
    .populate("transactionId", "amount type")
    .sort({ createdAt: -1 })
    .limit(limit);
};

NotificationSchema.statics.getUnreadCount = function (userId: string) {
  return this.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    isRead: false,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  });
};

NotificationSchema.statics.markAllAsRead = function (userId: string) {
  return this.updateMany(
    { userId: new mongoose.Types.ObjectId(userId), isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );
};

NotificationSchema.statics.cleanupExpired = function () {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// ─── Pre-save Middleware ──────────────────────────────────────────────────────
// ✅ next() নেই, parameter নেই — Mongoose 6+ এ এটাই সঠিক
NotificationSchema.pre("save", function () {
  if (!this.color) {
    const colorMap: Record<string, string> = {
      course_update: "#832388",
      payment:       "#00C48C",
      certificate:   "#F89B29",
      announcement:  "#FF0F7B",
      message:       "#6366F1",
      enrollment:    "#0EA5E9",
      system:        "#6B7280",
    };
    this.color = colorMap[this.type] || "#6B7280";
  }
  if (!this.icon) {
    const iconMap: Record<string, string> = {
      course_update: "📚",
      payment:       "💳",
      certificate:   "🏆",
      announcement:  "📢",
      message:       "💬",
      enrollment:    "✅",
      system:        "🔔",
    };
    this.icon = iconMap[this.type] || "🔔";
  }
  // ✅ next() নেই
});

// ─── Export ───────────────────────────────────────────────────────────────────
// ✅ পুরনো cached model delete করে নতুন করে তৈরি করা হচ্ছে
if (mongoose.models.Notification) {
  delete (mongoose.models as any).Notification;
}

const Notification = mongoose.model<INotificationDocument>("Notification", NotificationSchema);

export default Notification;