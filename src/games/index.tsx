import { lazy } from "react";
import type { GameProps } from "./types";
import { getGameType } from "./gameData";

import FallingLettersGame from "./FallingLettersGame";
import BubblePopGame from "./BubblePopGame";
import DragMatchGame from "./DragMatchGame";
import MultipleChoiceGame from "./MultipleChoiceGame";
import SentenceBuilderGame from "./SentenceBuilderGame";
import TypingGameComponent from "./TypingGame";
import CategorySortGame from "./CategorySortGame";
import FillInBlankGame from "./FillInBlankGame";
import StoryChoiceGame from "./StoryChoiceGame";
import BossChallengeGame from "./BossChallengeGame";

const gameComponents: Record<string, React.ComponentType<GameProps>> = {
  "falling-letters": FallingLettersGame,
  "bubble-pop": BubblePopGame,
  "drag-match": DragMatchGame,
  "multiple-choice": MultipleChoiceGame,
  "sentence-builder": SentenceBuilderGame,
  "typing": TypingGameComponent,
  "category-sort": CategorySortGame,
  "fill-in-blank": FillInBlankGame,
  "story-choice": StoryChoiceGame,
  "boss-challenge": BossChallengeGame,
};

export function getGameComponent(levelId: number): React.ComponentType<GameProps> {
  const type = getGameType(levelId);
  return gameComponents[type] || MultipleChoiceGame;
}
