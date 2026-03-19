-- Migration: 0003_add_passphrase
-- Description: Add passphrase field to diaries table for diary-specific access control

-- Add passphrase column to diaries table
ALTER TABLE diaries ADD COLUMN passphrase TEXT NOT NULL DEFAULT '';

-- Create unique index on (id, passphrase) to allow multiple diaries on same date with different passphrases
CREATE UNIQUE INDEX IF NOT EXISTS idx_diaries_id_passphrase ON diaries(id, passphrase);

-- Create index for passphrase-based queries
CREATE INDEX IF NOT EXISTS idx_diaries_passphrase ON diaries(passphrase);
