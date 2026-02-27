require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log("🔄 Testing MongoDB connection...");
    
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI not found in .env.local");
    }
    
    console.log("📍 Connecting to:", MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000,
    });
    
    console.log("✅ MongoDB connected successfully!");
    console.log("📦 Database:", mongoose.connection.db.databaseName);
    console.log("🌐 Host:", mongoose.connection.host);
    
    // Test basic operations
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: true, timestamp: new Date() });
    console.log("✅ Write test successful");
    
    const count = await testCollection.countDocuments();
    console.log("✅ Read test successful, documents:", count);
    
    await mongoose.connection.close();
    console.log("✅ Connection test completed successfully");
    
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("Error:", error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error("\n🔧 সমাধান:");
      console.error("1. MongoDB Atlas এ গিয়ে Network Access চেক করুন");
      console.error("2. আপনার IP address (0.0.0.0/0) whitelist করুন");
      console.error("3. Cluster running আছে কিনা চেক করুন");
      console.error("4. Username/Password সঠিক আছে কিনা চেক করুন");
    }
    
    if (error.message.includes('querySrv')) {
      console.error("\n🔧 সমাধান:");
      console.error("1. Cluster URL সঠিক আছে কিনা চেক করুন");
      console.error("2. Internet connection চেক করুন");
      console.error("3. DNS settings চেক করুন");
    }
    
    console.error("\n💡 Alternative solutions:");
    console.error("1. Try using a different network (mobile hotspot)");
    console.error("2. Use local MongoDB: mongodb://localhost:27017/learning-management");
    console.error("3. Create a new MongoDB Atlas cluster");
  }
}

testConnection();