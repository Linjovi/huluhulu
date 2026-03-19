/**
 * PUT /api/diary/update/[id] - Update an existing diary
 */
import { updateDiary } from "../../../services/diary";

export async function onRequestPut(context: any) {
  try {
    const db = context.env.DB;
    const id = context.params.id;
    const body = await context.request.json();
    
    if (!db) {
      return new Response(
        JSON.stringify({ success: false, error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing diary ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const { content } = body;
    
    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required field: content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const diary = await updateDiary(db, id, content);
    
    if (!diary) {
      return new Response(
        JSON.stringify({ success: false, error: "Diary not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, data: diary }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Update diary error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "更新日记失败" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
