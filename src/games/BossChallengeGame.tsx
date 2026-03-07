import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameEngine from "./GameEngine";
import type { GameProps } from "./types";
import { getLevelGameData } from "./gameData";

interface BossData {
  bossName: string;
  bossEmoji: string;
  rounds: {
    type: "mc" | "fill" | "typing" | "sort";
    question: string;
    options?: string[];
    correctIndex?: number;
    correctAnswer?: string;
    categories?: string[];
    categoryIndex?: number;
  }[];
}

const BossChallengeGame = ({ levelId, onComplete }: GameProps) => {
  const data = getLevelGameData(levelId) as BossData;

  return (
    <GameEngine
      totalRounds={data.rounds.length}
      lives={5}
      onComplete={(score, total, correct) =>
        onComplete({ score, totalQuestions: total, correctAnswers: correct, timeSpent: 0, details: [] })
      }
      levelTitle={`Boss: ${data.bossName}`}
    >
      {({ currentRound, onCorrect, onIncorrect, nextRound, isComplete, score, lives }) => {
        if (isComplete || currentRound >= data.rounds.length) return null;
        const round = data.rounds[currentRound];
        const bossHP = Math.max(0, 100 - Math.round((currentRound / data.rounds.length) * 100));

        return (
          <div>
            {/* Boss */}
            <div className="flex items-center justify-between mb-4 bg-destructive/5 rounded-xl p-3 border border-destructive/20">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{data.bossEmoji}</span>
                <div>
                  <p className="text-sm font-display text-foreground">{data.bossName}</p>
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-destructive rounded-full"
                      animate={{ width: `${bossHP}%` }}
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">HP: {bossHP}%</span>
            </div>

            <BossRound
              key={currentRound}
              round={round}
              onCorrect={() => { onCorrect(); setTimeout(nextRound, 800); }}
              onIncorrect={() => { onIncorrect(); setTimeout(nextRound, 1000); }}
            />
          </div>
        );
      }}
    </GameEngine>
  );
};

const BossRound = ({
  round,
  onCorrect,
  onIncorrect,
}: {
  round: BossData["rounds"][0];
  onCorrect: () => void;
  onIncorrect: () => void;
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (round.type === "typing") {
    const handleSubmit = () => {
      if (submitted || !input.trim()) return;
      setSubmitted(true);
      const correct = input.trim().toLowerCase() === round.correctAnswer?.toLowerCase();
      if (correct) onCorrect();
      else onIncorrect();
    };

    return (
      <div className="bg-card rounded-2xl p-4 border border-border/50">
        <p className="text-base font-display text-foreground mb-4">{round.question}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => !submitted && setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`flex-1 px-4 py-2 rounded-xl border-2 text-sm bg-background text-foreground outline-none ${
              submitted
                ? input.trim().toLowerCase() === round.correctAnswer?.toLowerCase()
                  ? "border-success"
                  : "border-destructive"
                : "border-border focus:border-primary"
            }`}
            placeholder="Type your answer..."
            disabled={submitted}
            autoFocus
          />
          {!submitted && (
            <button onClick={handleSubmit} className="px-4 py-2 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground">
              Go
            </button>
          )}
        </div>
        {submitted && input.trim().toLowerCase() !== round.correctAnswer?.toLowerCase() && (
          <p className="mt-2 text-sm text-muted-foreground">Answer: <span className="text-success font-semibold">{round.correctAnswer}</span></p>
        )}
      </div>
    );
  }

  // MC, fill, sort all use options
  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correctIdx = round.correctIndex ?? 0;
    if (idx === correctIdx) onCorrect();
    else onIncorrect();
  };

  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50">
      <p className="text-base font-display text-foreground mb-4">{round.question}</p>
      <div className="space-y-2">
        {(round.options || []).map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            className={`w-full p-3 rounded-xl text-left text-sm font-medium border-2 transition-all ${
              selected === null
                ? "bg-muted/30 border-border/50 text-foreground hover:border-primary/40 cursor-pointer"
                : i === (round.correctIndex ?? 0)
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
    </div>
  );
};

export default BossChallengeGame;
