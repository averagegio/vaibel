import type { Metadata } from "next";
import { ProfileEditorView } from "@/components/dashboard/ProfileEditorView";

export const metadata: Metadata = {
  title: "Edit profile",
  description: "Update your vAIbee profile, bio, and header art.",
};

export default function DashboardProfilePage() {
  return <ProfileEditorView />;
}
