import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI missing in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      family: 4, // Force IPv4
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    console.log("🔄 Connecting to MongoDB...");
    console.log("🔗 URI:", MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((conn) => {
        console.log("✅ MongoDB connected successfully!");
        console.log("📊 Database:", conn.connection.db?.databaseName);
        return conn;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ Database connection error:", error);
    throw error;
  }
}