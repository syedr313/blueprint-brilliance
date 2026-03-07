import { useState } from "react";
import { motion } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface MatchData {
  rounds: { pairs: { left: string; right: string; emoji?: string }[] }[];
  leftLabel?: string;
  rightLabel?: string;
}

const DragMatchGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as MatchData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Match Game"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        return (
          <MatchRound
            key={currentRound}
            pairs={data.rounds[currentRound].pairs}
            leftLabel={data.leftLabel}
            rightLabel={data.rightLabel}
            onComplete={(correct) => {
              if (correct) onCorrect(); else onIncorrect();
              setTimeout(nextRound, 600);
            }}
          />
        );
      }}
    </GameEngine>
  );
};

const MatchRound = ({
  pairs,
  leftLabel,
  rightLabel,
  onComplete,
}: {
  pairs: { left: string; right: string; emoji?: string }[];
  leftLabel?: string;
  rightLabel?: string;
  onComplete: (allCorrect: boolean) => void;
}) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);
  const [shuffledRight] = useState(() => {
    const indices = pairs.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
  });

  const handleLeftClick = (idx: number) => {
    if (matched.has(idx)) return;
    setSelectedLeft(idx);
    setWrongPair(null);
  };

  const handleRightClick = (rightIdx: number) => {
    if (selectedLeft === null || matched.has(rightIdx)) return;

    if (selectedLeft === rightIdx) {
      const newMatched = new Set(matched);
      newMatched.add(rightIdx);
      setMatched(newMatched);
      setSelectedLeft(null);
      if (newMatched.size === pairs.length) {
        setTimeout(() => onComplete(true), 400);
      }
    } else {
      setWrongPair([selectedLeft, rightIdx]);
      setSelectedLeft(null);
      setTimeout(() => setWrongPair(null), 600);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50">
      <p className="text-center text-sm text-muted-foreground mb-4">Tap a left item, then tap its match on the right</p>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {/* Left column */}
        <div className="space-y-2">
          {leftLabel && <p className="text-xs font-semibold text-muted-foreground mb-2">{leftLabel}</p>}
          {pairs.map((pair, i) => (
            <motion.button
              key={`l-${i}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLeftClick(i)}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium transition-all border-2 ${
                matched.has(i)
                  ? "bg-success/10 border-success/30 text-success opacity-60"
                  : selectedLeft === i
                  ? "bg-primary/10 border-primary text-foreground shadow-soft"
                  : wrongPair?.[0] === i
                  ? "bg-destructive/10 border-destructive text-destructive"
                  : "bg-muted/50 border-border/50 text-foreground hover:border-primary/30"
              }`}
            >
              {pair.emoji && <span className="mr-2 text-lg">{pair.emoji}</span>}
              {pair.left}
            </motion.button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-2">
          {rightLabel && <p className="text-xs font-semibold text-muted-foreground mb-2">{rightLabel}</p>}
          {shuffledRight.map((originalIdx) => (
            <motion.button
              key={`r-${originalIdx}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRightClick(originalIdx)}
              className={`w-full p-3 rounded-xl text-left text-sm font-medium transition-all border-2 ${
                matched.has(originalIdx)
                  ? "bg-success/10 border-success/30 text-success opacity-60"
                  : wrongPair?.[1] === originalIdx
                  ? "bg-destructive/10 border-destructive text-destructive"
                  : "bg-muted/50 border-border/50 text-foreground hover:border-secondary/30"
              }`}
            >
              {pairs[originalIdx].right}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragMatchGame;
