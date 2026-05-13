-- Run this in the Neon SQL Editor (or via `psql`) once per branch/database.
-- https://console.neon.tech/

CREATE TABLE IF NOT EXISTS tavily_search_log (
  id text PRIMARY KEY,
  query text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  request_id text NOT NULL,
  response_time double precision NOT NULL,
  answer_preview text,
  top_results text NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS tavily_search_log_created_at_idx
  ON tavily_search_log (created_at DESC);
