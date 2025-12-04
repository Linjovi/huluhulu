export interface TarotCard {
  id: string;
  name: string;
  suit?: "Wands" | "Cups" | "Swords" | "Pentacles" | "Major";
  number?: number;
  imageUrl: string;
  isReversed: boolean; // Determined during shuffle
  description?: string;
}

export interface SpreadPositionInfo {
  id: string;
  name: string; // Display name e.g. "过去", "核心指引"
  description?: string; // Prompt context
}

export interface SpreadConfig {
  id: string;
  name: string;
  description: string;
  cards: number;
  positions: SpreadPositionInfo[];
}

export interface DrawnCard extends TarotCard {
  position: string; // Stores the localized name of the position
  isRevealed: boolean;
}

export type GameStage =
  | "intro"
  | "input_question"
  | "spread_selection"
  | "shuffling"
  | "cutting"
  | "drawing"
  | "reading"
  | "result";
