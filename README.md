# DermaIQ App

DermaIQ is a monetized AI skincare scanner built with Next.js, Supabase, and Stripe.

## What is included

- Landing page designed for conversion (`/`)
- Pricing page with monthly/yearly switch (`/pricing`)
- Paywall education page (`/paywall`)
- Email magic-link auth with Supabase (`/auth/sign-in`)
- Protected dashboard with plan + usage awareness (`/dashboard`)
- Scanner experience + usage-limited free tier (`/scanner`)
- Stripe checkout API (`/api/checkout`)
- Stripe billing portal API (`/api/customer-portal`)
- Stripe webhook sync to Supabase (`/api/stripe/webhook`)

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (Auth + Postgres)
- Stripe (subscriptions)

## 1) Local setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PRICE_GLOW_MONTHLY=price_...
STRIPE_PRICE_GLOW_YEARLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
```

## 2) Supabase DB setup

Run the SQL migration:

- `supabase/migrations/0001_init_dermaiq.sql`

This creates:
- `profiles`
- `subscriptions`
- `usage`

## 3) Stripe setup

1. Create products/prices for **Glow** and **Pro Clinic** (monthly + yearly).
2. Add each price id to `.env.local`.
3. Configure Stripe webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
4. Store webhook signing secret in `STRIPE_WEBHOOK_SECRET`.

## 4) Run app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Monetization strategy embedded in this build

- Strong free-to-paid conversion path (scanner -> limit -> paywall -> pricing -> checkout)
- Annual pricing discount for stronger cash flow
- Feature gating around high-value outcomes:
  - Unlimited scans
  - Personalized recommendations
  - Trend tracking + reminders
- Billing portal access to reduce churn friction

## Suggested next upgrades

- Add social proof/testimonials linked to real user outcomes
- Add referral discounts for viral growth loops
- Add A/B testing on pricing copy and CTA placement
- Integrate real camera/image model for production scan quality
