import { 
  getWeiboHotSearch, 
  getDouyinHotSearch, 
  getXiaohongshuHotSearch, 
} from "../utils";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const summarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A short, witty, 'cat-style' daily summary (max 150 chars) of what's happening. Use cat puns (喵, 捏, 爪) and emojis.",
    },
    mood: {
      type: Type.STRING,
      description: "The overall internet vibe (e.g., 'Eating Melon', 'Angry', 'Touching', 'Funny').",
    },
    moodScore: {
      type: Type.INTEGER,
      description: "Mood Score from 0 (Very Negative) to 100 (Very Positive/Exciting).",
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Keyword or entity name." },
          weight: { type: Type.INTEGER, description: "Weight (1-10) based on frequency/importance." },
        },
        required: ["name", "weight"],
      },
      description: "8-12 popular keywords/entities from the titles.",
    },
  },
  required: ["summary", "mood", "moodScore", "keywords"],
};

export async function onRequestGet(context: any) {
  try {
    const apiKey = context.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set");
    }

    // Parallel fetch
    const [weibo, douyin, xhs] = await Promise.all([
      getWeiboHotSearch(),
      getDouyinHotSearch(),
      getXiaohongshuHotSearch()
    ]);

    const topTitles = {
      weibo: weibo.slice(0, 10).map(i => i.title),
      douyin: douyin.slice(0, 10).map(i => i.title),
      xiaohongshu: xhs.slice(0, 10).map(i => i.title),
    };

    const systemInstruction = `
Role: You are "Gossip Cat" (吃瓜喵), a cute, trendy, and slightly sassy cat who loves internet gossip.

Task:
1. **Summary**: Write a short, witty, "cat-style" daily summary (max 150 chars) of what's happening. Use cat puns (喵, 捏, 爪) and emojis. Be funny and engaging.
2. **Mood Analysis**: Analyze the overall internet vibe (e.g., "Eating Melon", "Angry", "Touching", "Funny").
3. **Mood Score**: 0 (Very Negative) to 100 (Very Positive/Exciting).
4. **Keywords**: Extract 8-12 popular keywords/entities from the titles for a word cloud. Assign a weight (1-10) based on frequency/importance.

Input Data (Top 10 Hot Searches from 3 Platforms):
Weibo: ${JSON.stringify(topTitles.weibo)}
Douyin: ${JSON.stringify(topTitles.douyin)}
Xiaohongshu: ${JSON.stringify(topTitles.xiaohongshu)}

Response Format: JSON ONLY based on the schema.
`;

    const ai = new GoogleGenAI({ apiKey });
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: "Start analyzing the gossip meow!",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: summarySchema,
        temperature: 0.7,
      },
    });

    const content = response.text;
    if (!content) {
      throw new Error("Gossip Cat is napping and didn't respond.");
    }

    let result;
    try {
        result = JSON.parse(content);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        // Fallback
        result = { summary: "喵？今天好像没有什么特别的新闻捏。", mood: "平静", moodScore: 50, keywords: [] };
    }

    return new Response(JSON.stringify({
      code: 0,
      message: "Success",
      data: result
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (e: any) {
    console.error("Hot Search Summary Error:", e);
    return new Response(JSON.stringify({ code: 500, message: e.message || "吃瓜喵接口出错" }), { status: 500 });
  }
}
