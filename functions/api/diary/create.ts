/**
 * POST /api/diary/create - Create a new diary
 */
import { createDiary, checkDiaryExists } from "../../services/diary";

// Validate ID format: YYYYMMDD
function isValidDateFormat(id: string): boolean {
  return /^\d{8}$/.test(id);
}

export async function onRequestPost(context: any) {
  try {
    const db = context.env.DB;
    const body = await context.request.json();
    
    if (!db) {
      return new Response(
        JSON.stringify({ success: false, error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const { id, content, passphrase } = body;
    
    if (!id || !content || !passphrase) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: id, content, passphrase" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (!isValidDateFormat(id)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid ID format. Expected YYYYMMDD" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Check if diary already exists for this date and passphrase
    const exists = await checkDiaryExists(db, id, passphrase);
    if (exists) {
      return new Response(
        JSON.stringify({ success: false, error: "Diary already exists for this date" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const diary = await createDiary(db, id, content, passphrase);
    
    return new Response(
      JSON.stringify({ success: true, data: diary }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Create diary error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "创建日记失败" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
