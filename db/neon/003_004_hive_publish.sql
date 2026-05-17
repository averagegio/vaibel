-- Run this entire file on the SAME Neon database your app uses (DATABASE_URL).
-- Neon Console → your project → branch (usually main) → SQL Editor → paste → Run

-- Short vaibes (compose dock)
CREATE TABLE IF NOT EXISTS hive_vaibes (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  headline TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Hive',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hive_vaibes_published_at_idx ON hive_vaibes (published_at DESC);

-- Long-form articles (admin + Vibe team)
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
