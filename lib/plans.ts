export type PlanId = "free" | "glow" | "pro";
export type BillingCycle = "monthly" | "yearly";

export type PlanDefinition = {
  id: PlanId;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  blurb: string;
  cta: string;
  highlight?: string;
  recommended?: boolean;
  features: string[];
};

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    blurb: "Try DermaIQ and get your first skin score.",
    cta: "Start free",
    features: [
      "2 scans per month",
      "Basic skin hydration and texture score",
      "Starter skincare routine",
    ],
  },
  {
    id: "glow",
    name: "Glow",
    monthlyPrice: 19,
    yearlyPrice: 15,
    blurb: "Perfect for users who want consistent progress tracking.",
    cta: "Upgrade to Glow",
    recommended: true,
    highlight: "Most popular",
    features: [
      "Unlimited scans",
      "Weekly skin trend analysis",
      "Personalized product recommendations",
      "Progress timeline with reminders",
    ],
  },
  {
    id: "pro",
    name: "Pro Clinic",
    monthlyPrice: 49,
    yearlyPrice: 39,
    blurb: "Built for power users and skincare creators.",
    cta: "Go Pro Clinic",
    highlight: "Best value",
    features: [
      "Everything in Glow",
      "Advanced AI concern detection",
      "Custom routines for morning/night",
      "Priority support + early feature access",
    ],
  },
];

type PriceEnvMapping = Record<Exclude<PlanId, "free">, Record<BillingCycle, string>>;

export function getStripePriceMap(): PriceEnvMapping {
  return {
    glow: {
      monthly: process.env.STRIPE_PRICE_GLOW_MONTHLY ?? "",
      yearly: process.env.STRIPE_PRICE_GLOW_YEARLY ?? "",
    },
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
    },
  };
}

export function getPriceIdForPlan(planId: Exclude<PlanId, "free">, billingCycle: BillingCycle) {
  return getStripePriceMap()[planId][billingCycle];
}

export function getPlanIdFromPriceId(priceId: string): Exclude<PlanId, "free"> | null {
  const priceMap = getStripePriceMap();
  for (const [planId, cycles] of Object.entries(priceMap) as [
    Exclude<PlanId, "free">,
    Record<BillingCycle, string>,
  ][]) {
    if (Object.values(cycles).includes(priceId)) {
      return planId;
    }
  }
  return null;
}
