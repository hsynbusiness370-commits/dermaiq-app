"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { BillingCycle, PlanDefinition, PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  plan: PlanDefinition;
  billingCycle: BillingCycle;
};

export function PricingCard({ plan, billingCycle }: PricingCardProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const priceSuffix = billingCycle === "monthly" ? "/mo" : "/mo billed yearly";

  const handleCheckout = () => {
    setError(null);
    if (plan.id === "free") {
      router.push("/auth/sign-in?next=/dashboard");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: plan.id as PlanId,
            billingCycle,
          }),
        });

        const payload = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !payload.url) {
          throw new Error(payload.error ?? "Unable to start checkout.");
        }

        window.location.href = payload.url;
      } catch (checkoutError) {
        const message = checkoutError instanceof Error ? checkoutError.message : "Checkout failed.";
        setError(message);
      }
    });
  };

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm",
        "border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950",
        plan.recommended && "border-emerald-500 ring-1 ring-emerald-500/40",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        {plan.highlight ? (
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
            {plan.highlight}
          </span>
        ) : null}
      </div>

      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">{plan.blurb}</p>

      <div className="mb-5">
        <p className="text-3xl font-bold">
          {price === 0 ? "Free" : `$${price}`}
          {price > 0 ? <span className="ml-1 text-sm font-medium text-zinc-500">{priceSuffix}</span> : null}
        </p>
      </div>

      <ul className="mb-6 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-2">
        <Button size="lg" className="w-full" disabled={pending} onClick={handleCheckout}>
          {pending ? "Redirecting..." : plan.cta}
        </Button>
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    </article>
  );
}
