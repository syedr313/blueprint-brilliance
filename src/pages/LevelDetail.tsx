import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import AiTutor from "@/components/AiTutor";
import { levels, moduleColors } from "@/data/levels";
import { getGameComponent } from "@/games";
import type { GameResult } from "@/games/types";
import { ArrowLeft, Play, Gamepad2, BarChart3, Lock, Star, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

type Phase = "watch" | "play" | "review";

const LevelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const levelId = parseInt(id || "1");
  const level = levels.find((l) => l.id === levelId) || levels[0];
  const colors = moduleColors[level.module - 1];

  const [phase, setPhase] = useState<Phase>("watch");
  const [videoProgress, setVideoProgress] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const gameUnlocked = true;
  const score = gameResult?.score ?? 0;

  const GameComponent = getGameComponent(levelId);

  const handleGameComplete = useCallback((result: GameResult) => {
    setGameResult(result);
    setGameComplete(true);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 max-w-4xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <Link to="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">{level.title}</span>
        </motion.div>

        {/* Level header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 shadow-card border border-border/50 mb-6"
          style={{
            background: `linear-gradient(135deg, ${colors.from}15, ${colors.to}10)`,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-md inline-block mb-2"
                style={{ background: `${colors.from}20`, color: colors.from }}
              >
                {level.moduleName} • Level {level.id}
              </span>
              <h1 className="text-2xl md:text-3xl font-display text-foreground">{level.title}</h1>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-6 h-6 ${
                    s <= level.stars ? "text-accent fill-accent" : "text-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Phase tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
          {[
            { key: "watch" as Phase, label: "Watch", icon: Play, available: true },
            { key: "play" as Phase, label: "Play", icon: Gamepad2, available: gameUnlocked },
            { key: "review" as Phase, label: "Review", icon: BarChart3, available: gameComplete },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => tab.available && setPhase(tab.key)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-colors ${
                phase === tab.key
                  ? "text-foreground"
                  : tab.available
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-muted-foreground/40 cursor-not-allowed"
              }`}
            >
              {!tab.available && <Lock className="w-3 h-3" />}
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {phase === tab.key && (
                <motion.div
                  layoutId="phase-tab"
                  className="absolute inset-0 bg-card rounded-lg shadow-sm"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Phase content */}
        <AnimatePresence mode="wait">
          {phase === "watch" && (
            <motion.div
              key="watch"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="aspect-video bg-foreground/5 rounded-2xl overflow-hidden mb-4 relative border border-border/50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
                      onClick={() => setVideoProgress(Math.min(100, videoProgress + 20))}
                    >
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                    <p className="text-muted-foreground text-sm">Watch the lesson or jump straight into the game</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      (Video progress is optional now)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${videoProgress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{videoProgress}%</span>
              </div>

              {!gameUnlocked && (
                <p className="text-sm text-muted-foreground text-center">
                  Watch at least 80% of the video to unlock the game 🎮
                </p>
              )}
              {gameUnlocked && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                  <button
                    onClick={() => setPhase("play")}
                    className="gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-elevated transition-all inline-flex items-center gap-2"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    Play the Game
                  </button>
                </motion.div>
              )}

              <div className="mt-6 bg-card rounded-2xl p-5 border border-border/50">
                <h3 className="font-display text-foreground mb-2">📝 Lesson Notes</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This lesson covers the fundamentals of {level.title.toLowerCase()}. 
                  Pay attention to the key concepts and examples shown in the video. 
                  These will be important for the interactive game that follows.
                </p>
              </div>
            </motion.div>
          )}

          {phase === "play" && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {!gameComplete ? (
                <GameComponent levelId={levelId} onComplete={handleGameComplete} />
              ) : (
                <div className="bg-card rounded-2xl p-8 border border-border/50 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success" />
                  </motion.div>
                  <h3 className="font-display text-xl text-foreground mb-2">Game Complete! 🎉</h3>
                  <p className="text-muted-foreground mb-4">Score: {score}%</p>
                  <button
                    onClick={() => setPhase("review")}
                    className="gradient-secondary text-secondary-foreground px-6 py-3 rounded-xl font-semibold shadow-soft hover:shadow-elevated transition-all inline-flex items-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5" />
                    View Results
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {phase === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-card text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                    <motion.circle
                      cx="60" cy="60" r="54" strokeWidth="8" fill="none"
                      strokeLinecap="round"
                      stroke={colors.from}
                      strokeDasharray={`${(score / 100) * 339.3} 339.3`}
                      initial={{ strokeDasharray: "0 339.3" }}
                      animate={{ strokeDasharray: `${(score / 100) * 339.3} 339.3` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-display text-foreground">{score}%</span>
                  </div>
                </div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-7 h-7 ${
                        s <= (score >= 90 ? 3 : score >= 80 ? 2 : score >= 70 ? 1 : 0)
                          ? "text-accent fill-accent"
                          : "text-muted-foreground/20"
                      }`}
                    />
                  ))}
                </div>
                {gameResult && (
                  <p className="text-muted-foreground text-sm">
                    {gameResult.correctAnswers} / {gameResult.totalQuestions} correct
                    {score >= 70 ? " — You can advance! 🎉" : " — Try again to score 70%+"}
                  </p>
                )}
              </div>

              <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-card">
                <h3 className="font-display text-foreground mb-4">Skill Breakdown</h3>
                {[
                  { skill: "Accuracy", score: Math.min(100, score + 5) },
                  { skill: "Speed", score: Math.max(50, score - 8) },
                  { skill: "Comprehension", score: Math.min(100, score + 2) },
                  { skill: "Consistency", score: Math.max(40, score - 5) },
                ].map((item) => (
                  <div key={item.skill} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{item.skill}</span>
                      <span className="text-muted-foreground">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setGameComplete(false);
                    setGameResult(null);
                    setPhase("play");
                  }}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm bg-card border border-border/50 text-foreground hover:bg-muted transition-colors"
                >
                  Replay Game
                </button>
                <Link
                  to={levelId < 50 ? `/level/${levelId + 1}` : "/dashboard"}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm gradient-primary text-primary-foreground text-center shadow-soft hover:shadow-glow transition-shadow"
                >
                  {levelId < 50 ? "Next Level →" : "Back to Dashboard"}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AiTutor />
    </div>
  );
};

export default LevelDetail;
