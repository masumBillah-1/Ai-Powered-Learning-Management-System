import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getConnectionStatus } from "@/db/monitor";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  try {
    // Check admin authorization
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const status = getConnectionStatus();
    
    return NextResponse.json({
      success: true,
      connection: status,
      health: {
        isHealthy: status.status === "connected",
        poolUsagePercent: status.poolSize > 0 
          ? Math.round(((status.poolSize - status.availableConnections) / status.poolSize) * 100)
          : 0,
        warning: status.poolSize > 0 && ((status.poolSize - status.availableConnections) / status.poolSize) > 0.8
          ? "Connection pool usage is high (>80%)"
          : null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
