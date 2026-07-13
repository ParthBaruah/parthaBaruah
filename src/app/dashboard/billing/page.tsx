"use client";

import React, { useState } from "react";
import { useBilling } from "@/hooks/use-billing";
import { PRICING_PLANS } from "@/config/plans";
import { CreditCard, ShieldAlert, Sparkles, Loader2, Calendar, CheckCircle } from "lucide-react";

export default function BillingManagementView() {
  const { subscription, loading, processingAction, cancelSubscription } = useBilling();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activePlanDetails = PRICING_PLANS.find(
    (p) => p.paypalPlanId === subscription?.plan_id
  );

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your premium data subscription? All access tracking will discontinue at the end of your billing loop.")) return;
    try {
      await cancelSubscription();
      setMessage({ type: "success", text: "Subscription cancelled successfully. Grace period protection activated." });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to process cancellation with the payment gateway." });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-white">
      {/* Title Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl font-bold tracking-tight">Account & Subscriptions</h1>
        <p className="mt-1 text-sm text-neutral-400">Manage your workspace access configurations and billing histories.</p>
      </div>

      {message && (
        <div className={`mt-6 rounded-xl border p-4 text-sm ${message.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-400"}`}>
          {message.text}
        </div>
      )}

      {/* Subscription Status Matrix Card Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="mt-1 rounded-xl bg-purple-500/10 p-3 border border-purple-500/20 text-purple-400">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Current Account Plan</span>
                <h2 className="text-xl font-bold mt-0.5">{activePlanDetails?.name || "Free Tier Archetype"}</h2>
                <p className="text-sm text-neutral-400 mt-1 max-w-sm">{activePlanDetails?.description || "Basic read-only workspace limits applied across indexing scopes."}</p>
              </div>
            </div>

            {subscription?.status === "active" && !subscription.cancel_at_period_end && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400">
                <CheckCircle className="h-3 w-3" /> Auto-Renew Active
              </span>
            )}
            {subscription?.cancel_at_period_end && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-400">
                <ShieldAlert className="h-3 w-3" /> Grace Period Active
              </span>
            )}
          </div>

          {subscription && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-neutral-500" /> 
                Period Terminates: <b>{new Date(subscription.current_period_end).toLocaleDateString()}</b>
              </span>
              
              {subscription.status === "active" && !subscription.cancel_at_period_end && (
                <button
                  onClick={handleCancel}
                  disabled={processingAction}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-rose-500/30 hover:text-rose-400 disabled:opacity-50 transition-colors"
                >
                  {processingAction ? "Processing Request..." : "Cancel Subscription"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Informational Upsell Grid Cell block */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-purple-400 text-sm font-semibold">
              <Sparkles className="h-4 w-4" /> Professional Strategy
            </div>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Unlock cross-niche target mapping, automated outreach script exports, and instant alerts for newly funded sponsorship allocations.
            </p>
          </div>
          {!subscription || subscription.status === "cancelled" ? (
            <a
              href="/#pricing"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-neutral-950 transition-all hover:bg-neutral-200"
            >
              Upgrade Core Workspace
            </a>
          ) : (
            <div className="text-xs text-neutral-500 text-center font-medium mt-6">Maximum structural permissions fully active.</div>
          )}
        </div>
      </div>
    </div>
  );
}
