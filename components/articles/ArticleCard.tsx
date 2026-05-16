import Link from "next/link";
import type { Article } from "@/lib/articles";
import { formatArticleDate } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-vaibee-border bg-vaibee-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-vaibee-cyan/35 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 text-xs text-vaibee-muted">
        <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{article.readMinutes} min read</span>
      </div>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-vaibee-navy">
        <Link href={`/articles/${article.slug}`} className="hover:text-vaibee-cyan">
          {article.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-vaibee-muted">{article.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[var(--vaibee-cyan-dim)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-vaibee-navy"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/articles/${article.slug}`}
        className="mt-5 inline-flex text-sm font-semibold text-vaibee-cyan hover:underline"
      >
        Read article →
      </Link>
    </article>
  );
}
