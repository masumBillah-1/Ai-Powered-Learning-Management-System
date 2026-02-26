const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://LMS:SCfCoThEgG3ISdEg@myserverdb.wwgfr6w.mongodb.net/?retryWrites=true&w=majority&appName=MyServerDB";

async function testConnection() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...");
    console.log("📍 URI:", MONGODB_URI.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connected successfully!");
    console.log("📦 Database:", mongoose.connection.db.databaseName);
    console.log("🌐 Host:", mongoose.connection.host);
    
    // Switch to learning-management database
    const db = mongoose.connection.useDb("learning-management");
    console.log("📂 Switched to database: learning-management");
    
    // List collections
    const collections = await db.db.listCollections().toArray();
    console.log("📋 Collections:", collections.map(c => c.name));
    
    // Count users
    if (collections.some(c => c.name === 'users')) {
      const usersCount = await db.db.collection('users').countDocuments();
      console.log("👥 Total users:", usersCount);
      
      // Show first user (without password)
      const firstUser = await db.db.collection('users').findOne({}, { projection: { password: 0 } });
      if (firstUser) {
        console.log("👤 Sample user:", JSON.stringify(firstUser, null, 2));
      }
    } else {
      console.log("⚠️ No users collection found yet");
    }
    
    await mongoose.connection.close();
    console.log("✅ Connection closed successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed!");
    console.error("Error:", error.message);
    if (error.code) console.error("Error code:", error.code);
  }
}

testConnection();
