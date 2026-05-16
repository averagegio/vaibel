import type { Metadata } from "next";
import { AdminArticlesPanel } from "@/components/admin/AdminArticlesPanel";

export const metadata: Metadata = {
  title: "Admin · Articles",
  description: "Create and edit hive articles.",
};

export default function AdminArticlesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-4">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Admin</p>
        <h1 className="text-2xl font-semibold text-vaibee-navy">Article editor</h1>
        <p className="text-sm text-vaibee-muted">
          Manage long-form posts stored in Neon or <code className="text-xs">.data/hive-articles.json</code>. Static
          seeds in <code className="text-xs">lib/articles.ts</code> stay in code.
        </p>
      </header>
      <AdminArticlesPanel />
    </div>
  );
}
