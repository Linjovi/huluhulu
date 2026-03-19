/**
 * Diary data access layer for Cloudflare D1
 */

export interface DiaryRecord {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get all diary IDs sorted by date descending
 */
export async function getDiaryList(db: any): Promise<string[]> {
  const result = await db.prepare(
    "SELECT id FROM diaries ORDER BY id DESC"
  ).all();
  
  return result.results.map((row: any) => row.id);
}

/**
 * Get a single diary by ID
 */
export async function getDiaryById(db: any, id: string): Promise<DiaryRecord | null> {
  const result = await db.prepare(
    "SELECT id, content, created_at, updated_at FROM diaries WHERE id = ?"
  ).bind(id).first();
  
  return result || null;
}

/**
 * Create a new diary
 */
export async function createDiary(db: any, id: string, content: string): Promise<DiaryRecord> {
  await db.prepare(
    "INSERT INTO diaries (id, content) VALUES (?, ?)"
  ).bind(id, content).run();
  
  return {
    id,
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Update an existing diary
 */
export async function updateDiary(db: any, id: string, content: string): Promise<DiaryRecord | null> {
  const existing = await getDiaryById(db, id);
  if (!existing) {
    return null;
  }
  
  await db.prepare(
    "UPDATE diaries SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(content, id).run();
  
  return {
    id,
    content,
    created_at: existing.created_at,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Delete a diary
 */
export async function deleteDiary(db: any, id: string): Promise<boolean> {
  const existing = await getDiaryById(db, id);
  if (!existing) {
    return false;
  }
  
  await db.prepare(
    "DELETE FROM diaries WHERE id = ?"
  ).bind(id).run();
  
  return true;
}
