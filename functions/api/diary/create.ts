/**
 * POST /api/diary/create - Create a new diary
 */
import { createDiary, getDiaryById } from "../../services/diary";

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
    
    const { id, content } = body;
    
    if (!id || !content) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: id, content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (!isValidDateFormat(id)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid ID format. Expected YYYYMMDD" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Check if diary already exists
    const existing = await getDiaryById(db, id);
    if (existing) {
      return new Response(
        JSON.stringify({ success: false, error: "Diary already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const diary = await createDiary(db, id, content);
    
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
