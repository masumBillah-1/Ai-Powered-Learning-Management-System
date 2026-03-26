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

// ✅ Connection event listeners (শুধু একবার setup করো)
if (!global.mongooseCache.conn) {
  mongoose.connection.on("connected", () => {
    console.log("✅ Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ Mongoose disconnected from MongoDB");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("✅ Mongoose connection closed due to app termination");
    process.exit(0);
  });
}

export async function connectDB() {
  // ✅ Connection alive হলে সরাসরি return
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // ✅ Only reset if state is disconnected (0) or disconnecting (3)
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4,
        maxPoolSize: 50,              // ✅ 10 থেকে 50 — more connections
        minPoolSize: 5,               // ✅ Minimum pool size
        maxIdleTimeMS: 60000,         // ✅ Close idle connections after 60s
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