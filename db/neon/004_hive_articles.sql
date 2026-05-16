-- Long-form hive articles (admin + Vibe team members)
CREATE TABLE IF NOT EXISTS hive_articles (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  author TEXT NOT NULL DEFAULT 'vAIbee',
  author_email TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hive_articles_published_at_idx ON hive_articles (published_at DESC);
