import Link from "next/link";
import { ShieldCheck, Sparkles, Timer, TrendingUp } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: TrendingUp,
    title: "Track visible progress",
    copy: "Premium users get weekly trend charts that reveal what is improving and what needs attention.",
  },
  {
    icon: Sparkles,
    title: "Get personalized picks",
    copy: "Recommendations update after each scan, so routines stay aligned with skin changes.",
  },
  {
    icon: ShieldCheck,
    title: "Avoid expensive guesswork",
    copy: "Plan-specific product matching helps reduce trial-and-error purchases.",
  },
  {
    icon: Timer,
    title: "Stay consistent",
    copy: "Automated reminders and streak tracking keep users engaged long enough to see real results.",
  },
];

export default function PaywallPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Unlock premium impact</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Why users choose paid plans</h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-300">
          The free plan is a great start. Premium makes DermaIQ a daily performance system for healthier skin.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {reasons.map(({ icon: Icon, title, copy }) => (
          <article key={title} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Icon className="mb-3 h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{copy}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/pricing" className={cn(buttonVariants({ size: "lg" }))}>
          Upgrade now
        </Link>
      </div>
    </div>
  );
}
