import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CancelledPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Checkout cancelled</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">No worries, your free plan is still active</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">
        Continue scanning with your free credits, or compare plans again when you are ready.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/pricing" className={cn(buttonVariants({ size: "lg" }))}>
          Compare plans
        </Link>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
