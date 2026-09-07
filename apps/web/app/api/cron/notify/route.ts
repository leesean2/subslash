import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Query subscriptions with billing day = today + 3 or today + 1
  // Mock logic
  console.warn("[cron/notify] sending daily notifications...");

  // Placeholder for Resend email integration

  return NextResponse.json({
    success: true,
    notified: 0,
    timestamp: new Date().toISOString(),
  });
}
