import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { pickFeaturedAgents } from "@/lib/dashboard-featured";
import { listPublishedAgents } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your vAIbee viber workspace overview.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const catalog = await listPublishedAgents();
  const featuredPicks = pickFeaturedAgents(catalog, 3);
  return <DashboardView featuredPicks={featuredPicks} />;
}
