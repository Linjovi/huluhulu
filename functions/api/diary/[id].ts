/**
 * GET /api/diary/[id] - Get a single diary by ID and passphrase
 */
import { getDiaryById } from "../../services/diary";

export async function onRequestGet(context: any) {
  try {
    const db = context.env.DB;
    const id = context.params.id;
    const url = new URL(context.request.url);
    const passphrase = url.searchParams.get('passphrase') || '';
    
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
    
    if (!passphrase) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing passphrase" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const diary = await getDiaryById(db, id, passphrase);
    
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
    console.error("Get diary error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "获取日记失败" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
