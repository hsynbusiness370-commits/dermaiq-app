import { NextResponse } from "next/server";
import { z } from "zod";

import { getAppUrl } from "@/lib/env";
import { getPriceIdForPlan } from "@/lib/plans";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const checkoutSchema = z.object({
  planId: z.enum(["glow", "pro"]),
  billingCycle: z.enum(["monthly", "yearly"]),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: z.infer<typeof checkoutSchema>;
  try {
    payload = checkoutSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid checkout payload." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = await createSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const priceId = getPriceIdForPlan(payload.planId, payload.billingCycle);
  if (!priceId) {
    return NextResponse.json(
      { error: "Stripe price IDs are not configured for this plan and billing cycle." },
      { status: 500 },
    );
  }

  try {
    const stripe = getStripeClient();
    const appUrl = getAppUrl();
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      customer_email: user.email,
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan_id: payload.planId,
          billing_cycle: payload.billingCycle,
        },
      },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancelled`,
      metadata: {
        user_id: user.id,
        plan_id: payload.planId,
        billing_cycle: payload.billingCycle,
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json({ error: "Failed to create checkout URL." }, { status: 500 });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Stripe error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
