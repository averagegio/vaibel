-- Published hive vaibes (short posts from /articles compose dock)
CREATE TABLE IF NOT EXISTS hive_vaibes (
  id UUID PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  headline TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Hive',
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS hive_vaibes_published_at_idx ON hive_vaibes (published_at DESC);
