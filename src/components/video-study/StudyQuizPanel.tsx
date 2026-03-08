import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Brain, Loader2, RotateCcw, BookOpen } from "lucide-react";

interface QuizQuestion {
  question: string;
  type: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
  transcript_reference_start?: number;
  transcript_reference_end?: number;
}

interface StudyQuizPanelProps {
  questions: QuizQuestion[];
  isLoading: boolean;
  onComplete: (score: number, total: number) => void;
  onReviewSection?: (startSeconds: number) => void;
  onRetake?: () => void;
}

const StudyQuizPanel = ({ questions, isLoading, onComplete, onReviewSection, onRetake }: StudyQuizPanelProps) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongSections, setWrongSections] = useState<number[]>([]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-8 border border-border/50 text-center">
        <Loader2 className="w-10 h-10 mx-auto mb-3 text-primary animate-spin" />
        <p className="text-foreground font-medium">Generating quiz from transcript...</p>
        <p className="text-sm text-muted-foreground mt-1">Analyzing what was taught in the video</p>
      </div>
    );
  }

  if (!questions.length) return null;

  const q = questions[currentQ];
  const isCorrect = selected === q.correct_answer;

  const handleSelect = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === q.correct_answer) {
      setCorrectCount(c => c + 1);
    } else if (q.transcript_reference_start != null) {
      setWrongSections(prev => [...prev, q.transcript_reference_start!]);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
      onComplete(correctCount, questions.length);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRetake = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setCorrectCount(0);
    setFinished(false);
    setWrongSections([]);
    onRetake?.();
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
        <p className="text-muted-foreground">{correctCount} / {questions.length} correct</p>
        <p className="text-sm text-muted-foreground mt-2">
          {pct >= 80 ? "Excellent understanding!" : pct >= 60 ? "Good job, keep learning!" : "Consider reviewing the video."}
        </p>

        <div className="flex gap-2 justify-center mt-4">
          <button onClick={handleRetake} className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-medium flex items-center gap-2 hover:bg-muted/80">
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
          {wrongSections.length > 0 && onReviewSection && (
            <button
              onClick={() => onReviewSection(wrongSections[0])}
              className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Review Weak Sections
            </button>
          )}
        </div>
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
        <div className="flex items-center gap-2">
          {q.difficulty && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              q.difficulty === "hard" ? "bg-destructive/10 text-destructive" :
              q.difficulty === "medium" ? "bg-accent/10 text-accent" :
              "bg-primary/10 text-primary"
            }`}>
              {q.difficulty}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{currentQ + 1} / {questions.length}</span>
        </div>
      </div>

      <div className="h-1.5 bg-muted rounded-full mb-5 overflow-hidden">
        <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <h4 className="text-foreground font-medium mb-4">{q.question}</h4>

          {q.type === "true_false" ? (
            <div className="grid grid-cols-2 gap-2">
              {["True", "False"].map(opt => {
                let cls = "border-border/50 bg-background";
                if (answered) {
                  if (opt === q.correct_answer) cls = "border-green-500 bg-green-500/10";
                  else if (opt === selected) cls = "border-destructive bg-destructive/10";
                } else if (opt === selected) cls = "border-primary bg-primary/5";

                return (
                  <button key={opt} onClick={() => handleSelect(opt)} disabled={answered}
                    className={`px-4 py-3 rounded-xl border ${cls} text-sm text-foreground font-medium transition-all`}>
                    {opt}
                    {answered && opt === q.correct_answer && <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />}
                    {answered && opt === selected && opt !== q.correct_answer && <XCircle className="w-4 h-4 text-destructive inline ml-2" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {(q.options || []).map((opt, idx) => {
                let cls = "border-border/50 bg-background";
                if (answered) {
                  if (opt === q.correct_answer) cls = "border-green-500 bg-green-500/10";
                  else if (opt === selected) cls = "border-destructive bg-destructive/10";
                } else if (opt === selected) cls = "border-primary bg-primary/5";

                return (
                  <button key={idx} onClick={() => handleSelect(opt)} disabled={answered}
                    className={`w-full text-left px-4 py-3 rounded-xl border ${cls} text-sm text-foreground transition-all hover:border-primary/50 disabled:cursor-default`}>
                    <span className="font-medium text-muted-foreground mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                    {answered && opt === q.correct_answer && <CheckCircle2 className="w-4 h-4 text-green-500 inline ml-2" />}
                    {answered && opt === selected && opt !== q.correct_answer && <XCircle className="w-4 h-4 text-destructive inline ml-2" />}
                  </button>
                );
              })}
            </div>
          )}

          {answered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
              <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3 mb-3">
                💡 {q.explanation}
              </p>
              {q.transcript_reference_start != null && onReviewSection && (
                <button
                  onClick={() => onReviewSection(q.transcript_reference_start!)}
                  className="text-xs text-primary hover:underline mb-3 flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3" /> Jump to this section in the video
                </button>
              )}
              <button onClick={handleNext}
                className="w-full py-2.5 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground shadow-soft hover:shadow-glow transition-shadow">
                {currentQ + 1 >= questions.length ? "See Results" : "Next Question →"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StudyQuizPanel;
