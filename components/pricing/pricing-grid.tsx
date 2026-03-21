"use client";

import { useState } from "react";

import type { BillingCycle } from "@/lib/plans";
import { PLAN_DEFINITIONS } from "@/lib/plans";
import { PricingCard } from "@/components/pricing/pricing-card";

export function PricingGrid() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="space-y-8">
      <div className="mx-auto inline-flex rounded-lg border border-zinc-300 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
          <button
            key={cycle}
            type="button"
            onClick={() => setBillingCycle(cycle)}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              billingCycle === cycle
                ? "bg-emerald-600 text-white"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {cycle === "monthly" ? "Monthly" : "Yearly (save 20%)"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLAN_DEFINITIONS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} billingCycle={billingCycle} />
        ))}
      </div>
    </div>
  );
}
