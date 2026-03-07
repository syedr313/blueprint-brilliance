import { useState } from "react";
import { motion } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface StoryData {
  rounds: {
    storyText: string;
    question: string;
    options: string[];
    correctIndex: number;
    nextStory?: string;
  }[];
}

const StoryChoiceGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as StoryData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Story Builder"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        return (
          <StoryRound
            key={currentRound}
            storyText={round.storyText}
            question={round.question}
            options={round.options}
            correctIndex={round.correctIndex}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 1000); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 1200); }}
          />
        );
      }}
    </GameEngine>
  );
};

const StoryRound = ({
  storyText,
  question,
  options,
  correctIndex,
  onCorrect,
  onIncorrect,
}: {
  storyText: string;
  question: string;
  options: string[];
  correctIndex: number;
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === correctIndex) onCorrect();
    else onIncorrect();
  };

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50">
      <div className="bg-muted/30 rounded-xl p-4 mb-4 text-sm text-foreground leading-relaxed border border-border/30">
        <div className="text-xs font-semibold text-primary mb-2">📖 Story</div>
        {storyText}
      </div>

      <h3 className="text-sm font-medium text-foreground mb-3">{question}</h3>

      <div className="space-y-2">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`w-full p-3 rounded-xl text-left text-sm font-medium border-2 transition-all ${
              selected === null
                ? "bg-muted/20 border-border/50 text-foreground hover:border-secondary/40 cursor-pointer"
                : i === correctIndex
                ? "bg-success/15 border-success text-success"
                : selected === i
                ? "bg-destructive/15 border-destructive text-destructive"
                : "bg-muted/20 border-border/30 text-muted-foreground/50"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default StoryChoiceGame;
