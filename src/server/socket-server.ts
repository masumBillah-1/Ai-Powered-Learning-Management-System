import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dns from "dns";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

// ✅ Force IPv4 — connect.ts এর মতোই
dns.setDefaultResultOrder("ipv4first");

const PORT = process.env.SOCKET_PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI as string;
const CLIENT_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI missing in .env.local");
}

// ── MongoDB connect (connect.ts এর মতো same logic) ──────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4, // ✅ Force IPv4
  });

  isConnected = true;
  console.log("✅ MongoDB connected (Socket Server)");
}

// ── Live Message Schema ──────────────────────────────────
const MessageSchema = new mongoose.Schema(
  {
    roomId: String,
    senderId: String,
    senderName: String,
    senderRole: String,
    content: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const LiveMessage =
  mongoose.models.LiveMessage ||
  mongoose.model("LiveMessage", MessageSchema);

// ── Online users track ───────────────────────────────────
const onlineUsers = new Map<
  string,
  { socketId: string; role: string; name: string }
>();

// ── Main ─────────────────────────────────────────────────
async function main() {
  await connectDB();

  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    // ── User join ──────────────────────────────────────
    socket.on("user:join", ({ userId, userName, userRole }) => {
      onlineUsers.set(userId, {
        socketId: socket.id,
        role: userRole,
        name: userName,
      });

      io.emit(
        "users:online",
        Array.from(onlineUsers.entries()).map(([id, data]) => ({
          userId: id,
          ...data,
        }))
      );

      console.log(`👤 ${userName} (${userRole}) joined`);
    });

    // ── Room join ──────────────────────────────────────
    socket.on("room:join", async ({ roomId, userId }) => {
      socket.join(roomId);

      // পুরনো messages load
      const history = await LiveMessage.find({ roomId })
        .sort({ createdAt: 1 })
        .limit(50)
        .lean();

      socket.emit("room:history", history);

      // Unread mark as read
      await LiveMessage.updateMany(
        { roomId, senderId: { $ne: userId }, read: false },
        { read: true }
      );
    });

    // ── Message send ───────────────────────────────────
    socket.on("message:send", async (data) => {
      const { roomId, senderId, senderName, senderRole, content } = data;

      const msg = await LiveMessage.create({
        roomId,
        senderId,
        senderName,
        senderRole,
        content,
      });

      io.to(roomId).emit("message:receive", {
        _id: msg._id,
        senderId,
        senderName,
        senderRole,
        content,
        createdAt: msg.createdAt,
        read: false,
      });
    });

    // ── Typing indicator ───────────────────────────────
    socket.on("typing:start", ({ roomId, userName }) => {
      socket.to(roomId).emit("typing:show", { userName });
    });

    socket.on("typing:stop", ({ roomId }) => {
      socket.to(roomId).emit("typing:hide");
    });

    // ── Disconnect ─────────────────────────────────────
    socket.on("disconnect", () => {
      for (const [userId, data] of onlineUsers.entries()) {
        if (data.socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit(
        "users:online",
        Array.from(onlineUsers.entries()).map(([id, data]) => ({
          userId: id,
          ...data,
        }))
      );

      console.log("❌ Disconnected:", socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.io server running on port ${PORT}`);
  });
}

main().catch(console.error);