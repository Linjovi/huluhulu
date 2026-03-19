/**
 * DELETE /api/diary/delete/[id] - Delete a diary
 */
import { deleteDiary } from "../../../services/diary";

export async function onRequestDelete(context: any) {
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
    
    const deleted = await deleteDiary(db, id, passphrase);
    
    if (!deleted) {
      return new Response(
        JSON.stringify({ success: false, error: "Diary not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Diary deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Delete diary error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "删除日记失败" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
