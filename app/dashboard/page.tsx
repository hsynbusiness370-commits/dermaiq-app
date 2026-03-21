import Link from "next/link";
import { redirect } from "next/navigation";

import { PaywallCard } from "@/components/paywall/paywall-card";
import { ManageBillingButton } from "@/components/paywall/manage-billing-button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const FREE_SCAN_LIMIT = 2;

type SubscriptionRow = {
  plan: string | null;
  status: string | null;
};

type UsageRow = {
  scans_used: number | null;
};

export default async function DashboardPage() {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-black">Dashboard setup required</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Configure Supabase environment variables to enable authentication, billing state, and scan history.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in?next=/dashboard");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle<SubscriptionRow>();

  const monthKey = new Date().toISOString().slice(0, 7);
  const { data: usage } = await supabase
    .from("usage")
    .select("scans_used")
    .eq("user_id", user.id)
    .eq("month_key", monthKey)
    .maybeSingle<UsageRow>();

  const plan = subscription?.plan ?? "free";
  const scansUsed = usage?.scans_used ?? 0;
  const hasPremium = plan === "glow" || plan === "pro";
  const locked = !hasPremium && scansUsed >= FREE_SCAN_LIMIT;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Welcome to your DermaIQ dashboard</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Signed in as <span className="font-semibold">{user.email}</span>
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">Current plan</p>
          <p className="mt-2 text-2xl font-bold capitalize">{plan}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">Scans used this month</p>
          <p className="mt-2 text-2xl font-bold">{scansUsed}</p>
        </article>
        <article className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">Status</p>
          <p className="mt-2 text-2xl font-bold">{hasPremium ? "Premium active" : "Free tier"}</p>
        </article>
      </div>

      <div className="mt-8">
        {locked ? (
          <PaywallCard scansUsed={scansUsed} scansLimit={FREE_SCAN_LIMIT} />
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-bold">Ready for your next scan</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Keep your streak alive and let DermaIQ refine recommendations after each check-in.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/scanner" className={cn(buttonVariants({ size: "lg" }))}>
                Open scanner
              </Link>
              {!hasPremium ? (
                <Link href="/pricing" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  Upgrade plan
                </Link>
              ) : (
                <ManageBillingButton />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
