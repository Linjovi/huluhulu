import OpenAI from "openai";
import { Request, Response } from "express";
import { getWeiboHotSearch } from "./weiboHotSearch";
import { getDouyinHotSearch } from "./douyinHotSearch";
import { getXiaohongshuHotSearch } from "./xiaohongshuHotSearch";

interface SummaryData {
  summary: string;
  mood: string;
  moodScore: number; // 0-100
  keywords: Array<{ name: string; weight: number }>; // weight for cloud size
}

interface CacheData {
  data: SummaryData;
  timestamp: number;
}

let cache: CacheData | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * 创建 DeepSeek 客户端
 */
function createDeepSeekClient() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY 未配置");
  }

  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
}

/**
 * 解析 AI 响应
 */
function parseAIResponse(content: string): SummaryData {
  const jsonContent = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  
  return JSON.parse(jsonContent);
}

/**
 * 获取全网热搜总结
 */
export async function getHotSearchSummary(): Promise<SummaryData> {
  // 1. 获取三大平台数据
  const [weibo, douyin, xhs] = await Promise.all([
    getWeiboHotSearch(),
    getDouyinHotSearch(),
    getXiaohongshuHotSearch(),
  ]);

  // 2. 提取前10名标题
  const topTitles = {
    weibo: weibo.slice(0, 10).map(i => i.title),
    douyin: douyin.slice(0, 10).map(i => i.title),
    xiaohongshu: xhs.slice(0, 10).map(i => i.title),
  };

  // 3. 构建 Prompt
  const prompt = `
Role: You are "Gossip Cat" (吃瓜喵), a cute, trendy, and slightly sassy cat who loves internet gossip.

Input Data (Top 10 Hot Searches from 3 Platforms):
Weibo: ${JSON.stringify(topTitles.weibo)}
Douyin: ${JSON.stringify(topTitles.douyin)}
Xiaohongshu: ${JSON.stringify(topTitles.xiaohongshu)}

Task:
1. **Summary**: Write a short, witty, "cat-style" daily summary (max 150 chars) of what's happening. Use cat puns (喵, 捏, 爪) and emojis. Be funny and engaging.
2. **Mood Analysis**: Analyze the overall internet vibe (e.g., "Eating Melon", "Angry", "Touching", "Funny").
3. **Mood Score**: 0 (Very Negative) to 100 (Very Positive/Exciting).
4. **Keywords**: Extract 10-15 popular keywords/entities from the titles for a word cloud. Assign a weight (1-10) based on frequency/importance.

Response Format (JSON ONLY):
{
  "summary": "string",
  "mood": "string (e.g. '吃瓜中', '气呼呼', '感动喵')",
  "moodScore": number,
  "keywords": [
    {"name": "keyword1", "weight": number},
    ...
  ]
}
`;

  // 4. 调用 AI
  const openai = createDeepSeekClient();
  const completion = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that speaks JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content?.trim() || "";
  
  try {
    return parseAIResponse(content);
  } catch (error) {
    console.error("AI Response Parse Error:", content);
    throw new Error("猫猫总结失败了喵~");
  }
}

/**
 * 路由处理函数
 */
export async function hotSearchSummaryHandler(req: Request, res: Response) {
  try {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return res.json({
        code: 0,
        message: "获取成功 (Cached)",
        data: cache.data,
      });
    }

    const data = await getHotSearchSummary();

    // Update cache
    cache = {
      data,
      timestamp: Date.now(),
    };

    res.json({
      code: 0,
      message: "获取成功",
      data,
    });
  } catch (error: any) {
    console.error("Summary API Error:", error);
    res.status(500).json({
      code: 500,
      message: error.message || "获取总结失败",
    });
  }
}

