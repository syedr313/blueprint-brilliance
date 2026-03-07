import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface TypingData {
  rounds: {
    prompt: string;
    answer: string;
    hint?: string;
  }[];
  instruction?: string;
}

const TypingGameComponent = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as TypingData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={3}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle="Typing Challenge"
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        return (
          <TypingRound
            key={currentRound}
            prompt={round.prompt}
            answer={round.answer}
            hint={round.hint}
            instruction={data.instruction}
            onCorrect={() => { onCorrect(); setTimeout(nextRound, 800); }}
            onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 1200); }}
          />
        );
      }}
    </GameEngine>
  );
};

const TypingRound = ({
  prompt,
  answer,
  hint,
  instruction,
  onCorrect,
  onIncorrect,
}: {
  prompt: string;
  answer: string;
  hint?: string;
  instruction?: string;
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (submitted || !input.trim()) return;
    setSubmitted(true);
    const normalized = input.trim().toLowerCase().replace(/[.,!?;:]/g, "");
    const expected = answer.toLowerCase().replace(/[.,!?;:]/g, "");
    const correct = normalized === expected;
    setIsCorrect(correct);
    if (correct) onCorrect();
    else onIncorrect();
  };

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 border border-border/50">
      {instruction && <p className="text-xs text-muted-foreground mb-2">{instruction}</p>}

      <div className="text-center mb-6">
        <p className="text-2xl md:text-3xl font-display text-foreground mb-2">{prompt}</p>
        {hint && <p className="text-sm text-muted-foreground">Hint: {hint}</p>}
      </div>

      <div className="flex gap-2 max-w-md mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => !submitted && setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Type your answer..."
          className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium bg-background text-foreground outline-none transition-colors ${
            submitted
              ? isCorrect
                ? "border-success bg-success/5"
                : "border-destructive bg-destructive/5"
              : "border-border focus:border-primary"
          }`}
          disabled={submitted}
          autoComplete="off"
          autoCapitalize="off"
        />
        {!submitted && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground shadow-soft"
          >
            Check
          </motion.button>
        )}
      </div>

      {submitted && !isCorrect && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-3 text-sm text-muted-foreground"
        >
          Correct answer: <span className="text-success font-semibold">{answer}</span>
        </motion.p>
      )}

      {submitted && isCorrect && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-3 text-lg font-display text-success"
        >
          ✨ Perfect!
        </motion.p>
      )}

      {/* Letter display for spelling hints */}
      {!submitted && answer.length <= 10 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {answer.split("").map((char, i) => (
            <div
              key={i}
              className={`w-8 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${
                input[i]?.toLowerCase() === char.toLowerCase()
                  ? "border-success/50 bg-success/10 text-success"
                  : input[i]
                  ? "border-destructive/50 bg-destructive/5 text-destructive"
                  : "border-border/50 bg-muted/30 text-muted-foreground/30"
              }`}
            >
              {input[i] || "_"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TypingGameComponent;
