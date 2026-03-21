import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

import { PLAN_DEFINITIONS } from "@/lib/plans";

export default function Home() {
  const glowPlan = PLAN_DEFINITIONS.find((plan) => plan.id === "glow");

  return (
    <div className="hero-grid">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 md:flex-row md:items-center">
        <div className="max-w-2xl space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
            <Sparkles className="h-3.5 w-3.5" /> AI skin intelligence
          </p>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Turn every selfie into a personalized skincare action plan.
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            DermaIQ analyzes hydration, redness, texture, and sensitivity to guide users toward routines that actually
            move their skin score up week by week.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/auth/sign-in?next=/scanner"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Start free scan <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
            >
              View plans
            </Link>
          </div>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-500">Growth snapshot</p>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold">+41%</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Average retention increase with weekly scans</p>
          <div className="mt-5 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
            <p className="text-sm font-medium">Most chosen plan</p>
            <p className="mt-1 text-xl font-bold">{glowPlan?.name}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              ${glowPlan?.monthlyPrice}/mo with unlimited scans and recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
