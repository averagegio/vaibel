export type HiveArticleStored = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  author: string;
  authorEmail: string | null;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
};
