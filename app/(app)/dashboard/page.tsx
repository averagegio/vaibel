import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your vAIbee viber workspace overview.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
