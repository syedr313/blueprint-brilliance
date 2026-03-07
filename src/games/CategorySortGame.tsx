import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface CSData {
  categories: string[];
  rounds: {
    item: string;
    categoryIndex: number;
  }[];
}

const CategorySortGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as CSData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Sort It!"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        return (
          <SortRound
            key={currentRound}
            item={round.item}
            categories={data.categories}
            correctCategory={round.categoryIndex}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 600); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 800); }}
          />
        );
      }}
    </GameEngine>
  );
};

const SortRound = ({
  item,
  categories,
  correctCategory,
  onCorrect,
  onIncorrect,
}: {
  item: string;
  categories: string[];
  correctCategory: number;
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === correctCategory) onCorrect();
    else onIncorrect();
  };

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50">
      {/* Item to sort */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-6"
      >
        <div className="inline-block bg-primary/10 border-2 border-primary/30 rounded-2xl px-6 py-4">
          <p className="text-lg md:text-xl font-display text-foreground">{item}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Which category does this belong to?</p>
      </motion.div>

      {/* Categories */}
      <div className={`grid gap-3 ${categories.length <= 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
        {categories.map((cat, i) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`p-4 rounded-xl text-center font-medium text-sm border-2 transition-all ${
              selected === null
                ? "bg-muted/30 border-border/50 text-foreground hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer"
                : i === correctCategory
                ? "bg-success/15 border-success text-success"
                : selected === i
                ? "bg-destructive/15 border-destructive text-destructive"
                : "bg-muted/30 border-border/30 text-muted-foreground/50"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategorySortGame;
