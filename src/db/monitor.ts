import mongoose from "mongoose";

/**
 * MongoDB Connection Health Monitor
 * Use this to check connection status and pool usage
 */
export function getConnectionStatus() {
  const state = mongoose.connection.readyState;
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  // Mongoose connection object থেকে সরাসরি client এর pool তথ্য নেওয়া
  // @ts-ignore
  const client = mongoose.connection.client;
  
  // ডাইনামিকভাবে কানেকশন সংখ্যা বের করা
  const poolSize = client?.topology?.s?.options?.maxPoolSize || 50; 
  
  // বর্তমানে ব্যবহৃত কানেকশন সংখ্যা বের করার নির্ভরযোগ্য উপায়
  // @ts-ignore
  const activeConnections = mongoose.connection?.base?.connections?.length || 0;

  return {
    status: states[state as keyof typeof states] || "unknown",
    readyState: state,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
    poolSize: poolSize,
    // poolSize থেকে active বিয়োগ করলে available পাওয়া যাবে
    availableConnections: Math.max(0, poolSize - activeConnections),
  };
}