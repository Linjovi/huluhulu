import OpenAI from "openai";
import { Request, Response } from "express";

// Define necessary interfaces inline to avoid relative import issues
interface TarotCardInput {
  name: string;
  isReversed: boolean;
  position: string;
}

interface TarotRequestData {
  cards: TarotCardInput[];
  spreadName: string;
  question: string;
}

const SYSTEM_INSTRUCTION = `
你是一位精通象征主义、占星术和心理学的神秘塔罗占卜猫。
你的目标是根据抽出的牌为用户提供深刻、富有同理心且具有指导意义的解读。
请使用 Markdown 格式，用中文回答，保持语气神秘但温暖支持，并且每一句话的结尾都要加上“喵”。
重点解读每一张牌在对应位置的含义，并结合正逆位进行分析。
最后提供一个综合的指引。

请按照以下结构输出：

## 🔮 灵性洞察喵
(针对每一张牌：)
### [位置名称]：[牌名]
[解读]

### ✨ 命运指引喵
[综合建议]
`;

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
 * 构建塔罗牌 Prompt
 */
function buildTarotPrompt(data: TarotRequestData): string {
  const { cards, spreadName, question } = data;

  const cardDescriptions = cards
    .map(
      (c) =>
        `位置【${c.position}】：${c.name} ${c.isReversed ? "(逆位)" : "(正位)"}`
    )
    .join("\n");

  return `
      用户的问题是：“${
        question || "（用户心中默念，未直接说明，请针对通用运势解读）"
      }”。
      
      我选择的牌阵是：“${spreadName}”。
      我抽取了以下卡牌：
      ${cardDescriptions}
      
      请结合用户的问题（如果有）以及牌阵含义，为我解读这些牌的启示。
    `;
}

/**
 * 获取塔罗牌解读
 */
export async function getTarotReading(data: TarotRequestData): Promise<string> {
  const { cards, spreadName } = data;

  // 验证参数
  if (!cards || cards.length === 0 || !spreadName) {
    throw new Error("缺少必需参数: cards 或 spreadName");
  }

  const openai = createDeepSeekClient();
  const prompt = buildTarotPrompt(data);

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: SYSTEM_INSTRUCTION,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
    });

    return (
      completion.choices[0].message.content?.trim() ||
      "水晶球此刻有些模糊，请稍后再试喵。"
    );
  } catch (error) {
    console.error("DeepSeek Error:", error);
    throw new Error("灵性链接似乎中断了。请检查你的网络连接并重试喵。");
  }
}

/**
 * 塔罗牌接口路由处理
 */
export async function tarotHandler(req: Request, res: Response) {
  try {
    const { cards, spreadName, question } = req.body;

    const result = await getTarotReading({ cards, spreadName, question });

    res.json({
      code: 0,
      data: result,
    });
  } catch (error: any) {
    console.error("塔罗牌接口错误:", error);

    const statusCode =
      error.message.includes("未配置") || error.message.includes("缺少必需参数")
        ? 400
        : 500;

    res.status(statusCode).json({
      code: statusCode,
      message: error.message || "神秘力量暂时无法回应，请稍后再试喵。",
    });
  }
}
