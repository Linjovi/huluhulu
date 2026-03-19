/**
 * Migration script to import diary txt files into D1 database
 * 
 * Usage: npx tsx scripts/migrate-diaries.ts
 * 
 * This script reads diary content from public/diary/content/*.txt files
 * and inserts them into the D1 database.
 */

import * as fs from 'fs';
import * as path from 'path';

interface DiaryEntry {
  id: string;
  content: string;
}

async function migrateDiaries() {
  const contentDir = path.join(__dirname, '../public/diary/content');
  const indexFile = path.join(contentDir, 'index.json');
  
  // Read the index file to get list of diary IDs
  if (!fs.existsSync(indexFile)) {
    console.error('Index file not found:', indexFile);
    process.exit(1);
  }
  
  const diaryIds: string[] = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
  console.log(`Found ${diaryIds.length} diaries to migrate`);
  
  // Read each diary file
  const diaries: DiaryEntry[] = [];
  for (const id of diaryIds) {
    const filePath = path.join(contentDir, `${id}.txt`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      diaries.push({ id, content });
      console.log(`Read diary: ${id}`);
    } else {
      console.warn(`Warning: Diary file not found: ${filePath}`);
    }
  }
  
  // Generate SQL statements
  console.log('\n--- SQL Statements ---\n');
  for (const diary of diaries) {
    const escapedContent = diary.content.replace(/'/g, "''");
    console.log(`INSERT INTO diaries (id, content) VALUES ('${diary.id}', '${escapedContent.substring(0, 50)}...');`);
  }
  
  console.log('\n--- Migration Complete ---');
  console.log(`Total diaries: ${diaries.length}`);
  console.log('\nTo execute on local database:');
  console.log('npx wrangler d1 execute huluhulu --local --command "INSERT INTO diaries (id, content) VALUES (\'...\', \'...\');"');
  console.log('\nTo execute on remote database:');
  console.log('npx wrangler d1 execute huluhulu --remote --command "INSERT INTO diaries (id, content) VALUES (\'...\', \'...\');"');
}

migrateDiaries().catch(console.error);
