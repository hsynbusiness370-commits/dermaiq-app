import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeSkin } from "@/services/skin-analysis";
import { buildRecommendations } from "@/services/recommendations";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FREE_SCAN_LIMIT = 2;

const scanSchema = z.object({
  hydration: z.number().min(0).max(100),
  texture: z.number().min(0).max(100),
  redness: z.number().min(0).max(100),
  sensitivity: z.number().min(0).max(100),
});

type UsageRow = {
  scans_used: number | null;
};

type SubscriptionRow = {
  plan: string | null;
  status: string | null;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: z.infer<typeof scanSchema>;
  try {
    payload = scanSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid scan payload." }, { status: 400 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .maybeSingle<SubscriptionRow>();

  const isPremium = subscription?.plan === "glow" || subscription?.plan === "pro";
  const monthKey = new Date().toISOString().slice(0, 7);

  const { data: usage } = await supabase
    .from("usage")
    .select("scans_used")
    .eq("user_id", user.id)
    .eq("month_key", monthKey)
    .maybeSingle<UsageRow>();

  const scansUsed = usage?.scans_used ?? 0;
  if (!isPremium && scansUsed >= FREE_SCAN_LIMIT) {
    return NextResponse.json(
      {
        error: "Free scan limit reached. Upgrade to continue scanning.",
        paywall: true,
      },
      { status: 402 },
    );
  }

  await supabase.from("usage").upsert(
    {
      user_id: user.id,
      month_key: monthKey,
      scans_used: scansUsed + 1,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,month_key" },
  );

  const analysis = analyzeSkin(payload);
  const recommendations = buildRecommendations(analysis);

  return NextResponse.json({
    analysis,
    recommendations,
    scansUsed: scansUsed + 1,
    scansRemaining: isPremium ? null : Math.max(FREE_SCAN_LIMIT - (scansUsed + 1), 0),
  });
}
