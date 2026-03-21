import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SuccessPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Payment successful</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Welcome to Premium</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-300">
        Your account is upgrading now. Open the dashboard to start unlimited scans and personalized routines.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }))}>
          Go to dashboard
        </Link>
        <Link href="/scanner" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Start scanning
        </Link>
      </div>
    </div>
  );
}
