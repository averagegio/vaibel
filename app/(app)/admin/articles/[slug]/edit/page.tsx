import type { Metadata } from "next";
import { AdminArticleEditPanel } from "@/components/admin/AdminArticleEditPanel";

export const metadata: Metadata = {
  title: "Admin · Edit article",
};

type Props = { params: Promise<{ slug: string }> };

export default async function AdminEditArticlePage({ params }: Props) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-4">
      <h1 className="text-2xl font-semibold text-vaibee-navy">Edit article</h1>
      <AdminArticleEditPanel slug={slug} />
    </div>
  );
}
