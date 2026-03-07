import { useState } from "react";
import { motion } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface FIBData {
  rounds: {
    sentence: string; // Use ___ for blank
    options: string[];
    correctIndex: number;
    explanation?: string;
  }[];
}

const FillInBlankGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as FIBData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Fill the Blank"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        return (
          <FIBRound
            key={currentRound}
            sentence={round.sentence}
            options={round.options}
            correctIndex={round.correctIndex}
            explanation={round.explanation}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 1000); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 1200); }}
          />
        );
      }}
    </GameEngine>
  );
};

const FIBRound = ({
  sentence,
  options,
  correctIndex,
  explanation,
  onCorrect,
  onIncorrect,
}: {
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const parts = sentence.split("___");

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === correctIndex) onCorrect();
    else onIncorrect();
  };

  const filledWord = selected !== null ? options[selected] : null;
  const isCorrect = selected === correctIndex;

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50">
      {/* Sentence with blank */}
      <div className="text-base md:text-lg text-foreground leading-relaxed mb-6 text-center">
        {parts[0]}
        <span
          className={`inline-block min-w-[80px] mx-1 px-3 py-1 rounded-lg border-2 border-dashed text-center font-semibold transition-all ${
            filledWord
              ? isCorrect
                ? "border-success bg-success/10 text-success border-solid"
                : "border-destructive bg-destructive/10 text-destructive border-solid"
              : "border-primary/40 bg-primary/5 text-primary/40"
          }`}
        >
          {filledWord || "___"}
        </span>
        {parts[1]}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-2 justify-center">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
              selected === null
                ? "bg-muted/30 border-border/50 text-foreground hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
                : i === correctIndex
                ? "bg-success/15 border-success text-success"
                : selected === i
                ? "bg-destructive/15 border-destructive text-destructive"
                : "bg-muted/30 border-border/30 text-muted-foreground/50"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {selected !== null && explanation && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-muted-foreground bg-secondary/10 rounded-xl p-3"
        >
          💡 {explanation}
        </motion.p>
      )}
    </div>
  );
};

export default FillInBlankGame;
