import { NextRequest, NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();
    if (!subscriptionId) {
      return NextResponse.json({ error: "Missing Target PayPal Id Parameter" }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    
    // Call the external PayPal Subscriptions engine API directly
    const paypalResponse = await fetch(
      `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "User requested termination via self-service UI panel." }),
      }
    );

    if (!paypalResponse.ok && paypalResponse.status !== 204) {
      const errorContext = await paypalResponse.text();
      throw new Error(`PayPal Gateway rejected cancellation payload: ${errorContext}`);
    }

    // Reflect cancellation down instantly into the database tier
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq("paypal_subscription_id", subscriptionId);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
