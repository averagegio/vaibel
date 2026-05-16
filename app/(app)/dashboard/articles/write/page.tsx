import type { Metadata } from "next";
import { MemberArticleWriteView } from "@/components/articles/MemberArticleWriteView";

export const metadata: Metadata = {
  title: "Write article",
  description: "Publish a long-form hive article (Vibe team).",
};

export default function WriteArticlePage() {
  return <MemberArticleWriteView />;
}
