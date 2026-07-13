export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  paypalPlanId: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  features: PlanFeature[];
  popular: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "tier_starter",
    paypalPlanId: "P-STARTER_PLAN_ID",
    name: "Starter",
    description: "Perfect for emerging creators launching their data metrics discovery journey.",
    price: 0,
    interval: "month",
    popular: false,
    features: [
      { text: "Query up to 15 companies / mo", included: true },
      { text: "Basic niche matching tools", included: true },
      { text: "Public outreach frameworks", included: true },
      { text: "Advanced filtering pipelines", included: false },
      { text: "Automated early access notifications", included: false },
      { text: "Priority developer customer support", included: false },
    ],
  },
  {
    id: "tier_premium_monthly",
    paypalPlanId: "P-PREMIUM_MONTHLY_ID",
    name: "Creator Pro",
    description: "Our core engine suite engineered to lock down ongoing brand agreements.",
    price: 29,
    interval: "month",
    popular: true,
    features: [
      { text: "Unlimited monthly database queries", included: true },
      { text: "Advanced multi-attribute search filters", included: true },
      { text: "AI Outreach Email Builder Engine", included: true },
      { text: "Export clean CSV spreadsheets", included: true },
      { text: "Instant monitoring early email alerts", included: true },
      { text: "Priority direct developer response queues", included: true },
    ],
  },
  {
    id: "tier_premium_yearly",
    paypalPlanId: "P-PREMIUM_YEARLY_ID",
    name: "Agency Scale",
    description: "Full capacity programmatic access optimized for multi-channel pipelines.",
    price: 199,
    interval: "year",
    popular: false,
    features: [
      { text: "Unlimited monthly database queries", included: true },
      { text: "Advanced multi-attribute search filters", included: true },
      { text: "AI Outreach Email Builder Engine", included: true },
      { text: "Export clean CSV spreadsheets", included: true },
      { text: "Instant monitoring early email alerts", included: true },
      { text: "Priority direct developer response queues", included: true },
    ],
  },
];
