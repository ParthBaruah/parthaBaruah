# SponsorVault Production Blueprint

SponsorVault is an enterprise-tier indexing platform designed to link digital content channels with monetization ecosystems. It features sub-millisecond search capabilities via decoupled client caches, robust analytical instrumentation, and full end-to-end PayPal billing subscription lifecycle handlers.

## Core Structural Ecosystem
* **Core Framework:** Next.js 15 (App Router Architecture)
* **Data Layer & Session Persistence:** Supabase API Engine + PostgREST
* **Payment Pipeline Processor:** PayPal Developer Billing Subscriptions API
* **Styles & Component Models:** Tailwind CSS, Radix UI Primitives, Lucide Icon Libraries
* **Test Isolation Frameworks:** Vitest, Playwright E2E Runner Automation

---

## Environmental Execution Context Keys

Create an environment declaration layout file (`.env.local`) in your working directory path root containing these exact parameter keys:

```env
# Database Pipeline Parameters
NEXT_PUBLIC_SUPABASE_URL=[https://your-project-id.supabase.co](https://your-project-id.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Payment Gateway Infrastructure Hooks
PAYPAL_CLIENT_ID=AXXXXXXXXXXXXX-YYYYYYYYYYYYY
PAYPAL_CLIENT_SECRET=EZZZZZZZZZZZZZZZZZZZZZZZZZ
PAYPAL_API_URL=[https://api-m.sandbox.paypal.com](https://api-m.sandbox.paypal.com)
NEXT_PUBLIC_PAYPAL_PLAN_ID_PREMIUM=P-1234567890ABCDEF

# System Deployment Paths Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
