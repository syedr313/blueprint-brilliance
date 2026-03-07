import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Clock, Star, Trophy, Zap } from "lucide-react";

interface GameEngineProps {
  totalRounds: number;
  lives?: number;
  timeLimit?: number; // seconds per round, 0 = no limit
  showTimer?: boolean;
  children: (props: {
    currentRound: number;
    score: number;
    lives: number;
    streak: number;
    onCorrect: () => void;
    onIncorrect: () => void;
    nextRound: () => void;
    isComplete: boolean;
  }) => React.ReactNode;
  onComplete: (score: number, total: number, correct: number) => void;
  levelTitle: string;
}

const GameEngine = ({
  totalRounds,
  lives: initialLives = 3,
  children,
  onComplete,
  levelTitle,
}: GameEngineProps) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(initialLives);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [startTime] = useState(Date.now());

  const handleCorrect = useCallback(() => {
    const multiplier = streak >= 8 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
    const points = Math.round(10 * multiplier);
    setScore((s) => s + points);
    setCorrectCount((c) => c + 1);
    setStreak((s) => s + 1);
    setShowFeedback("correct");
    setTimeout(() => setShowFeedback(null), 600);
  }, [streak]);

  const handleIncorrect = useCallback(() => {
    setLives((l) => Math.max(0, l - 1));
    setStreak(0);
    setShowFeedback("incorrect");
    setTimeout(() => setShowFeedback(null), 600);
  }, []);

  const nextRound = useCallback(() => {
    if (currentRound + 1 >= totalRounds || lives <= 0) {
      setIsComplete(true);
    } else {
      setCurrentRound((r) => r + 1);
    }
  }, [currentRound, totalRounds, lives]);

  useEffect(() => {
    if (lives <= 0 && !isComplete) {
      setTimeout(() => setIsComplete(true), 800);
    }
  }, [lives, isComplete]);

  useEffect(() => {
    if (isComplete) {
      const pct = Math.round((correctCount / totalRounds) * 100);
      onComplete(pct, totalRounds, correctCount);
    }
  }, [isComplete, correctCount, totalRounds, onComplete]);

  return (
    <div className="w-full">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {Array.from({ length: initialLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all ${
                  i < lives ? "text-destructive fill-destructive" : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          {streak >= 3 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent"
            >
              <Zap className="w-3 h-3" /> x{streak >= 8 ? "3" : streak >= 5 ? "2" : "1.5"}
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
          <Trophy className="w-4 h-4 text-accent" />
          {score}
        </div>

        <div className="text-xs text-muted-foreground">
          {currentRound + 1} / {totalRounds}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-hover"
          animate={{ width: `${((currentRound + 1) / totalRounds) * 100}%` }}
          transition={{ type: "spring", bounce: 0.2 }}
        />
      </div>

      {/* Feedback overlay */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div
              className={`text-6xl font-display ${
                showFeedback === "correct" ? "text-success" : "text-destructive"
              }`}
            >
              {showFeedback === "correct" ? "✓" : "✗"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game content */}
      {children({
        currentRound,
        score,
        lives,
        streak,
        onCorrect: handleCorrect,
        onIncorrect: handleIncorrect,
        nextRound,
        isComplete,
      })}
    </div>
  );
};

export default GameEngine;
