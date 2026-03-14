import mongoose from "mongoose";
import dns from "dns";

// ✅ Force IPv4 — secureConnect timeout fix
dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("MONGODB_URI missing in .env.local");

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}
declare global { var mongooseCache: MongooseCache; }

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  // ✅ Connection alive হলে সরাসরি return
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // ✅ Dead connection হলে reset
  if (mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000, // 30s থেকে 10s — faster fail
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4,                        // ✅ Force IPv4
        maxPoolSize: 10,
        retryWrites: true,
        dbName: "learning-management",
      })
      .then((conn) => {
        console.log("✅ MongoDB connected:", conn.connection.db?.databaseName);
        return conn;
      })
      .catch((error) => {
        console.error("❌ MongoDB failed:", error.message);
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}