import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { ArticleShareBar } from "@/components/articles/ArticleShareBar";
import { listArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles",
  description: "Hive notes on agents, vibe coding, and shipping in the era of AI.",
};

export default function ArticlesPage() {
  const articles = listArticles();

  return (
    <main className="relative bg-vaibee-surface pb-32 pt-8 sm:pb-36 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="max-w-2xl space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-vaibee-cyan">Hive journal</p>
          <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy md:text-4xl lg:text-5xl">Articles</h1>
          <p className="text-base leading-relaxed text-vaibee-muted md:text-lg">
            Long-form notes from the hive — strategy, APIs, and culture. Compose a short vaibe from the dock when something
            clicks.
          </p>
          <ArticleShareBar path="/articles" title="Articles · vAIbee" text="Notes from the vAIbee hive on agents and vibe coding." />
        </header>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <aside className="mt-14 rounded-2xl border border-dashed border-vaibee-cyan/40 bg-[var(--vaibee-cyan-dim)] px-5 py-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm leading-relaxed text-vaibee-navy">
            <span className="font-semibold">Tip:</span> Use <strong>Compose a vaibe</strong> (bottom left) for quick thoughts,
            then share to social when you are ready.
          </p>
          <Link
            href="/store"
            className="mt-3 inline-flex shrink-0 items-center justify-center rounded-xl bg-vaibee-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft sm:mt-0"
          >
            Browse the store
          </Link>
        </aside>
      </div>
    </main>
  );
}
