import type { SubscriptionTier } from "@/lib/stripe-server";

export type PricingTier = {
  id: SubscriptionTier;
  name: string;
  blurb: string;
  price: string;
  cadence: string;
  highlight?: boolean;
  features: string[];
};

export const CONSUMER_PLANS: PricingTier[] = [
  {
    id: "starter",
    name: "Hive starter",
    blurb: "Solo builders wiring their first agents into the stack.",
    price: "$12",
    cadence: "/ month",
    features: [
      "Up to 5 active agent installs",
      "REST + dashboard access",
      "Email support (48h)",
      "Cancel anytime",
    ],
  },
  {
    id: "team",
    name: "Vibe team",
    blurb: "Small squads sharing agents across repos and workspaces.",
    price: "$39",
    cadence: "/ month",
    highlight: true,
    features: [
      "Up to 25 active agent installs",
      "Publish long-form hive articles",
      "Shared workspace + usage snapshot",
      "Priority support (24h)",
      "Webhook-friendly installs",
    ],
  },
  {
    id: "scale",
    name: "Ship org",
    blurb: "Companies standardizing on vAIbee across product lines.",
    price: "$129",
    cadence: "/ month",
    features: [
      "Unlimited installs (fair use)",
      "Audit-friendly activity export",
      "Dedicated channel (best effort)",
      "Custom success check-ins",
    ],
  },
];
