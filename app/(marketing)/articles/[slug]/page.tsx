import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleShareBar } from "@/components/articles/ArticleShareBar";
import { formatArticleDate, getArticleBySlug } from "@/lib/articles";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="relative bg-vaibee-surface pb-32 pt-8 sm:pb-36 sm:pt-10">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-vaibee-muted">
          <Link href="/articles" className="font-semibold text-vaibee-cyan hover:underline">
            Articles
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate text-vaibee-navy">{article.title}</span>
        </nav>

        <header className="space-y-4 border-b border-vaibee-border pb-8">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--vaibee-cyan-dim)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-vaibee-navy"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-vaibee-navy sm:text-4xl">{article.title}</h1>
          <p className="text-lg leading-relaxed text-vaibee-muted">{article.excerpt}</p>
          <p className="text-sm text-vaibee-muted">
            <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
            {" · "}
            {article.readMinutes} min read · {article.author}
          </p>
          <ArticleShareBar
            path={`/articles/${article.slug}`}
            title={article.title}
            text={article.excerpt}
            className="pt-2"
          />
        </header>

        <div className="prose-vaibee mt-10 space-y-6 text-base leading-relaxed text-vaibee-navy">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-vaibee-border pt-8">
          <Link href="/articles" className="text-sm font-semibold text-vaibee-cyan hover:underline">
            ← All articles
          </Link>
          <Link
            href="/store"
            className="rounded-xl bg-vaibee-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-vaibee-navy-soft"
          >
            Explore the store
          </Link>
        </footer>
      </article>
    </main>
  );
}
