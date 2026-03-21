import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getPlanIdFromPriceId } from "@/lib/plans";
import { getStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function getUserIdFromCustomerId(customerId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle<{ id: string }>();

  return profile?.id ?? null;
}

async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;

  const explicitUserId = subscription.metadata?.user_id;
  const userId = explicitUserId || (await getUserIdFromCustomerId(customerId));
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price?.id;
  const planFromPrice = priceId ? getPlanIdFromPriceId(priceId) : null;
  const plan = planFromPrice ?? (subscription.metadata?.plan_id as "glow" | "pro" | undefined) ?? "glow";
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end;

  const supabaseAdmin = createSupabaseAdminClient();
  await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan,
      status: subscription.status,
      current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe webhook configuration." }, { status: 400 });
  }

  const stripe = getStripeClient();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const customerId = typeof session.customer === "string" ? session.customer : null;
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

        if (userId && customerId) {
          const supabaseAdmin = createSupabaseAdminClient();
          await supabaseAdmin.from("profiles").upsert(
            {
              id: userId,
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" },
          );
        }

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await upsertSubscriptionFromStripe(subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(subscription);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handling failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
