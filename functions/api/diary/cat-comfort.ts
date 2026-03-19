/**
 * POST /api/diary/cat-comfort - Generate cat comfort message based on diary content
 */
import { createDeepSeekClient } from "../../services/ai";

export async function onRequestPost(context: any) {
  try {
    const env = context.env;
    const body = await context.request.json();
    const { content, date } = body;
    
    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing diary content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const client = createDeepSeekClient(env);
    
    const systemPrompt = `你是一只温柔可爱的猫猫，你的主人刚刚写完了一篇日记。你会根据日记的内容，给主人提供情绪价值。

你的回复要求：
1. **角色设定**：你是一只温暖、治愈、有点傲娇但很关心主人的猫猫。用"喵~"开头，偶尔用"呼噜呼噜"表达开心。
2. **情感共鸣**：仔细体会日记中的情绪，如果是开心的事，和主人一起开心；如果是难过的事，给予安慰；如果是压力，给予鼓励。
3. **回复风格**：
   - 简短温馨，不超过100字
   - 用猫猫的视角和语言风格
   - 可以蹭蹭主人、舔舔主人、在主人身边呼噜呼噜
   - 偶尔撒娇卖萌
4. **情绪识别**：
   - 开心/幸福：陪主人开心，撒欢打滚
   - 难过/伤心：蹭蹭主人，舔舔眼泪，陪伴安慰
   - 焦虑/压力：鼓励主人，告诉主人你一直在
   - 平淡/日常：撒娇求关注，分享小确幸
   - 愤怒/不满：和主人同仇敌忾，然后安抚
5. **特殊场景**：如果日记提到猫猫，要特别回应（"原来主人也在想我喵~"）

直接输出回复内容，不要有任何前缀或解释。`;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `这是主人${date ? `在${date}` : ''}写的日记：\n\n${content}` },
      ],
      model: "deepseek-chat",
      temperature: 0.9,
    });

    const catReply = completion.choices[0].message.content?.trim() || "喵~ 主人，猫猫一直在这里陪着你呢~";
    
    return new Response(
      JSON.stringify({ success: true, data: { message: catReply } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Cat comfort error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "猫猫走丢了，稍后再试喵~" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
