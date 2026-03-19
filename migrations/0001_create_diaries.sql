-- Migration: 0001_create_diaries
-- Description: Create diaries table for diary storage

CREATE TABLE IF NOT EXISTS diaries (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_diaries_created_at ON diaries(created_at DESC);
