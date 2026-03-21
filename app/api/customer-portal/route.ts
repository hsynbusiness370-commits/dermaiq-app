import { NextResponse } from "next/server";

import { getAppUrl } from "@/lib/env";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = {
  stripe_customer_id: string | null;
};

export const runtime = "nodejs";

export async function POST() {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer found for this account." }, { status: 404 });
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${getAppUrl()}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create billing portal session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
