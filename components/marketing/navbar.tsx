import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          DermaIQ
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/pricing"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm")}
          >
            Pricing
          </Link>
          <Link href="/dashboard" className={cn(buttonVariants({ size: "sm" }), "text-sm")}>
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
