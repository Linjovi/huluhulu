import { generateReplySuggestions } from "../../services/mbti";

export async function onRequestPost(context: any) {
  const req = context.request;

  try {
    const { receivedMessage, instinctualReply, targetMBTI, currentScore } = await req.json();

    if (!receivedMessage || !instinctualReply || !targetMBTI) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: receivedMessage, instinctualReply, targetMBTI" 
        }),
        { status: 400 }
      );
    }

    const result = await generateReplySuggestions(
      receivedMessage,
      instinctualReply,
      targetMBTI,
      currentScore || 50,
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
    console.error("Generate suggestions error:", error);
    return new Response(
      JSON.stringify({
        code: 500,
        message: error.message || "生成回复建议时发生错误",
      }),
      { status: 500 }
    );
  }
}

