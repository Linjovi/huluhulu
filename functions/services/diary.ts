/**
 * Diary data access layer for Cloudflare D1
 */

export interface DiaryRecord {
  id: string;
  content: string;
  passphrase: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all diary IDs for a specific passphrase, sorted by date descending
 */
export async function getDiaryList(db: any, passphrase: string): Promise<string[]> {
  const result = await db.prepare(
    "SELECT id FROM diaries WHERE passphrase = ? ORDER BY id DESC"
  ).bind(passphrase).all();
  
  return result.results.map((row: any) => row.id);
}

/**
 * Get a single diary by ID and passphrase
 */
export async function getDiaryById(db: any, id: string, passphrase: string): Promise<DiaryRecord | null> {
  const result = await db.prepare(
    "SELECT id, content, passphrase, created_at, updated_at FROM diaries WHERE id = ? AND passphrase = ?"
  ).bind(id, passphrase).first();
  
  return result || null;
}

/**
 * Check if a diary exists for a specific date and passphrase
 */
export async function checkDiaryExists(db: any, id: string, passphrase: string): Promise<boolean> {
  const result = await db.prepare(
    "SELECT 1 FROM diaries WHERE id = ? AND passphrase = ?"
  ).bind(id, passphrase).first();
  
  return !!result;
}

/**
 * Create a new diary
 */
export async function createDiary(db: any, id: string, content: string, passphrase: string): Promise<DiaryRecord> {
  await db.prepare(
    "INSERT INTO diaries (id, content, passphrase) VALUES (?, ?, ?)"
  ).bind(id, content, passphrase).run();
  
  return {
    id,
    content,
    passphrase,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Update an existing diary
 */
export async function updateDiary(db: any, id: string, content: string, passphrase: string): Promise<DiaryRecord | null> {
  const existing = await getDiaryById(db, id, passphrase);
  if (!existing) {
    return null;
  }
  
  await db.prepare(
    "UPDATE diaries SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND passphrase = ?"
  ).bind(content, id, passphrase).run();
  
  return {
    id,
    content,
    passphrase,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Delete a diary
 */
export async function deleteDiary(db: any, id: string, passphrase: string): Promise<boolean> {
  const existing = await getDiaryById(db, id, passphrase);
  if (!existing) {
    return false;
  }
  
  await db.prepare(
    "DELETE FROM diaries WHERE id = ? AND passphrase = ?"
  ).bind(id, passphrase).run();
  
  return true;
}
