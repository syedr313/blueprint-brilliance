import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface BubbleData {
  rounds: { prompt: string; correctLetter: string; options: string[] }[];
}

const BubblePopGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as BubbleData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Phonics Pop"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        return (
          <BubbleRound
            key={currentRound}
            prompt={round.prompt}
            correctLetter={round.correctLetter}
            options={round.options}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 700); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 700); }}
          />
        );
      }}
    </GameEngine>
  );
};

const BubbleRound = ({
  prompt,
  correctLetter,
  options,
  onCorrect,
  onIncorrect,
}: {
  prompt: string;
  correctLetter: string;
  options: string[];
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [popped, setPopped] = useState<string | null>(null);
  const [positions] = useState(() =>
    options.map(() => ({
      x: 10 + Math.random() * 70,
      y: 10 + Math.random() * 60,
      size: 60 + Math.random() * 20,
      delay: Math.random() * 0.5,
    }))
  );

  const handlePop = (letter: string) => {
    if (popped) return;
    setPopped(letter);
    if (letter === correctLetter) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  return (
    <div className="relative h-[400px] md:h-[500px] bg-gradient-to-b from-primary/5 to-secondary/5 rounded-2xl overflow-hidden border border-border/30">
      {/* Prompt */}
      <div className="absolute top-4 left-0 right-0 text-center z-10">
        <div className="inline-block bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-soft border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">Which letter makes this sound?</p>
          <p className="text-2xl font-display text-primary">"{prompt}"</p>
        </div>
      </div>

      {/* Bubbles */}
      {options.map((letter, i) => (
        <AnimatePresence key={letter}>
          {popped !== letter && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -10, 0, -5, 0],
              }}
              exit={{
                scale: popped === letter ? 1.5 : 0.8,
                opacity: 0,
              }}
              transition={{
                y: { duration: 2 + positions[i].delay, repeat: Infinity },
                scale: { delay: positions[i].delay * 0.3 },
              }}
              onClick={() => handlePop(letter)}
              className="absolute"
              style={{
                left: `${positions[i].x}%`,
                top: `${positions[i].y}%`,
                width: positions[i].size,
                height: positions[i].size,
              }}
            >
              <div
                className={`w-full h-full rounded-full flex items-center justify-center text-xl md:text-2xl font-display border-2 transition-colors hover:scale-110 cursor-pointer ${
                  popped === letter && letter === correctLetter
                    ? "bg-success/30 border-success text-success"
                    : popped === letter
                    ? "bg-destructive/30 border-destructive text-destructive"
                    : "bg-gradient-to-br from-secondary/40 to-primary/30 border-secondary/50 text-foreground hover:from-secondary/60 hover:to-primary/50"
                }`}
              >
                {letter}
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      ))}

      {/* Pop effect */}
      {popped && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          className={`absolute w-10 h-10 rounded-full ${
            popped === correctLetter ? "bg-success/30" : "bg-destructive/30"
          }`}
          style={{
            left: `${positions[options.indexOf(popped)].x}%`,
            top: `${positions[options.indexOf(popped)].y}%`,
          }}
        />
      )}
    </div>
  );
};

export default BubblePopGame;
