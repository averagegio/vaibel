import type { Metadata } from "next";
import { AdminArticleEditPanel } from "@/components/admin/AdminArticleEditPanel";

export const metadata: Metadata = {
  title: "Admin · New article",
};

export default function AdminNewArticlePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4">
      <h1 className="text-2xl font-semibold text-vaibee-navy">New article</h1>
      <AdminArticleEditPanel />
    </div>
  );
}
