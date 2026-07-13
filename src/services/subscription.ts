import { supabaseClient } from "@/lib/supabase";
import { Database } from "@/types/database.types";

export type SubscriptionWithProfile = Database["public"]["Tables"]["subscriptions"]["Row"];

export async function getUserSubscriptionDetails(userId: string): Promise<SubscriptionWithProfile | null> {
  const { data, error } = await supabaseClient
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Architectural data query disruption:", error);
    return null;
  }

  return data;
}

export async function cancelPayPalSubscriptionInstance(subscriptionId: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/subscriptions/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed execution on billing gateway API.");
    }

    return { success: true, message: "Subscription termination request dispatched successfully." };
  } catch (error: any) {
    return { success: false, message: error.message || "Unknown error occurred." };
  }
}
