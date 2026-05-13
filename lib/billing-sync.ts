import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe-server";
import { normalizeBillingEmail, parseTier, savePaidEntitlement, updateBySubscriptionId } from "@/lib/billing-store";

function subscriptionIdOf(session: Stripe.Checkout.Session): string | null {
  const sub = session.subscription;
  if (typeof sub === "string") return sub;
  if (sub && typeof sub === "object" && "id" in sub) return sub.id;
  return null;
}

function customerIdOf(session: Stripe.Checkout.Session): string | null {
  const c = session.customer;
  if (typeof c === "string") return c;
  if (c && typeof c === "object" && "id" in c) return c.id;
  return null;
}

function emailFromCheckoutSession(session: Stripe.Checkout.Session): string | null {
  const details = session.customer_details;
  const fromDetails = details?.email;
  if (typeof fromDetails === "string" && fromDetails.trim()) {
    return normalizeBillingEmail(fromDetails);
  }
  const direct = session.customer_email;
  if (typeof direct === "string" && direct.trim()) {
    return normalizeBillingEmail(direct);
  }
  return null;
}

function customerEmailFromStripeCustomer(customer: Stripe.Customer | Stripe.DeletedCustomer): string | null {
  if ("deleted" in customer && customer.deleted) return null;
  if (!("email" in customer) || typeof customer.email !== "string" || !customer.email.trim()) {
    return null;
  }
  return normalizeBillingEmail(customer.email);
}

/** True when checkout finished and the subscription is in good standing (including trials). */
export function checkoutSessionLooksPaid(session: Stripe.Checkout.Session): boolean {
  if (session.mode !== "subscription") return false;
  if (session.status !== "complete") return false;
  if (!subscriptionIdOf(session)) return false;
  const ps = session.payment_status;
  if (ps === "paid" || ps === "no_payment_required") return true;
  const sub = session.subscription;
  if (typeof sub === "object" && sub !== null && "status" in sub) {
    const st = (sub as Stripe.Subscription).status;
    return st === "trialing" || st === "active";
  }
  return false;
}

export async function syncEntitlementFromCheckoutSession(session: Stripe.Checkout.Session): Promise<boolean> {
  if (!checkoutSessionLooksPaid(session)) return false;
  const email = emailFromCheckoutSession(session);
  const tier = parseTier(session.metadata?.tier);
  if (!email || !tier) return false;
  const subId = subscriptionIdOf(session);
  const custId = customerIdOf(session);
  await savePaidEntitlement(email, {
    tier,
    stripeCustomerId: custId,
    stripeSubscriptionId: subId,
    active: true,
  });
  return true;
}

export async function syncEntitlementFromSubscription(sub: Stripe.Subscription): Promise<void> {
  const tier = parseTier(sub.metadata?.tier);
  const active = sub.status === "active" || sub.status === "trialing";
  const subId = sub.id;

  const updated = await updateBySubscriptionId(subId, { active, tier: tier ?? undefined });
  if (updated) return;

  const stripe = getStripe();
  const customerRef = sub.customer;
  const customerId = typeof customerRef === "string" ? customerRef : customerRef?.id;
  if (!customerId) return;

  const customer = await stripe.customers.retrieve(customerId);
  const email = customerEmailFromStripeCustomer(customer);
  if (!email || !tier) return;

  await savePaidEntitlement(email, {
    tier,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subId,
    active,
  });
}

export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "customer"],
  });
}
