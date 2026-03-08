import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Brain, Loader2 } from "lucide-react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface YouTubeQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
  isLoading?: boolean;
}

const YouTubeQuiz = ({ questions, onComplete, isLoading }: YouTubeQuizProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-8 border border-border/50 text-center">
        <Loader2 className="w-10 h-10 mx-auto mb-3 text-primary animate-spin" />
        <p className="text-foreground font-medium">Generating quiz from video content...</p>
        <p className="text-sm text-muted-foreground mt-1">AI is analyzing what you've learned</p>
      </div>
    );
  }

  if (!questions.length) return null;

  const q = questions[currentQ];
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      const finalScore = correctCount + (isCorrect ? 0 : 0); // already counted
      setFinished(true);
      onComplete(correctCount, questions.length);
    } else {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl p-8 border border-border/50 text-center"
      >
        <Brain className="w-14 h-14 mx-auto mb-3 text-primary" />
        <h3 className="text-xl font-display text-foreground mb-2">Quiz Complete! 🎉</h3>
        <p className="text-3xl font-bold text-foreground mb-1">{pct}%</p>
        <p className="text-muted-foreground">
          {correctCount} / {questions.length} correct
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {pct >= 80 ? "Excellent understanding!" : pct >= 60 ? "Good job, keep learning!" : "Consider rewatching the video."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Knowledge Check</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-muted rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h4 className="text-foreground font-medium mb-4">{q.question}</h4>

          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let borderColor = "border-border/50";
              let bg = "bg-background";
              if (answered) {
                if (idx === q.correctIndex) {
                  borderColor = "border-green-500";
                  bg = "bg-green-500/10";
                } else if (idx === selected && !isCorrect) {
                  borderColor = "border-destructive";
                  bg = "bg-destructive/10";
                }
              } else if (idx === selected) {
                borderColor = "border-primary";
                bg = "bg-primary/5";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`w-full text-left px-4 py-3 rounded-xl border ${borderColor} ${bg} text-sm text-foreground transition-all hover:border-primary/50 disabled:cursor-default`}
                >
                  <span className="font-medium text-muted-foreground mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                  {answered && idx === q.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />
                  )}
                  {answered && idx === selected && !isCorrect && idx !== q.correctIndex && (
                    <XCircle className="w-4 h-4 text-destructive inline ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3 mb-3">
                💡 {q.explanation}
              </p>
              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-shadow"
              >
                {currentQ + 1 >= questions.length ? "See Results" : "Next Question →"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default YouTubeQuiz;
