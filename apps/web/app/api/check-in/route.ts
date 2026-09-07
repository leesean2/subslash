import { NextRequest, NextResponse } from "next/server";
import { CheckInRequest, CheckInResponse } from "@subslash/shared";
import { calculateCostPerUse, getRiskLevel, formatShockMessage } from "@subslash/shared";

export async function POST(request: NextRequest) {
  try {
    const body: CheckInRequest = await request.json();
    const { usageCount } = body;

    // Mock lookup subscription
    const mockSubscription = {
      amount: 10000,
      currency: "KRW" as const,
    };

    const costPerUse = calculateCostPerUse(mockSubscription.amount, usageCount);
    const riskLevel = getRiskLevel(costPerUse, mockSubscription.amount, usageCount);
    const shockMessage = formatShockMessage(
      "MockService",
      mockSubscription.amount,
      usageCount,
      mockSubscription.currency,
    );

    const response: CheckInResponse = {
      costPerUse,
      riskLevel,
      shockMessage,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[api/check-in]", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
