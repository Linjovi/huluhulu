import { analyzeIncomingMessage } from "../../services/mbti";

export async function onRequestPost(context: any) {
  const req = context.request;

  try {
    const { message, targetMBTI, relationshipIndex } = await req.json();

    if (!message || !targetMBTI) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: message, targetMBTI" }),
        { status: 400 }
      );
    }

    const result = await analyzeIncomingMessage(
      message,
      targetMBTI,
      relationshipIndex || 50,
      context.env
    );

    return new Response(
      JSON.stringify({
        code: 0,
        message: "Success",
        data: result,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Analyze message error:", error);
    return new Response(
      JSON.stringify({
        code: 500,
        message: error.message || "分析消息时发生错误",
      }),
      { status: 500 }
    );
  }
}

