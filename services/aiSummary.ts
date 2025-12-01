import OpenAI from "openai";

/**
 * 创建 DeepSeek 客户端
 */
function createDeepSeekClient() {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.warn("DEEPSEEK_API_KEY 未配置，AI 总结功能将不可用");
    return null;
  }

  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
}

/**
 * 生成单平台热搜总结
 */
export async function getHotSearchSummary(
  sourceName: string,
  list: any[]
): Promise<string> {
  const client = createDeepSeekClient();
  if (!client) return "";

  // 提取前15条热搜用于总结 (增加数量以获取更多上下文)
  const topItems = list
    .slice(0, 15)
    .map((item, i) => `${i + 1}. ${item.title}`)
    .join("\n");

  const prompt = `
Role: You are "Gossip Cat" (吃瓜喵), a cute cat who loves internet gossip and trending news.

Task:
Read the top trending topics from ${sourceName} (Hot Search) below.
Summarize the most interesting, discussed events.
Your summary should be fun, slightly gossipy, and very cute.
Use emojis appropriately.

Tone & Style:
- Casual, excited, and gossipy (like sharing news with a friend).
- Use "喵" (meow) or "捏" (ne) at the end of sentences.
- Keep it concise (around 80-120 Chinese characters).
- Address the reader as "铲屎官" (Shoveler).
- **Highlight keywords (names, events, key terms) using HTML <b> tags. Do NOT use markdown bolding.**

Data:
[${sourceName} Hot Search]
${topItems}

Output:
Return ONLY the summary text in Chinese. No JSON, no markdown formatting.
`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a cute gossip cat bot.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error(`AI Summary generation failed for ${sourceName}:`, error);
    return "";
  }
}

