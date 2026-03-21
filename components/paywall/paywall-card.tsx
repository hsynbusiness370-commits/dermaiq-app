import Link from "next/link";
import { Sparkles } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaywallCardProps = {
  scansUsed: number;
  scansLimit: number;
};

export function PaywallCard({ scansUsed, scansLimit }: PaywallCardProps) {
  return (
    <section className="rounded-2xl border border-emerald-300/60 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-sm dark:border-emerald-900 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Upgrade to unlock</p>
      </div>

      <h2 className="text-2xl font-bold tracking-tight">You hit your free scan limit</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        You used <strong>{scansUsed}</strong> of <strong>{scansLimit}</strong> free monthly scans. Upgrade to keep
        your skin progress streak active and receive personalized product picks after every scan.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/pricing" className={cn(buttonVariants({ size: "lg" }))}>
          See plans
        </Link>
        <Link href="/paywall" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Why users upgrade
        </Link>
      </div>
    </section>
  );
}
