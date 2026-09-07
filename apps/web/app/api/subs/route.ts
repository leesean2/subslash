import { NextRequest, NextResponse } from "next/server";
import { Subscription, SubscriptionFormData } from "@subslash/shared";

// For MVP, these will act as stubs that might interact with a DB eventually.
// Currently mock implementation for fallback.

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const _status = searchParams.get("status");
    void _status;
    // In MVP, localStorage is primary, but this is the DB fallback endpoint
    return NextResponse.json({ subscriptions: [] });
  } catch (error) {
    console.error("[api/subs]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionFormData = await request.json();
    const newSubscription: Subscription = {
      ...body,
      id: crypto.randomUUID(),
      status: "active",
      createdAt: new Date().toISOString(),
      amount: body.amount,
      currency: body.currency,
      billingCycle: body.billingCycle,
      billingDay: body.billingDay,
    };
    return NextResponse.json({ subscription: newSubscription });
  } catch (error) {
    console.error("[api/subs]", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<SubscriptionFormData> & { id: string } = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    // Mock return
    return NextResponse.json({ subscription: { ...body } });
  } catch (error) {
    console.error("[api/subs]", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/subs]", error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
