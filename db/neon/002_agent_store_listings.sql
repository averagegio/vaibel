-- Run once per Neon branch (SQL Editor or psql).
-- https://console.neon.tech/

CREATE TABLE IF NOT EXISTS agent_store_listings (
  application_id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL,
  category text NOT NULL DEFAULT 'Community',
  installs_label text NOT NULL DEFAULT 'New',
  rating double precision NOT NULL DEFAULT 5,
  author text NOT NULL,
  agent_api_url text NOT NULL,
  approved_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_store_listings_approved_at_idx
  ON agent_store_listings (approved_at DESC);
