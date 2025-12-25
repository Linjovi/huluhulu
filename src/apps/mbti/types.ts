// 复用后端定义的类型，但由于路径问题，我们在前端重新定义一份或引用公共类型
// 这里为了方便，重新定义一份，保持一致

export type MBTIType = 
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export interface MessageAnalysis {
  mbtiLogic: string;
}

export interface ScoreChange {
  from: number;
  to: number;
  diff: number;
}

export interface ReplySuggestion {
  originalReply: string;
  reactionToOriginal: string;
  optimizedReply: string;
  reactionToOptimized: string;
  briefAnalysis: string;
  scoreChange: ScoreChange;
}

export interface APIResponse<T> {
  code: number;
  message: string;
  data: T;
}

