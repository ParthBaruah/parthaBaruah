"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRICING_PLANS } from "@/config/plans";
import { 
  Check, 
  ArrowRight, 
  Zap, 
  Search, 
  ShieldCheck, 
  Database, 
  HelpCircle, 
  Plus, 
  Minus,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const displayedPlans = PRICING_PLANS.filter(
    (plan) => plan.interval === billingInterval || plan.price === 0
  );

  const faqs = [
    {
      q: "How does SponsorVault discover and compile data points?",
      a: "Our background architectures trace and clean validated public YouTube integration data blocks, matching public programmatic submission endpoints, performance data, and historic direct creator outreach frameworks into an optimized relational database layout."
    },
    {
      q: "Can I swap or cancel structural subscription tiers?",
      a: "Yes. All processing handles directly inside the user dashboard settings view layout. Subscriptions processed through PayPal configurations remain operational until your current structural billing period loops terminate safely."
    },
    {
      q: "How does the OpenAI outreach script engine parse data configurations?",
      a: "The generation layers feed target profile metrics directly alongside verified brand attributes to safely compute contextual script copy targeting localized decision makers directly."
    }
  ];

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-50 selection:bg-purple-500/30 overflow-x-hidden">
      {/* Decorative Top Radial Ambient Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-purple-600/10 to-blue-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Sticky Structural Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-neutral-950/70 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">SV</div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">SponsorVault</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-950 shadow transition-all hover:bg-neutral-200 active:scale-95">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Interactive Core Area */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-400 backdrop-blur-md mb-6">
          <Sparkles className="h-3.5 w-3.5" /> Now Live: Instant YouTube Creator Fit Scoring
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-tight">
          Stop Guessing. Find the Brands That Actually{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sponsor YouTube Channels
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          Unlock a searchable database of hundreds of verified companies buying integration real estate. Run deep queries across categories, viewer size preferences, and automate outreach layouts.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3.5 font-medium text-white shadow-xl shadow-purple-600/10 transition-all hover:opacity-90 active:scale-98">
            Start Discovering Free <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/companies" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-medium text-white transition-all hover:bg-white/10">
            Explore Sponsors Map
          </Link>
        </div>
      </section>

      {/* Features Multi-Attribute Matrix Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 border-t border-white/5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Built for Growth Operations</h2>
          <p className="mt-4 text-neutral-400">Everything required to map, filter, script, and close predictable production monetization lines.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-8 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6"><Search className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold text-white">Full-Text Index Querying</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">Instantly isolate platform entities via optimized localized index parameters mapping exact target industries instantly.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-8 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6"><Zap className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold text-white">AI Alignment Matching</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">Let our LLM logic pipelines calculate match profiles based on historic integration behavior data models.</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-8 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6"><ShieldCheck className="h-5 w-5" /></div>
            <h3 className="text-lg font-semibold text-white">Verified Acquisition Channels</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">Zero dead data strings. Skip generic contact fields using verified dedicated dashboard application links.</p>
          </div>
        </div>
      </section>

      {/* Subscription Pricing Controls Grid Layout */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 border-t border-white/5 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Transparent Subscription Architecture</h2>
          <p className="mt-4 text-neutral-400">Gain full access matrix query boundaries. Cancel any time directly without hidden penalties.</p>
          
          {/* Toggle Switch Button Controls */}
          <div className="mt-10 inline-flex items-center gap-1 rounded-xl bg-neutral-900 p-1 border border-white/5">
            <button onClick={() => setBillingInterval("month")} className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${billingInterval === "month" ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"}`}>Monthly Tiers</button>
            <button onClick={() => setBillingInterval("year")} className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${billingInterval === "year" ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"}`}>Yearly Plan (Save ~40%)</button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 max-w-5xl mx-auto items-stretch">
          {displayedPlans.map((plan) => (
            <div key={plan.id} className={`relative flex flex-col justify-between rounded-2xl border p-8 backdrop-blur-xl transition-all ${plan.popular ? "border-purple-500 bg-gradient-to-b from-purple-500/[0.08] to-transparent ring-1 ring-purple-500" : "border-white/5 bg-neutral-900/40"}`}>
              {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 text-xs font-medium text-white tracking-wide">Most Selected Plan</span>}
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-neutral-400 min-h-[40px]">{plan.description}</p>
                <div className="mt-6 flex items-baseline text-white">
                  <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-sm font-semibold text-neutral-400">/{plan.interval}</span>
                </div>
                <ul className="mt-8 space-y-4 border-t border-white/5 pt-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-3 text-sm ${feature.included ? "text-neutral-200" : "text-neutral-600"}`}>
                      <Check className={`h-4 w-4 shrink-0 mt-0.5 ${feature.included ? "text-purple-400" : "text-neutral-700"}`} />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href={`/register?plan=${plan.paypalPlanId}`} className={`mt-8 inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition-all active:scale-98 ${plan.popular ? "bg-white text-neutral-950 hover:bg-neutral-200" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}>Get Fast Pass Access</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion Interface Segment Component */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 border-t border-white/5 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl border border-white/5 bg-neutral-900/20 overflow-hidden transition-colors">
              <button onClick={() => setActiveFaq(activeFaq === index ? null : index)} className="flex w-full items-center justify-between p-6 text-left font-medium text-white focus:outline-none">
                <span>{faq.q}</span>
                {activeFaq === index ? <Minus className="h-4 w-4 text-purple-400" /> : <Plus className="h-4 w-4 text-neutral-400" />}
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-6 text-sm leading-relaxed text-neutral-400 border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Global Interactive Footer Area */}
      <footer className="border-t border-white/5 bg-neutral-950 py-12 text-xs text-neutral-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-6 sm:px-6 lg:px-8">
          <p>© 2026 SponsorVault Inc. Continuous architectural validation lifecycle active.</p>
          <div className="flex flex-wrap gap-6 font-medium">
            <Link href="/privacy" className="hover:text-neutral-300">Privacy Configuration</Link>
            <Link href="/terms" className="hover:text-neutral-300">Terms of Use</Link>
            <Link href="/contact" className="hover:text-neutral-300">Contact Route</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
