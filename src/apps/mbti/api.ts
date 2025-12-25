import { MBTIType, MessageAnalysis, ReplySuggestion, APIResponse } from "./types";

const API_BASE = "/api/mbti";

export const analyzeIncomingMessage = async (
  message: string,
  targetMBTI: MBTIType,
  relationshipIndex: number
): Promise<MessageAnalysis> => {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      targetMBTI,
      relationshipIndex,
    }),
  });

  if (!response.ok) {
    throw new Error("分析请求失败");
  }

  const result: APIResponse<MessageAnalysis> = await response.json();
  if (result.code !== 0) {
    throw new Error(result.message || "分析失败");
  }

  return result.data;
};

export const generateReplySuggestions = async (
  receivedMessage: string,
  instinctualReply: string,
  targetMBTI: MBTIType,
  currentScore: number
): Promise<ReplySuggestion[]> => {
  const response = await fetch(`${API_BASE}/suggest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      receivedMessage,
      instinctualReply,
      targetMBTI,
      currentScore,
    }),
  });

  if (!response.ok) {
    throw new Error("生成建议请求失败");
  }

  const result: APIResponse<ReplySuggestion[]> = await response.json();
  if (result.code !== 0) {
    throw new Error(result.message || "生成建议失败");
  }

  return result.data;
};

