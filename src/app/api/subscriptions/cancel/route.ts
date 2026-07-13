import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return NextResponse.json({ message: "Missing resource identifier metadata." }, { status: 400 });
    }

    // 1. Verify User Authentication Context
    const supabaseAdmin = getSupabaseAdmin();
    const token = req.headers.get("Authorization")?.split(" ")[1];
    
    // Fallback or explicit check via your session handler. For production API endpoint security:
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token || "");
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized architectural access block." }, { status: 401 });
    }

    // 2. Fetch Authorization Access Token for PayPal Gateway API
    const accessToken = await getPayPalAccessToken();

    // 3. Dispatch Cancellation Request directly to PayPal Server Engines
    const paypalResponse = await fetch(
      `${
