/**
 * GET /api/diary/list - Get all diary IDs
 */
import { getDiaryList } from "../../services/diary";

export async function onRequestGet(context: any) {
  try {
    const db = context.env.DB;
    
    if (!db) {
      return new Response(
        JSON.stringify({ success: false, error: "Database not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const list = await getDiaryList(db);
    
    return new Response(
      JSON.stringify({ success: true, data: list }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Get diary list error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "获取日记列表失败" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
