"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseClient } from "@/lib/supabase";

export interface SubscriptionDetails {
  id: string;
  paypal_subscription_id: string | null;
  status: 'active' | 'trialing' | 'cancelled' | 'past_due' | 'unpaid';
  plan_id: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function useBilling() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingAction, setProcessingAction] = useState<boolean>(false);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) return;

      const { data, error } = await supabaseClient
        .from("subscriptions")
        .select("id, paypal_subscription_id, status, plan_id, current_period_end, cancel_at_period_end")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data as SubscriptionDetails);
    } catch (err) {
      console.error("Error synchronization data pipelines:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const cancelSubscription = async () => {
    if (!subscription?.paypal_subscription_id) return;
    setProcessingAction(true);
    try {
      const response = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subscription.paypal_subscription_id }),
      });

      if (!response.ok) throw new Error("Cancellation gateway rejected operation.");
      await fetchSubscription();
    } catch (err) {
      console.error("Cancellation operation failure:", err);
      throw err;
    } finally {
      setProcessingAction(false);
    }
  };

  return { subscription, loading, processingAction, cancelSubscription, refresh: fetchSubscription };
}
