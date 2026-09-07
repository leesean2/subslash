import { NextRequest, NextResponse } from "next/server";
import { DashboardStats } from "@subslash/shared";

export async function GET(_request: NextRequest) {
  try {
    // Mock implementation for Dashboard stats
    const stats: DashboardStats = {
      totalMonthlySpend: 0,
      activeCount: 0,
      killedCount: 0,
      totalSaved: 0,
      atRiskCount: 0,
    };
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[api/dashboard]", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
