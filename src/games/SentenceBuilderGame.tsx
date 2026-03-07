import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface SBData {
  rounds: {
    instruction?: string;
    words: string[];
    correctOrder: number[];
  }[];
}

const SentenceBuilderGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as SBData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Sentence Builder"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        return (
          <SBRound
            key={currentRound}
            instruction={round.instruction}
            words={round.words}
            correctOrder={round.correctOrder}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 800); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 1000); }}
          />
        );
      }}
    </GameEngine>
  );
};

const SBRound = ({
  instruction,
  words,
  correctOrder,
  onCorrect,
  onIncorrect,
}: {
  instruction?: string;
  words: string[];
  correctOrder: number[];
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [placed, setPlaced] = useState<number[]>([]);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [shuffled] = useState(() => {
    const indices = words.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const available = shuffled.filter((i) => !placed.includes(i));

  const handleWordClick = (wordIdx: number) => {
    if (result) return;
    const newPlaced = [...placed, wordIdx];
    setPlaced(newPlaced);

    if (newPlaced.length === words.length) {
      const isCorrect = newPlaced.every((v, i) => v === correctOrder[i]);
      setResult(isCorrect ? "correct" : "incorrect");
      if (isCorrect) onCorrect();
      else onIncorrect();
    }
  };

  const handleRemove = (idx: number) => {
    if (result) return;
    setPlaced(placed.filter((_, i) => i !== idx));
  };

  const correctSentence = correctOrder.map((i) => words[i]).join(" ");

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50">
      {instruction && (
        <p className="text-sm text-muted-foreground mb-3">{instruction}</p>
      )}

      {/* Sentence slots */}
      <div className="min-h-[60px] bg-muted/30 rounded-xl p-3 mb-4 flex flex-wrap gap-2 border-2 border-dashed border-border/50">
        {placed.length === 0 && (
          <span className="text-sm text-muted-foreground/50">Tap words below to build the sentence...</span>
        )}
        {placed.map((wordIdx, i) => (
          <motion.button
            key={`placed-${i}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => handleRemove(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              result === "correct"
                ? "bg-success/15 border-success/30 text-success"
                : result === "incorrect"
                ? "bg-destructive/15 border-destructive/30 text-destructive"
                : "bg-primary/10 border-primary/30 text-foreground hover:bg-primary/20"
            }`}
          >
            {words[wordIdx]}
          </motion.button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2 justify-center">
        {available.map((wordIdx) => (
          <motion.button
            key={`avail-${wordIdx}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleWordClick(wordIdx)}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-muted border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-colors cursor-pointer"
          >
            {words[wordIdx]}
          </motion.button>
        ))}
      </div>

      {result === "incorrect" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-sm text-muted-foreground"
        >
          Correct: <span className="text-success font-medium">{correctSentence}</span>
        </motion.p>
      )}
    </div>
  );
};

export default SentenceBuilderGame;
