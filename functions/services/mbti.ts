import { createDeepSeekClient } from "./ai";
import { MessageAnalysis, ReplySuggestion, MBTIType, Env } from "../types";
import { safeParseJSON } from "../utils/common";

/**
 * 分析收到的消息，识别 MBTI 人格特征和潜台词
 */
export const analyzeIncomingMessage = async (
  message: string,
  targetMBTI: MBTIType,
  relationshipIndex: number,
  env: Env
): Promise<MessageAnalysis> => {
  const client = createDeepSeekClient(env);

  const systemPrompt = `你是一名资深的MBTI心理学专家和情感导师。
当前场景：
- 对方人格：${targetMBTI}
- 关系指数：${relationshipIndex}/100 (0-30初识, 31-60暧昧/好友, 61-100热恋/深交)

请分析来自该 ${targetMBTI} 的信息：
1. 识别其表现出的认知功能（如 Ni, Te, Fi, Se 等）。
2. 结合关系深度，挖掘文字背后的潜台词、真实意图和情绪需求。
3. 必须完全使用中文回答，语言敏锐、深刻且富有洞察力。`;

  const userPrompt = `对方的消息: "${message}"`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
    });

    return {
      mbtiLogic: completion.choices[0].message.content?.trim() || "暂时无法洞察对方的内心，请稍后再试。",
    };
  } catch (error) {
    console.error("DeepSeek analyzeIncomingMessage Error:", error);
    return {
      mbtiLogic: "暂时无法洞察对方的内心，请稍后再试。",
    };
  }
};

/**
 * 生成优化后的回复建议
 */
export const generateReplySuggestions = async (
  receivedMessage: string,
  instinctualReply: string,
  targetMBTI: MBTIType,
  currentScore: number,
  env: Env
): Promise<ReplySuggestion[]> => {
  const client = createDeepSeekClient(env);

  const systemPrompt = `你是一名MBTI聊天专家。
场景：用户收到了一条来自 ${targetMBTI} 的消息。
用户的原始回复意图是用户提供的。

请提供3个优化后的中文回复方案。
要求：
1. reactionToOriginal：描述该人格看到用户原始回复后的内心OS。
2. optimizedReply：提供符合 ${targetMBTI} 人格偏好（逻辑或情感触发点）的高情商回复。
3. reactionToOptimized：描述对方看到优化回复后的积极心理变化。
4. briefAnalysis：简述优化逻辑。
5. scoreChange：预估关系指数的变化（diff 字段表示变化值，可以是正数或负数）。

请以 JSON 数组格式输出，每个对象包含以下字段：
- originalReply: 用户的原始回复
- reactionToOriginal: 对方看到原始回复的内心OS
- optimizedReply: 优化后的回复
- reactionToOptimized: 对方看到优化回复的积极心理变化
- briefAnalysis: 优化逻辑分析
- scoreChange: { from: number, to: number, diff: number }

重要：请务必以纯 JSON 数组格式输出，不要包含 markdown 代码块标记。`;

  const userPrompt = `收到的消息: "${receivedMessage}"
用户的原始回复意图: "${instinctualReply}"
当前关系指数: ${currentScore}`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    let content = completion.choices[0].message.content?.trim() || "[]";
    
    // 尝试解析 JSON，如果返回的是对象，尝试提取数组
    let data: any = safeParseJSON(content);
    
    // 如果返回的是对象且包含 suggestions 或 data 字段，提取数组
    if (data && typeof data === "object" && !Array.isArray(data)) {
      data = data.suggestions || data.data || Object.values(data).find((v: any) => Array.isArray(v)) || [];
    }
    
    // 确保是数组
    if (!Array.isArray(data)) {
      console.error("Failed to parse suggestions: not an array", data);
      return [];
    }

    return data.map((item: any) => ({
      originalReply: item.originalReply || instinctualReply,
      reactionToOriginal: item.reactionToOriginal || "",
      optimizedReply: item.optimizedReply || "",
      reactionToOptimized: item.reactionToOptimized || "",
      briefAnalysis: item.briefAnalysis || "",
      scoreChange: {
        from: currentScore,
        to: currentScore + (item.scoreChange?.diff || 5),
        diff: item.scoreChange?.diff || 5,
      },
    }));
  } catch (error) {
    console.error("Failed to generate reply suggestions", error);
    return [];
  }
};

