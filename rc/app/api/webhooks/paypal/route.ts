import { NextResponse } from "next/server";
import { verifyPayPalWebhook } from "@/lib/paypal";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID!;
  const isValid = await verifyPayPalWebhook(req, webhookId);

  if (!isValid) {
    return new NextResponse("Invalid security payload signature context.", { status: 400 });
  }

  const event = await req.json();
  const supabaseAdmin = getSupabaseAdmin();

  switch (event.event_type) {
    case "BILLING.SUBSCRIPTION.CREATED": {
      const resource = event.resource;
      const customId = resource.custom_id; // Contains local Profile UUID mapping

      await supabaseAdmin.from("subscriptions").insert({
        user_id: customId,
        paypal_subscription_id: resource.id,
        status: "trialing",
        plan_id: resource.plan_id,
        current_period_start: new Date(resource.create_time).toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      break;
    }

    case "BILLING.SUBSCRIPTION.ACTIVATED": {
      const resource = event.resource;
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("paypal_subscription_id", resource.id);
      break;
    }

    case "BILLING.SUBSCRIPTION.CANCELLED": {
      const resource = event.resource;
      await supabaseAdmin
        .from("subscriptions")
        .update({
          status: "cancelled",
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq("paypal_subscription_id", resource.id);
      break;
    }
  }

  return NextResponse.json({ processed: true }, { status: 200 });
}
