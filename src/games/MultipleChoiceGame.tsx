import { useState } from "react";
import { motion } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface MCData {
  rounds: {
    question: string;
    passage?: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[];
}

const MultipleChoiceGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as MCData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Challenge"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        return (
          <MCRound
            key={currentRound}
            question={round.question}
            passage={round.passage}
            options={round.options}
            correctIndex={round.correctIndex}
            explanation={round.explanation}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 1200); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 1500); }}
          />
        );
      }}
    </GameEngine>
  );
};

const MCRound = ({
  question,
  passage,
  options,
  correctIndex,
  explanation,
  onCorrect,
  onIncorrect,
}: {
  question: string;
  passage?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === correctIndex) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50">
      {passage && (
        <div className="bg-muted/50 rounded-xl p-4 mb-4 text-sm text-foreground leading-relaxed max-h-48 overflow-y-auto">
          {passage}
        </div>
      )}

      <h3 className="text-base md:text-lg font-display text-foreground mb-4">{question}</h3>

      <div className="space-y-2">
        {options.map((option, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`w-full p-3 md:p-4 rounded-xl text-left text-sm md:text-base font-medium transition-all border-2 ${
              selected === null
                ? "bg-muted/30 border-border/50 text-foreground hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                : i === correctIndex
                ? "bg-success/15 border-success text-success"
                : selected === i
                ? "bg-destructive/15 border-destructive text-destructive"
                : "bg-muted/30 border-border/30 text-muted-foreground"
            }`}
          >
            <span className="mr-2 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
            {option}
          </motion.button>
        ))}
      </div>

      {selected !== null && explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-sm text-foreground"
        >
          💡 {explanation}
        </motion.div>
      )}
    </div>
  );
};

export default MultipleChoiceGame;
