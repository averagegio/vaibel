/** Early-stage vAIbee funnel — Apply for vibers as the front door */

export type MonetizationIntent = "undecided" | "free" | "subscription" | "usage" | "hybrid";

export const MONETIZATION_OPTIONS: { value: MonetizationIntent; label: string; hint: string }[] = [
  { value: "undecided", label: "Still figuring it out", hint: "Totally fine — we will nudge you when listing time comes." },
  { value: "free", label: "Free for now", hint: "Grow distribution before you monetize." },
  { value: "subscription", label: "Paid subscription", hint: "Recurring seats or agent plans." },
  { value: "usage", label: "Usage / metered", hint: "Per call, token, or task." },
  { value: "hybrid", label: "Hybrid", hint: "Mix of free tier + paid add-ons." },
];

export type FunnelStep = {
  id: string;
  title: string;
  body: string;
  owner: "you" | "vaibee";
};

/** What happens after someone applies — practical sequence */
export const POST_APPLY_STEPS: FunnelStep[] = [
  {
    id: "prove",
    title: "Prove distribution",
    body: "We look at your API, README, and demo path. The goal is real installs and repeat use — not pitch decks.",
    owner: "vaibee",
  },
  {
    id: "curate",
    title: "Light curation",
    body: "We keep the hive small: short call or async checklist so buyers trust what they install.",
    owner: "vaibee",
  },
  {
    id: "list",
    title: "List on the store",
    body: "Once approved, your listing appears in the hive store and the public GET /api/v1/agents catalog — same slug-based JSON surface as curated agents.",
    owner: "vaibee",
  },
  {
    id: "monetize",
    title: "One revenue line later",
    body: "When traffic is there, we add a single clear cut — usually marketplace billing or featured slots — not ads on day one.",
    owner: "vaibee",
  },
];

/** Shown on the apply page so applicants know the bar before they write */
export const APPLICATION_STEPS: { title: string; detail: string }[] = [
  { title: "You & co-founder", detail: "Who we onboard and who gets updates." },
  { title: "Agent & API", detail: "What you ship and where we integrate." },
  { title: "Brand", detail: "Optional logo — helps the store feel human." },
];
