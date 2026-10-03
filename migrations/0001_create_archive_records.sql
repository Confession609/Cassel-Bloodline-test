CREATE TABLE IF NOT EXISTS archive_records (
  id TEXT PRIMARY KEY NOT NULL,
  archive_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  grade TEXT NOT NULL,
  grade_label TEXT NOT NULL,
  score INTEGER NOT NULL,
  composite_score INTEGER NOT NULL,
  performance_percent REAL,
  dominant TEXT NOT NULL,
  spell TEXT NOT NULL,
  character TEXT NOT NULL,
  hidden_triggered INTEGER NOT NULL DEFAULT 0,
  special_name TEXT,
  special_quote TEXT
);

CREATE INDEX IF NOT EXISTS archive_records_updated_at_idx ON archive_records(updated_at DESC);
