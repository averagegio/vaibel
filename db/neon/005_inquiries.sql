-- Footer inbox: contact messages and career intros
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('contact', 'career')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT,
  role TEXT,
  links TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inquiries_kind_created_idx ON inquiries (kind, created_at DESC);
