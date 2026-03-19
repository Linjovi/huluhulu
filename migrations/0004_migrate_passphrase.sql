-- Migration: 0004_migrate_passphrase
-- Description: Migrate existing diaries to use default passphrase

-- Update all existing diaries with empty passphrase to use the default passphrase
UPDATE diaries 
SET passphrase = '枕边书怀中猫意中人' 
WHERE passphrase = '' OR passphrase IS NULL;
