import { DrawnCard, TarotReadingResult } from "../types";

interface TarotResponse {
  code: number;
  data: TarotReadingResult;
  message?: string;
}

export const getTarotReading = async (
  cards: DrawnCard[],
  spreadName: string,
  question: string
): Promise<TarotReadingResult> => {
  try {
    const mappedCards = cards.map((card) => ({
      name: card.name,
      isReversed: card.isReversed,
      position: card.position,
    }));

    const response = await fetch("/api/tarot-reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cards: mappedCards,
        spreadName,
        question,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "塔罗连接断开了，请稍后再试");
    }

    const result: TarotResponse = await response.json();

    if (result.code !== 0) {
      throw new Error(result.message || "塔罗服务返回异常");
    }

    return result.data;
  } catch (error) {
    console.error("Tarot API Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("网络链接中断，请稍后再试");
  }
};
