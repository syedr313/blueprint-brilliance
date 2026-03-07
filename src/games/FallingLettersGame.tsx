import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

const FallingLettersGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as { letters: string[] };
  const letters = data.letters;

  return (
    <GameEngine
      totalRounds={letters.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({
          score,
          totalQuestions: total,
          correctAnswers: correct,
          timeSpent: 0,
          details: [],
        })
      }
      levelTitle="Alphabet Avalanche"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, lives, isComplete }) => {
        if (isComplete || currentRound >= letters.length) return null;
        return (
          <FallingRound
            letter={letters[currentRound]}
            allLetters={letters}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 500); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 800); }}
            round={currentRound}
          />
        );
      }}
    </GameEngine>
  );
};

const FallingRound = ({
  letter,
  allLetters,
  onCorrect,
  onIncorrect,
  round,
}: {
  letter: string;
  allLetters: string[];
  onCorrect: () => void;
  onIncorrect: () => void;
  round: number;
}) => {
  const [position, setPosition] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Generate wrong option
  const wrongLetter = allLetters.find(
    (l) => l !== letter && l !== allLetters[(round + 1) % allLetters.length]
  ) || (letter === "A" ? "B" : "A");

  const options = Math.random() > 0.5 ? [letter, wrongLetter] : [wrongLetter, letter];

  useEffect(() => {
    setPosition(0);
    setAnswered(false);
    setResult(null);

    const speed = Math.max(30, 60 - round * 1.2);
    intervalRef.current = setInterval(() => {
      setPosition((p) => {
        if (p >= 100) {
          clearInterval(intervalRef.current);
          if (!answered) {
            setAnswered(true);
            setResult("incorrect");
            onIncorrect();
          }
          return 100;
        }
        return p + 1;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [round]);

  const handleClick = (selected: string) => {
    if (answered) return;
    setAnswered(true);
    clearInterval(intervalRef.current);

    if (selected === letter) {
      setResult("correct");
      onCorrect();
    } else {
      setResult("incorrect");
      onIncorrect();
    }
  };

  return (
    <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-secondary/10 to-secondary/5 rounded-2xl overflow-hidden border border-border/30">
      {/* Snowflakes background */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-secondary/20"
          initial={{ x: `${Math.random() * 100}%`, y: -10 }}
          animate={{ y: "110%" }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      {/* Falling letter */}
      <motion.div
        className={`absolute left-1/2 -translate-x-1/2 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-display shadow-elevated border-2 ${
          result === "correct"
            ? "bg-success/20 border-success text-success"
            : result === "incorrect"
            ? "bg-destructive/20 border-destructive text-destructive"
            : "bg-card border-secondary/50 text-foreground"
        }`}
        animate={{
          top: `${Math.min(position, 65)}%`,
          rotate: result === "incorrect" ? [0, -10, 10, -5, 0] : 0,
        }}
        transition={result === "incorrect" ? { duration: 0.3 } : { type: "tween" }}
      >
        {letter}
        {result === "correct" && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-4 border-success"
            initial={{ scale: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.div>

      {/* Landing zones */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 px-4">
        {options.map((opt) => (
          <motion.button
            key={`${round}-${opt}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(opt)}
            disabled={answered}
            className={`w-28 h-20 md:w-36 md:h-24 rounded-2xl text-3xl md:text-4xl font-display border-2 transition-colors ${
              answered && opt === letter
                ? "bg-success/20 border-success text-success"
                : answered && opt !== letter
                ? "bg-muted border-border/50 text-muted-foreground"
                : "bg-card border-primary/30 text-foreground hover:border-primary hover:bg-primary/5 cursor-pointer"
            }`}
          >
            {opt}
          </motion.button>
        ))}
      </div>

      {/* Prompt */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground">Tap the matching landing zone!</p>
      </div>
    </div>
  );
};

export default FallingLettersGame;
