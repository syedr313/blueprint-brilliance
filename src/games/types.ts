export interface GameResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  details: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[];
}

export interface GameProps {
  levelId: number;
  onComplete: (result: GameResult) => void;
}

export type GameType =
  | "falling-letters"
  | "bubble-pop"
  | "drag-match"
  | "multiple-choice"
  | "sentence-builder"
  | "typing-game"
  | "category-sort"
  | "fill-in-blank"
  | "story-choice"
  | "boss-challenge";
